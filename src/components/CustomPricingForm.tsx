import React, { useState } from 'react';
import { CustomPricingRule, PricingConfig, AdditionalFee, ContainerSpecificPricingRule, ServiceAreaVerificationData } from '../types';
import { FREQUENCY_OPTIONS, EQUIPMENT_TYPES, MATERIAL_TYPES, CONTAINER_SIZES } from '../data/divisions';
import { Plus, Trash2, DollarSign, Percent, Settings, X } from 'lucide-react';
import { ComprehensivePricingForm } from './ComprehensivePricingForm';

interface CustomPricingFormProps {
  initialRules: CustomPricingRule[];
  onRulesUpdate: (rules: CustomPricingRule[]) => void;
  serviceAreaVerification?: ServiceAreaVerificationData | null;
  isSingleLocation?: boolean;
  pricingConfig: PricingConfig;
  onPricingConfigUpdate: (config: PricingConfig, isValid?: boolean) => void;
  onApplyPricingConfig?: () => void;
}

export function CustomPricingForm({ 
  initialRules, 
  onRulesUpdate, 
  serviceAreaVerification, 
  isSingleLocation = false,
  pricingConfig,
  onPricingConfigUpdate,
  onApplyPricingConfig
}: CustomPricingFormProps) {
  const [rules, setRules] = useState<CustomPricingRule[]>(initialRules);
  const [showAdditionalFees, setShowAdditionalFees] = useState(false);
  const [manualRules, setManualRules] = useState<CustomPricingRule[]>(initialRules);
  const [showManualRuleForm, setShowManualRuleForm] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [showComprehensiveForm, setShowComprehensiveForm] = useState(false);
  
  // Single location workflow state variables
  const [newRuleEquipmentType, setNewRuleEquipmentType] = useState('auto-inherit');
  const [newRuleMaterialType, setNewRuleMaterialType] = useState('auto-inherit');
  const [newRuleContainerSize, setNewRuleContainerSize] = useState('auto-inherit');
  const [newRuleFrequency, setNewRuleFrequency] = useState('auto-inherit');
  const [newRuleBinQuantity, setNewRuleBinQuantity] = useState('auto-inherit');
  const [newRuleTax, setNewRuleTax] = useState(8.25);
  const [newRuleFranchiseFee, setNewRuleFranchiseFee] = useState(0);
  const [newRuleFuelSurcharge, setNewRuleFuelSurcharge] = useState(15);
  const [newRuleDeliveryFee, setNewRuleDeliveryFee] = useState(0);
  const [newRuleExtraPickupRate, setNewRuleExtraPickupRate] = useState(0);
  const [newRuleTaxExempt, setNewRuleTaxExempt] = useState(false);
  
  // Single location specific fields
  const [newRuleLargeContainerPricePerYard, setNewRuleLargeContainerPricePerYard] = useState(0);
  const [newRuleCity, setNewRuleCity] = useState('');
  const [newRuleState, setNewRuleState] = useState('Texas');

  // Initialize newRulePricePerYard with pricingConfig value
  const [newRulePricePerYard, setNewRulePricePerYard] = useState(pricingConfig.smallContainerPrice || 0);

  // Synchronize newRulePricePerYard with pricingConfig.smallContainerPrice when it changes
  React.useEffect(() => {
    if (pricingConfig?.smallContainerPrice !== undefined && 
        pricingConfig.smallContainerPrice !== newRulePricePerYard &&
        newRulePricePerYard === 0) { // Only update if user hasn't entered a value yet
      console.log('🔄 Auto-populating Price/YD from service area verification:', {
        currentValue: newRulePricePerYard,
        newValue: pricingConfig.smallContainerPrice,
        reason: 'Auto-population from parent component'
      });
      setNewRulePricePerYard(pricingConfig.smallContainerPrice);
    }
  }, [pricingConfig?.smallContainerPrice]);
  
  // Derive serviceableLocation from serviceAreaVerification prop
  const serviceableLocation = isSingleLocation && serviceAreaVerification 
    ? serviceAreaVerification.results.find(result => result.status === 'serviceable')
    : null;

  // Update rules when initialRules prop changes
  React.useEffect(() => {
    setRules(initialRules);
  }, [initialRules]);

  // Update local state when config prop changes
  React.useEffect(() => {
    if (pricingConfig) {
      console.log('🔧 CustomPricingForm received config update:', {
        smallContainerPrice: pricingConfig.smallContainerPrice,
        largeContainerPrice: pricingConfig.largeContainerPrice,
        franchiseFee: pricingConfig.franchiseFee,
        tax: pricingConfig.tax,
        fuelSurcharge: pricingConfig.fuelSurcharge,
        deliveryFee: pricingConfig.deliveryFee,
        extraPickupRate: pricingConfig.extraPickupRate
      });
    }
  }, [pricingConfig]);

  // Auto-populate single location fields from service area verification
  React.useEffect(() => {
    if (isSingleLocation && serviceableLocation) {
      setNewRuleCity(serviceableLocation.city);
      setNewRuleState(serviceableLocation.state);
      
      // Auto-populate franchise fee and tax from division data
      if (serviceableLocation.divisionData) {
        setNewRuleFranchiseFee(serviceableLocation.divisionData.franchiseFee || 0);
        setNewRuleTax(serviceableLocation.divisionData.salesTax || 8.25);
      }
      
      console.log('🏛️ Auto-populated single location fields:', {
        city: serviceableLocation.city,
        state: serviceableLocation.state,
        franchiseFee: serviceableLocation.divisionData?.franchiseFee,
        salesTax: serviceableLocation.divisionData?.salesTax
      });
    }
  }, [isSingleLocation, serviceableLocation]);

  // Helper function to determine if the form is valid
  const isFormValid = (): boolean => {
    if (isSingleLocation) {
      // For single location, only check if Price/YD is set
      const hasPricePerYard = newRulePricePerYard > 0;
      
      // Check if additional fees are valid (if enabled)
      const additionalFeesValid = !showAdditionalFees || areAllFeesComplete();
      
      return hasPricePerYard && additionalFeesValid;
    } else {
      // For bulk upload, check container-specific pricing OR global pricing
      const hasValidContainerSpecificPricing = pricingConfig.containerSpecificPricingRules.some(rule => 
        rule.containerSize.trim() !== '' && rule.pricePerYard > 0
      );
      
      const hasValidGlobalPricing = pricingConfig.smallContainerPrice > 0 && pricingConfig.largeContainerPrice > 0;
      
      const hasPricingConfiguration = hasValidContainerSpecificPricing || hasValidGlobalPricing;
      const containerRulesValid = areAllContainerRulesComplete();
      const additionalFeesValid = !showAdditionalFees || areAllFeesComplete();
      
      return hasPricingConfiguration && containerRulesValid && additionalFeesValid;
    }
  };

  const isRuleComplete = () => {
    if (isSingleLocation) {
      // Single location requires all fields including pricePerYard, city, and state
      return newRuleEquipmentType !== 'auto-inherit' && 
             newRuleContainerSize !== 'auto-inherit' && 
             newRuleFrequency !== 'auto-inherit' && 
             newRuleMaterialType !== 'auto-inherit' && 
             newRulePricePerYard > 0 &&
             newRuleCity.trim() !== '' && 
             newRuleState.trim() !== '';
    } else {
      // Bulk upload only requires basic service parameters (can be auto-inherit)
      return newRuleEquipmentType !== '' && 
             newRuleContainerSize !== '' && 
             newRuleFrequency !== '' && 
             newRuleMaterialType !== '';
    }
  };

  // Helper functions to check container-specific pricing coverage
  const hasSmallContainerSpecificPricing = (): boolean => {
    const smallContainerSizes = ['2YD', '3YD', '4YD'];
    return smallContainerSizes.some(size => 
      pricingConfig.containerSpecificPricingRules.some(rule => rule.containerSize === size)
    );
  };

  const hasLargeContainerSpecificPricing = (): boolean => {
    const largeContainerSizes = ['6YD', '8YD', '10YD'];
    return largeContainerSizes.some(size => 
      pricingConfig.containerSpecificPricingRules.some(rule => rule.containerSize === size)
    );
  };

  const addContainerSpecificRule = () => {
    const newRule: ContainerSpecificPricingRule = {
      id: `container-rule-${Date.now()}`,
      containerSize: '2YD',
      equipmentType: 'Front-Load Container',
      pricePerYard: 0
    };
    
    const updatedConfig = {
      ...pricingConfig,
      containerSpecificPricingRules: [...pricingConfig.containerSpecificPricingRules, newRule]
    };
    onPricingConfigUpdate(updatedConfig);
  };

  const updateContainerSpecificRule = (id: string, field: keyof ContainerSpecificPricingRule, value: any) => {
    const updatedConfig = {
      ...pricingConfig,
      containerSpecificPricingRules: pricingConfig.containerSpecificPricingRules.map(rule => 
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    };
    onPricingConfigUpdate(updatedConfig);
  };

  const removeContainerSpecificRule = (id: string) => {
    const updatedConfig = {
      ...pricingConfig,
      containerSpecificPricingRules: pricingConfig.containerSpecificPricingRules.filter(rule => rule.id !== id)
    };
    onPricingConfigUpdate(updatedConfig);
  };

  const isContainerRuleComplete = (rule: ContainerSpecificPricingRule) => {
    return rule.containerSize.trim() !== '' && rule.pricePerYard > 0;
  };

  const areAllContainerRulesComplete = () => {
    return pricingConfig.containerSpecificPricingRules.every(rule => isContainerRuleComplete(rule));
  };

  const updatePricingConfig = (field: string, value: any) => {
    const updatedConfig = {
      ...pricingConfig,
      [field]: value
    };
    
    console.log('🔧 CustomPricingForm updating config:', {
      field,
      value,
      updatedConfig,
      smallContainerPrice: updatedConfig.smallContainerPrice
    });
    
    onPricingConfigUpdate(updatedConfig, isFormValid());
  };

  const isComprehensiveFormValid = (configToCheck: PricingConfig): boolean => {
    if (isSingleLocation) {
      const hasPricePerYard = configToCheck.smallContainerPrice > 0;
      console.log('🔧 CustomPricingForm validity check:', {
        configToCheck: configToCheck,
        smallContainerPrice: configToCheck.smallContainerPrice,
        hasPricePerYard: hasPricePerYard,
        result: hasPricePerYard
      });
      return hasPricePerYard;
    } else {
      // For bulk uploads, check if we have container pricing OR additional fees
      const hasContainerPricing = configToCheck.smallContainerPrice > 0 || configToCheck.largeContainerPrice > 0;
      const hasAdditionalFees = configToCheck.additionalFees && configToCheck.additionalFees.length > 0;
      return hasContainerPricing || hasAdditionalFees;
    }
  };

  const addAdditionalFee = () => {
    const newFee: AdditionalFee = {
      id: `fee-${Date.now()}`,
      category: '',
      price: 0,
      frequency: 'one-time',
      assignedDivisions: []
    };
    
    const updatedConfig = {
      ...pricingConfig,
      additionalFees: [...pricingConfig.additionalFees, newFee]
    };
    onPricingConfigUpdate(updatedConfig);
  };

  const isFeeComplete = (fee: AdditionalFee) => {
    return fee.category.trim() !== '' && fee.price > 0;
  };

  const areAllFeesComplete = () => {
    return pricingConfig.additionalFees.every(fee => isFeeComplete(fee));
  };

  const updateAdditionalFee = (id: string, field: string, value: any) => {
    const updatedConfig = {
      ...pricingConfig,
      additionalFees: pricingConfig.additionalFees.map(fee => 
        fee.id === id ? { ...fee, [field]: value } : fee
      )
    };
    onPricingConfigUpdate(updatedConfig);
  };

  const removeAdditionalFee = (id: string) => {
    const updatedConfig = {
      ...pricingConfig,
      additionalFees: pricingConfig.additionalFees.filter(fee => fee.id !== id)
    };
    onPricingConfigUpdate(updatedConfig);
  };

  const additionalFeeFrequencies = [
    { value: 'one-time', label: 'One-time' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];

  // Manual Pricing Rules functions for bulk upload
  const addRule = () => {
    if (!isRuleComplete()) {
      if (isSingleLocation) {
        alert('Please fill in all required fields including price per yard, city, and state');
      } else {
        alert('Please fill in all required service parameters');
      }
      return;
    }

    const rule: CustomPricingRule = {
      id: `rule-${Date.now()}`,
      // Only include city/state for single location workflow
      ...(isSingleLocation && { 
        city: newRuleCity,
        state: newRuleState,
        pricePerYard: newRulePricePerYard,
        largeContainerPricePerYard: newRuleLargeContainerPricePerYard
      }),
      equipmentType: newRuleEquipmentType,
      containerSize: newRuleContainerSize,
      frequency: newRuleFrequency,
      materialType: newRuleMaterialType,
      franchiseFee: newRuleFranchiseFee,
      tax: newRuleTax,
      deliveryFee: newRuleDeliveryFee,
      fuelSurcharge: newRuleFuelSurcharge,
      extraPickupRate: newRuleExtraPickupRate,
      taxExempt: newRuleTaxExempt
    };

    const updatedRules = [...rules, rule];
    setRules(updatedRules);
    onRulesUpdate(updatedRules);

    // Reset form state variables
    setNewRuleEquipmentType('auto-inherit');
    setNewRuleMaterialType('auto-inherit');
    setNewRuleContainerSize('auto-inherit');
    setNewRuleFrequency('auto-inherit');
    setNewRuleBinQuantity('auto-inherit');
    setNewRuleTax(8.25);
    setNewRuleFranchiseFee(0);
    setNewRuleFuelSurcharge(15);
    setNewRuleDeliveryFee(0);
    setNewRuleExtraPickupRate(0);
    setNewRuleTaxExempt(false);
    
    // Reset single location specific fields
    if (isSingleLocation) {
      setNewRulePricePerYard(0);
      setNewRuleLargeContainerPricePerYard(0);
      setNewRuleCity('');
      setNewRuleState('Texas');
    }

    console.log('✅ Single location pricing rule created:', rule);
  };

  const updateRule = (id: string, field: keyof CustomPricingRule, value: any) => {
    const updatedRules = rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    );
    setRules(updatedRules);
    onRulesUpdate(updatedRules);
  };

  const removeRule = (id: string) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    onRulesUpdate(updatedRules);
  };

  const getContainerSizeOptions = () => {
    if (newRuleEquipmentType === 'Front-Load Container') {
      return [
        { value: 'auto-inherit', label: 'Auto-inherit from service data' },
        { value: '2YD', label: '2 Yard' },
        { value: '4YD', label: '4 Yard' },
        { value: '6YD', label: '6 Yard' },
        { value: '8YD', label: '8 Yard' },
        { value: '10YD', label: '10 Yard' }
      ];
    }
    if (newRuleEquipmentType === 'Compactor') {
      return [
        { value: 'auto-inherit', label: 'Auto-inherit from service data' },
        { value: '15YD', label: '15 Yard' },
        { value: '20YD', label: '20 Yard' },
        { value: '30YD', label: '30 Yard' },
        { value: '35YD', label: '35 Yard' },
        { value: '40YD', label: '40 Yard' }
      ];
    }
    if (newRuleEquipmentType === 'Roll-off') {
      return [
        { value: 'auto-inherit', label: 'Auto-inherit from service data' },
        { value: '20YD', label: '20 Yard' },
        { value: '30YD', label: '30 Yard' },
        { value: '40YD', label: '40 Yard' }
      ];
    }
    return [
      { value: 'auto-inherit', label: 'Auto-inherit from service data' },
      ...CONTAINER_SIZES
    ];
  };

  return (
    <div className="space-y-6">
      {/* Single Location Workflow */}
      {isSingleLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Location Pricing</h3>
              <p className="text-blue-700 text-sm mt-1">
                Configure pricing for: {serviceableLocation?.address}, {serviceableLocation?.city}, {serviceableLocation?.state}
              </p>
            </div>
          </div>

          {/* Row 1: Equipment Type, Material Type, Container Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Type
              </label>
              <select
                value={newRuleEquipmentType}
                onChange={(e) => setNewRuleEquipmentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto-inherit">Auto-inherit from service data</option>
                {EQUIPMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Type
              </label>
              <select
                value={newRuleMaterialType}
                onChange={(e) => setNewRuleMaterialType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto-inherit">Auto-inherit from service data</option>
                {MATERIAL_TYPES.map(material => (
                  <option key={material.value} value={material.value}>{material.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Container Size
              </label>
              <select
                value={newRuleContainerSize}
                onChange={(e) => setNewRuleContainerSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {getContainerSizeOptions().map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Frequency, Bin Quantity, Price/YD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={newRuleFrequency}
                onChange={(e) => setNewRuleFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto-inherit">Auto-inherit from service data</option>
                {FREQUENCY_OPTIONS.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bin Quantity
              </label>
              <select
                value={newRuleBinQuantity}
                onChange={(e) => setNewRuleBinQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto-inherit">Auto-inherit from service data</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price/YD *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newRulePricePerYard}
                  onChange={(e) => setNewRulePricePerYard(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Tax %, Franchise Fee %, Fuel Surcharge % */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax %
              </label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={newRuleTax}
                  onChange={(e) => setNewRuleTax(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="8.25"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Franchise Fee %
              </label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={newRuleFranchiseFee}
                  onChange={(e) => setNewRuleFranchiseFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Surcharge %
              </label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={newRuleFuelSurcharge}
                  onChange={(e) => setNewRuleFuelSurcharge(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="15.00"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Delivery Fee, Extra Pickup Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newRuleDeliveryFee}
                  onChange={(e) => setNewRuleDeliveryFee(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extra Pickup Rate
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newRuleExtraPickupRate}
                  onChange={(e) => setNewRuleExtraPickupRate(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Tax-exempt checkbox */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newRuleTaxExempt}
                onChange={(e) => setNewRuleTaxExempt(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Tax-exempt</span>
            </label>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                // Create a custom rule with the entered values
                const rule: CustomPricingRule = {
                  id: `single-location-rule-${Date.now()}`,
                  city: newRuleCity,
                  state: newRuleState,
                  equipmentType: newRuleEquipmentType,
                  containerSize: newRuleContainerSize,
                  frequency: newRuleFrequency,
                  materialType: newRuleMaterialType,
                  pricePerYard: newRulePricePerYard,
                  franchiseFee: newRuleFranchiseFee,
                  tax: newRuleTax,
                  fuelSurcharge: newRuleFuelSurcharge,
                  deliveryFee: newRuleDeliveryFee,
                  extraPickupRate: newRuleExtraPickupRate,
                  taxExempt: newRuleTaxExempt
                };

                // Update the pricing config with the Price/YD value
                const updatedConfig = {
                  ...pricingConfig,
                  smallContainerPrice: newRulePricePerYard,
                  franchiseFee: newRuleFranchiseFee,
                  tax: newRuleTax,
                  fuelSurcharge: newRuleFuelSurcharge,
                  deliveryFee: newRuleDeliveryFee,
                  extraPickupRate: newRuleExtraPickupRate
                };

                const isValid = newRulePricePerYard > 0;
                
                console.log('🔧 Apply Pricing Configuration clicked:', {
                  rule,
                  updatedConfig,
                  isValid,
                  pricePerYard: newRulePricePerYard
                });

                // Update both the rules and the config
                const updatedRules = [...rules, rule];
                setRules(updatedRules);
                onRulesUpdate(updatedRules);
                
                // CRITICAL FIX: Call onPricingConfigUpdate with explicit isValid parameter
                onPricingConfigUpdate(updatedConfig, isValid);
                
                if (onApplyPricingConfig) {
                  onApplyPricingConfig();
                }
              }}
              disabled={newRulePricePerYard <= 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Pricing Configuration
            </button>
          </div>
        </div>
      )}

      {/* Bulk Upload Workflow */}
      {!isSingleLocation && (
        <div>
          <ComprehensivePricingForm
            config={pricingConfig}
            onConfigUpdate={onPricingConfigUpdate}
            isSingleLocation={isSingleLocation}
          />
        </div>
      )}

      {/* Manual Rules Section (for bulk upload) */}
      {!isSingleLocation && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Manual Pricing Rules (Optional)</h4>
            <button
              onClick={() => setShowManualRuleForm(!showManualRuleForm)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {showManualRuleForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {showManualRuleForm ? 'Cancel' : 'Add Manual Rule'}
            </button>
          </div>

          {showManualRuleForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Type</label>
                  <select
                    value={newRuleEquipmentType}
                    onChange={(e) => setNewRuleEquipmentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="auto-inherit">Auto-inherit from service data</option>
                    {EQUIPMENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Container Size</label>
                  <select
                    value={newRuleContainerSize}
                    onChange={(e) => setNewRuleContainerSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getContainerSizeOptions().map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={newRuleFrequency}
                    onChange={(e) => setNewRuleFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="auto-inherit">Auto-inherit from service data</option>
                    {FREQUENCY_OPTIONS.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
                  <select
                    value={newRuleMaterialType}
                    onChange={(e) => setNewRuleMaterialType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="auto-inherit">Auto-inherit from service data</option>
                    {MATERIAL_TYPES.map(material => (
                      <option key={material.value} value={material.value}>{material.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowManualRuleForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addRule}
                  disabled={!isRuleComplete()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Rule
                </button>
              </div>
            </div>
          )}

          {/* Display existing manual rules */}
          {rules.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-md font-medium text-gray-900">Configured Rules ({rules.length})</h5>
              {rules.map((rule) => (
                <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Equipment:</span>
                          <p className="text-gray-900">{rule.equipmentType}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Container:</span>
                          <p className="text-gray-900">{rule.containerSize}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Frequency:</span>
                          <p className="text-gray-900">{rule.frequency}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Material:</span>
                          <p className="text-gray-900">{rule.materialType}</p>
                        </div>
                      </div>
                      {rule.city && rule.state && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-700">Location:</span>
                          <span className="text-gray-900 ml-1">{rule.city}, {rule.state}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeRule(rule.id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}