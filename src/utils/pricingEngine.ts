import { 
  ServiceRequest, 
  Quote, 
  PricingLogic, 
  CustomPricingRule, 
  RateData, 
  RegionalPricingData, 
  ServiceAreaVerificationData,
  AdditionalFee,
  FranchisedCitySupplementaryPricing
} from '../types';
import { standardizeFrequency } from './frequencyMatcher';
import { matchFranchisedCity, getFranchisedCityRate } from './franchisedCityMatcher';
import { getFrequencyMultiplier } from './frequencyMatcher';
import { normalizeContainerSize } from './csvParser';

export class PricingEngine {
  private pricingLogic: PricingLogic | null = null;
  private regionalPricingData: RegionalPricingData | null = null;
  private serviceAreaData: ServiceAreaVerificationData | null = null;
  private isSingleLocation: boolean = false;

  setPricingLogic(logic: PricingLogic) {
    this.pricingLogic = logic;
    console.log('🔧 Pricing logic set:', {
      type: logic.type,
      hasCustomRules: !!(logic.customRules?.length),
      customRulesCount: logic.customRules?.length || 0,
      hasBrokerRates: !!(logic.brokerRates?.length),
      brokerRatesCount: logic.brokerRates?.length || 0,
      hasRegionalData: !!(logic.regionalPricingData),
      regionalSheetsCount: logic.regionalPricingData?.rateSheets?.length || 0,
      hasPricingConfig: !!(logic.pricingConfig),
      hasAdditionalFees: !!(logic.pricingConfig?.additionalFees?.length),
      additionalFeesCount: logic.pricingConfig?.additionalFees?.length || 0
    });
  }

  getPricingLogic(): PricingLogic | null {
    return this.pricingLogic;
  }

  setRegionalPricingData(data: RegionalPricingData) {
    this.regionalPricingData = data;
    console.log('🧠 Regional pricing data set:', {
      totalSheets: data.rateSheets.length,
      regions: data.rateSheets.map(s => s.region)
    });
  }

  setServiceAreaData(data: ServiceAreaVerificationData) {
    this.serviceAreaData = data;
    this.isSingleLocation = data.totalProcessed === 1;
    console.log('🗺️ Service area data set for pricing engine:', {
      totalProcessed: data.totalProcessed,
      serviceableCount: data.serviceableCount,
      isSingleLocation: this.isSingleLocation
    });
  }

