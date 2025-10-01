import React, { useState } from 'react';
import { PricingLogic, RateData, CustomPricingRule, PricingConfig, ServiceAreaVerificationData, RegionalPricingData, FranchisedCitySupplementaryPricing } from '../types';
import { parseCSV, detectColumns, parseRateData, parseRegionalRateSheets } from '../utils/csvParser';
import { FileUpload } from './FileUpload';
import { CustomPricingForm } from './CustomPricingForm';
import { FranchisedCitySupplementaryForm } from './FranchisedCitySupplementaryForm';
import { isFranchisedCity, getFranchisedCityName } from '../utils/franchisedCityParser';
import { Settings, Upload, CreditCard as Edit3, ArrowRight, CheckCircle, XCircle, Brain, DollarSign, Plus, X } from 'lucide-react';
import { getBuiltInRegionalPricingData } from '../data/regionalRateSheets';

interface ComprehensivePricingFormProps {
  onPricingLogicSet: (logic: PricingLogic) => void;
  onContinue: () => void;
  serviceAreaVerification?: ServiceAreaVerificationData | null;
  uploadedFileName?: string;
  savedData?: {
    selectedOption: 'regional-brain' | 'custom' | null;
    brokerFile: File | null;
    brokerRates: any[];
    customRules: any[];
    pricingConfig: PricingConfig;
    isConfigured: boolean;
  };
  onDataSave?: (data: {
    selectedOption: 'regional-brain' | 'custom' | null;
    brokerFile: File | null;
    brokerRates: any[];
    customRules: any[];
    pricingConfig: PricingConfig;
    isConfigured: boolean;
  }) => void;
}

interface ContainerPricingRow {
  id: string;
  smallContainerPrice: number;
  largeContainerPrice: number;
  selectedDivisions: string[];
}

