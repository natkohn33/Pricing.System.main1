import React, { useState, useCallback, useMemo, useRef } from 'react';
import { PricingLogic, RateData, CustomPricingRule, PricingConfig, ServiceAreaVerificationData, RegionalPricingData, FranchisedCitySupplementaryPricing } from '../types';
import { parseCSV, detectColumns, parseRateData, parseRegionalRateSheets } from '../utils/csvParser';
import { FileUpload } from './FileUpload';
import { CustomPricingForm } from './CustomPricingForm';
import { FranchisedCitySupplementaryForm } from './FranchisedCitySupplementaryForm';
import { isFranchisedCity, getFranchisedCityName } from '../utils/franchisedCityParser';
import { Settings, Upload, CreditCard as Edit3, ArrowRight, CheckCircle, XCircle, Brain, DollarSign, Plus, X } from 'lucide-react';
import { getBuiltInRegionalPricingData } from '../data/regionalRateSheets';
import { LocationsReference } from './LocationsReference';

interface PricingSetupProps {
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

export function PricingSetup({ onPricingLogicSet, onContinue, serviceAreaVerification, uploadedFileName, savedData, onDataSave }: PricingSetupProps) {
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
  
  // Use refs to track previous values and prevent unnecessary re-renders
  const prevLogicRef = useRef<PricingLogic | null>(null);
  const prevConfigRef = useRef<PricingConfig | null>(null);
  const prevManualRulesRef = useRef<CustomPricingRule[]>([]);
  
  // Local pricingConfig state initialized from savedData
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    const defaultPricingConfig: PricingConfig = {
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
    };
    return savedData?.pricingConfig ? { ...defaultPricingConfig, ...savedData.pricingConfig } : defaultPricingConfig;
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
  const saveData = useCallback((data: any) => {
    if (onDataSave) {
      onDataSave(data);
    }
  }, [onDataSave]);

  // Handle pricing config updates with debouncing
  const handlePricingConfigUpdate = useCallback((config: PricingConfig, isValid?: boolean) => {
    console.log('🔧 HANDLE_PRICING_CONFIG_UPDATE RECEIVED:', {
      receivedConfig: config,
      receivedIsValid: isValid,
      configSmallContainerPrice: config.smallContainerPrice
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
          customRules: manualRules,
          pricingConfig: config
        };
        updatePricingLogic(logic);
        
        // Calculate configuration state
        const isSingleLocationWorkflow = serviceAreaVerification?.totalProcessed === 1;
        const hasManualRules = manualRules.length > 0;
        const newConfigState = isSingleLocationWorkflow ? (isValid || false) : (hasManualRules || (isValid || false));
        
        if (newConfigState !== isConfigured) {
          setIsConfigured(newConfigState);
        }
        
        // Save data
        saveData({
          selectedOption: selectedOption,
          brokerFile: brokerFile,
          brokerRates: brokerRates,
          customRules: manualRules,
          pricingConfig: config,
          isConfigured: newConfigState
        });
      }
    }
  }, [selectedOption, manualRules, serviceAreaVerification?.totalProcessed, isConfigured, updatePricingLogic, saveData, brokerFile, brokerRates]);

  // Handle manual rules updates
  const handleManualRulesUpdate = useCallback((rules: CustomPricingRule[]) => {
    console.log('🔧 HANDLE_MANUAL_RULES_UPDATE:', { rulesCount: rules.length });
    
    const rulesString = JSON.stringify(rules);
    const prevRulesString = JSON.stringify(prevManualRulesRef.current);
    
    if (rulesString !== prevRulesString) {
      setManualRules(rules);
      prevManualRulesRef.current = rules;
      
      if (selectedOption === 'custom') {
        const logic: PricingLogic = {
          type: 'custom',
          customRules: rules,
          pricingConfig: pricingConfig
        };
        updatePricingLogic(logic);
        
        // Calculate configuration state
        const isSingleLocationWorkflow = serviceAreaVerification?.totalProcessed === 1;
        const hasManualRules = rules.length > 0;
        const newConfigState = isSingleLocationWorkflow ? comprehensiveFormValid : (hasManualRules || comprehensiveFormValid);
        
        if (newConfigState !== isConfigured) {
          setIsConfigured(newConfigState);
        }
        
        // Save data
        saveData({
          selectedOption: selectedOption,
          brokerFile: brokerFile,
          brokerRates: brokerRates,
          customRules: rules,
          pricingConfig: pricingConfig,
          isConfigured: newConfigState
        });
      }
    }
  }, [selectedOption, pricingConfig, serviceAreaVerification?.totalProcessed, comprehensiveFormValid, isConfigured, updatePricingLogic, saveData, brokerFile, brokerRates]);

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
      
