// pricingEngine.ts - COMPLETE CORRECTED VERSION WITH PHASE 3 UPDATES

import { 
  ServiceRequest, 
  Quote, 
  PricingLogic, 
  CustomPricingRule, 
  RateData, 
  RegionalPricingData, 
  ServiceAreaVerificationData,
  AdditionalFee,
  FranchisedCitySupplementaryPricing,
  GlobalPricingRule,           
  ContainerSpecificOverride    
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
      hasGlobalPricingRules: !!(logic.pricingConfig?.globalPricingRules?.length),
      globalPricingRulesCount: logic.pricingConfig?.globalPricingRules?.length || 0,
      hasAdditionalFees: !!(logic.pricingConfig?.additionalFees?.length),
      additionalFeesCount: logic.pricingConfig?.additionalFees?.length || 0,
      hasFranchisedCitySupplementary: !!(logic.franchisedCitySupplementary),
      franchisedCitySupplementaryCount: Object.keys(logic.franchisedCitySupplementary || {}).length
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
   * Find matching Global Pricing Rule based on service parameters
   * Supports "auto-inherit" values that match any service parameter
   * FIXED: Now normalizes equipment types and container sizes for case-insensitive matching
   */
  private findMatchingGlobalRule(
    serviceRequest: ServiceRequest,
    globalPricingRules: GlobalPricingRule[]
  ): GlobalPricingRule | null {
    if (!globalPricingRules || globalPricingRules.length === 0) {
      return null;
    }

    // Normalize service request values for consistent matching
    const normalizedRequestEquipment = this.normalizeEquipmentType(serviceRequest.equipmentType);
    const normalizedRequestContainer = this.normalizeContainerSizeForMatching(serviceRequest.containerSize);

    console.log('🔍 Finding matching Global Pricing Rule:', {
      originalEquipment: serviceRequest.equipmentType,
      normalizedEquipment: normalizedRequestEquipment,
      originalContainer: serviceRequest.containerSize,
      normalizedContainer: normalizedRequestContainer,
      frequency: serviceRequest.frequency,
      materialType: serviceRequest.materialType,
      availableRules: globalPricingRules.length
    });

    const matchedRule = globalPricingRules.find(rule => {
      // Normalize rule values for comparison
      const normalizedRuleEquipment = this.normalizeEquipmentType(rule.equipmentType);
      const normalizedRuleContainer = this.normalizeContainerSizeForMatching(rule.containerSize);

      // Each parameter can be "auto-inherit" (matches anything) or a specific value
      // FIXED: Compare normalized values instead of raw values
      const matchesEquipment =
        rule.equipmentType === 'auto-inherit' ||
        normalizedRuleEquipment === normalizedRequestEquipment;

      const matchesContainer =
        rule.containerSize === 'auto-inherit' ||
        normalizedRuleContainer === normalizedRequestContainer;

      const matchesFrequency =
        rule.frequency === 'auto-inherit' ||
        rule.frequency === serviceRequest.frequency;

      const matchesMaterial =
        rule.materialType === 'auto-inherit' ||
        rule.materialType === serviceRequest.materialType;

      console.log('  🔎 Checking rule:', {
        ruleId: rule.id,
        ruleEquipment: rule.equipmentType,
        normalizedRuleEquipment,
        ruleContainer: rule.containerSize,
        normalizedRuleContainer,
        ruleFrequency: rule.frequency,
        ruleMaterial: rule.materialType,
        matchesEquipment,
        matchesContainer,
        matchesFrequency,
        matchesMaterial,
        MATCH: matchesEquipment && matchesContainer && matchesFrequency && matchesMaterial
      });

      return matchesEquipment && matchesContainer && matchesFrequency && matchesMaterial;
    });

    if (matchedRule) {
      console.log('✅ GLOBAL RULE MATCHED:', {
        ruleId: matchedRule.id,
        equipmentType: matchedRule.equipmentType,
        containerSize: matchedRule.containerSize,
        frequency: matchedRule.frequency,
        materialType: matchedRule.materialType,
        isRollOffOrCompactor: matchedRule.isRollOffOrCompactor
      });
    } else {
      console.log('❌ NO GLOBAL RULE MATCHED');
    }

    return matchedRule || null;
  }

  /**
   * Find container-specific override within a Global Pricing Rule or pricing config
   * Equipment Type is OPTIONAL in overrides - if blank, matches all equipment types
   */
private findContainerOverride(
  serviceRequest: ServiceRequest,
  containerSpecificPricing: ContainerSpecificOverride[]
): ContainerSpecificOverride | undefined {
  if (!containerSpecificPricing || containerSpecificPricing.length === 0) {
    return undefined;
  }

  // Normalize the service request values for comparison
  const normalizedRequestEquipment = this.normalizeEquipmentType(serviceRequest.equipmentType);
  const normalizedRequestContainer = this.normalizeContainerSizeForMatching(serviceRequest.containerSize);

  console.log('🔍 CONTAINER OVERRIDE SEARCH:', {
    originalEquipment: serviceRequest.equipmentType,
    normalizedEquipment: normalizedRequestEquipment,
    originalContainer: serviceRequest.containerSize,
    normalizedContainer: normalizedRequestContainer,
    availableOverrides: containerSpecificPricing.length
  });

  const matchedOverride = containerSpecificPricing.find(override => {
    // Normalize override values for comparison
    const normalizedOverrideEquipment = override.equipmentType 
      ? this.normalizeEquipmentType(override.equipmentType) 
      : null;
    const normalizedOverrideContainer = this.normalizeContainerSizeForMatching(override.containerSize);

    // Equipment Type matching:
    // - If blank/null/undefined → matches ANY equipment type
    // - If specified → must match after normalization
    const matchesEquipment = 
      !normalizedOverrideEquipment || 
      normalizedOverrideEquipment === normalizedRequestEquipment;
    
    // Container Size must match exactly after normalization (always required)
    const matchesContainer = normalizedOverrideContainer === normalizedRequestContainer;
    
    console.log('  🔎 Checking override:', {
      overrideEquipment: override.equipmentType,
      normalizedOverrideEquipment,
      overrideContainer: override.containerSize,
      normalizedOverrideContainer,
      pricePerYard: override.pricePerYard,
      matchesEquipment,
      matchesContainer,
      MATCH: matchesEquipment && matchesContainer
    });

    return matchesEquipment && matchesContainer;
  });

  if (matchedOverride) {
    console.log('✅ CONTAINER OVERRIDE MATCHED:', {
      equipment: matchedOverride.equipmentType || 'Any Equipment',
      containerSize: matchedOverride.containerSize,
      pricePerYard: matchedOverride.pricePerYard
    });
  } else {
    console.log('❌ NO CONTAINER OVERRIDE MATCHED');
  }

  return matchedOverride;
}

  /**
   * Generate quote from pricing configuration
   * Updated to support Global Pricing Rules hierarchy
   */
  private generateQuoteFromPricingConfig(
    serviceRequest: ServiceRequest, 
    cityFranchiseFee: number, 
    citySalesTax: number
  ): Quote {
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

    // NEW: PRICING HIERARCHY WITH GLOBAL RULES
    let pricePerYard: number;
    let pricingSource: string;
    let baseFees: {
      fuelSurchargeRate: number;
      franchiseFeeRate: number;
      localTaxRate: number;
      deliveryFee: number;
      extraPickupRate: number;
    };

    // STEP 1: Try to find matching Global Pricing Rule
    const matchingGlobalRule = this.findMatchingGlobalRule(
      serviceRequest,
      config.globalPricingRules || []
    );

    if (matchingGlobalRule) {
      console.log('🎯 Found matching Global Pricing Rule:', {
        ruleId: matchingGlobalRule.id,
        serviceParams: {
          equipmentType: matchingGlobalRule.equipmentType,
          containerSize: matchingGlobalRule.containerSize,
          frequency: matchingGlobalRule.frequency,
          materialType: matchingGlobalRule.materialType
        },
        isRollOffOrCompactor: matchingGlobalRule.isRollOffOrCompactor
      });

      // CHECK: If this is a Roll-off or Compactor rule, use special pricing logic
      if (matchingGlobalRule.isRollOffOrCompactor && matchingGlobalRule.rollOffPricing) {
        console.log('🚛 Routing to Roll-off/Compactor pricing logic');
        return this.generateRollOffCompactorQuote(
          serviceRequest,
          matchingGlobalRule,
          cityFranchiseFee,
          citySalesTax
        );
      }

      // STEP 2: Within the matched rule, check for Container-Specific override
      const containerOverride = this.findContainerOverride(
        serviceRequest,
        matchingGlobalRule.containerSpecificPricing || []
      );

      if (containerOverride) {
        // PRIORITY 1: Container-Specific override within the rule
        pricePerYard = containerOverride.pricePerYard;
        pricingSource = `Global Rule (Container Override: ${containerOverride.equipmentType || 'Any Equipment'} + ${containerOverride.containerSize})`;
        console.log('📦 Using container-specific override from Global Rule (PRIORITY 1):', {
          equipmentType: containerOverride.equipmentType || 'Any Equipment',
          containerSize: containerOverride.containerSize,
          pricePerYard: containerOverride.pricePerYard
        });
      } else {
        // PRIORITY 2: Rule's Small/Large Container pricing
        const isSmallContainer = [2, 3, 4].includes(containerSizeNumber);
        const isLargeContainer = [6, 8, 10].includes(containerSizeNumber);
        const isOversizedContainer = containerSizeNumber >= 20; // 20YD, 30YD, 40YD, etc.

        if (isSmallContainer) {
          pricePerYard = matchingGlobalRule.smallContainerPricePerYard;
          pricingSource = 'Global Rule (Small Container Price)';
          console.log('🌐 Using Global Rule Small Container pricing (PRIORITY 2):', {
            containerSizeNumber,
            pricePerYard
          });
        } else if (isLargeContainer) {
          pricePerYard = matchingGlobalRule.largeContainerPricePerYard;
          pricingSource = 'Global Rule (Large Container Price)';
          console.log('🌐 Using Global Rule Large Container pricing (PRIORITY 2):', {
            containerSizeNumber,
            pricePerYard
          });
        } else if (isOversizedContainer) {
          // ✅ FIXED: Check if this is Roll-off/Compactor equipment before failing
          const normalizedEquipment = this.normalizeEquipmentType(serviceRequest.equipmentType);

          if (normalizedEquipment === 'Roll-off' || normalizedEquipment === 'Compactor') {
            // This is Roll-off/Compactor but wasn't routed to specialized pricing
            console.error('❌ ROLL-OFF/COMPACTOR PRICING CONFIGURATION MISSING:', {
              containerSize: serviceRequest.containerSize,
              containerSizeNumber,
              equipmentType: serviceRequest.equipmentType,
              normalizedEquipment,
              message: 'Roll-off/Compactor equipment should use specialized pricing configuration, not container-specific pricing'
            });

            return this.createFailedQuote(
              serviceRequest,
              `Roll-off/Compactor pricing configuration is missing or incomplete. Please configure Roll-off pricing at Step 1: Choose Pricing Logic with Delivery Fee, Rental, Haul Rate, and Disposal Per Ton.`
            );
          }

          // Standard oversized container (not Roll-off/Compactor)
          console.error('❌ OVERSIZED CONTAINER WITHOUT SPECIFIC PRICING:', {
            containerSize: serviceRequest.containerSize,
            containerSizeNumber,
            equipmentType: serviceRequest.equipmentType,
            message: 'Oversized containers (20YD+) require container-specific pricing and should NOT default to large container price'
          });

          return this.createFailedQuote(
            serviceRequest,
            `Oversized container (${serviceRequest.containerSize}) requires container-specific pricing. Please configure pricing for this container size.`
          );
        } else {
          // Unknown container size (not small, large, or oversized)
          console.error('❌ UNKNOWN CONTAINER SIZE:', {
            containerSize: serviceRequest.containerSize,
            containerSizeNumber
          });
          
          return this.createFailedQuote(
            serviceRequest,
            `Unknown container size (${serviceRequest.containerSize}). Please configure pricing for this container size.`
          );
        }
      }

      // ✅ FIXED: Calculate effective franchise fee with CITY PRIORITY
      const effectiveFranchiseFee = cityFranchiseFee > 0
        ? cityFranchiseFee  // City fee ALWAYS wins when it exists
        : (matchingGlobalRule.franchiseFeePercent ?? config.franchiseFee ?? 0);

      console.log('🏛️ Franchise fee priority resolution (FIXED):', {
        cityFranchiseFee,
        globalRuleFranchiseFee: matchingGlobalRule.franchiseFeePercent,
        configFranchiseFee: config.franchiseFee,
        effectiveFranchiseFee,
        priorityUsed: cityFranchiseFee > 0 ? 'CITY (highest priority)' : 'Global Rule or Config',
        city: serviceRequest.city,
        state: serviceRequest.state
      });

      // Use fees from the Global Rule with CORRECTED franchise fee priority
      baseFees = {
        fuelSurchargeRate: matchingGlobalRule.fuelSurchargePercent ?? config.fuelSurcharge ?? 15,
        franchiseFeeRate: effectiveFranchiseFee,  // ✅ Now correctly prioritizes city fees
        localTaxRate: matchingGlobalRule.taxPercent ?? citySalesTax ?? config.tax ?? 8.25,
        deliveryFee: matchingGlobalRule.deliveryFee ?? config.deliveryFee ?? 0,
        extraPickupRate: matchingGlobalRule.extraPickupRate ?? config.extraPickupRate ?? 0
      };

    } else {
      // NO MATCHING GLOBAL RULE - Fall back to default pricing config
      console.log('🔄 No matching Global Rule, using default pricing config');

      // Normalize service request values for consistent matching
      const normalizedServiceEquipmentType = this.normalizeEquipmentType(serviceRequest.equipmentType);
      const normalizedServiceContainerSize = normalizeContainerSize(serviceRequest.containerSize);

      // Check for container-specific pricing rules in default config
      const containerSpecificRule = config.containerSpecificPricingRules?.find(rule => {
        const normalizedRuleEquipmentType = this.normalizeEquipmentType(rule.equipmentType);
        const normalizedRuleContainerSize = normalizeContainerSize(rule.containerSize);
        
        return normalizedRuleContainerSize === normalizedServiceContainerSize &&
          normalizedRuleEquipmentType === normalizedServiceEquipmentType;
      });

      if (this.isSingleLocation) {
        // For single location workflow, use the single Price/YD value
        pricePerYard = config.smallContainerPrice;
        pricingSource = 'Default Config (Single Price/YD)';
        console.log('🎯 Single location pricing applied:', {
          pricePerYard: config.smallContainerPrice
        });
      } else if (containerSpecificRule && containerSpecificRule.pricePerYard) {
        // Use container-specific rule from default config
        pricePerYard = containerSpecificRule.pricePerYard;
        pricingSource = 'Default Config (Container-Specific Rule)';
        console.log('📦 Using container-specific pricing rule from default config:', {
          containerSize: containerSpecificRule.containerSize,
          equipmentType: containerSpecificRule.equipmentType,
          pricePerYard: containerSpecificRule.pricePerYard
        });
      } else {
        // Use Small/Large Container pricing from default config
        const isSmallContainer = [2, 3, 4].includes(containerSizeNumber);
        const isLargeContainer = [6, 8, 10].includes(containerSizeNumber);
        const isOversizedContainer = containerSizeNumber >= 20; // 20YD, 30YD, 40YD, etc.
        
        if (isSmallContainer) {
          pricePerYard = config.smallContainerPrice;
          pricingSource = 'Default Config (Small Container Price)';
          console.log('🌐 Using default Small Container pricing:', {
            containerSizeNumber,
            pricePerYard
          });
        } else if (isLargeContainer) {
          pricePerYard = config.largeContainerPrice;
          pricingSource = 'Default Config (Large Container Price)';
          console.log('🌐 Using default Large Container pricing:', {
            containerSizeNumber,
            pricePerYard
          });
        } else if (isOversizedContainer) {
          // ✅ FIXED: Check if this is Roll-off/Compactor equipment before failing
          const normalizedEquipment = this.normalizeEquipmentType(serviceRequest.equipmentType);

          if (normalizedEquipment === 'Roll-off' || normalizedEquipment === 'Compactor') {
            // This is Roll-off/Compactor but wasn't routed to specialized pricing
            console.error('❌ ROLL-OFF/COMPACTOR PRICING CONFIGURATION MISSING:', {
              containerSize: serviceRequest.containerSize,
              containerSizeNumber,
              equipmentType: serviceRequest.equipmentType,
              normalizedEquipment,
              message: 'Roll-off/Compactor equipment should use specialized pricing configuration, not container-specific pricing'
            });

            return this.createFailedQuote(
              serviceRequest,
              `Roll-off/Compactor pricing configuration is missing or incomplete. Please configure Roll-off pricing at Step 1: Choose Pricing Logic with Delivery Fee, Rental, Haul Rate, and Disposal Per Ton.`
            );
          }

          // Standard oversized container (not Roll-off/Compactor)
          console.error('❌ OVERSIZED CONTAINER WITHOUT SPECIFIC PRICING:', {
            containerSize: serviceRequest.containerSize,
            containerSizeNumber,
            equipmentType: serviceRequest.equipmentType,
            message: 'Oversized containers (20YD+) require container-specific pricing and should NOT default to large container price'
          });

          return this.createFailedQuote(
            serviceRequest,
            `Oversized container (${serviceRequest.containerSize}) requires container-specific pricing. Please configure pricing for this container size.`
          );
        } else {
          // Unknown container size (not small, large, or oversized)
          console.error('❌ UNKNOWN CONTAINER SIZE:', {
            containerSize: serviceRequest.containerSize,
            containerSizeNumber
          });
          
          return this.createFailedQuote(
            serviceRequest,
            `Unknown container size (${serviceRequest.containerSize}). Please configure pricing for this container size.`
          );
        }
      }

      // Use fees from default config with CITY PRIORITY for franchise fee
      baseFees = {
        fuelSurchargeRate: config.fuelSurcharge ?? 15,
        franchiseFeeRate: cityFranchiseFee > 0 ? cityFranchiseFee : (config.franchiseFee ?? 0),
        localTaxRate: citySalesTax > 0 ? citySalesTax : (config.tax ?? 8.25),
        deliveryFee: config.deliveryFee ?? 0,
        extraPickupRate: config.extraPickupRate ?? 0
      };
    }

    // Validate that we have a valid price per yard
    if (!pricePerYard || pricePerYard <= 0) {
      console.error('❌ CRITICAL ERROR: No valid price per yard found!', {
        pricePerYard,
        hasGlobalRules: !!(config.globalPricingRules?.length),
        hasContainerSpecificRules: !!(config.containerSpecificPricingRules?.length),
        configSmallContainerPrice: config.smallContainerPrice,
        configLargeContainerPrice: config.largeContainerPrice
      });
      
      throw new Error(
        `No pricing configured for ${serviceRequest.containerSize} ${serviceRequest.equipmentType}. ` +
        `Please configure Global Pricing Rules, Container-Specific Pricing Rules, or Global Container Pricing.`
      );
    }

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 2
    // Cost before tax and fees = (Total volume) × (price per yard)
    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;
    
    // ✅ PHASE 3: Calculate additional fees with location filtering
    const { totalCost: addOnsCost, breakdown: addOnDetails } = this.calculateAdditionalFeesWithDetails(
      serviceRequest,
      config.additionalFees || []
    );

    // MANDATORY PRICING CALCULATION SEQUENCE - Step 3
    // Fuel Surcharge = (Cost before tax and fees) × Fuel Surcharge %
    const fuelSurchargeAmount = costBeforeTaxAndFees * (baseFees.fuelSurchargeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 4
    // Franchise Fee = (Cost before tax and fees + Additional Fees) × Franchise Fee %
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (baseFees.franchiseFeeRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 5
    // Subtotal = Cost before tax and fees + Franchise Fee + Fuel Surcharge + Additional Fees
    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 6
    // Tax = Subtotal × Tax %
    const localTaxAmount = subtotal * (baseFees.localTaxRate / 100);
    
    // MANDATORY PRICING CALCULATION SEQUENCE - Step 7
    // Final Total = Subtotal + Tax
    const totalMonthlyCost = subtotal + localTaxAmount;

    console.log('💰 Pricing calculation breakdown:', {
      pricingSource,
      totalMonthlyVolume,
      pricePerYard,
      costBeforeTaxAndFees,
      fuelSurchargeAmount,
      franchiseFeeAmount,
      addOnsCost,
      deliveryFee: baseFees.deliveryFee,
      extraPickupRate: baseFees.extraPickupRate,
      subtotal,
      localTaxAmount,
      totalMonthlyCost
    });

    return {
      id: `quote-${serviceRequest.id}`,
      serviceRequest,
      matchedRate: null,
      pricingSource,
      baseRate: costBeforeTaxAndFees,
      totalMonthlyVolume,
      numberOfUnits: serviceRequest.binQuantity || 1,
      pickupsPerWeek: serviceFrequency,
      franchiseFeeAmount,
      localTaxAmount,
      fuelSurchargeAmount,
      fuelSurchargeRate: baseFees.fuelSurchargeRate,
      franchiseFeeRate: baseFees.franchiseFeeRate,
      localTaxRate: baseFees.localTaxRate,
      deliveryFee: baseFees.deliveryFee,
      subtotal,
      valueC: 0,
      addOnsCost,
      totalPrice: totalMonthlyCost,
      totalMonthlyCost,
      status: 'success',
      extraPickupRate: baseFees.extraPickupRate,
      addOnDetails: addOnDetails.length > 0 ? addOnDetails : undefined
    };
  }

  /**
   * ASYNC Generate quote for single location workflow
   * Now async to support dynamic franchise fee loading
   */
  async generateQuote(request: ServiceRequest): Promise<Quote> {
    console.log('💰 Generating quote for single location request:', request);

    if (!this.pricingLogic) {
      throw new Error('Pricing logic not configured');
    }

    // Get service area result for this location
    const serviceAreaResult = this.serviceAreaData?.results.find(result =>
      result.address === request.address && result.city === request.city
    );

    // ✅ FIX: Extract city-specific fees for ALL cities (not just franchised cities)
    const safeCity = request.city || '';
    const safeState = request.state || '';

    console.log('🔍 Service request validation before franchise city matching:', {
      originalCity: request.city,
      originalState: request.state,
      safeCity,
      safeState,
      hasValidCity: !!safeCity,
      hasValidState: !!safeState
    });

    // ✅ CRITICAL FIX: Now using async matchFranchisedCity to load fees from CSV
    const franchisedCityMatch = await matchFranchisedCity(safeCity, safeState);

    // ✅ FIX: Extract the franchise fee and sales tax from the match result
    const cityFranchiseFee = franchisedCityMatch.franchiseFee;
    const citySalesTax = franchisedCityMatch.salesTax;

    console.log('🏛️ City-specific fees extracted for pricing:', {
      city: request.city,
      cityFranchiseFee: `${cityFranchiseFee}%`,
      citySalesTax: `${citySalesTax}%`,
      hasMunicipalRates: !!franchisedCityMatch.pricingData,
      isDallas: request.city.toLowerCase() === 'dallas',
      isHouston: request.city.toLowerCase() === 'houston'
    });

    // Check for franchised city first (highest priority)
    if (franchisedCityMatch.isMatch && franchisedCityMatch.pricingData) {
      return this.generateFranchisedCityQuoteSynchronous(request, franchisedCityMatch, cityFranchiseFee, citySalesTax);
    }

    // Use regional pricing brain if available
    if (this.pricingLogic.type === 'regional-brain' && this.regionalPricingData) {
      return this.generateRegionalQuote(request, cityFranchiseFee, citySalesTax);
    }

    // ✅ FIX: Pass cityFranchiseFee and citySalesTax to custom quote
    if (this.pricingLogic.type === 'custom') {
      return this.generateCustomQuote(request, cityFranchiseFee, citySalesTax);
    }

    // ✅ FIX: Pass cityFranchiseFee and citySalesTax to broker quote
    if (this.pricingLogic.type === 'broker' && this.pricingLogic.brokerRates) {
      return this.generateBrokerQuote(request, cityFranchiseFee, citySalesTax);
    }

    throw new Error('No valid pricing method available');
  }

  /**
   * ASYNC Generate quote for bulk workflow
   */
  async generateQuoteAsync(serviceRequest: ServiceRequest): Promise<Quote> {
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
          return this.generateRegionalQuote(resolvedServiceRequest, cityFranchiseFee, citySalesTax);
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
    const resolved = { ...serviceRequest };

    if (resolved.equipmentType === 'auto-inherit') {
      resolved.equipmentType = serviceRequest.equipmentType || 'Front-Load Container';
    }
    if (resolved.containerSize === 'auto-inherit') {
      resolved.containerSize = serviceRequest.containerSize || '8YD';
    }
    if (resolved.frequency === 'auto-inherit') {
      resolved.frequency = serviceRequest.frequency;
    }
    if (resolved.materialType === 'auto-inherit') {
      resolved.materialType = serviceRequest.materialType || 'Solid Waste';
    }

    return resolved;
  }

  /**
   * Generate quote using franchised city municipal pricing (ASYNC version for bulk workflow)
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

    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);

    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;
    const pricePerYard = rate.monthlyRate / (containerSizeNumber * serviceFrequency * 4.33);
    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;

    const deliveryFee = rate.deliveryFee ?? this.pricingLogic?.pricingConfig?.deliveryFee ?? 0;
    const extraPickupRate = rate.extraPickupRate ?? this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;

    // Get supplementary costs for this franchised city
    const supplementaryCosts = this.getSupplementaryCostsForCity(serviceRequest.city, serviceRequest.state);

    // Calculate supplementary costs and create detailed breakdown
    let addOnsCost = 0;
    const addOnDetails: Array<{
      category: string;
      originalPrice: number;
      originalFrequency: string;
      monthlyEquivalent: number;
    }> = [];

    supplementaryCosts.forEach(cost => {
      const monthlyEquivalent = this.convertFeeToMonthlyEquivalent(cost.amount, cost.frequency);
      addOnsCost += monthlyEquivalent;
      addOnDetails.push({
        category: cost.category,
        originalPrice: cost.amount,
        originalFrequency: cost.frequency,
        monthlyEquivalent
      });
    });

    console.log('📋 Supplementary costs applied to quote:', {
      city: serviceRequest.city,
      supplementaryCostsCount: supplementaryCosts.length,
      totalSupplementaryCost: addOnsCost,
      breakdown: addOnDetails
    });

    const fuelSurchargeRate = rate.fuelSurcharge ?? this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = costBeforeTaxAndFees * (fuelSurchargeRate / 100);

    const franchiseFeeRate = rate.franchiseFee ?? cityFranchiseFee ?? 0;
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100);

    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;

    const localTaxRate = rate.salesTax ?? citySalesTax ?? 8.25;
    const localTaxAmount = subtotal * (localTaxRate / 100);

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
      totalMonthlyCost
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
      extraPickupRate,
      addOnDetails: addOnDetails.length > 0 ? addOnDetails : undefined
    };
  }

  /**
   * Generate quote using franchised city municipal pricing (SYNCHRONOUS version for single location workflow)
   */
  private generateFranchisedCityQuoteSynchronous(serviceRequest: ServiceRequest, franchisedCityMatch: any, cityFranchiseFee: number, citySalesTax: number): Quote {
    console.log('🏛️ Generating franchised city quote (sync) for:', franchisedCityMatch.cityName);

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

    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);

    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;
    const pricePerYard = rate.monthlyRate / (containerSizeNumber * serviceFrequency * 4.33);
    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;

    const deliveryFee = rate.deliveryFee ?? this.pricingLogic?.pricingConfig?.deliveryFee ?? 0;
    const extraPickupRate = rate.extraPickupRate ?? this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;

    // Get supplementary costs for this franchised city
    const supplementaryCosts = this.getSupplementaryCostsForCity(serviceRequest.city, serviceRequest.state);

    // Calculate supplementary costs and create detailed breakdown
    let addOnsCost = 0;
    const addOnDetails: Array<{
      category: string;
      originalPrice: number;
      originalFrequency: string;
      monthlyEquivalent: number;
    }> = [];

    supplementaryCosts.forEach(cost => {
      const monthlyEquivalent = this.convertFeeToMonthlyEquivalent(cost.amount, cost.frequency);
      addOnsCost += monthlyEquivalent;
      addOnDetails.push({
        category: cost.category,
        originalPrice: cost.amount,
        originalFrequency: cost.frequency,
        monthlyEquivalent
      });
    });

    console.log('📋 Supplementary costs applied to quote (sync):', {
      city: serviceRequest.city,
      supplementaryCostsCount: supplementaryCosts.length,
      totalSupplementaryCost: addOnsCost,
      breakdown: addOnDetails
    });

    const fuelSurchargeRate = rate.fuelSurcharge ?? this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = costBeforeTaxAndFees * (fuelSurchargeRate / 100);

    const franchiseFeeRate = rate.franchiseFee ?? cityFranchiseFee ?? 0;
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100);

    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;

    const localTaxRate = rate.salesTax ?? citySalesTax ?? 8.25;
    const localTaxAmount = subtotal * (localTaxRate / 100);

    const totalMonthlyCost = subtotal + localTaxAmount;

    console.log('🏛️ Franchised city pricing calculation breakdown (sync):', {
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
      totalMonthlyCost
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
      extraPickupRate,
      addOnDetails: addOnDetails.length > 0 ? addOnDetails : undefined
    };
  }

  /**
   * Generate quote using regional pricing brain
   */
  private generateRegionalQuote(
    serviceRequest: ServiceRequest,
    cityFranchiseFee: number, 
    citySalesTax: number
  ): Quote {
    console.log('🧠 Generating regional brain quote');

    if (!this.pricingLogic?.regionalPricingData) {
      throw new Error('Regional pricing data not available');
    }

    const region = this.determineRegion(serviceRequest.city, serviceRequest.state);
    
    if (!region) {
      throw new Error(`Cannot determine region for ${serviceRequest.city}, ${serviceRequest.state}`);
    }

    const rateSheet = this.pricingLogic.regionalPricingData.rateSheets.find(sheet => sheet.region === region);
    
    if (!rateSheet) {
      throw new Error(`No rate sheet found for region: ${region}`);
    }

    const matchingRate = rateSheet.rates.find(rate => 
      rate.containerSize === serviceRequest.containerSize && 
      rate.frequency === serviceRequest.frequency
    );

    if (!matchingRate) {
      throw new Error(`No rate found for ${serviceRequest.containerSize} with ${serviceRequest.frequency} frequency in ${region} region`);
    }

    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);
    
    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;
    const pricePerYard = matchingRate.price / (containerSizeNumber * 4.33);
    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;
    
    const deliveryFee = this.pricingLogic?.pricingConfig?.deliveryFee ?? 100;
    const extraPickupRate = this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;
    const addOnsCost = 0;

    const fuelSurchargeRate = this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = costBeforeTaxAndFees * (fuelSurchargeRate / 100);
    
    const franchiseFeeRate = cityFranchiseFee ?? 0;
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100);
    
    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;
    
    const localTaxRate = citySalesTax ?? 8.25;
    const localTaxAmount = subtotal * (localTaxRate / 100);
    
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
      totalMonthlyCost
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

    const matchingRule = this.findMatchingCustomRule(serviceRequest);
    
    if (matchingRule) {
      return this.generateQuoteFromCustomRule(serviceRequest, matchingRule, cityFranchiseFee, citySalesTax);
    }

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

    if (!serviceRequest.city || !serviceRequest.state) {
      throw new Error('Service request missing required city or state information');
    }

    const matchingRate = this.pricingLogic.brokerRates.find(rate => {
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

    const containerSizeNumber = this.extractContainerSizeNumber(serviceRequest.containerSize);
    const serviceFrequency = getFrequencyMultiplier(serviceRequest.frequency);
    
    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;
    const costBeforeTaxAndFees = matchingRate.baseRate * (serviceRequest.binQuantity || 1);
    
    const addOnsCost = 0;
    const franchiseFeeRate = matchingRate.franchiseFee ? 0 : cityFranchiseFee;
    const franchiseFeeAmount = matchingRate.franchiseFee || ((costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100));
    
    const localTaxRate = matchingRate.localTax ? 0 : citySalesTax;
    
    const fuelSurchargeRate = this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = matchingRate.fuelSurcharge || (costBeforeTaxAndFees * (fuelSurchargeRate / 100));
    
    const deliveryFee = (matchingRate as any).deliveryFee ?? this.pricingLogic?.pricingConfig?.deliveryFee ?? 0;
    const extraPickupRate = (matchingRate as any).extraPickupRate ?? this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;

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

    const normalizedServiceEquipmentType = this.normalizeEquipmentType(serviceRequest.equipmentType);
    const normalizedServiceContainerSize = normalizeContainerSize(serviceRequest.containerSize);

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
    
    const totalMonthlyVolume = (serviceRequest.binQuantity || 1) * serviceFrequency * containerSizeNumber * 4.33;

    let pricePerYard: number;
    const isSmallContainer = [2, 3, 4].includes(containerSizeNumber);
    const isLargeContainer = [6, 8, 10].includes(containerSizeNumber);

    if (rule.pricePerYard && rule.pricePerYard > 0) {
      if (isSmallContainer) {
        pricePerYard = rule.pricePerYard;
      } else if (isLargeContainer && rule.largeContainerPricePerYard) {
        pricePerYard = rule.largeContainerPricePerYard;
      } else {
        pricePerYard = rule.pricePerYard;
      }
      
      console.log('🎯 Using custom rule specific pricing (single location):', {
        pricePerYard,
        source: 'Custom rule direct pricing'
      });
    } else {
      console.log('🎯 Applying bulk upload pricing hierarchy for custom rule');
      
      const normalizedServiceEquipmentType = this.normalizeEquipmentType(serviceRequest.equipmentType);
      const normalizedServiceContainerSize = normalizeContainerSize(serviceRequest.containerSize);
      
      const containerSpecificRule = this.pricingLogic?.pricingConfig?.containerSpecificPricingRules?.find(rule => {
        const normalizedRuleEquipmentType = this.normalizeEquipmentType(rule.equipmentType);
        const normalizedRuleContainerSize = normalizeContainerSize(rule.containerSize);
        
        return normalizedRuleContainerSize === normalizedServiceContainerSize &&
          normalizedRuleEquipmentType === normalizedServiceEquipmentType;
      });
      
      if (containerSpecificRule && containerSpecificRule.pricePerYard) {
        pricePerYard = containerSpecificRule.pricePerYard;
        console.log('📦 Using container-specific pricing rule (PRIORITY 1):', {
          containerSize: containerSpecificRule.containerSize,
          equipmentType: containerSpecificRule.equipmentType,
          pricePerYard: containerSpecificRule.pricePerYard,
          source: 'Container-specific rule'
        });
      } else {
        if (isSmallContainer) {
          pricePerYard = this.pricingLogic?.pricingConfig?.smallContainerPrice || 0;
        } else if (isLargeContainer) {
          pricePerYard = this.pricingLogic?.pricingConfig?.largeContainerPrice || 0;
        } else {
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

    const costBeforeTaxAndFees = totalMonthlyVolume * pricePerYard;
    
    const deliveryFee = rule.deliveryFee ?? this.pricingLogic?.pricingConfig?.deliveryFee ?? 0;
    const extraPickupRate = rule.extraPickupRate ?? this.pricingLogic?.pricingConfig?.extraPickupRate ?? 0;
    const addOnsCost = 0;

    const franchiseFeeRate = rule.franchiseFee ?? cityFranchiseFee ?? 0;
    const fuelSurchargeRate = rule.fuelSurcharge ?? this.pricingLogic?.pricingConfig?.fuelSurcharge ?? 15;
    const fuelSurchargeAmount = costBeforeTaxAndFees * (fuelSurchargeRate / 100);
    
    const franchiseFeeAmount = (costBeforeTaxAndFees + addOnsCost) * (franchiseFeeRate / 100);
    
    const subtotal = costBeforeTaxAndFees + franchiseFeeAmount + fuelSurchargeAmount + addOnsCost;
    
    const localTaxRate = rule.tax ?? citySalesTax ?? 8.25;
    const localTaxAmount = subtotal * (localTaxRate / 100);
    
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
      totalMonthlyCost
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
   * Get supplementary costs for a specific city
   */
  private getSupplementaryCostsForCity(cityName: string, state: string): SupplementaryCost[] {
    if (!this.pricingLogic?.franchisedCitySupplementary) {
      return [];
    }

    const key = `${cityName.toLowerCase()}, ${state.toLowerCase()}`;
    const supplementaryPricing = this.pricingLogic.franchisedCitySupplementary[key];

    if (!supplementaryPricing || !supplementaryPricing.supplementaryCosts) {
      return [];
    }

    console.log('📋 Supplementary costs found for city:', {
      city: cityName,
      state,
      costsCount: supplementaryPricing.supplementaryCosts.length,
      costs: supplementaryPricing.supplementaryCosts.map(c => ({
        category: c.category,
        amount: c.amount,
        frequency: c.frequency
      }))
    });

    return supplementaryPricing.supplementaryCosts;
  }

  /**
   * ✅ PHASE 3: Calculate additional fees for a service request with location filtering
   * Filters fees to include only:
   * - Global fees (no locationId)
   * - Location-specific fees matching this serviceRequest.id
   */
  private calculateAdditionalFees(serviceRequest: ServiceRequest, additionalFees: AdditionalFee[]): number {
    if (!additionalFees || additionalFees.length === 0) {
      return 0;
    }

    // ✅ PHASE 3: Filter fees by location
    const applicableFees = additionalFees.filter(fee => {
      // Include fee if:
      // 1. It has no locationId (global fee), OR
      // 2. Its locationId matches this service request
      const isApplicable = !fee.locationId || fee.locationId === serviceRequest.id;
      
      if (!isApplicable) {
        console.log('  ⏭️ Skipping fee (location mismatch):', {
          feeCategory: fee.category,
          feeLocationId: fee.locationId,
          serviceRequestId: serviceRequest.id
        });
      }
      
      return isApplicable;
    });

    console.log('💰 Additional fees filtering (Phase 3):', {
      totalFeesConfigured: additionalFees.length,
      applicableFeesForThisLocation: applicableFees.length,
      serviceRequestId: serviceRequest.id,
      serviceRequestAddress: `${serviceRequest.address}, ${serviceRequest.city}, ${serviceRequest.state}`,
      feesBreakdown: applicableFees.map(f => ({
        category: f.category,
        price: f.price,
        frequency: f.frequency,
        locationSpecific: !!f.locationId,
        locationDisplay: f.locationDisplay
      }))
    });

    let totalAdditionalFees = 0;

    applicableFees.forEach(fee => {
      const monthlyEquivalent = this.convertFeeToMonthlyEquivalent(fee.price, fee.frequency);
      totalAdditionalFees += monthlyEquivalent;
    });

    console.log('💰 Additional fees calculated:', {
      totalFees: applicableFees.length,
      totalMonthlyEquivalent: totalAdditionalFees
    });

    return totalAdditionalFees;
  }

  /**
   * ✅ PHASE 3: Calculate additional fees with detailed breakdown and location filtering
   * Filters fees to include only:
   * - Global fees (no locationId)
   * - Location-specific fees matching this serviceRequest.id
   */
  private calculateAdditionalFeesWithDetails(
    serviceRequest: ServiceRequest,
    additionalFees: AdditionalFee[]
  ): {
    totalCost: number;
    breakdown: Array<{
      category: string;
      originalPrice: number;
      originalFrequency: string;
      monthlyEquivalent: number;
      locationSpecific?: boolean;      // ✅ PHASE 3: New field
      locationDisplay?: string;        // ✅ PHASE 3: New field
    }>;
  } {
    if (!additionalFees || additionalFees.length === 0) {
      return { totalCost: 0, breakdown: [] };
    }

    // ✅ PHASE 3: Filter fees by location
    const applicableFees = additionalFees.filter(fee => {
      // Include fee if:
      // 1. It has no locationId (global fee), OR
      // 2. Its locationId matches this service request
      const isApplicable = !fee.locationId || fee.locationId === serviceRequest.id;
      
      if (!isApplicable) {
        console.log('  ⏭️ Skipping fee (location mismatch):', {
          feeCategory: fee.category,
          feeLocationId: fee.locationId,
          serviceRequestId: serviceRequest.id
        });
      }
      
      return isApplicable;
    });

    console.log('💰 Additional fees filtering with details (Phase 3):', {
      totalFeesConfigured: additionalFees.length,
      applicableFeesForThisLocation: applicableFees.length,
      serviceRequestId: serviceRequest.id,
      serviceRequestLocation: `${serviceRequest.address}, ${serviceRequest.city}, ${serviceRequest.state}`,
      globalFees: applicableFees.filter(f => !f.locationId).length,
      locationSpecificFees: applicableFees.filter(f => !!f.locationId).length
    });

    let totalCost = 0;
    const breakdown: Array<{
      category: string;
      originalPrice: number;
      originalFrequency: string;
      monthlyEquivalent: number;
      locationSpecific?: boolean;
      locationDisplay?: string;
    }> = [];

    applicableFees.forEach(fee => {
      const monthlyEquivalent = this.convertFeeToMonthlyEquivalent(fee.price, fee.frequency);
      totalCost += monthlyEquivalent;

      breakdown.push({
        category: fee.category,
        originalPrice: fee.price,
        originalFrequency: fee.frequency,
        monthlyEquivalent,
        locationSpecific: !!fee.locationId,      // ✅ PHASE 3: Track if location-specific
        locationDisplay: fee.locationDisplay     // ✅ PHASE 3: Include location info
      });
    });

    console.log('💰 Additional fees calculated with details:', {
      totalFees: applicableFees.length,
      totalMonthlyEquivalent: totalCost,
      breakdown
    });

    return { totalCost, breakdown };
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
   * Generate quote for Roll-off or Compactor equipment
   * Uses special pricing structure with delivery, rental, haul, disposal, etc.
   */
  private generateRollOffCompactorQuote(
    serviceRequest: ServiceRequest,
    rule: GlobalPricingRule,
    cityFranchiseFee: number,
    citySalesTax: number
  ): Quote {
    console.log('🚛 Generating Roll-off/Compactor quote with pricing:', rule.rollOffPricing);

    if (!rule.rollOffPricing) {
      throw new Error('Roll-off pricing configuration is missing');
    }

    const rollOffPricing = rule.rollOffPricing;
    const binQuantity = serviceRequest.binQuantity || 1;

    // Calculate base costs
    const deliveryFee = rollOffPricing.deliveryFee || 0;
    const dailyRental = rollOffPricing.dailyRental || 0;
    const monthlyRent = rollOffPricing.monthlyRent || 0;
    const haulRate = rollOffPricing.haulRate || 0;
    const disposalPerTon = rollOffPricing.disposalPerTon || 0;
    const dryRun = rollOffPricing.dryRun || 0;
    const deposit = rollOffPricing.deposit || 0;

    // Calculate monthly rental cost (use whichever is provided)
    // Daily rental is typically charged per day, so multiply by ~30 for monthly equivalent
    const monthlyRentalCost = monthlyRent || (dailyRental * 30);

    // Total monthly recurring cost
    const monthlyRecurringCost = monthlyRentalCost * binQuantity;

    // One-time costs
    const oneTimeCosts = deliveryFee + (deposit || 0);

    // Calculate franchise fee and tax
    const franchiseFeeAmount = monthlyRecurringCost * (cityFranchiseFee / 100);
    const localTaxAmount = (monthlyRecurringCost + franchiseFeeAmount) * (citySalesTax / 100);

    // Total monthly cost includes recurring + franchise + tax
    const totalMonthlyCost = monthlyRecurringCost + franchiseFeeAmount + localTaxAmount;

    // Base rate for roll-off is the haul rate + disposal (per haul)
    const baseRate = haulRate + disposalPerTon;

    console.log('🚛 Roll-off Quote Calculation:', {
      deliveryFee,
      dailyRental,
      monthlyRent,
      monthlyRentalCost,
      haulRate,
      disposalPerTon,
      baseRate,
      dryRun,
      deposit,
      binQuantity,
      monthlyRecurringCost,
      franchiseFeeAmount,
      localTaxAmount,
      totalMonthlyCost
    });

    return {
      id: `quote-${serviceRequest.id}`,
      serviceRequest,
      matchedRate: null,
      pricingSource: 'Roll-off/Compactor Pricing',
      baseRate,
      totalMonthlyVolume: 0, // Not applicable for roll-off
      numberOfUnits: binQuantity,
      pickupsPerWeek: 0, // Not applicable for roll-off
      franchiseFeeAmount,
      localTaxAmount,
      fuelSurchargeAmount: 0,
      fuelSurchargeRate: 0,
      franchiseFeeRate: cityFranchiseFee,
      localTaxRate: citySalesTax,
      deliveryFee,
      subtotal: monthlyRecurringCost,
      valueC: 0,
      addOnsCost: 0,
      totalPrice: totalMonthlyCost + oneTimeCosts,
      totalMonthlyCost,
      status: 'success',
      isRollOffOrCompactor: true,
      rollOffPricing: {
        deliveryFee,
        deliveryFeeNegotiable: rollOffPricing.deliveryFeeNegotiable,
        dailyRental,
        dailyRentalNegotiable: rollOffPricing.dailyRentalNegotiable,
        monthlyRent,
        monthlyRentNegotiable: rollOffPricing.monthlyRentNegotiable,
        haulRate,
        haulRateNegotiable: rollOffPricing.haulRateNegotiable,
        disposalPerTon,
        disposalPerTonNegotiable: rollOffPricing.disposalPerTonNegotiable,
        dryRun,
        dryRunNegotiable: rollOffPricing.dryRunNegotiable,
        deposit,
        depositNegotiable: rollOffPricing.depositNegotiable,
        depositCities: rollOffPricing.depositCities
      }
    };
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

    const ntxCities = ['dallas', 'fort worth', 'plano', 'garland', 'irving', 'grand prairie', 'mesquite', 'mckinney', 'carrollton', 'frisco', 'denton', 'richardson', 'lewisville', 'allen', 'flower mound', 'mansfield', 'euless', 'desoto', 'grapevine', 'bedford', 'haltom city', 'wylie', 'keller', 'coppell', 'duncanville', 'rockwall', 'farmers branch', 'rowlett', 'the colony', 'southlake', 'watauga', 'colleyville', 'corinth', 'highland village', 'lancaster', 'little elm', 'north richland hills', 'princeton', 'sachse', 'addison', 'cedar hill', 'glenn heights', 'murphy', 'prosper', 'red oak', 'seagoville', 'university park', 'weatherford', 'granbury', 'cresson', 'sherman', 'denison', 'gainesville', 'justin'];

    const stxCities = ['houston', 'corpus christi', 'pasadena', 'pearland', 'league city', 'sugar land', 'baytown', 'beaumont', 'missouri city', 'galveston', 'conroe', 'texas city', 'huntsville', 'lufkin', 'tyler', 'longview', 'texarkana', 'port arthur', 'orange', 'liberty', 'cleveland', 'dayton', 'tomball', 'jersey village', 'cypress', 'humble', 'katy', 'spring', 'channelview', 'la porte'];

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
    return match ? parseInt(match[1]) : 8;
  }
  
/**
 * Normalize container size for consistent matching
 * Handles variations like "8YD", "8 YD", "8 Yard", "8 Yards", "8yd"
 */
private normalizeContainerSizeForMatching(containerSize: string): string {
  if (!containerSize || typeof containerSize !== 'string') {
    return '8YD'; // Default
  }

  // Extract the numeric part
  const match = containerSize.match(/(\d+)/);
  if (!match) {
    return '8YD'; // Default if no number found
  }

  const sizeNumber = match[1];
  
  // Return standardized format: "8YD"
  return `${sizeNumber}YD`;
}
  
  /**
   * Normalize equipment type for consistent matching
   * ENHANCED: Now handles all variations including "roll off" (with space)
   */
  private normalizeEquipmentType(equipmentType: string): string {
    if (!equipmentType || typeof equipmentType !== 'string') {
      return 'Front-Load Container';
    }

    // Normalize to lowercase and trim whitespace
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

    // Roll-off variations (ENHANCED: explicitly handle "roll off" with space)
    if (normalized.includes('roll') ||
        normalized.includes('rolloff') ||
        normalized.includes('roll-off') ||
        normalized.includes('roll off') ||  // NEW: explicit handling
        normalized === 'rolloff' ||
        normalized === 'roll-off' ||
        normalized === 'roll off' ||        // NEW: explicit handling
        normalized.includes('temporary') ||
        normalized.includes('temp')) {
      return 'Roll-off';
    }

    // Compactor variations
    if (normalized.includes('compactor') ||
        normalized.includes('compact')) {
      return 'Compactor';
    }

    // Default fallback
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
