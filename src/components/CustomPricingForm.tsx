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
  pricingConfig: PricingConfig | null | undefined;
  onPricingConfigUpdate: (config: PricingConfig, isValid?: boolean) => void;
  onApplyPricingConfig?: () => void;
}

// Default pricing config to prevent undefined errors
const DEFAULT_PRICING_CONFIG: PricingConfig = {
  smallContainerPrice: 0,
  largeContainerPrice: 0,
  franchiseFee: 0,
  tax: 8.25,
  fuelSurcharge: 15,
  deliveryFee: 0,
  extraPickupRate: 0,
  taxExempt: false,
  containerSpecificPricingRules: [],
  additionalFees: []
};

export function CustomPricingForm({
  initialRules,
  onRulesUpdate,
  serviceAreaVerification,
  isSingleLocation = false,
  pricingConfig: rawPricingConfig,
  onPricingConfigUpdate,
  onApplyPricingConfig
}: CustomPricingFormProps) {
  // Ensure pricingConfig is always a valid object
  // Ensure pricingConfig is always a valid object, using a deep merge for initial values
  const pricingConfig = React.useMemo(() => {
    const config = rawPricingConfig ? { ...DEFAULT_PRICING_CONFIG, ...rawPricingConfig } : { ...DEFAULT_PRICING_CONFIG };
    config.containerSpecificPricingRules = config.containerSpecificPricingRules || [];
    config.additionalFees = config.additionalFees || [];
    return config;
  }, [rawPricingConfig]);
  
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
    if (pricingConfig.smallContainerPrice !== undefined && 
        pricingConfig.smallContainerPrice !== newRulePricePerYard &&
        newRulePricePerYard === 0) { // Only update if user hasn't entered a value yet
      console.log('🔄 Auto-populating Price/YD from service area verification:', {
        currentValue: newRulePricePerYard,
        newValue: pricingConfig.smallContainerPrice,
        reason: 'Auto-population from parent component'
      });
      setNewRulePricePerYard(pricingConfig.smallContainerPrice);
    }
  }, [pricingConfig.smallContainerPrice, newRulePricePerYard]);

  // Update local state when pricingConfig prop changes (for parent updates)
  React.useEffect(() => {
    if (rawPricingConfig) {
      onPricingConfigUpdate(pricingConfig, isComprehensiveFormValid(pricingConfig));
    }
  }, [pricingConfig, onPricingConfigUpdate]);
  
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
  }

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
  }

  // Helper functions to check container-specific pricing coverage
  const hasSmallContainerSpecificPricing = (): boolean => {
    const smallContainerSizes = ['2YD', '3YD', '4YD'];
    return smallContainerSizes.some(size => 
      pricingConfig.containerSpecificPricingRules.some(rule => rule.containerSize === size)
    );
  }

  const hasLargeContainerSpecificPricing = (): boolean => {
    const largeContainerSizes = ['6YD', '8YD', '10YD'];
    return largeContainerSizes.some(size => 
      pricingConfig.containerSpecificPricingRules.some(rule => rule.containerSize === size)
    );
  }

  const addContainerSpecificRule = () => {
    const newRule: ContainerSpecificPricingRule = {
      id: `container-rule-${Date.now()}`,
      containerSize: '2YD',
      equipmentType: 'Front-Load Container',
      pricePerYard: 0
    }
    
    const updatedConfig = {
      ...pricingConfig,
      containerSpecificPricingRules: [...pricingConfig.containerSpecificPricingRules, newRule]
    }
    onPricingConfigUpdate(updatedConfig);
  }

  const updateContainerSpecificRule = (id: string, field: keyof ContainerSpecificPricingRule, value: any) => {
    const updatedConfig = {
      ...pricingConfig,
      containerSpecificPricingRules: pricingConfig.containerSpecificPricingRules.map(rule => 
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    }
    onPricingConfigUpdate(updatedConfig);
  }

  const removeContainerSpecificRule = (id: string) => {
    const updatedConfig = {
      ...pricingConfig,
      containerSpecificPricingRules: pricingConfig.containerSpecificPricingRules.filter(rule => rule.id !== id)
    }
    onPricingConfigUpdate(updatedConfig);
  }

  const isContainerRuleComplete = (rule: ContainerSpecificPricingRule) => {
    return rule.containerSize.trim() !== '' && rule.pricePerYard > 0;
  }

  const areAllContainerRulesComplete = () => {
    return pricingConfig.containerSpecificPricingRules.every(rule => isContainerRuleComplete(rule));
  }

  const updatePricingConfig = (field: string, value: any) => {
    const updatedConfig = {
      ...pricingConfig,
      [field]: value
    }
    
    console.log('🔧 CustomPricingForm updating config:', {
      field,
      value,
      updatedConfig,
      smallContainerPrice: updatedConfig.smallContainerPrice
    });
    
    onPricingConfigUpdate(updatedConfig, isFormValid());
  }

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
  }

  const addAdditionalFee = () => {
    const newFee: AdditionalFee = {
      id: `fee-${Date.now()}`,
      category: '',
      price: 0,
      frequency: 'one-time',
      assignedDivisions: []
    }
    
    const updatedConfig = {
      ...pricingConfig,
      additionalFees: [...pricingConfig.additionalFees, newFee]
    }
    onPricingConfigUpdate(updatedConfig);
  }

  const isFeeComplete = (fee: AdditionalFee) => {
    return fee.category.trim() !== '' && fee.price > 0;
  }

  const areAllFeesComplete = () => {
    return pricingConfig.additionalFees.every(fee => isFeeComplete(fee));
  }

  const updateAdditionalFee = (id: string, field: string, value: any) => {
    const updatedConfig = {
      ...pricingConfig,
      additionalFees: pricingConfig.additionalFees.map(fee => 
        fee.id === id ? { ...fee, [field]: value } : fee
      )
    }
    onPricingConfigUpdate(updatedConfig);
  }

  const removeAdditionalFee = (id: string) => {
    const updatedConfig = {
      ...pricingConfig,
      additionalFees: pricingConfig.additionalFees.filter(fee => fee.id !== id)
    }
    onPricingConfigUpdate(updatedConfig);
  }

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
    }

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
  }

  const updateRule = (id: string, field: keyof CustomPricingRule, value: any) => {
    const updatedRules = rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    );
    setRules(updatedRules);
    onRulesUpdate(updatedRules);
  }

  const removeRule = (id: string) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    onRulesUpdate(updatedRules);
  }

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
  }

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {getContainerSizeOptions().map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Frequency, Price/YD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={newRuleFrequency}
                onChange={(e) => setNewRuleFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto-inherit">Auto-inherit from service data</option>
                {FREQUENCY_OPTIONS.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Yard ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newRulePricePerYard}
                onChange={(e) => setNewRulePricePerYard(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter price per yard"
              />
            </div>
          </div>

          {/* Row 3: City, State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={newRuleCity}
                onChange={(e) => setNewRuleCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={newRuleState}
                onChange={(e) => setNewRuleState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter state"
              />
            </div>
          </div>

          {/* Additional Fees Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Additional Fees</h4>
              <button
                onClick={() => setShowAdditionalFees(!showAdditionalFees)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showAdditionalFees ? 'Hide' : 'Show'} Additional Fees
              </button>
            </div>

            {showAdditionalFees && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pricingConfig.tax || 0}
                      onChange={(e) => updatePricingConfig('tax', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Franchise Fee ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pricingConfig.franchiseFee || 0}
                      onChange={(e) => updatePricingConfig('franchiseFee', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Surcharge (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pricingConfig.fuelSurcharge || 0}
                      onChange={(e) => updatePricingConfig('fuelSurcharge', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pricingConfig.deliveryFee || 0}
                      onChange={(e) => updatePricingConfig('deliveryFee', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Pickup Rate ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pricingConfig.extraPickupRate || 0}
                      onChange={(e) => updatePricingConfig('extraPickupRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="taxExempt"
                      checked={pricingConfig.taxExempt || false}
                      onChange={(e) => updatePricingConfig('taxExempt', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="taxExempt" className="ml-2 block text-sm text-gray-900">
                      Tax Exempt
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Upload Workflow */}
      {!isSingleLocation && (
        <div className="space-y-6">
          {/* Global Pricing Configuration */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 text-gray-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Global Pricing Configuration</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Set default pricing that applies to all locations unless overridden by specific rules
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Small Container Price per Yard ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricingConfig.smallContainerPrice || 0}
                  onChange={(e) => updatePricingConfig('smallContainerPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter price for small containers (2-4 YD)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Large Container Price per Yard ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricingConfig.largeContainerPrice || 0}
                  onChange={(e) => updatePricingConfig('largeContainerPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter price for large containers (6-10 YD)"
                />
              </div>
            </div>

            {/* Additional Global Fees */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricingConfig.tax || 0}
                  onChange={(e) => updatePricingConfig('tax', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Franchise Fee ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricingConfig.franchiseFee || 0}
                  onChange={(e) => updatePricingConfig('franchiseFee', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Surcharge (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricingConfig.fuelSurcharge || 0}
                  onChange={(e) => updatePricingConfig('fuelSurcharge', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fee ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricingConfig.deliveryFee || 0}
                  onChange={(e) => updatePricingConfig('deliveryFee', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Container-Specific Pricing Rules */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Container-Specific Pricing</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Override global pricing for specific container sizes and equipment types
                  </p>
                </div>
              </div>
              <button
                onClick={addContainerSpecificRule}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Container Rule
              </button>
            </div>

            {pricingConfig.containerSpecificPricingRules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No container-specific pricing rules configured</p>
                <p className="text-sm">Add rules to override global pricing for specific containers</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pricingConfig.containerSpecificPricingRules.map((rule) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Container Size
                        </label>
                        <select
                          value={rule.containerSize}
                          onChange={(e) => updateContainerSpecificRule(rule.id, 'containerSize', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          {CONTAINER_SIZES.map(size => (
                            <option key={size.value} value={size.value}>{size.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Equipment Type
                        </label>
                        <select
                          value={rule.equipmentType}
                          onChange={(e) => updateContainerSpecificRule(rule.id, 'equipmentType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          {EQUIPMENT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price per Yard ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={rule.pricePerYard}
                          onChange={(e) => updateContainerSpecificRule(rule.id, 'pricePerYard', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={() => removeContainerSpecificRule(rule.id)}
                          className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>

                    {!isContainerRuleComplete(rule) && (
                      <div className="mt-2 text-sm text-red-600">
                        Please complete all fields for this container rule
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Fees */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Percent className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Additional Fees</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Configure additional fees that apply to specific divisions or all locations
                  </p>
                </div>
              </div>
              <button
                onClick={addAdditionalFee}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Fee
              </button>
            </div>

            {pricingConfig.additionalFees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Percent className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No additional fees configured</p>
                <p className="text-sm">Add fees for services like environmental fees, administrative charges, etc.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pricingConfig.additionalFees.map((fee) => (
                  <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fee Category
                        </label>
                        <input
                          type="text"
                          value={fee.category}
                          onChange={(e) => updateAdditionalFee(fee.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Environmental Fee"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={fee.price}
                          onChange={(e) => updateAdditionalFee(fee.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency
                        </label>
                        <select
                          value={fee.frequency}
                          onChange={(e) => updateAdditionalFee(fee.id, 'frequency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          {additionalFeeFrequencies.map(freq => (
                            <option key={freq.value} value={freq.value}>{freq.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={() => removeAdditionalFee(fee.id)}
                          className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>

                    {!isFeeComplete(fee) && (
                      <div className="mt-2 text-sm text-red-600">
                        Please complete all fields for this additional fee
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Pricing Rules */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Settings className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Manual Pricing Rules</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Create specific pricing rules for unique service combinations
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowManualRuleForm(!showManualRuleForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Rule
              </button>
            </div>

            {showManualRuleForm && (
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">New Manual Pricing Rule</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Type
                    </label>
                    <select
                      value={newRuleEquipmentType}
                      onChange={(e) => setNewRuleEquipmentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select equipment type</option>
                      {EQUIPMENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select container size</option>
                      {getContainerSizeOptions().map(size => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={newRuleFrequency}
                      onChange={(e) => setNewRuleFrequency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select frequency</option>
                      {FREQUENCY_OPTIONS.map(freq => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select material type</option>
                      {MATERIAL_TYPES.map(material => (
                        <option key={material.value} value={material.value}>{material.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowManualRuleForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addRule}
                    disabled={!isRuleComplete()}
                    className="px-4 py-2 border border-transparent text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add Rule
                  </button>
                </div>
              </div>
            )}

            {rules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No manual pricing rules configured</p>
                <p className="text-sm">Add rules for specific service combinations that need custom pricing</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Equipment:</span>
                          <p className="text-sm text-gray-900">{rule.equipmentType}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Container:</span>
                          <p className="text-sm text-gray-900">{rule.containerSize}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Frequency:</span>
                          <p className="text-sm text-gray-900">{rule.frequency}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Material:</span>
                          <p className="text-sm text-gray-900">{rule.materialType}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comprehensive Pricing Form */}
      {showComprehensiveForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Comprehensive Pricing Configuration</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Advanced pricing configuration with all available options
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowComprehensiveForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ComprehensivePricingForm
            initialConfig={pricingConfig}
            onConfigUpdate={(config) => {
              onPricingConfigUpdate(config, isComprehensiveFormValid(config));
            }}
            serviceAreaVerification={serviceAreaVerification}
            isSingleLocation={isSingleLocation}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {!isSingleLocation && !showComprehensiveForm && (
          <button
            onClick={() => setShowComprehensiveForm(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Advanced Configuration
          </button>
        )}
        
        {onApplyPricingConfig && (
          <button
            onClick={onApplyPricingConfig}
            disabled={!isFormValid()}
            className="px-6 py-2 border border-transparent text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Apply Pricing Configuration
          </button>
        )}
      </div>
    </div>
  );
}
