import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { PricingLogic, RateData, PricingConfig, ServiceAreaVerificationData, RegionalPricingData, FranchisedCitySupplementaryPricing } from '../types';
import { parseCSV, detectColumns, parseRateData, parseRegionalRateSheets } from '../utils/csvParser';
import { FileUpload } from './FileUpload';
import { CustomPricingForm } from './CustomPricingForm';
import { FranchisedCitySupplementaryForm } from './FranchisedCitySupplementaryForm';
import { LocationsReference } from './LocationsReference';
import { isFranchisedCity, getFranchisedCityName } from '../utils/franchisedCityParser';
import { Settings, Upload, CreditCard as Edit3, ArrowRight, CheckCircle, XCircle, Brain, DollarSign, Plus, X } from 'lucide-react';
import { getBuiltInRegionalPricingData } from '../data/regionalRateSheets';

interface PricingSetupProps {
  onPricingLogicSet: (logic: PricingLogic) => void;
  onContinue: () => void;
  serviceAreaVerification?: ServiceAreaVerificationData | null;
  uploadedFileName?: string;
  savedData?: {
    selectedOption: 'regional-brain' | 'custom' | null;
    brokerFile: File | null;
    brokerRates: RateData[];
    pricingConfig: PricingConfig;
    isConfigured: boolean;
    regionalPricingData?: RegionalPricingData | null;
  };
  onDataSave?: (data: {
    selectedOption: 'regional-brain' | 'custom' | null;
    brokerFile: File | null;
    brokerRates: RateData[];
    pricingConfig: PricingConfig;
    isConfigured: boolean;
    regionalPricingData?: RegionalPricingData | null;
  }) => void;
}