      updatePricingLogic(logic);
      setIsConfigured(true);
      setRegionalBrainActive(true);
      
      // Save regional brain data for persistence
      saveData({
        selectedOption: selectedOption,
        brokerFile: null,
        brokerRates: [],
        customRules: [],
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
        
        // Update local pricing config with city-specific fees
        setPricingConfig(prevConfig => {
          const newConfig = {
            ...prevConfig,
            franchiseFee: franchiseFee,
            tax: salesTax
          };
          prevConfigRef.current = newConfig;
          return newConfig;
        });
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
        mostCommonSalesTax: `${mostCommonSalesTax}%`
      });
      
      // Update local pricing config with most common fees
      setPricingConfig(prevConfig => {
        const newConfig = {
          ...prevConfig,
          franchiseFee: mostCommonFranchiseFee,
          tax: mostCommonSalesTax
        };
        prevConfigRef.current = newConfig;
        return newConfig;
      });
    }
  }, [serviceAreaVerification, selectedOption]);

  // Memoized continue handler
  const handleContinue = useCallback(() => {
    console.log('🚀 Continue button clicked');
    onContinue();
  }, [onContinue]);

  // Other handlers remain the same but optimized
  const handleRegionalBrainFileUpload = useCallback(async (file: File) => {
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
      
      updatePricingLogic(logic);
      setIsConfigured(true);
      
      console.log('🧠 Regional pricing brain configured:', {
        totalSheets: regionalData.rateSheets.length,
        regions: regionalData.rateSheets.map(s => s.region)
      });
      
      // Save regional brain data for persistence
      saveData({
        selectedOption: 'regional-brain',
        brokerFile: null,
        brokerRates: [],
        customRules: [],
        pricingConfig,
        isConfigured: true,
        regionalPricingData: regionalData
      });
    } catch (error) {
      console.error('Error parsing regional rate sheets:', error);
      alert(`Error parsing the regional rate sheets CSV file: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the format and try again.`);
    }
  }, [updatePricingLogic, pricingConfig, saveData]);

  const handleBrokerFileUpload = useCallback(async (file: File) => {
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
      
      updatePricingLogic(logic);
      setIsConfigured(true);
      
      // Save broker data for persistence
      saveData({
        selectedOption: 'regional-brain',
        brokerFile: file,
        brokerRates: rates,
        customRules: [],
        pricingConfig,
        isConfigured: true
      });
    } catch (error) {
      console.error('Error parsing broker file:', error);
      alert(`Error parsing the broker CSV file: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the format and try again.`);
    }
  }, [updatePricingLogic, pricingConfig, saveData]);

  const handleCustomPricingSelection = useCallback(() => {
    setSelectedOption('custom');
    setIsConfigured(false); // Reset configured state when switching to custom
    setRegionalBrainActive(false);
    
    const logic: PricingLogic = {
      type: 'custom',
      customRules: manualRules,
      pricingConfig: pricingConfig
    };
    updatePricingLogic(logic);
    
    // Save data
    saveData({
      selectedOption: 'custom',
      brokerFile: null,
      brokerRates: [],
      customRules: manualRules,
      pricingConfig: pricingConfig,
      isConfigured: false
    });
  }, [manualRules, pricingConfig, updatePricingLogic, saveData]);

  const handleRegionalBrainSelection = useCallback(() => {
    setSelectedOption('regional-brain');
    setIsConfigured(false); // Reset configured state when switching to regional brain
    
    // Attempt to auto-activate if serviceable locations are already present
    if (serviceAreaVerification && serviceAreaVerification.serviceableCount > 0) {
      console.log('🧠 Attempting to auto-activate regional pricing brain on selection');
      const builtInData = getBuiltInRegionalPricingData();
      setRegionalPricingData(builtInData);
      
      const logic: PricingLogic = {
        type: 'regional-brain',
        brokerRates: [],
        regionalPricingData: builtInData,
        customRules: []
      };
      updatePricingLogic(logic);
      setIsConfigured(true);
      setRegionalBrainActive(true);
      
      // Save regional brain data for persistence
      saveData({
        selectedOption: 'regional-brain',
        brokerFile: null,
        brokerRates: [],
        customRules: [],
        pricingConfig: pricingConfig,
        isConfigured: true,
        regionalPricingData: builtInData
      });
    } else {
      // If no serviceable locations, keep it unconfigured until a file is uploaded or locations are verified
      const logic: PricingLogic = {
        type: 'regional-brain',
        brokerRates: [],
        customRules: []
      };
      updatePricingLogic(logic);
      setRegionalBrainActive(false);
      
      // Save data
      saveData({
        selectedOption: 'regional-brain',
        brokerFile: null,
        brokerRates: [],
        customRules: [],
        pricingConfig: pricingConfig,
        isConfigured: false
      });
    }
  }, [serviceAreaVerification, updatePricingLogic, pricingConfig, saveData]);

  const handleFranchisedCitySupplementaryUpdate = useCallback((data: FranchisedCitySupplementaryPricing) => {
    setFranchisedCitySupplementary(data);
    // You might want to update the overall pricing logic here as well
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pricing Setup</h1>

      {serviceAreaVerification && (
        <LocationsReference
          serviceableLocations={verifiedServiceableLocations}
          notServiceableLocations={verifiedNotServiceableLocations}
        />
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Choose Your Pricing Logic</h2>
        <p className="text-gray-600 mb-6">Configure your pricing logic using manual rules and optional advanced settings.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regional Pricing Brain Card */}
          <div
            className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${selectedOption === 'regional-brain' ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
            onClick={handleRegionalBrainSelection}
          >
            <div className="flex items-center mb-3">
              <Brain className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Regional Pricing Brain</h3>
            </div>
            <p className="text-gray-600 mb-4">Will auto-activate when serviceable locations are detected</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>• NTX Rate Sheet: Dallas/Fort Worth region</li>
              <li>• CTX Rate Sheet: San Antonio/San Marcos/Austin region</li>
              <li>• STX Rate Sheet: Houston region</li>
            </ul>
          </div>

          {/* Custom Pricing Card */}
          <div
            className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${selectedOption === 'custom' ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
            onClick={handleCustomPricingSelection}
          >
            <div className="flex items-center mb-3">
              <DollarSign className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Custom Pricing</h3>
            </div>
            <p className="text-gray-600 mb-4">Create your own pricing rules</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>• Set container-specific pricing</li>
              <li>• Configure frequency discounts</li>
              <li>• Add custom fees and surcharges</li>
            </ul>
          </div>
        </div>

        {selectedOption === 'custom' && (
          <div className="mt-8">
            <CustomPricingForm
              initialRules={manualRules}
              onRulesUpdate={handleManualRulesUpdate}
              serviceAreaVerification={serviceAreaVerification}
              isSingleLocation={isSingleLocation}
              pricingConfig={pricingConfig}
              onPricingConfigUpdate={handlePricingConfigUpdate}
            />
          </div>
        )}
      </div>

      {isConfigured && (
        <div className="flex justify-end mt-8">
          <button 
            onClick={handleContinue}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center"
          >
            Continue to Quote Generation <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function parseCSVWithHeaderDetection(text: string): { headers: string[], data: any[] } {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) {
    return { headers: [], data: [] };
  }
  const headers = lines[0].split(',').map(h => h.trim());
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] ? values[index].trim() : '';
      return obj;
    }, {} as any);
  });
  return { headers, data };
}