export function ComprehensivePricingForm({ onPricingLogicSet, onContinue, serviceAreaVerification, uploadedFileName, savedData, onDataSave }: ComprehensivePricingFormProps) {
  // Initialize state with saved data if available
  const [selectedOption, setSelectedOption] = useState<'regional-brain' | 'custom' | null>(savedData?.selectedOption || 'custom');
  const [brokerFile, setBrokerFile] = useState<File | null>(savedData?.brokerFile || null);
  const [brokerRates, setBrokerRates] = useState<RateData[]>(savedData?.brokerRates || []);
  const [regionalBrainFile, setRegionalBrainFile] = useState<File | null>(null);
  const [regionalPricingData, setRegionalPricingData] = useState<RegionalPricingData | null>(null);
  const [customRules, setCustomRules] = useState<CustomPricingRule[]>([]);
  const [manualRules, setManualRules] = useState<CustomPricingRule[]>(savedData?.customRules || []);
  const [isConfigured, setIsConfigured] = useState(savedData?.isConfigured || false);
  const [enableDivisionPricing, setEnableDivisionPricing] = useState(false);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [allConfigurationsValid, setAllConfigurationsValid] = useState(true);
  const [regionalBrainActive, setRegionalBrainActive] = useState(false);
  const [franchisedCitySupplementary, setFranchisedCitySupplementary] = useState<FranchisedCitySupplementaryPricing | null>(null);
  const [comprehensiveFormValid, setComprehensiveFormValid] = useState(false);
  const [showSingleLocationGenerateButton, setShowSingleLocationGenerateButton] = useState(false);
  
  // Ref to track previous logic for stable comparison
  const prevLogicRef = React.useRef<PricingLogic | null>(null);
  
  // Local pricingConfig state initialized from savedData
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => savedData?.pricingConfig || {
    smallContainerPrice: 0,
    largeContainerPrice: 0,
    defaultFrequency: '1x/week',
    frequencyDiscounts: {
      twoThreeTimesWeek: 0,
      fourTimesWeek: 0
    },
    franchiseFee: 0,
    tax: 8.25,
    deliveryFee: 0,
    fuelSurcharge: 0,
    extraPickupRate: 0,
    additionalFees: [],
    containerSpecificPricingRules: []
  });

  // Synchronize internal pricingConfig state with savedData prop changes
  React.useEffect(() => {
    if (savedData?.pricingConfig) {
      // Check if savedData.pricingConfig is different from current pricingConfig
      const savedConfigString = JSON.stringify(savedData.pricingConfig);
      const currentConfigString = JSON.stringify(pricingConfig);
      
      if (savedConfigString !== currentConfigString) {
        console.log('🔄 Synchronizing pricingConfig state with savedData:', {
          savedConfig: savedData.pricingConfig,
          currentConfig: pricingConfig,
          smallContainerPriceChanged: savedData.pricingConfig.smallContainerPrice !== pricingConfig.smallContainerPrice
        });
        setPricingConfig(savedData.pricingConfig);
      }
    }
  }, [savedData?.pricingConfig]);

  // Add state to track current pricing logic
  const [pricingLogicState, setPricingLogicState] = useState<PricingLogic | null>(null);

  // Main useEffect to handle pricing logic updates
  React.useEffect(() => {
    if (selectedOption === 'custom') {
      const logic: PricingLogic = {
        type: 'custom',
        customRules: manualRules,
        pricingConfig: pricingConfig
      };
      
      // Only update if logic has actually changed
      const logicString = JSON.stringify(logic);
      const prevLogicString = JSON.stringify(prevLogicRef.current);
      
      if (logicString !== prevLogicString) {
        console.log('🔧 PRICING LOGIC UPDATE TRIGGERED:', {
          selectedOption,
          manualRulesCount: manualRules.length,
          configSmallPrice: pricingConfig.smallContainerPrice,
          comprehensiveFormValid,
          isSingleLocation
        });
        
        onPricingLogicSet(logic);
        setPricingLogicState(logic);
        prevLogicRef.current = logic;
        
        // Calculate new config state
        const isSingleLocationWorkflow = serviceAreaVerification?.totalProcessed === 1;
        const hasManualRules = manualRules.length > 0;
        const newConfigState = isSingleLocationWorkflow ? comprehensiveFormValid : (hasManualRules || comprehensiveFormValid);
        
        console.log('🔧 CONFIG STATE CALCULATION:', {
          isSingleLocationWorkflow,
          hasManualRules,
          comprehensiveFormValid,
          newConfigState,
          currentIsConfigured: isConfigured
        });
        
        if (newConfigState !== isConfigured) {
          setIsConfigured(newConfigState);
          console.log('🔧 IS_CONFIGURED UPDATED:', { from: isConfigured, to: newConfigState });
        }
        
        // Save data for persistence
        if (onDataSave) {
          onDataSave({
            selectedOption: selectedOption,
            brokerFile: brokerFile,
            brokerRates: brokerRates,
            customRules: manualRules,
            pricingConfig: pricingConfig,
            isConfigured: newConfigState
          });
        }
      }
    }
  }, [selectedOption, manualRules, pricingConfig, comprehensiveFormValid, serviceAreaVerification?.totalProcessed, onPricingLogicSet, onDataSave, brokerFile, brokerRates]);

  // Check if this is a single location scenario
  const isSingleLocation = serviceAreaVerification && serviceAreaVerification.totalProcessed === 1;
  
  // Auto-activate regional pricing brain when serviceable locations are detected
  React.useEffect(() => {
    if (serviceAreaVerification && serviceAreaVerification.serviceableCount > 0 && !regionalBrainActive && selectedOption === 'regional-brain') {
      console.log('🧠 Auto-activating regional pricing brain for serviceable locations');
      
      const builtInData = getBuiltInRegionalPricingData();
      setRegionalPricingData(builtInData);
      
      const logic: PricingLogic = {
        type: 'regional-brain',
        brokerRates: [],
        regionalPricingData: builtInData,
        customRules: []
      };
      
      onPricingLogicSet(logic);
      setPricingLogicState(logic);
      setIsConfigured(true);
      setRegionalBrainActive(true);
      
      // Save regional brain data for persistence
      if (onDataSave) {
        onDataSave({
          selectedOption: selectedOption, // Keep current selection
          brokerFile: null,
          brokerRates: [],
          customRules: [],
          pricingConfig: pricingConfig,
          isConfigured: true,
          regionalPricingData: builtInData
        });
      }
      
      console.log('🧠 Regional pricing brain auto-activated:', {
        totalSheets: builtInData.rateSheets.length,
        regions: builtInData.rateSheets.map(s => s.region),
        serviceableLocations: serviceAreaVerification.serviceableCount
      });
    }
  }, [serviceAreaVerification, regionalBrainActive, selectedOption, onPricingLogicSet, pricingConfig, onDataSave]);

  // Auto-populate franchise fees and sales tax from service area verification
  React.useEffect(() => {
    if (serviceAreaVerification && serviceAreaVerification.serviceableCount === 1 && selectedOption === 'custom') {
      const serviceableLocation = serviceAreaVerification.results.find(r => r.status === 'serviceable');
      
      if (serviceableLocation && serviceableLocation.divisionData) {
        const { franchiseFee, salesTax } = serviceableLocation.divisionData;
        
        console.log('🏛️ Auto-populating franchise fee and sales tax for single location:', {
          city: serviceableLocation.city,
          state: serviceableLocation.state,
          franchiseFee: `${franchiseFee}%`,
          salesTax: `${salesTax}%`
        });
        
        // Update local pricing config with city-specific fees (functional update to preserve user input)
        setPricingConfig(prevConfig => ({
          ...prevConfig,
          franchiseFee: franchiseFee,
          tax: salesTax
        }));
      }
    }
    
    // BULK UPLOAD: Auto-populate franchise fees for bulk uploads
    if (serviceAreaVerification && serviceAreaVerification.serviceableCount > 1 && selectedOption === 'custom') {
      // For bulk uploads, check if we have consistent franchise fees across locations
      const serviceableLocations = serviceAreaVerification.results.filter(r => r.status === 'serviceable');
      const franchiseFees = serviceableLocations.map(loc => loc.divisionData?.franchiseFee || 0);
      const salesTaxes = serviceableLocations.map(loc => loc.divisionData?.salesTax || 8.25);
      
      // Use the most common franchise fee and sales tax
      const mostCommonFranchiseFee = franchiseFees.sort((a,b) =>
        franchiseFees.filter(v => v === a).length - franchiseFees.filter(v => v === b).length
      ).pop() || 0;
      
      const mostCommonSalesTax = salesTaxes.sort((a,b) =>
        salesTaxes.filter(v => v === a).length - salesTaxes.filter(v => v === b).length
      ).pop() || 8.25;
      
      console.log('🏛️ Auto-populating franchise fee and sales tax for bulk upload:', {
        serviceableLocations: serviceableLocations.length,
        franchiseFeeRange: `${Math.min(...franchiseFees)}% - ${Math.max(...franchiseFees)}%`,
        mostCommonFranchiseFee: `${mostCommonFranchiseFee}%`,
        mostCommonSalesTax: `${mostCommonSalesTax}%`,
        citiesWithFees: serviceableLocations.map(loc => ({
          city: loc.city,
          franchiseFee: loc.divisionData?.franchiseFee,
          salesTax: loc.divisionData?.salesTax
        }))
      });
      
      // Update local pricing config with most common fees (functional update to preserve user input)
      setPricingConfig(prevConfig => ({
        ...prevConfig,
        franchiseFee: mostCommonFranchiseFee,
        tax: mostCommonSalesTax
      }));
    }
  }, [serviceAreaVerification, selectedOption]);

  // Get serviceable locations for reference
  const allVerificationLocations = serviceAreaVerification?.results || [];
  const verifiedServiceableLocations = allVerificationLocations.filter(r => r.status === 'serviceable');
  const verifiedNotServiceableLocations = allVerificationLocations.filter(r => r.status === 'not-serviceable');
  
  // Define variables used in JSX
  const allLocations = allVerificationLocations;
  const serviceableLocations = verifiedServiceableLocations;
  const notServiceableLocations = verifiedNotServiceableLocations;
  
  // Check for franchised cities in serviceable locations
  const franchisedCityLocations = verifiedServiceableLocations.filter(location => 
    isFranchisedCity(location.city, location.state)
  );
  
  // Get unique franchised cities
  const uniqueFranchisedCities = Array.from(new Set(
    franchisedCityLocations.map(location => `${location.city}, ${location.state}`)
  ));
  
  const divisionOptions = [
    'Central - San Marcos',
    'Central - Poteet',
    'Central - Nolanville',
    'Central - Hearne',
    'Central - Mexia',
    'Central - Hillsboro',
    'North - Wilmer',
    'North - Cresson',
    'North - Mansfield',
    'North - Justin',
    'North - McKinney',
    'North - Pottsboro',
    'South - Conroe',
    'South - Jersey Village',
    'South - Pearland',
    'South - Dayton',
    'South - Bayou',
    'South - Corpus'
  ];


  const handleRegionalBrainFileUpload = async (file: File) => {
    setRegionalBrainFile(file);
    
    try {
      const text = await file.text();
      console.log('📄 Regional brain file content preview:', text.substring(0, 500));
      const regionalData = parseRegionalRateSheets(text);
      
      console.log('🧠 Parsed regional data:', regionalData);
      
      if (!regionalData.rateSheets || regionalData.rateSheets.length === 0) {
        throw new Error('No rate sheets found in the uploaded file. Please check the file format.');
      }
      
      setRegionalPricingData(regionalData);
      
      const logic: PricingLogic = {
        type: 'regional-brain',
        brokerRates: [],
        regionalPricingData: regionalData,
        customRules: []
      };
      
      onPricingLogicSet(logic);
      setPricingLogicState(logic);
      setIsConfigured(true);
      
      console.log('🧠 Regional pricing brain configured:', {
        totalSheets: regionalData.rateSheets.length,
        regions: regionalData.rateSheets.map(s => s.region)
      });
      
      // Save regional brain data for persistence
      if (onDataSave) {
        onDataSave({
          selectedOption: 'regional-brain',
          brokerFile: null,
          brokerRates: [],
          customRules: [],
          pricingConfig,
          isConfigured: true,
          regionalPricingData: regionalData
        });
      }
    } catch (error) {
      console.error('Error parsing regional rate sheets:', error);
      alert(`Error parsing the regional rate sheets CSV file: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the format and try again.`);
    }
  };

  const handleBrokerFileUpload = async (file: File) => {
    setBrokerFile(file);
    
    try {
      const text = await file.text();
      const { headers, data } = parseCSVWithHeaderDetection(text);
      const columnMap = detectColumns(headers);
      const rates = parseRateData(data, columnMap);
      
      setBrokerRates(rates);
      
      const logic: PricingLogic = {
        type: 'broker',
        brokerRates: rates
      };
      
      onPricingLogicSet(logic);
      setPricingLogicState(logic);
      setIsConfigured(true);
      
      // Save broker data for persistence
      if (onDataSave) {
        onDataSave({
          ...savedData,
          selectedOption: 'broker',
          brokerFile: file,
          brokerRates: rates,
          customRules: [],
          isConfigured: true
        });
      }
    } catch (error) {
      console.error('Error parsing broker rates:', error);
      alert('Error parsing the CSV file. Please check the format and try again.');
    }
  };

  const handleManualRulesUpdate = (rules: CustomPricingRule[]) => {
    console.log('🔧 HANDLE_MANUAL_RULES_UPDATE:', { rulesCount: rules.length });
  };

  const handlePricingConfigUpdate = (config: PricingConfig, isValid?: boolean) => {
    console.log('🔧 HANDLE_PRICING_CONFIG_UPDATE RECEIVED:', {
      config,
      isValid,
      configSmallContainerPrice: config.smallContainerPrice
    });
    
    console.log('🔧 HANDLE_PRICING_CONFIG_UPDATE CALLED:', {
      receivedConfig: config,
      receivedIsValid: isValid,
      configSmallContainerPrice: config.smallContainerPrice,
      configLargeContainerPrice: config.largeContainerPrice,
      isSingleLocation: serviceAreaVerification?.totalProcessed === 1
    });
    
    // Update comprehensive form validity state
    if (typeof isValid === 'boolean') {
      setComprehensiveFormValid(isValid);
    }
    
    // Update local pricing config state
    setPricingConfig(config);
    
    // For single location, only check if Price/YD is set
    if (isSingleLocation) {
      const isSingleLocationValid = config.smallContainerPrice > 0;
      setAllConfigurationsValid(isSingleLocationValid);
      
      console.log('🔧 Single Location Pricing Config Update:', {
        pricePerYard: config.smallContainerPrice,
        franchiseFee: config.franchiseFee,
        fuelSurcharge: config.fuelSurcharge,
        tax: config.tax,
        deliveryFee: config.deliveryFee,
        extraPickupRate: config.extraPickupRate,
        isValid: isSingleLocationValid
      });
    } else {
      // Check if all configurations are valid (container pricing + additional fees)
      const hasContainerPricing = config.smallContainerPrice > 0 || config.largeContainerPrice > 0;
      const hasAdditionalFees = config.additionalFees.length > 0;
      
      // Validate additional fees have division assignments
      const additionalFeesValid = config.additionalFees.every(fee => 
        fee.category.trim() !== '' && fee.price > 0
      );
      
      setAllConfigurationsValid(additionalFeesValid); // Update validation state
    }
    
    // Save data for persistence between steps
    if (onDataSave) {
      onDataSave({
        selectedOption: selectedOption,
        brokerFile: brokerFile,
        brokerRates: brokerRates,
        customRules: manualRules,
        pricingConfig: config,
        isConfigured: isValid || false
      });
    }
  };


  const handleApplyPricingConfig = () => {
    setShowSingleLocationGenerateButton(true);
    console.log('🔧 Single location pricing configuration applied, Generate Quotes button now active');
  };

  const handleDivisionToggle = (enabled: boolean) => {
    setEnableDivisionPricing(enabled);
    if (!enabled) {
      setSelectedDivisions([]);
    }
  };

  const handleDivisionSelection = (division: string) => {
    setSelectedDivisions(prev => {
      if (prev.includes(division)) {
        return prev.filter(d => d !== division);
      } else {
        return [...prev, division];
      }
    });
  };


  const clearBrokerData = () => {
    setBrokerFile(null);
    setBrokerRates([]);
    setIsConfigured(false);
    
    // Clear saved data
    if (onDataSave) {
      onDataSave({
        ...savedData,
        selectedOption: null,
        brokerFile: null,
        brokerRates: [],
        customRules: [],
        isConfigured: false
      });
    }
  };


  const handleFranchisedCitySupplementaryUpdate = (supplementaryPricing: FranchisedCitySupplementaryPricing) => {
    setFranchisedCitySupplementary(supplementaryPricing);
    
    // Update pricing logic to include franchised city supplementary costs
    if (pricingLogicState) {
      const updatedLogic: PricingLogic = {
        ...pricingLogicState,
        franchisedCitySupplementary: {
          ...pricingLogicState.franchisedCitySupplementary,
          [supplementaryPricing.cityName]: supplementaryPricing
        }
      };
      onPricingLogicSet(updatedLogic);
      setPricingLogicState(updatedLogic);
      
      console.log('🏛️ Updated pricing logic with franchised city supplementary costs:', {
        cityName: supplementaryPricing.cityName,
        supplementaryCostsCount: supplementaryPricing.supplementaryCosts.length
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Serviceable Locations Reference */}
      {allLocations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                All Locations Reference
              </h3>
              <p className="text-gray-600 mt-1">
                Review all {allLocations.length} location{allLocations.length !== 1 ? 's' : ''} ({serviceableLocations.length} serviceable, {notServiceableLocations.length} not serviceable) while configuring pricing logic
              </p>
            </div>
          </div>

          {/* Ticket Number Field for Bulk Upload */}
          {serviceAreaVerification && serviceAreaVerification.totalProcessed > 1 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uploaded File
                </label>
                <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
                  {uploadedFileName || 'Unknown file'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  File used for bulk service area verification
                </p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{serviceAreaVerification.totalProcessed}</div>
                  <div className="text-xs text-blue-700">Total Locations</div>
                </div>
                <div className="text-center p-3 bg-white border border-green-200 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{serviceAreaVerification.serviceableCount}</div>
                  <div className="text-xs text-green-700">Will Get Quotes</div>
                </div>
                <div className="text-center p-3 bg-white border border-red-200 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{serviceAreaVerification.notServiceableCount}</div>
                  <div className="text-xs text-red-700">Tracked Only</div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Number *
                </label>
                <input
                  type="number"
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter ticket number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the ticket number for this bulk quote generation
                </p>
              </div>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-3 border border-gray-100 rounded-lg p-4 bg-gray-50">
            {/* Serviceable Locations */}
            {verifiedServiceableLocations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Serviceable Locations ({verifiedServiceableLocations.length})
                </h4>
                <div className="space-y-3">
                  {verifiedServiceableLocations.map((location, index) => (
                    <div
                      key={location.id}
                      className="bg-white border border-green-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
                          </div>
                          <h5 className="font-medium text-gray-900">
                            {location.companyName || `Location ${index + 1}`}
                          </h5>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {location.division || 'Serviceable'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1"><strong>Address:</strong></p>
                          <p className="text-gray-900">{location.address}</p>
                          <p className="text-gray-900">{location.city}, {location.state} {location.zipCode}</p>
                          {(location.latitude && location.longitude) && (
                            <p className="text-gray-500 text-xs mt-1">
                              Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          {/* Service Details */}
                          {(location.equipmentType || location.containerSize || location.frequency || location.materialType) && (
                            <div className="mb-3">
                              <p className="text-gray-600 mb-1"><strong>Service Details:</strong></p>
                              {location.equipmentType && (
                                <p className="text-gray-900">Equipment: {location.equipmentType}</p>
                              )}
                              {location.containerSize && (
                                <p className="text-gray-900">Container: {location.containerSize}</p>
                              )}
                              {location.frequency && (
                                <p className="text-gray-900">Service Frequency: {location.frequency}</p>
                              )}
                              {location.materialType && (
                                <p className="text-gray-900">Material: {location.materialType}</p>
                              )}
                              {location.addOns && location.addOns.length > 0 && (
                                <p className="text-gray-900">Add-ons: {Array.isArray(location.addOns) ? location.addOns.join(', ') : location.addOns}</p>
                              )}
                            </div>
                          )}
                          
                          {/* Division Details */}
                          {location.divisionData && (
                            <div>
                              <p className="text-gray-600 mb-1"><strong>Division Info:</strong></p>
                              <p className="text-gray-900">CSR Center: {location.divisionData.csrCenter}</p>
                              <p className="text-gray-900">Service Region: {location.divisionData.serviceRegion}</p>
                              {location.divisionData.franchiseFee && (
                                <p className="text-gray-900">Franchise Fee: {location.divisionData.franchiseFee}%</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Not Serviceable Locations */}
            {verifiedNotServiceableLocations.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-red-800 mb-3 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Not Serviceable Locations ({verifiedNotServiceableLocations.length})
                </h4>
                <div className="space-y-3">
                  {verifiedNotServiceableLocations.map((location, index) => (
                    <div
                      key={location.id}
                      className="bg-white border border-red-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {verifiedServiceableLocations.length + index + 1}
                          </div>
                          <h5 className="font-medium text-gray-900">
                            {location.companyName || `Location ${verifiedServiceableLocations.length + index + 1}`}
                          </h5>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Not Serviceable
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1"><strong>Address:</strong></p>
                          <p className="text-gray-900">{location.address}</p>
                          <p className="text-gray-900">{location.city}, {location.state} {location.zipCode}</p>
                          {(location.latitude && location.longitude) && (
                            <p className="text-gray-500 text-xs mt-1">
                              Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          {/* Service Details */}
                          {(location.equipmentType || location.containerSize || location.frequency || location.materialType) && (
                            <div className="mb-3">
                              <p className="text-gray-600 mb-1"><strong>Service Details:</strong></p>
                              {location.equipmentType && (
                                <p className="text-gray-900">Equipment: {location.equipmentType}</p>
                              )}
                              {location.containerSize && (
                                <p className="text-gray-900">Container: {location.containerSize}</p>
                              )}
                              {location.frequency && (
                                <p className="text-gray-900">Service Frequency: {location.frequency}</p>
                              )}
                              {location.materialType && (
                                <p className="text-gray-900">Material: {location.materialType}</p>
                              )}
                              {location.addOns && location.addOns.length > 0 && (
                                <p className="text-gray-900">Add-ons: {Array.isArray(location.addOns) ? location.addOns.join(', ') : location.addOns}</p>
                              )}
                            </div>
                          )}
                          
                          {/* Failure Reason */}
                          <div>
                            <p className="text-gray-600 mb-1"><strong>Reason:</strong></p>
                            <p className="text-red-700">{location.failureReason || 'Unknown reason'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>💡 Reference Guide:</strong> Use this information to create targeted pricing rules. 
              Serviceable locations will receive quotes, while not serviceable locations will be tracked but excluded from pricing calculations.
              Consider factors like division assignments, service requirements, and geographic distribution 
              when configuring your custom pricing logic below.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Step 1: Choose Your Pricing Logic</h2>
            <p className="text-gray-600 mt-1">
              Configure your pricing logic using manual rules and optional advanced settings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Regional Pricing Brain - Auto-Activated */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedOption === 'regional-brain' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption('regional-brain')}
          >
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Regional Pricing Brain</h3>
                <p className="text-sm text-gray-600">
                  {regionalBrainActive ? '✓ Auto-activated for serviceable locations' : 'Will auto-activate when serviceable locations are detected'}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• NTX Rate Sheet: Dallas/Fort Worth region</p>
              <p>• CTX Rate Sheet: San Antonio/San Marcos/Austin region</p>
              <p>• STX Rate Sheet: Houston region</p>
              <p>• Franchised Cities: Municipal contract pricing (e.g., Mansfield)</p>
              {regionalBrainActive ? (
                <p className="font-medium text-green-700">Ready to generate quotes using standardized regional rates</p>
              ) : (
                <p className="text-gray-600">
                  Complete service area verification first. The regional pricing brain will automatically 
                  activate and load rate sheets for your serviceable locations.
                </p>
              )}
            </div>
          </div>

          {/* Option 2: Custom Division Pricing */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedOption === 'custom' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption('custom')}
          >
            <div className="flex items-center mb-4">
              <Edit3 className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Custom Division Pricing</h3>
                <p className="text-sm text-gray-600">Define your own pricing rules manually</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              Create custom pricing rules using an interactive interface. Define price per yard, 
              delivery fees, fuel surcharges, and other pricing components.
            </p>
          </div>
        </div>
        
      </div>

      {/* Configuration Section */}
      {selectedOption === 'regional-brain' && regionalBrainActive && (
        <div className="bg-white border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Pricing Brain Status</h3>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
                Regional Pricing Brain Active
              </p>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              {regionalPricingData?.rateSheets.map(sheet => (
                <p key={sheet.region}>
                  • {sheet.region} ({sheet.regionName}): {sheet.rates.length} pricing entries
                </p>
              ))}
              <p className="font-medium mt-3 text-green-800">
                System will automatically match each location to its appropriate regional rate sheet
              </p>
            </div>
          </div>

          {/* Franchised City Supplementary Costs Section - Moved from below */}
          {uniqueFranchisedCities.length > 0 && (
            <div className="mt-8 bg-white border border-purple-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-bold text-sm">🏛️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Franchised City Supplementary Costs
                  </h3>
                  <p className="text-purple-700 text-sm mt-1">
                    Municipal contract pricing active for: {uniqueFranchisedCities.join(', ')}
                  </p>
                </div>
              </div>

              {/* Municipal Contract Notice */}
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">
                      Municipal Contract Pricing Active
                    </h4>
                    <p className="text-sm text-purple-700 mb-2">
                      All base pricing for franchised cities is automatically handled by municipal contract rate sheets. 
                      Use this section only to add supplementary costs that are NOT included in the municipal contract.
                    </p>
                    <p className="text-xs text-purple-600">
                      Municipal contracts include: container rates, delivery fees, franchise fees, sales tax, and standard services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Supplementary Costs Form for each franchised city */}
              {uniqueFranchisedCities.map((cityInfo) => (
                <div key={`${cityInfo}-supplementary`} className="mb-6">
                  <FranchisedCitySupplementaryForm
                    cityName={cityInfo.split(',')[0].trim()}
                    state={cityInfo.split(',')[1]?.trim() || 'Texas'}
                    onSupplementaryPricingUpdate={handleFranchisedCitySupplementaryUpdate}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedOption !== 'regional-brain' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isSingleLocation ? 'Custom Division Pricing Rules' : 'Custom Division Pricing Rules & Container Pricing'}
          </h3>
          
          <CustomPricingForm
            initialRules={manualRules}
            onRulesUpdate={handleManualRulesUpdate}
            serviceAreaVerification={serviceAreaVerification}
            isSingleLocation={isSingleLocation}
            pricingConfig={pricingConfig}
            onPricingConfigUpdate={handlePricingConfigUpdate}
            onApplyPricingConfig={handleApplyPricingConfig}
          />
        </div>
      )}


      {/* Continue Button */}
      {(isConfigured || savedData?.isConfigured) && (regionalBrainActive || selectedOption === 'custom') && !isSingleLocation && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {serviceAreaVerification && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Verification Data Available</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• {serviceAreaVerification.serviceableCount} serviceable locations identified</p>
                <p>• {serviceAreaVerification.results.filter(r => r.divisionData).length} locations with division and franchise fee data</p>
                <p>• Enhanced export includes division names and franchise fees</p>
                {regionalBrainActive && regionalPricingData && (
                  <p>• Regional pricing brain loaded with {regionalPricingData.rateSheets.length} rate sheets</p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Process Requests</h3>
              <p className="text-gray-600">
                Pricing logic configured: {
                  regionalBrainActive 
                    ? `Regional pricing brain (${regionalPricingData?.rateSheets.length || 0} rate sheets)`
                    : `${manualRules.length} manual rules`
                }
                {(pricingConfig.smallContainerPrice > 0 || pricingConfig.largeContainerPrice > 0) && 
                  ' + advanced configuration'}
                {(pricingConfig.containerSpecificPricingRules || []).length > 0 && 
                  ` + ${pricingConfig.containerSpecificPricingRules.length} container-specific rules`}
                {(pricingConfig.additionalFees || []).length > 0 && 
                  ` + ${pricingConfig.additionalFees.length} additional fees`}. Continue to bulk processing mode.
                {serviceAreaVerification && 
                  ` Verification data for ${serviceAreaVerification.serviceableCount} serviceable locations is ready for integration.`}
              </p>
            </div>
            <button
              onClick={onContinue}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Generate Quotes
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Single Location Generate Quotes Button */}
      {isSingleLocation && showSingleLocationGenerateButton && (isConfigured || savedData?.isConfigured) && (
        <div className="bg-white border border-green-200 rounded-lg p-6">
          {(() => {
            console.log('🔧 SINGLE LOCATION GENERATE BUTTON RENDER CHECK:', {
              isSingleLocation,
              showSingleLocationGenerateButton,
              isConfigured,
              savedDataIsConfigured: savedData?.isConfigured,
              finalCondition: isSingleLocation && showSingleLocationGenerateButton && (isConfigured || savedData?.isConfigured)
            });
            return null;
          })()}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Generate Quote</h3>
              <p className="text-gray-600">
                Single location pricing configuration applied. Click "Generate Quote" to proceed to Step 2 and calculate the final pricing.
              </p>
            </div>
            <button
              onClick={onContinue}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Generate Quote
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}