export function PricingSetup({ onPricingLogicSet, onContinue, serviceAreaVerification, uploadedFileName, savedData, onDataSave }: PricingSetupProps) {
  // Initialize state with saved data if available
  const [selectedOption, setSelectedOption] = useState<'regional-brain' | 'custom' | null>(savedData?.selectedOption || 'custom');

  const [brokerFile, setBrokerFile] = useState<File | null>(savedData?.brokerFile || null);
  const [brokerRates, setBrokerRates] = useState<RateData[]>(savedData?.brokerRates || []);
  const [regionalBrainFile, setRegionalBrainFile] = useState<File | null>(null);
  const [regionalPricingData, setRegionalPricingData] = useState<RegionalPricingData | null>(savedData?.regionalPricingData || null);
  const [isConfigured, setIsConfigured] = useState(savedData?.isConfigured || false);
  const [enableDivisionPricing, setEnableDivisionPricing] = useState(false);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [allConfigurationsValid, setAllConfigurationsValid] = useState(true);
  const [regionalBrainActive, setRegionalBrainActive] = useState(false);
  const [franchisedCitySupplementary, setFranchisedCitySupplementary] = useState<FranchisedCitySupplementaryPricing | null>(null);
  const [regionalBrainSupplementary, setRegionalBrainSupplementary] = useState<FranchisedCitySupplementaryPricing | null>(null);
  const [comprehensiveFormValid, setComprehensiveFormValid] = useState(false);
  const [showSingleLocationGenerateButton, setShowSingleLocationGenerateButton] = useState(false);
  
  // Use refs to track previous values and prevent unnecessary re-renders
  const prevLogicRef = useRef<PricingLogic | null>(null);
  const prevConfigRef = useRef<PricingConfig | null>(null);
  
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
    deliveryFee: 75,
    fuelSurcharge: 0,
    extraPickupRate: 0,
    additionalFees: [],
    containerSpecificPricingRules: [],
    globalPricingRules: []
  });

  // Add state to track current pricing logic
  const [pricingLogicState, setPricingLogicState] = useState<PricingLogic | null>(null);

  // Memoize expensive calculations
  const allVerificationLocations = useMemo(() => serviceAreaVerification?.results || [], [serviceAreaVerification?.results]);
  const verifiedServiceableLocations = useMemo(() => allVerificationLocations.filter(r => r.status === 'serviceable'), [allVerificationLocations]);
  const verifiedNotServiceableLocations = useMemo(() => allVerificationLocations.filter(r => r.status === 'not-serviceable'), [allVerificationLocations]);
  const isSingleLocation = useMemo(() => serviceAreaVerification && serviceAreaVerification.totalProcessed === 1, [serviceAreaVerification]);

  // Memoize franchised city calculations
  const franchisedCityLocations = useMemo(() => 
    verifiedServiceableLocations.filter(location => 
      isFranchisedCity(location.city, location.state)
    ), [verifiedServiceableLocations]
  );

  const uniqueFranchisedCities = useMemo(() => 
    Array.from(new Set(
      franchisedCityLocations.map(location => `${location.city}, ${location.state}`)
    )), [franchisedCityLocations]
  );

  const divisionOptions = useMemo(() => [
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
  ], []);

  // Optimized pricing logic update function
  const updatePricingLogic = useCallback((newLogic: PricingLogic) => {
    const logicString = JSON.stringify(newLogic);
    const prevLogicString = JSON.stringify(prevLogicRef.current);
    
    if (logicString !== prevLogicString) {
      console.log('🔧 PRICING LOGIC UPDATE TRIGGERED:', newLogic);
      onPricingLogicSet(newLogic);
      setPricingLogicState(newLogic);
      prevLogicRef.current = newLogic;
    }
  }, [onPricingLogicSet]);

  // Optimized data save function
  const saveData = useCallback((data: {
    selectedOption: 'regional-brain' | 'custom' | null;
    brokerFile: File | null;
    brokerRates: RateData[];
    pricingConfig: PricingConfig;
    isConfigured: boolean;
    regionalPricingData?: RegionalPricingData | null;
  }) => {
    if (onDataSave) {
      onDataSave(data);
    }
  }, [onDataSave]);

  // Handle pricing config updates with debouncing
  const handlePricingConfigUpdate = useCallback((config: PricingConfig, isValid?: boolean) => {
    console.log('🔧 HANDLE_PRICING_CONFIG_UPDATE RECEIVED:', {
      receivedConfig: config,
      receivedIsValid: isValid,
      configSmallContainerPrice: config.smallContainerPrice,
      configLargeContainerPrice: config.largeContainerPrice,
      globalPricingRulesCount: config.globalPricingRules?.length || 0
    });

    const configString = JSON.stringify(config);
    const prevConfigString = JSON.stringify(prevConfigRef.current);

    if (configString !== prevConfigString) {
      setPricingConfig(config);
      prevConfigRef.current = config;

      if (isValid !== undefined) {
        setComprehensiveFormValid(isValid);
      }

      // Update pricing logic if in custom mode
      if (selectedOption === 'custom') {
        const logic: PricingLogic = {
          type: 'custom',
          pricingConfig: config
        };
        updatePricingLogic(logic);

        // FIXED: Correct validation logic for single location vs bulk upload
        const isSingleLocationWorkflow = serviceAreaVerification?.totalProcessed === 1;
        const hasGlobalPricingRules = config.globalPricingRules && config.globalPricingRules.length > 0;
        const hasBasicPricing = config.smallContainerPrice > 0 && config.largeContainerPrice > 0;

        // Check if this is roll-off/compactor pricing
        const isRollOffPricing = hasGlobalPricingRules && config.globalPricingRules![0]?.isRollOffOrCompactor;

        // For single location with roll-off/compactor: valid if globalPricingRules with roll-off pricing exist
        // For single location with standard pricing: valid if basic pricing is set
        // For bulk upload: valid if globalPricingRules exist
        const newConfigState = isSingleLocationWorkflow
          ? (isRollOffPricing ? hasGlobalPricingRules : hasBasicPricing)
          : hasGlobalPricingRules;

        console.log('🔧 [PricingSetup] Validation check:', {
          isSingleLocationWorkflow,
          hasBasicPricing,
          hasGlobalPricingRules,
          isRollOffPricing,
          smallContainerPrice: config.smallContainerPrice,
          largeContainerPrice: config.largeContainerPrice,
          newConfigState
        });

        if (newConfigState !== isConfigured) {
          setIsConfigured(newConfigState);
        }

        // Save data
        saveData({
          selectedOption: selectedOption,
          brokerFile: brokerFile,
          brokerRates: brokerRates,
          pricingConfig: config,
          isConfigured: newConfigState
        });
      }
    }
  }, [selectedOption, serviceAreaVerification?.totalProcessed, isConfigured, updatePricingLogic, saveData, brokerFile, brokerRates]);

  // Auto-activate regional pricing brain when serviceable locations are detected
  useEffect(() => {
    if (serviceAreaVerification && serviceAreaVerification.serviceableCount > 0 && !regionalBrainActive && selectedOption === 'regional-brain') {
      console.log('🧠 Auto-activating regional pricing brain for serviceable locations');
      
      const builtInData = getBuiltInRegionalPricingData();
      setRegionalPricingData(builtInData);
      
      const logic: PricingLogic = {
        type: 'regional-brain',
        brokerRates: [],
        regionalPricingData: builtInData,
      };
      
      updatePricingLogic(logic);
      setIsConfigured(true);
      setRegionalBrainActive(true);
      
      // Save regional brain data for persistence
      saveData({
        selectedOption: selectedOption,
        brokerFile: null,
        brokerRates: [],
        pricingConfig: pricingConfig,
        isConfigured: true,
        regionalPricingData: builtInData
      });
      
      console.log('🧠 Regional pricing brain auto-activated:', {
        totalSheets: builtInData.rateSheets.length,
        regions: builtInData.rateSheets.map(s => s.region),
        serviceableLocations: serviceAreaVerification.serviceableCount
      });
    }
  }, [serviceAreaVerification, regionalBrainActive, selectedOption, updatePricingLogic, pricingConfig, saveData]);

  // Auto-populate franchise fees and sales tax from service area verification
  useEffect(() => {
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
        
        // Update local pricing config with city-specific fees
        setPricingConfig(prevConfig => {
          const newConfig = {
            ...prevConfig,
            franchiseFee: franchiseFee,
            tax: salesTax,
          };
          console.log('Updating pricingConfig with auto-populated fees:', newConfig);
          return newConfig;
        });
      }
    }
  }, [serviceAreaVerification, selectedOption]);

  // Effect to update isConfigured based on selected option and data presence
  useEffect(() => {
    let newConfiguredState = false;
    if (selectedOption === 'regional-brain') {
      newConfiguredState = !!regionalPricingData;
    } else if (selectedOption === 'custom') {
      // FIXED: Use correct validation logic based on workflow type
      const isSingleLocationWorkflow = serviceAreaVerification?.totalProcessed === 1;
      const hasGlobalPricingRules = pricingConfig.globalPricingRules && pricingConfig.globalPricingRules.length > 0;
      const hasBasicPricing = pricingConfig.smallContainerPrice > 0 && pricingConfig.largeContainerPrice > 0;

      // Check if this is roll-off/compactor pricing
      const isRollOffPricing = hasGlobalPricingRules && pricingConfig.globalPricingRules![0]?.isRollOffOrCompactor;

      // For single location with roll-off/compactor: valid if globalPricingRules with roll-off pricing exist
      // For single location with standard pricing: valid if basic pricing is set
      // For bulk upload: valid if globalPricingRules exist
      newConfiguredState = isSingleLocationWorkflow
        ? (isRollOffPricing ? hasGlobalPricingRules : hasBasicPricing)
        : hasGlobalPricingRules;

      console.log('🔧 [PricingSetup] useEffect validation:', {
        isSingleLocationWorkflow,
        hasBasicPricing,
        hasGlobalPricingRules,
        isRollOffPricing,
        smallContainerPrice: pricingConfig.smallContainerPrice,
        largeContainerPrice: pricingConfig.largeContainerPrice,
        newConfiguredState
      });
    }
    if (newConfiguredState !== isConfigured) {
      setIsConfigured(newConfiguredState);
    }
  }, [selectedOption, regionalPricingData, pricingConfig.globalPricingRules, pricingConfig.smallContainerPrice, pricingConfig.largeContainerPrice, serviceAreaVerification?.totalProcessed, isConfigured]);

  // Effect to save data whenever relevant state changes
  useEffect(() => {
    saveData({
      selectedOption: selectedOption,
      brokerFile: brokerFile,
      brokerRates: brokerRates,
      pricingConfig: pricingConfig,
      isConfigured: isConfigured,
      regionalPricingData: regionalPricingData,
    });
  }, [selectedOption, brokerFile, brokerRates, pricingConfig, isConfigured, regionalPricingData, saveData]);

  // Effect to update pricing logic when pricingConfig changes in custom mode
  useEffect(() => {
    if (selectedOption === 'custom') {
      const supplementaryRecord: Record<string, FranchisedCitySupplementaryPricing> = {};
      if (franchisedCitySupplementary) {
        const key = `${franchisedCitySupplementary.cityName.toLowerCase()}, ${franchisedCitySupplementary.state.toLowerCase()}`;
        supplementaryRecord[key] = franchisedCitySupplementary;
      }

      const logic: PricingLogic = {
        type: 'custom',
        pricingConfig: pricingConfig,
        franchisedCitySupplementary: Object.keys(supplementaryRecord).length > 0 ? supplementaryRecord : undefined,
      };
      updatePricingLogic(logic);
    }
  }, [selectedOption, pricingConfig, franchisedCitySupplementary, updatePricingLogic]);

  // Effect to update pricing logic when regionalBrainSupplementary changes
  useEffect(() => {
    if (selectedOption === 'regional-brain' && regionalPricingData) {
      const supplementaryRecord: Record<string, FranchisedCitySupplementaryPricing> = {};
      if (regionalBrainSupplementary) {
        const key = `${regionalBrainSupplementary.cityName.toLowerCase()}, ${regionalBrainSupplementary.state.toLowerCase()}`;
        supplementaryRecord[key] = regionalBrainSupplementary;
      }

      const logic: PricingLogic = {
        type: 'regional-brain',
        brokerRates: brokerRates,
        regionalPricingData: regionalPricingData,
        franchisedCitySupplementary: Object.keys(supplementaryRecord).length > 0 ? supplementaryRecord : undefined,
      };
      updatePricingLogic(logic);
    }
  }, [selectedOption, regionalPricingData, regionalBrainSupplementary, brokerRates, updatePricingLogic]);

  // Helper function for CSV parsing with header detection
  function parseCSVWithHeaderDetection(text: string): { headers: string[]; data: any[] } {
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    if (lines.length === 0) {
      return { headers: [], data: [] };
    }
    const headers = lines[0].split(',').map((h) => h.trim());
    const data = lines.slice(1).map((line) => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] ? values[index].trim() : '';
        return obj;
      }, {} as any);
    });
    return { headers, data };
  }

  const handleBrokerFileUpload = async (file: File) => {
    setBrokerFile(file);
    const text = await file.text();
    const { headers, data } = parseCSVWithHeaderDetection(text);
    const rates = parseRateData(data);
    setBrokerRates(rates);

    const logic: PricingLogic = {
      type: 'broker',
      brokerRates: rates,
      pricingConfig: pricingConfig
    };
    updatePricingLogic(logic);
    setIsConfigured(true);

    saveData({
      selectedOption: selectedOption,
      brokerFile: file,
      brokerRates: rates,
      pricingConfig: pricingConfig,
      isConfigured: true,
      regionalPricingData: regionalPricingData,
    });
  };

  const handleRegionalBrainFileUpload = async (file: File) => {
    setRegionalBrainFile(file);
    const text = await file.text();
    const { headers, data } = parseCSVWithHeaderDetection(text);
    const regionalData = parseRegionalRateSheets(data);
    setRegionalPricingData(regionalData);

    const logic: PricingLogic = {
      type: 'regional-brain',
      brokerRates: brokerRates,
      regionalPricingData: regionalData,
    };
    updatePricingLogic(logic);
    setIsConfigured(true);

    saveData({
      selectedOption: selectedOption,
      brokerFile: brokerFile,
      brokerRates: brokerRates,
      pricingConfig: pricingConfig,
      isConfigured: true,
      regionalPricingData: regionalData,
    });
  };

  const handleSelectOption = useCallback((option: 'regional-brain' | 'custom') => {
    setSelectedOption(option);
    setIsConfigured(false); // Reset configured state when option changes

    // Clear relevant states based on option
    if (option === 'regional-brain') {
      setBrokerFile(null);
      setBrokerRates([]);
      setRegionalBrainActive(false); // Deactivate regional brain until serviceable locations are found or file uploaded
      setRegionalPricingData(null);
    } else if (option === 'custom') {
      setRegionalBrainFile(null);
      setRegionalPricingData(null);
      setRegionalBrainActive(false);
      // Custom pricing will be configured via CustomPricingForm
    }

    // Update pricing logic immediately
    const logic: PricingLogic = {
      type: option,
      brokerRates: brokerRates,
      pricingConfig: option === 'custom' ? pricingConfig : {
        smallContainerPrice: 0,
        largeContainerPrice: 0,
        defaultFrequency: '1x/week',
        frequencyDiscounts: {
          twoThreeTimesWeek: 0,
          fourTimesWeek: 0
        },
        franchiseFee: 0,
        tax: 8.25,
        deliveryFee: 75,
        fuelSurcharge: 0,
        extraPickupRate: 0,
        additionalFees: [],
        containerSpecificPricingRules: [],
        globalPricingRules: []
      },
      regionalPricingData: option === 'regional-brain' ? regionalPricingData : null,
    };
    updatePricingLogic(logic);

    saveData({
      selectedOption: option,
      brokerFile: brokerFile,
      brokerRates: brokerRates,
      pricingConfig: option === 'custom' ? pricingConfig : {
        smallContainerPrice: 0,
        largeContainerPrice: 0,
        defaultFrequency: '1x/week',
        frequencyDiscounts: {
          twoThreeTimesWeek: 0,
          fourTimesWeek: 0
        },
        franchiseFee: 0,
        tax: 8.25,
        deliveryFee: 75,
        fuelSurcharge: 0,
        extraPickupRate: 0,
        additionalFees: [],
        containerSpecificPricingRules: [],
        globalPricingRules: []
      },
      isConfigured: false,
      regionalPricingData: option === 'regional-brain' ? regionalPricingData : null,
    });
  }, [serviceAreaVerification, updatePricingLogic, pricingConfig, brokerFile, brokerRates, regionalPricingData, saveData]);

  const handleContinue = () => {
    console.log('🚀 [PricingSetup] handleContinue called - validation check:', {
      isConfigured,
      selectedOption,
      globalPricingRulesCount: pricingConfig.globalPricingRules?.length || 0,
      comprehensiveFormValid
    });
    
    if (isConfigured) {
      onContinue();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Locations Reference Section */}
      {serviceAreaVerification && serviceAreaVerification.results && serviceAreaVerification.results.length > 0 && (
        <LocationsReference
          serviceable={verifiedServiceableLocations}
          nonServiceable={verifiedNotServiceableLocations}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-gray-600 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pricing Setup</h2>
            <p className="text-gray-600 text-sm mt-1">
              Choose how you want to configure pricing for your locations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regional Pricing Brain */}
          <div
            onClick={() => handleSelectOption('regional-brain')}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedOption === 'regional-brain' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-500'}`}
          >
            <div className="flex items-center mb-4">
              <Brain className={`h-8 w-8 mr-4 ${selectedOption === 'regional-brain' ? 'text-blue-600' : 'text-gray-500'}`} />
              <div>
                <h4 className="text-lg font-bold text-gray-900">Regional Pricing Brain</h4>
                <p className="text-sm text-gray-600">Will auto-activate when serviceable locations are detected</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 pl-2">
              <li>• NTX Rate Sheet: Dallas/Fort Worth region</li>
              <li>• CTX Rate Sheet: San Antonio/San Marcos/Austin region</li>
              <li>• STX Rate Sheet: Houston region</li>
            </ul>
          </div>

          {/* Custom Pricing */}
          <div
            onClick={() => handleSelectOption('custom')}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedOption === 'custom' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-500'}`}
          >
            <div className="flex items-center mb-4">
              <DollarSign className={`h-8 w-8 mr-4 ${selectedOption === 'custom' ? 'text-blue-600' : 'text-gray-500'}`} />
              <div>
                <h4 className="text-lg font-bold text-gray-900">Custom Pricing</h4>
                <p className="text-sm text-gray-600">Create your own pricing rules</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 pl-2">
              <li>• Set container-specific pricing</li>
              <li>• Configure frequency discounts</li>
              <li>• Add custom fees and surcharges</li>
            </ul>
          </div>
        </div>

        {/* Regional Brain Supplementary Costs */}
        {selectedOption === 'regional-brain' && franchisedCityLocations.length > 0 && (
          <div className="mt-8">
            <FranchisedCitySupplementaryForm
              franchisedCityLocations={franchisedCityLocations}
              onSupplementaryPricingUpdate={(pricing) => setRegionalBrainSupplementary(pricing)}
              initialPricing={regionalBrainSupplementary}
              pricingType="regional-brain"
            />
          </div>
        )}

        {/* Custom Pricing Form */}
        {selectedOption === 'custom' && (
          <div className="mt-8">
            <CustomPricingForm
              pricingConfig={pricingConfig}
              onPricingConfigUpdate={handlePricingConfigUpdate}
              isSingleLocation={isSingleLocation}
              serviceAreaVerification={serviceAreaVerification}
            />
          </div>
        )}

        {/* Custom Mode Supplementary Costs */}
        {selectedOption === 'custom' && franchisedCityLocations.length > 0 && (
          <div className="mt-8">
            <FranchisedCitySupplementaryForm
              franchisedCityLocations={franchisedCityLocations}
              onSupplementaryPricingUpdate={(pricing) => setFranchisedCitySupplementary(pricing)}
              initialPricing={franchisedCitySupplementary}
              pricingType="custom"
            />
          </div>
        )}

        {/* Regional Brain File Upload (if regional brain is selected but not active) */}
        {selectedOption === 'regional-brain' && !regionalBrainActive && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Upload Regional Rate Sheet (Optional)</h3>
            <p className="text-blue-700 mb-4">
              If you have a custom regional rate sheet, you can upload it here. Otherwise, the built-in regional pricing data will be used.
            </p>
            <FileUpload
              onFileUpload={handleRegionalBrainFileUpload}
              accept=".csv"
              title="Upload Regional Rate Sheet"
              description="Upload a CSV file containing regional rate sheets."
            />
          </div>
        )}


        {/* Broker Rates Display - Hidden when regional brain is active */}
        {brokerRates.length > 0 && selectedOption !== 'regional-brain' && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Broker Rates</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {brokerRates.slice(0, 5).map((rate, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rate.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.containerSize}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rate.baseRate.toFixed(2)}</td>
                    </tr>
                  ))}
                  {brokerRates.length > 5 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        ... {brokerRates.length - 5} more rates
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Continue Button Section */}
      <div className="mt-8">
        {/* Debug Information */}
        <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-md">
          <p className="text-xs text-gray-700">
            <strong>Debug - Button Visibility:</strong> isConfigured={isConfigured.toString()},
            selectedOption={selectedOption},
            isSingleLocation={isSingleLocation?.toString()},
            hasGlobalRules={pricingConfig.globalPricingRules?.length || 0},
            smallContainerPrice={pricingConfig.smallContainerPrice},
            largeContainerPrice={pricingConfig.largeContainerPrice}
          </p>
        </div>

        {isConfigured ? (
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center shadow-lg"
            >
              Continue to Quote Generation <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <div className="text-sm text-gray-500 bg-gray-50 border border-gray-300 rounded-lg px-6 py-3">
              {selectedOption === 'custom'
                ? isSingleLocation
                  ? 'Please enter a valid Price/YD to continue'
                  : 'Please add at least one pricing rule to continue'
                : 'Please complete pricing configuration to continue'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