  /**
   * Generate a quote for a service request
   */
  async generateQuote(serviceRequest: ServiceRequest): Promise<Quote> {
    console.log('💰 Generating quote for service request:', {
      id: serviceRequest.id,
      customerName: serviceRequest.customerName,
      address: serviceRequest.address,
      city: serviceRequest.city,
      state: serviceRequest.state,
      equipmentType: serviceRequest.equipmentType,
      containerSize: serviceRequest.containerSize,
      frequency: serviceRequest.frequency,
      materialType: serviceRequest.materialType,
      binQuantity: serviceRequest.binQuantity
    });

    if (!this.pricingLogic) {
      throw new Error('Pricing logic not configured');
    }

    // Resolve auto-inherit values using the specific service request data
    const resolvedServiceRequest = this.resolveAutoInheritValues(serviceRequest);

    console.log('🔄 Resolved service request after auto-inherit processing:', {
      original: serviceRequest,
      resolved: resolvedServiceRequest
    });

    try {
      // STEP 1: Get city-specific franchise fee and sales tax for ALL cities
      // Ensure city and state are valid strings before passing to matchFranchisedCity
      const safeCity = resolvedServiceRequest.city || '';
      const safeState = resolvedServiceRequest.state || '';
      
      console.log('🔍 Service request validation before franchise city matching:', {
        originalCity: resolvedServiceRequest.city,
        originalState: resolvedServiceRequest.state,
        safeCity,
        safeState,
        hasValidCity: !!safeCity,
        hasValidState: !!safeState
      });
      
      const franchisedCityMatch = await matchFranchisedCity(safeCity, safeState);
      
      // Extract city-specific fees (available for all cities, not just franchise cities)
      const cityFranchiseFee = franchisedCityMatch.franchiseFee;
      const citySalesTax = franchisedCityMatch.salesTax;
      
      console.log('🏛️ City-specific fees extracted for pricing:', {
        city: resolvedServiceRequest.city,
        cityFranchiseFee: `${cityFranchiseFee}%`,
        citySalesTax: `${citySalesTax}%`,
        hasMunicipalRates: !!franchisedCityMatch.pricingData,
        isHouston: resolvedServiceRequest.city.toLowerCase() === 'houston'
      });
      
      // STEP 2: Check if city has municipal pricing data (true franchise city)
      if (franchisedCityMatch.isMatch && franchisedCityMatch.pricingData) {
        console.log('🏛️ Processing franchised city quote:', franchisedCityMatch.cityName);
        return await this.generateFranchisedCityQuote(resolvedServiceRequest, franchisedCityMatch, cityFranchiseFee, citySalesTax);
      }

      // STEP 3: Process based on pricing logic type (with city-specific fees)
      switch (this.pricingLogic.type) {
        case 'regional-brain':
          return this.generateRegionalBrainQuote(resolvedServiceRequest, cityFranchiseFee, citySalesTax);
        case 'custom':
          return this.generateCustomQuote(resolvedServiceRequest, cityFranchiseFee, citySalesTax);
        case 'broker':
          return this.generateBrokerQuote(resolvedServiceRequest, cityFranchiseFee, citySalesTax);
        default:
          throw new Error(`Unsupported pricing logic type: ${this.pricingLogic.type}`);
      }
    } catch (error) {
      console.error('❌ Error generating quote:', error);
      return this.createFailedQuote(resolvedServiceRequest, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Resolve auto-inherit values in a service request using the request's own data
   */
  private resolveAutoInheritValues(serviceRequest: ServiceRequest): ServiceRequest {
    // Create a copy to avoid mutating the original
    const resolved = { ...serviceRequest };

    // Auto-inherit values are resolved using the service request's own data
    // This means 'auto-inherit' gets replaced with the actual values from this specific request
    if (resolved.equipmentType === 'auto-inherit') {
      resolved.equipmentType = serviceRequest.equipmentType || 'Front-Load Container';
    }
    if (resolved.containerSize === 'auto-inherit') {
      resolved.containerSize = serviceRequest.containerSize || '8YD';
    }
    if (resolved.frequency === 'auto-inherit') {
      resolved.frequency = serviceRequest.frequency || '1x/week';
    }
    if (resolved.materialType === 'auto-inherit') {
      resolved.materialType = serviceRequest.materialType || 'Solid Waste';
    }

    return resolved;
  }

  /**
   * Generate quote using franchised city municipal pricing
   */
  private async generateFranchisedCityQuote(serviceRequest: ServiceRequest, franchisedCityMatch: any, cityFranchiseFee: number, citySalesTax: number): Promise<Quote> {
    console.log('🏛️ Generating franchised city quote for:', franchisedCityMatch.cityName);

    const rate = getFranchisedCityRate(
      franchisedCityMatch.pricingData,
      serviceRequest.containerSize,
      serviceRequest.frequency,
      serviceRequest.equipmentType,
      serviceRequest.materialType
    );

    if (!rate) {
      throw new Error(`No municipal rate found for ${serviceRequest.containerSize} ${serviceRequest.equipmentType} with ${serviceRequest.frequency} frequency in ${franchisedCityMatch.cityName}`);
    }

    // Calculate volume and pricing
    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 1
    // Total Volume = (# of bins) × (Service Frequency) × (container size) × (4.33)
    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 2
    // Cost before tax and fees = (Total volume) × (price per yard)
    // For municipal rates, convert monthly rate to price per yard
    const pricePerYard = rate.monthlyRate / (containerSizeNumber * serviceFrequency * 4.33);
    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;
    
    const deliveryFee = rate.deliveryFee ?? this.pricingLogic?.pricingConfig?.deliveryFee ?? 0;
    const extraPickupRate = rate.extraPickupRate ?? this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;

    // Additional fees
    const addOnsCost = 0; // Municipal rates don't typically have additional fees

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 3
    // Fuel Surcharge = (Cost before tax and fees) × Fuel Surcharge %
    const fuelSurchargeRate = rate.fuelSurcharge ?? this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = costBeforeTaxAndFees * (fuelSurchargeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 4
    // Franchise Fee = (Cost before tax and fees + Additional Fees) × Franchise Fee %
    const franchiseFeeRate = rate.franchiseFee ?? cityFranchiseFee ?? 0;
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 5
    // Subtotal = Cost before tax and fees + Franchise Fee + Fuel Surcharge + Additional Fees
    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 6
    // Tax = Subtotal × Tax %
    const localTaxRate = rate.salesTax ?? citySalesTax ?? 8.25;
    const localTaxAmount = subtotal * (localTaxRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 7
    // Final Total = Subtotal + Tax
    const totalMonthlyCost = subtotal + localTaxAmount;
    

    console.log('🏛️ Franchised city pricing calculation breakdown:', {
      cityName: franchisedCityMatch.cityName,
      municipalMonthlyRate: rate.monthlyRate,
      pricePerYard,
      totalMonthlyVolume,
      costBeforeTaxAndFees,
      fuelSurchargeAmount,
      franchiseFeeAmount,
      addOnsCost,
      subtotal,
      localTaxAmount,
      totalMonthlyCost,
      deliveryFee: `${deliveryFee} (included in monthly total)`,
      extraPickupRate: `${extraPickupRate} (included in monthly total)`
    });

    console.log('🏛️ CORRECTED: One-time fees excluded from monthly calculation:', {
      deliveryFee: `${deliveryFee} (one-time only)`,
      extraPickupRate: `${extraPickupRate} (one-time only)`,
      monthlyRecurringCost: totalMonthlyCost,
      franchiseFeeCalculatedOn: costBeforeTaxAndFees + addOnsCost
    });

    return {
      id: `quote-${serviceRequest.id}`,
      serviceRequest,
      matchedRate: rate,
      pricingSource: `${franchisedCityMatch.cityName} Municipal Contract`,
      baseRate: costBeforeTaxAndFees,
      totalMonthlyVolume,
      numberOfUnits: serviceRequest.binQuantity || 1,
      pickupsPerWeek: serviceFrequency,
      franchiseFeeAmount,
      localTaxAmount,
      fuelSurchargeAmount,
      fuelSurchargeRate,
      franchiseFeeRate,
      localTaxRate,
      deliveryFee,
      subtotal,
      valueC: 0,
      addOnsCost,
      totalPrice: totalMonthlyCost,
      totalMonthlyCost,
      status: 'success',
      extraPickupRate
    };
  }

  /**
   * Generate quote using regional pricing brain
   */
  private generateRegionalBrainQuote(serviceRequest: ServiceRequest, cityFranchiseFee: number, citySalesTax: number): Quote {
    console.log('🧠 Generating regional brain quote');

    if (!this.pricingLogic?.regionalPricingData) {
      throw new Error('Regional pricing data not available');
    }

    // Determine region based on service request location
    const region = this.determineRegion(serviceRequest.city, serviceRequest.state);
    
    if (!region) {
      throw new Error(`Cannot determine region for ${serviceRequest.city}, ${serviceRequest.state}`);
    }

    // Find the appropriate rate sheet
    const rateSheet = this.pricingLogic.regionalPricingData.rateSheets.find(sheet => sheet.region === region);
    
    if (!rateSheet) {
      throw new Error(`No rate sheet found for region: ${region}`);
    }

    // Find matching rate
    const matchingRate = rateSheet.rates.find(rate => 
      rate.containerSize === serviceRequest.containerSize && 
      rate.frequency === serviceRequest.frequency
    );

    if (!matchingRate) {
      throw new Error(`No rate found for ${serviceRequest.containerSize} with ${serviceRequest.frequency} frequency in ${region} region`);
    }

    // Calculate volume and pricing
    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 1
    // Total Volume = (# of bins) × (Service Frequency) × (container size) × (4.33)
    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 2
    // Cost before tax and fees = (Total volume) × (price per yard)
    const pricePerYard = matchingRate.price / (containerSizeNumber * 4.33); // Convert monthly rate to price per yard
    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;
    
    const deliveryFee = this.pricingLogic?.pricingConfig?.deliveryFee ?? 100;
    const extraPickupRate = this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;

    // Additional fees
    const addOnsCost = 0; // Regional brain doesn't typically have additional fees

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 3
    // Fuel Surcharge = (Cost before tax and fees) × Fuel Surcharge %
    const fuelSurchargeRate = this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = costBeforeTaxAndFees * (fuelSurchargeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 4
    // Franchise Fee = (Cost before tax and fees + Additional Fees) × Franchise Fee %
    const franchiseFeeRate = cityFranchiseFee ?? 0;
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 5
    // Subtotal = Cost before tax and fees + Franchise Fee + Fuel Surcharge + Additional Fees
    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 6
    // Tax = Subtotal × Tax %
    const localTaxRate = citySalesTax ?? 8.25;
    const localTaxAmount = subtotal * (localTaxRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 7
    // Final Total = Subtotal + Tax
    const totalMonthlyCost = subtotal + localTaxAmount;
    

    console.log('🧠 Regional brain pricing calculation breakdown:', {
      region,
      matchingRatePrice: matchingRate.price,
      pricePerYard,
      totalMonthlyVolume,
      costBeforeTaxAndFees,
      cityFranchiseFee: `${cityFranchiseFee}%`,
      citySalesTax: `${citySalesTax}%`,
      fuelSurchargeAmount,
      franchiseFeeAmount,
      addOnsCost,
      subtotal,
      localTaxAmount,
      totalMonthlyCost,
      deliveryFee: `${deliveryFee} (included in monthly total)`,
      extraPickupRate: `${extraPickupRate} (included in monthly total)`
    });

    console.log('🧠 CORRECTED: One-time fees excluded from monthly calculation:', {
      deliveryFee: `${deliveryFee} (one-time only)`,
      extraPickupRate: `${extraPickupRate} (one-time only)`,
      monthlyRecurringCost: totalMonthlyCost,
      franchiseFeeCalculatedOn: costBeforeTaxAndFees + addOnsCost
    });

    return {
      id: `quote-${serviceRequest.id}`,
      serviceRequest,
      matchedRate: matchingRate,
      pricingSource: `${region} Regional Rate Sheet`,
      baseRate: costBeforeTaxAndFees,
      totalMonthlyVolume,
      numberOfUnits: serviceRequest.binQuantity || 1,
      pickupsPerWeek: serviceFrequency,
      franchiseFeeAmount,
      localTaxAmount,
      fuelSurchargeAmount,
      fuelSurchargeRate,
      franchiseFeeRate,
      localTaxRate,
      deliveryFee,
      subtotal,
      valueC: 0,
      addOnsCost,
      totalPrice: totalMonthlyCost,
      totalMonthlyCost,
      status: 'success',
      extraPickupRate
    };
  }

  /**
   * Generate quote using custom pricing rules
   */
  private generateCustomQuote(serviceRequest: ServiceRequest, cityFranchiseFee: number, citySalesTax: number): Quote {
    console.log('🔧 Generating custom quote');

    if (!this.pricingLogic?.customRules && !this.pricingLogic?.pricingConfig) {
      throw new Error('No custom rules or pricing configuration available');
    }

    // Try to find a matching custom rule first
    const matchingRule = this.findMatchingCustomRule(serviceRequest);
    
    if (matchingRule) {
      return this.generateQuoteFromCustomRule(serviceRequest, matchingRule, cityFranchiseFee, citySalesTax);
    }

    // Fall back to pricing config if no custom rule matches
    if (this.pricingLogic.pricingConfig) {
      return this.generateQuoteFromPricingConfig(serviceRequest, cityFranchiseFee, citySalesTax);
    }

    throw new Error('No matching custom rule or pricing configuration found');
  }

  /**
   * Generate quote using broker rates
   */
  private generateBrokerQuote(serviceRequest: ServiceRequest, cityFranchiseFee: number, citySalesTax: number): Quote {
    console.log('📊 Generating broker quote');

    if (!this.pricingLogic?.brokerRates) {
      throw new Error('Broker rates not available');
    }

    // Validate serviceRequest has required properties
    if (!serviceRequest.city || !serviceRequest.state) {
      throw new Error('Service request missing required city or state information');
    }

    // Find matching broker rate
    const matchingRate = this.pricingLogic.brokerRates.find(rate => {
      // Validate rate has required properties before comparison
      if (!rate.city || !rate.state) {
        console.warn('⚠️ Broker rate missing city or state:', rate);
        return false;
      }
      
      return rate.city.toLowerCase() === serviceRequest.city.toLowerCase() &&
        rate.state.toLowerCase() === serviceRequest.state.toLowerCase() &&
        rate.equipmentType === serviceRequest.equipmentType &&
        rate.containerSize === serviceRequest.containerSize &&
        rate.frequency === serviceRequest.frequency;
    });

    if (!matchingRate) {
      throw new Error(`No broker rate found for ${serviceRequest.city}, ${serviceRequest.state}`);
    }

    // Calculate volume and pricing
    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 1
    // Total Volume = (# of bins) × (Service Frequency) × (container size) × (4.33)
    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 2
    // Cost before tax and fees = (Total volume) × (price per yard)
    // For broker rates, use the base rate directly as cost before tax and fees
    const costBeforeTaxAndFees = matchingRate.baseRate * (serviceRequest.binQuantity || 1);
    
    // Use broker rates if available, otherwise use city-specific fees
    const franchiseFeeRate = matchingRate.franchiseFee ? 0 : cityFranchiseFee; // If broker has pre-calculated amount, rate is 0
    const franchiseFeeAmount = matchingRate.franchiseFee || ((costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100));
    
    const localTaxRate = matchingRate.localTax ? 0 : citySalesTax; // If broker has pre-calculated amount, rate is 0
    const localTaxAmount = matchingRate.localTax || 0; // Will be recalculated below if needed
    
    const fuelSurchargeRate = this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = matchingRate.fuelSurcharge || (costBeforeTaxAndFees * (fuelSurchargeRate / 100));
    
    const addOnsCost = 0;
    const deliveryFee = matchingRate.deliveryFee ?? this.pricingLogic?.pricingConfig?.deliveryFee ?? 0;
    const extraPickupRate = matchingRate.extraPickupRate ?? this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;

    // Calculate subtotal and total
    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost + deliveryFee + extraPickupRate;
    const finalLocalTaxAmount = matchingRate.localTax || (subtotal * (localTaxRate / 100));
    const totalMonthlyCost = subtotal + finalLocalTaxAmount;
    
    console.log('📊 Broker pricing calculation breakdown:', {
      brokerBaseRate: matchingRate.baseRate,
      binQuantity: serviceRequest.binQuantity || 1,
      costBeforeTaxAndFees,
      cityFranchiseFee: `${cityFranchiseFee}%`,
      citySalesTax: `${citySalesTax}%`,
      franchiseFeeAmount,
      fuelSurchargeAmount,
      localTaxAmount: finalLocalTaxAmount,
      subtotal,
      totalMonthlyCost
    });

    return {
      id: `quote-${serviceRequest.id}`,
      serviceRequest,
      matchedRate: matchingRate,
      pricingSource: 'Broker Rate Sheet',
      baseRate: costBeforeTaxAndFees,
      totalMonthlyVolume,
      numberOfUnits: serviceRequest.binQuantity || 1,
      pickupsPerWeek: serviceFrequency,
      franchiseFeeAmount,
      localTaxAmount: finalLocalTaxAmount,
      fuelSurchargeAmount,
      fuelSurchargeRate,
      franchiseFeeRate,
      localTaxRate,
      deliveryFee,
      subtotal,
      valueC: 0,
      addOnsCost,
      totalPrice: totalMonthlyCost,
      totalMonthlyCost,
      status: 'success',
      extraPickupRate
    };
  }

  /**
   * Find matching custom rule for a service request
   */
  private findMatchingCustomRule(serviceRequest: ServiceRequest): CustomPricingRule | null {
    if (!this.pricingLogic?.customRules) return null;

    // Normalize service request values for consistent matching
    const normalizedServiceEquipmentType = this.normalizeEquipmentType(serviceRequest.equipmentType);
    const normalizedServiceContainerSize = normalizeContainerSize(serviceRequest.containerSize);

    // Resolve auto-inherit values in custom rules using the service request data
    const resolvedRules = this.pricingLogic.customRules.map(rule => this.resolveCustomRuleAutoInherit(rule, serviceRequest));

    return resolvedRules.find(rule => {
      const normalizedRuleEquipmentType = this.normalizeEquipmentType(rule.equipmentType);
      const normalizedRuleContainerSize = normalizeContainerSize(rule.containerSize);
      
      return (rule.city || '').toLowerCase() === (serviceRequest.city || '').toLowerCase() &&
        (rule.state || '').toLowerCase() === (serviceRequest.state || '').toLowerCase() &&
        normalizedRuleEquipmentType === normalizedServiceEquipmentType &&
        normalizedRuleContainerSize === normalizedServiceContainerSize &&
        rule.frequency === serviceRequest.frequency &&
        rule.materialType === serviceRequest.materialType;
    }) || null;
  }

  /**
   * Resolve auto-inherit values in a custom rule using service request data
   */
  private resolveCustomRuleAutoInherit(rule: CustomPricingRule, serviceRequest: ServiceRequest): CustomPricingRule {
    const resolved = { ...rule };

    if (resolved.equipmentType === 'auto-inherit') {
      resolved.equipmentType = serviceRequest.equipmentType;
    }
    if (resolved.containerSize === 'auto-inherit') {
      resolved.containerSize = serviceRequest.containerSize;
    }
    if (resolved.frequency === 'auto-inherit') {
      resolved.frequency = serviceRequest.frequency;
    }
    if (resolved.materialType === 'auto-inherit') {
      resolved.materialType = serviceRequest.materialType;
    }

    return resolved;
  }

  /**
   * Generate quote from custom rule
   */
  private generateQuoteFromCustomRule(serviceRequest: ServiceRequest, rule: CustomPricingRule, cityFranchiseFee: number, citySalesTax: number): Quote {
    console.log('🎯 Generating quote from custom rule:', rule.id);

    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 1
    // Total Volume = (# of bins) × (Service Frequency) × (container size) × (4.33)
    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;

    // PRICING HIERARCHY IMPLEMENTATION
    let pricePerYard: number;
    
    // Check if this custom rule has its own pricePerYard (single location workflow)
    if (rule.pricePerYard && rule.pricePerYard > 0) {
      // Single location workflow: use rule's specific price
      const isSmallContainer = [2, 3, 4].includes(containerSizeNumber);
      const isLargeContainer = [6, 8, 10].includes(containerSizeNumber);
      
      if (isSmallContainer) {
        pricePerYard = rule.pricePerYard;
      } else if (isLargeContainer && rule.largeContainerPricePerYard) {
        pricePerYard = rule.largeContainerPricePerYard;
      } else {
        pricePerYard = rule.pricePerYard; // Fallback to main price
      }
      
      console.log('🎯 Using custom rule specific pricing (single location):', {
        pricePerYard,
        source: 'Custom rule direct pricing'
      });
    } else {
      // Bulk upload workflow: apply pricing hierarchy
      console.log('🎯 Applying bulk upload pricing hierarchy for custom rule');
      
      // STEP 1: Check for container-specific pricing rules (HIGHEST PRIORITY)
      const normalizedServiceEquipmentType = this.normalizeEquipmentType(serviceRequest.equipmentType);
      const normalizedServiceContainerSize = normalizeContainerSize(serviceRequest.containerSize);
      
      const containerSpecificRule = this.pricingLogic?.pricingConfig?.containerSpecificPricingRules?.find(rule => {
        const normalizedRuleEquipmentType = this.normalizeEquipmentType(rule.equipmentType);
        const normalizedRuleContainerSize = normalizeContainerSize(rule.containerSize);
        
        return normalizedRuleContainerSize === normalizedServiceContainerSize &&
          normalizedRuleEquipmentType === normalizedServiceEquipmentType;
      });
      
      if (containerSpecificRule) {
        pricePerYard = containerSpecificRule.pricePerYard;
        console.log('📦 Using container-specific pricing rule (PRIORITY 1):', {
          containerSize: containerSpecificRule.containerSize,
          equipmentType: containerSpecificRule.equipmentType,
          pricePerYard: containerSpecificRule.pricePerYard,
          source: 'Container-specific rule'
        });
      } else {
        // STEP 2: Fall back to global pricing (PRIORITY 2)
        const isSmallContainer = [2, 3, 4].includes(containerSizeNumber);
        const isLargeContainer = [6, 8, 10].includes(containerSizeNumber);
        
        if (isSmallContainer) {
          pricePerYard = this.pricingLogic?.pricingConfig?.smallContainerPrice || 0;
        } else if (isLargeContainer) {
          pricePerYard = this.pricingLogic?.pricingConfig?.largeContainerPrice || 0;
        } else {
          // For container sizes not in standard categories, default to large container pricing
          pricePerYard = this.pricingLogic?.pricingConfig?.largeContainerPrice || 0;
        }
        
        console.log('🌐 Using global pricing (PRIORITY 2 - fallback):', {
          containerSizeNumber,
          isSmallContainer,
          isLargeContainer,
          pricePerYard,
          source: 'Global pricing configuration'
        });
      }
    }

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 2
    // Cost before tax and fees = (Total volume) × (price per yard)
    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;
    
    const deliveryFee = rule.deliveryFee ?? this.pricingLogic?.pricingConfig?.deliveryFee ?? 0;
    const extraPickupRate = rule.extraPickupRate ?? this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;

    // Additional fees (if any)
    const addOnsCost = 0; // Custom rules don't typically have additional fees

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 3
    // Fuel Surcharge = (Cost before tax and fees) × Fuel Surcharge %
    // Custom rule fees take priority, then city-specific fees, then defaults
    const franchiseFeeRate = rule.franchiseFee ?? cityFranchiseFee ?? 0;
    const fuelSurchargeRate = rule.fuelSurcharge ?? this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = costBeforeTaxAndFees * (fuelSurchargeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 4
    // Franchise Fee = (Cost before tax and fees + Additional Fees) × Franchise Fee %
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 5
    // Subtotal = Cost before tax and fees + Franchise Fee + Fuel Surcharge + Additional Fees
    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 6
    // Tax = Subtotal × Tax %
    const localTaxRate = rule.tax ?? citySalesTax ?? 8.25;
    const localTaxAmount = subtotal * (localTaxRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 7
    // Final Total = Subtotal + Tax
    const totalMonthlyCost = subtotal + localTaxAmount;
    

    console.log('💰 Custom rule pricing calculation breakdown:', {
      containerSizeNumber,
      isSmallContainer,
      isLargeContainer,
      pricePerYard,
      totalMonthlyVolume,
      costBeforeTaxAndFees,
      cityFranchiseFee: `${cityFranchiseFee}%`,
      citySalesTax: `${citySalesTax}%`,
      appliedFranchiseFeeRate: `${franchiseFeeRate}%`,
      appliedLocalTaxRate: `${localTaxRate}%`,
      fuelSurchargeAmount,
      franchiseFeeAmount,
      addOnsCost,
      subtotal,
      localTaxAmount,
      totalMonthlyCost,
      deliveryFee: `${deliveryFee} (included in monthly total)`,
      extraPickupRate: `${extraPickupRate} (included in monthly total)`
    });

    console.log('💰 CORRECTED: One-time fees excluded from monthly calculation:', {
      deliveryFee: `${deliveryFee} (one-time only)`,
      extraPickupRate: `${extraPickupRate} (one-time only)`,
      monthlyRecurringCost: totalMonthlyCost,
      franchiseFeeCalculatedOn: costBeforeTaxAndFees + addOnsCost
    });

    return {
      id: `quote-${serviceRequest.id}`,
      serviceRequest,
      matchedRate: rule,
      pricingSource: 'Custom Rule',
      baseRate: costBeforeTaxAndFees,
      totalMonthlyVolume,
      numberOfUnits: serviceRequest.binQuantity || 1,
      pickupsPerWeek: serviceFrequency,
      franchiseFeeAmount,
      localTaxAmount,
      fuelSurchargeAmount,
      fuelSurchargeRate,
      franchiseFeeRate,
      localTaxRate,
      deliveryFee,
      subtotal,
      valueC: 0,
      addOnsCost,
      totalPrice: totalMonthlyCost,
      totalMonthlyCost,
      status: 'success',
      extraPickupRate
    };
  }

  /**
   * Generate quote from pricing configuration
   */
  private generateQuoteFromPricingConfig(serviceRequest: ServiceRequest, cityFranchiseFee: number, citySalesTax: number): Quote {
    console.log('⚙️ Generating quote from pricing configuration');

    if (!this.pricingLogic?.pricingConfig) {
      throw new Error('Pricing configuration not available');
    }

    const config = this.pricingLogic.pricingConfig;
    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 1
    // Total Volume = (# of bins) × (Service Frequency) × (container size) × (4.33)
    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;

    // Normalize service request values for consistent matching
    const normalizedServiceEquipmentType = this.normalizeEquipmentType(serviceRequest.equipmentType);
    const normalizedServiceContainerSize = normalizeContainerSize(serviceRequest.containerSize);

    // Check for container-specific pricing rules first
    const containerSpecificRule = config.containerSpecificPricingRules?.find(rule => {
      const normalizedRuleEquipmentType = this.normalizeEquipmentType(rule.equipmentType);
      const normalizedRuleContainerSize = normalizeContainerSize(rule.containerSize);
      
      return normalizedRuleContainerSize === normalizedServiceContainerSize &&
        normalizedRuleEquipmentType === normalizedServiceEquipmentType;
    });

    let pricePerYard: number;
    
    if (this.isSingleLocation) {
      // For single location workflow, use the single Price/YD value (stored in smallContainerPrice)
      pricePerYard = config.smallContainerPrice;
      console.log('🎯 Single location pricing applied:', {
        containerSize: serviceRequest.containerSize,
        equipmentType: serviceRequest.equipmentType,
        pricePerYard: config.smallContainerPrice,
        source: 'Single Price/YD field'
      });
    } else if (containerSpecificRule) {
      pricePerYard = containerSpecificRule.pricePerYard;
      console.log('📦 Using container-specific pricing rule:', {
        originalContainerSize: serviceRequest.containerSize,
        normalizedContainerSize: normalizedServiceContainerSize,
        matchedRuleContainerSize: containerSpecificRule.containerSize,
        originalEquipmentType: serviceRequest.equipmentType,
        normalizedEquipmentType: normalizedServiceEquipmentType,
        matchedRuleEquipmentType: containerSpecificRule.equipmentType,
        pricePerYard: containerSpecificRule.pricePerYard
      });
    } else {
      // CONTAINER SIZE PRICING LOGIC - Use Small/Large Container Price/YD as fallback
      // Small Containers: 2YD, 3YD, 4YD
      // Large Containers: 6YD, 8YD, 10YD
      const isSmallContainer = [2, 3, 4].includes(containerSizeNumber);
      const isLargeContainer = [6, 8, 10].includes(containerSizeNumber);
      
      if (isSmallContainer) {
        pricePerYard = config.smallContainerPrice;
      } else if (isLargeContainer) {
        pricePerYard = config.largeContainerPrice;
      } else {
        // For container sizes not in standard categories, default to large container pricing
        pricePerYard = config.largeContainerPrice;
      }
      
      console.log('🌐 Using global pricing:', {
        originalContainerSize: serviceRequest.containerSize,
        normalizedContainerSize: normalizedServiceContainerSize,
        containerSizeNumber,
        isSmallContainer,
        isLargeContainer,
        pricePerYard,
        configSmallContainerPrice: config.smallContainerPrice,
        configLargeContainerPrice: config.largeContainerPrice
      });
    }
    
    // CRITICAL FIX: Validate that we have a valid price per yard
    if (!pricePerYard || pricePerYard <= 0) {
      console.error('❌ CRITICAL ERROR: No valid price per yard found in pricing hierarchy!', {
        pricePerYard,
        hasCustomRulePrice: !!(rule.pricePerYard && rule.pricePerYard > 0),
        hasContainerSpecificRules: !!(this.pricingLogic?.pricingConfig?.containerSpecificPricingRules?.length),
        configSmallContainerPrice: this.pricingLogic?.pricingConfig?.smallContainerPrice,
        configLargeContainerPrice: this.pricingLogic?.pricingConfig?.largeContainerPrice,
        containerSizeNumber,
        serviceRequest: {
          containerSize: serviceRequest.containerSize,
          equipmentType: serviceRequest.equipmentType
        }
      });
      
      if (rule.pricePerYard !== undefined) {
        // Single location workflow
        throw new Error(`No pricing configured for this service. Please configure the 'Price/YD' field in the custom rule.`);
      } else {
        // Bulk upload workflow
        throw new Error(`No pricing configured for ${serviceRequest.containerSize} ${serviceRequest.equipmentType}. Please configure Container-Specific Pricing Rules or Global Container Pricing.`);
      }
    }

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 2
    // Cost before tax and fees = (Total volume) × (price per yard)
    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;
    
    const deliveryFee = config.deliveryFee ?? 0;
    const extraPickupRate = config.extraPickupRate ?? 0;

    // Calculate additional fees
    const addOnsCost = this.calculateAdditionalFees(serviceRequest, config.additionalFees || []);

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 3
    // Fuel Surcharge = (Cost before tax and fees) × Fuel Surcharge %
    // Use city-specific fees instead of config defaults
    const franchiseFeeRate = cityFranchiseFee ?? config.franchiseFee ?? 0;
    const fuelSurchargeRate = config.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = costBeforeTaxAndFees * (fuelSurchargeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 4
    // Franchise Fee = (Cost before tax and fees + Additional Fees) × Franchise Fee %
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 5
    // Subtotal = Cost before tax and fees + Franchise Fee + Fuel Surcharge + Additional Fees
    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 6
    // Tax = Subtotal × Tax %
    const localTaxRate = citySalesTax ?? config.tax ?? 8.25;
    const localTaxAmount = subtotal * (localTaxRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 7
    // Final Total = Subtotal + Tax
    const totalMonthlyCost = subtotal + localTaxAmount;
    

    console.log('💰 Pricing calculation breakdown:', {
      totalMonthlyVolume,
      pricePerYard,
      costBeforeTaxAndFees,
      cityFranchiseFee: `${cityFranchiseFee}%`,
      citySalesTax: `${citySalesTax}%`,
      appliedFranchiseFeeRate: `${franchiseFeeRate}%`,
      appliedLocalTaxRate: `${localTaxRate}%`,
      fuelSurchargeAmount,
      franchiseFeeAmount,
      addOnsCost,
      deliveryFee,
      extraPickupRate,
      subtotal,
      localTaxAmount,
      totalMonthlyCost
    });

    console.log('💰 CORRECTED: One-time fees excluded from monthly calculation:', {
      deliveryFee: `${deliveryFee} (one-time only)`,
      extraPickupRate: `${extraPickupRate} (one-time only)`,
      monthlyRecurringCost: totalMonthlyCost,
      franchiseFeeCalculatedOn: costBeforeTaxAndFees + addOnsCost
    });

    return {
      id: `quote-${serviceRequest.id}`,
      serviceRequest,
      matchedRate: null,
      pricingSource: 'Pricing Configuration',
      baseRate: costBeforeTaxAndFees,
      totalMonthlyVolume,
      numberOfUnits: serviceRequest.binQuantity || 1,
      pickupsPerWeek: serviceFrequency,
      franchiseFeeAmount,
      localTaxAmount,
      fuelSurchargeAmount,
      fuelSurchargeRate,
      franchiseFeeRate,
      localTaxRate,
      deliveryFee,
      subtotal,
      valueC: 0,
      addOnsCost,
      totalPrice: totalMonthlyCost,
      totalMonthlyCost,
      status: 'success',
      extraPickupRate
    };
  }

  /**
   * Calculate additional fees for a service request
   */
  private calculateAdditionalFees(serviceRequest: ServiceRequest, additionalFees: AdditionalFee[]): number {
    if (!additionalFees || additionalFees.length === 0) {
      return 0;
    }

    let totalAdditionalFees = 0;

    additionalFees.forEach(fee => {
      // Convert fee to monthly equivalent
      const monthlyEquivalent = this.convertFeeToMonthlyEquivalent(fee.price, fee.frequency);
      totalAdditionalFees += monthlyEquivalent;
    });

    console.log('💰 Additional fees calculated:', {
      totalFees: additionalFees.length,
      totalMonthlyEquivalent: totalAdditionalFees
    });

    return totalAdditionalFees;
  }

  /**
   * Convert fee to monthly equivalent based on frequency
   */
  private convertFeeToMonthlyEquivalent(price: number, frequency: string): number {
    const multipliers: Record<string, number> = {
      'one-time': 0,
      'weekly': 4.33,
      'monthly': 1,
      'quarterly': 1/3,
      'annually': 1/12
    };

    return price * (multipliers[frequency] || 1);
  }

  /**
   * Determine region based on city and state
   */
  private determineRegion(city: string, state: string): string | null {
    const cityLower = city.toLowerCase().trim();
    const stateLower = state.toLowerCase().trim();

    if (stateLower !== 'texas' && stateLower !== 'tx') {
      return null;
    }

    // NTX cities
    const ntxCities = ['dallas', 'fort worth', 'plano', 'garland', 'irving', 'grand prairie', 'mesquite', 'mckinney', 'carrollton', 'frisco', 'denton', 'richardson', 'lewisville', 'allen', 'flower mound', 'mansfield', 'euless', 'desoto', 'grapevine', 'bedford', 'haltom city', 'wylie', 'keller', 'coppell', 'duncanville', 'rockwall', 'farmers branch', 'rowlett', 'the colony', 'southlake', 'watauga', 'colleyville', 'corinth', 'highland village', 'lancaster', 'little elm', 'north richland hills', 'princeton', 'sachse', 'addison', 'cedar hill', 'glenn heights', 'murphy', 'prosper', 'red oak', 'seagoville', 'university park', 'weatherford', 'granbury', 'cresson', 'sherman', 'denison', 'gainesville', 'justin'];

    // STX cities
    const stxCities = ['houston', 'corpus christi', 'pasadena', 'pearland', 'league city', 'sugar land', 'baytown', 'beaumont', 'missouri city', 'galveston', 'conroe', 'texas city', 'huntsville', 'lufkin', 'tyler', 'longview', 'texarkana', 'port arthur', 'orange', 'liberty', 'cleveland', 'dayton', 'tomball', 'jersey village', 'cypress', 'humble', 'katy', 'spring', 'channelview', 'la porte'];

    // CTX cities
    const ctxCities = ['austin', 'san antonio', 'waco', 'killeen', 'temple', 'bryan', 'college station', 'round rock', 'cedar park', 'georgetown', 'pflugerville', 'leander', 'san marcos', 'new braunfels', 'kyle', 'buda', 'dripping springs', 'bee cave', 'lakeway', 'west lake hills', 'rollingwood', 'sunset valley', 'manchaca', 'del valle', 'elgin', 'manor', 'hutto', 'taylor', 'granger', 'jarrell', 'florence', 'liberty hill', 'bertram', 'burnet', 'marble falls', 'horseshoe bay', 'granite shoals', 'cottonwood shores', 'meadowlakes', 'spicewood', 'lockhart', 'luling', 'gonzales', 'nixon', 'smiley', 'waelder', 'flatonia', 'muldoon', 'schulenburg', 'weimar', 'columbus', 'eagle lake', 'wallis', 'orchard', 'east bernard', 'boling', 'wharton', 'hungerford', 'louise', 'blessing', 'midfield', 'matagorda', 'bay city', 'wadsworth', 'markham', 'van vleck', 'sweeny', 'west columbia', 'brazoria', 'angleton', 'lake jackson', 'clute', 'freeport', 'surfside beach', 'quintana', 'hearne', 'franklin', 'bremond', 'calvert', 'reagan', 'centerville', 'normangee', 'madisonville', 'midway', 'crockett', 'lovelady', 'grapeland', 'elkhart', 'palestine', 'davilla', 'rogers', 'buckholts', 'cameron', 'rockdale', 'thorndale', 'thrall', 'belton', 'seguin', 'boerne'];

    if (ntxCities.includes(cityLower)) {
      return 'NTX';
    } else if (stxCities.includes(cityLower)) {
      return 'STX';
    } else if (ctxCities.includes(cityLower)) {
      return 'CTX';
    }

    return null;
  }

  /**
   * Extract container size number from container size string
   */
  private extractContainerSizeNumber(containerSize: string): number {
    const match = containerSize.match(/(\d+)/);
    return match ? parseInt(match[1]) : 8; // Default to 8 if no number found
  }

  /**
   * Normalize equipment type for consistent matching
   */
  private normalizeEquipmentType(equipmentType: string): string {
    if (!equipmentType || typeof equipmentType !== 'string') {
      return 'Front-Load Container';
    }

    const normalized = equipmentType.toLowerCase().trim();
    
    // Front-Load Container variations
    if (normalized.includes('front') || 
        normalized.includes('dumpster') || 
        normalized.includes('fl') ||
        normalized === 'container' ||
        normalized.includes('front-load') ||
        normalized.includes('frontload') ||
        normalized === 'front load') {
      return 'Front-Load Container';
    }
    
    // Cart variations
    if (normalized.includes('cart') || 
        normalized.includes('toter') || 
        normalized.includes('bin')) {
      return 'Cart';
    }
    
    // Roll-off variations
    if (normalized.includes('roll') || 
        normalized.includes('rolloff') || 
        normalized.includes('roll-off') ||
        normalized.includes('temporary') ||
        normalized.includes('temp')) {
      return 'Roll-off';
    }
    
    // Compactor variations
    if (normalized.includes('compactor') || 
        normalized.includes('compact')) {
      return 'Compactor';
    }
    
    // Default to Front-Load Container for unrecognized types
    return 'Front-Load Container';
  }
  /**
   * Create a failed quote
   */
  private createFailedQuote(serviceRequest: ServiceRequest, reason: string): Quote {
    return {
      id: `quote-${serviceRequest.id}`,
      serviceRequest,
      matchedRate: null,
      pricingSource: 'Failed',
      baseRate: 0,
      totalMonthlyVolume: 0,
      numberOfUnits: 0,
      pickupsPerWeek: 0,
      franchiseFeeAmount: 0,
      localTaxAmount: 0,
      fuelSurchargeAmount: 0,
      fuelSurchargeRate: 0,
      franchiseFeeRate: 0,
      localTaxRate: 0,
      deliveryFee: 0,
      subtotal: 0,
      valueC: 0,
      addOnsCost: 0,
      totalPrice: 0,
      totalMonthlyCost: 0,
      status: 'failed',
      failureReason: reason,
      extraPickupRate: 0
    };
  }

  /**
   * Debug additional fees calculation
   */
  debugAdditionalFees(serviceRequest: ServiceRequest): any {
    console.log('🧪 DEBUG: Additional fees calculation for service request:', serviceRequest);
    
    if (!this.pricingLogic?.pricingConfig?.additionalFees) {
      return { message: 'No additional fees configured' };
    }

    const additionalFees = this.pricingLogic.pricingConfig.additionalFees;
    const totalCost = this.calculateAdditionalFees(serviceRequest, additionalFees);

    return {
      serviceRequest,
      additionalFees,
      totalMonthlyCost: totalCost,
      breakdown: additionalFees.map(fee => ({
        category: fee.category,
        originalPrice: fee.price,
        originalFrequency: fee.frequency,
        monthlyEquivalent: this.convertFeeToMonthlyEquivalent(fee.price, fee.frequency)
      }))
    };
  }

  /**
   * Identify fee source for debugging
   */
  identifyFeeSource(): any {
    if (!this.pricingLogic) {
      return { source: 'No pricing logic configured' };
    }

    return {
      type: this.pricingLogic.type,
      hasCustomRules: !!(this.pricingLogic.customRules?.length),
      hasPricingConfig: !!(this.pricingLogic.pricingConfig),
      hasAdditionalFees: !!(this.pricingLogic.pricingConfig?.additionalFees?.length),
      additionalFeesCount: this.pricingLogic.pricingConfig?.additionalFees?.length || 0
    };
  }
}