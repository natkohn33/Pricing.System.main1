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
  const [newRulePricePerYard, setNewRulePricePerYard] = useState(pricingConfig?.smallContainerPrice || 0);;

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
                {MATERIAL_TYPES.map(type => (
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
                Bin Quantity
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newRuleBinQuantity}
                onChange={(e) => setNewRuleBinQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Yard (Small Container)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newRulePricePerYard}
                onChange={(e) => setNewRulePricePerYard(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Large Container Price/YD, City, State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Yard (Large Container)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newRuleLargeContainerPricePerYard}
                onChange={(e) => setNewRuleLargeContainerPricePerYard(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={newRuleCity}
                onChange={(e) => setNewRuleCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              />
            </div>
          </div>

          {/* Row 4: Tax, Franchise Fee, Fuel Surcharge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newRuleTax}
                onChange={(e) => setNewRuleTax(parseFloat(e.target.value) || 0)}
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
                value={newRuleFranchiseFee}
                onChange={(e) => setNewRuleFranchiseFee(parseFloat(e.target.value) || 0)}
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
                value={newRuleFuelSurcharge}
                onChange={(e) => setNewRuleFuelSurcharge(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 5: Delivery Fee, Extra Pickup Rate, Tax Exempt */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newRuleDeliveryFee}
                onChange={(e) => setNewRuleDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extra Pickup Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newRuleExtraPickupRate}
                onChange={(e) => setNewRuleExtraPickupRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                id="taxExempt"
                type="checkbox"
                checked={newRuleTaxExempt}
                onChange={(e) => setNewRuleTaxExempt(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="taxExempt" className="ml-2 block text-sm text-gray-900">
                Tax Exempt
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={addRule}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Rule
            </button>
          </div>
        </div>
      )}

      {/* Existing Rules Display */}
      {rules.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configured Pricing Rules</h3>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={rule.id} className="border border-gray-200 rounded-md p-4 relative">
                <button
                  onClick={() => removeRule(rule.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                  aria-label="Remove rule"
                >
                  <X className="h-5 w-5" />
                </button>
                <p className="text-sm font-medium text-gray-700">
                  Rule {index + 1}: 
                  {isSingleLocation && ` ${rule.city}, ${rule.state} - `}
                  {rule.equipmentType} ({rule.containerSize}) - {rule.materialType} - {rule.frequency}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Price/YD (Small): ${rule.pricePerYard.toFixed(2)}
                  {rule.largeContainerPricePerYard > 0 && ` | Price/YD (Large): $${rule.largeContainerPricePerYard.toFixed(2)}`}
                </p>
                <p className="text-sm text-gray-600">
                  Tax: {rule.tax.toFixed(2)}% | Franchise Fee: ${rule.franchiseFee.toFixed(2)} | Fuel Surcharge: {rule.fuelSurcharge.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-600">
                  Delivery Fee: ${rule.deliveryFee.toFixed(2)} | Extra Pickup: ${rule.extraPickupRate.toFixed(2)}
                  {rule.taxExempt && ' | Tax Exempt'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Pricing Configuration for Bulk Upload */}
      {!isSingleLocation && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Pricing Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Small Container Price Per Yard
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingConfig.smallContainerPrice}
                onChange={(e) => updatePricingConfig('smallContainerPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Large Container Price Per Yard
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingConfig.largeContainerPrice}
                onChange={(e) => updatePricingConfig('largeContainerPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Franchise Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingConfig.franchiseFee}
                onChange={(e) => updatePricingConfig('franchiseFee', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingConfig.tax}
                onChange={(e) => updatePricingConfig('tax', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Surcharge (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingConfig.fuelSurcharge}
                onChange={(e) => updatePricingConfig('fuelSurcharge', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingConfig.deliveryFee}
                onChange={(e) => updatePricingConfig('deliveryFee', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Pickup Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingConfig.extraPickupRate}
                onChange={(e) => updatePricingConfig('extraPickupRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                id="globalTaxExempt"
                type="checkbox"
                checked={pricingConfig.taxExempt}
                onChange={(e) => updatePricingConfig('taxExempt', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="globalTaxExempt" className="ml-2 block text-sm text-gray-900">
                Tax Exempt
              </label>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Container-Specific Pricing Rules</h4>
            <p className="text-sm text-gray-600 mb-4">Define specific pricing per yard for different container sizes. These rules will override global pricing for matching container types.</p>
            <div className="space-y-3">
              {pricingConfig.containerSpecificPricingRules.map(rule => (
                <div key={rule.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <select
                    value={rule.containerSize}
                    onChange={(e) => updateContainerSpecificRule(rule.id, 'containerSize', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    {CONTAINER_SIZES.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rule.pricePerYard}
                    onChange={(e) => updateContainerSpecificRule(rule.id, 'pricePerYard', parseFloat(e.target.value) || 0)}
                    placeholder="Price/YD"
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm w-24"
                  />
                  <button
                    onClick={() => removeContainerSpecificRule(rule.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addContainerSpecificRule}
              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Container Rule
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800">Additional Fees</h4>
              <button
                onClick={() => setShowAdditionalFees(!showAdditionalFees)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showAdditionalFees ? 'Hide' : 'Show'} Additional Fees
              </button>
            </div>
            {showAdditionalFees && (
              <div className="space-y-3">
                {pricingConfig.additionalFees.map(fee => (
                  <div key={fee.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <input
                      type="text"
                      value={fee.category}
                      onChange={(e) => updateAdditionalFee(fee.id, 'category', e.target.value)}
                      placeholder="Fee Category (e.g., Environmental Fee)"
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm flex-grow"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={fee.price}
                      onChange={(e) => updateAdditionalFee(fee.id, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm w-24"
                    />
                    <select
                      value={fee.frequency}
                      onChange={(e) => updateAdditionalFee(fee.id, 'frequency', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      {additionalFeeFrequencies.map(freq => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeAdditionalFee(fee.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAdditionalFee}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Additional Fee
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Rules for Bulk Upload */}
      {!isSingleLocation && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Pricing Rules (Bulk Upload)</h3>
          <p className="text-sm text-gray-600 mb-4">Define specific pricing rules for certain equipment, container, material, or frequency combinations. These rules will be applied during bulk processing.</p>
          <button
            onClick={() => setShowManualRuleForm(!showManualRuleForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showManualRuleForm ? 'Hide Rule Form' : 'Add New Manual Rule'}
          </button>

          {showManualRuleForm && (
            <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-md font-semibold text-gray-800 mb-4">New Manual Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Type
                  </label>
                  <select
                    value={newRuleEquipmentType}
                    onChange={(e) => setNewRuleEquipmentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Equipment Type</option>
                    {EQUIPMENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Container Size
                  </label>
                  <select
                    value={newRuleContainerSize}
                    onChange={(e) => setNewRuleContainerSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Container Size</option>
                    {CONTAINER_SIZES.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Type
                  </label>
                  <select
                    value={newRuleMaterialType}
                    onChange={(e) => setNewRuleMaterialType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Material Type</option>
                    {MATERIAL_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newRuleFrequency}
                    onChange={(e) => setNewRuleFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Frequency</option>
                    {FREQUENCY_OPTIONS.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Yard
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRulePricePerYard}
                    onChange={(e) => setNewRulePricePerYard(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Franchise Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRuleFranchiseFee}
                    onChange={(e) => setNewRuleFranchiseFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRuleTax}
                    onChange={(e) => setNewRuleTax(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Surcharge (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRuleFuelSurcharge}
                    onChange={(e) => setNewRuleFuelSurcharge(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRuleDeliveryFee}
                    onChange={(e) => setNewRuleDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extra Pickup Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRuleExtraPickupRate}
                    onChange={(e) => setNewRuleExtraPickupRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    id="newRuleTaxExempt"
                    type="checkbox"
                    checked={newRuleTaxExempt}
                    onChange={(e) => setNewRuleTaxExempt(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="newRuleTaxExempt" className="ml-2 block text-sm text-gray-900">
                    Tax Exempt
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={addRule}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </button>
              </div>
            </div>
          )}

          {manualRules.length > 0 && (
            <div className="mt-6 space-y-4">
              {manualRules.map((rule, index) => (
                <div key={rule.id} className="border border-gray-200 rounded-md p-4 relative">
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    aria-label="Remove rule"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <p className="text-sm font-medium text-gray-700">
                    Rule {index + 1}: {rule.equipmentType} ({rule.containerSize}) - {rule.materialType} - {rule.frequency}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Price/YD: ${rule.pricePerYard.toFixed(2)} | Tax: {rule.tax.toFixed(2)}% | Franchise Fee: ${rule.franchiseFee.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fuel Surcharge: {rule.fuelSurcharge.toFixed(2)}% | Delivery Fee: ${rule.deliveryFee.toFixed(2)} | Extra Pickup: ${rule.extraPickupRate.toFixed(2)}
                    {rule.taxExempt && ' | Tax Exempt'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Pricing Form */}
      {showComprehensiveForm && (
        <ComprehensivePricingForm
          pricingConfig={pricingConfig}
          onPricingConfigUpdate={onPricingConfigUpdate}
          onClose={() => setShowComprehensiveForm(false)}
        />
      )}
    </div>
  );
}

