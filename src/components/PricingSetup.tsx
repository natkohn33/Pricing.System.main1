import React, { useState, useCallback, useMemo, useRef } from 'react';
import { PricingLogic, RateData, CustomPricingRule, PricingConfig, ServiceAreaVerificationData, RegionalPricingData, FranchisedCitySupplementaryPricing } from '../types';
import { parseCSV, detectColumns, parseRateData, parseRegionalRateSheets } from '../utils/csvParser';
import { FileUpload } from './FileUpload';
import { CustomPricingForm } from './CustomPricingForm';
import { FranchisedCitySupplementaryForm } from './FranchisedCitySupplementaryForm';
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
        ...savedData,
        selectedOption: 'broker',
        brokerFile: file,
        brokerRates: rates,
        customRules: [],
        isConfigured: true
      });
    } catch (error) {
      console.error('Error parsing broker rates:', error);
      alert('Error parsing the CSV file. Please check the format and try again.');
    }
  }, [updatePricingLogic, saveData, savedData]);

  const handleDivisionToggle = useCallback((enabled: boolean) => {
    setEnableDivisionPricing(enabled);
    if (!enabled) {
      setSelectedDivisions([]);
    }
  }, []);

  const handleDivisionSelection = useCallback((division: string) => {
    setSelectedDivisions(prev => {
      if (prev.includes(division)) {
        return prev.filter(d => d !== division);
      } else {
        return [...prev, division];
      }
    });
  }, []);

  const clearBrokerData = useCallback(() => {
    setBrokerFile(null);
    setBrokerRates([]);
    setIsConfigured(false);
    
    // Clear saved data
    saveData({
      ...savedData,
      selectedOption: null,
      brokerFile: null,
      brokerRates: [],
      customRules: [],
      isConfigured: false
    });
  }, [saveData, savedData]);

  const handleFranchisedCitySupplementaryUpdate = useCallback((supplementaryPricing: FranchisedCitySupplementaryPricing) => {
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
      updatePricingLogic(updatedLogic);
      
      console.log('🏛️ Updated pricing logic with franchised city supplementary costs:', {
        cityName: supplementaryPricing.cityName,
        supplementaryCostsCount: supplementaryPricing.supplementaryCosts.length
      });
    }
  }, [pricingLogicState, updatePricingLogic]);

  return (
    <div className="space-y-8">
      {/* Serviceable Locations Reference */}
      {allVerificationLocations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                All Locations Reference
              </h3>
              <p className="text-gray-600 mt-1">
                Review all {allVerificationLocations.length} location{allVerificationLocations.length !== 1 ? 's' : ''} ({verifiedServiceableLocations.length} serviceable, {verifiedNotServiceableLocations.length} not serviceable) while configuring pricing logic
              </p>
            </div>
          </div>

          {/* Continue Button - Fixed and Optimized */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!isConfigured}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-colors ${
                isConfigured
                  ? 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  : 'text-gray-400 bg-gray-200 cursor-not-allowed'
              }`}
            >
              Continue to Quote Generation
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
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

        {/* Pricing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Regional Pricing Brain */}
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
            </div>
          </div>

          {/* Option 2: Custom Pricing */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedOption === 'custom' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption('custom')}
          >
            <div className="flex items-center mb-4">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Custom Pricing</h3>
                <p className="text-sm text-gray-600">Create your own pricing rules</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Set container-specific pricing</p>
              <p>• Configure frequency discounts</p>
              <p>• Add custom fees and surcharges</p>
            </div>
          </div>
        </div>

        {/* Custom Pricing Form */}
        {selectedOption === 'custom' && (
          <div className="mt-8">
            <CustomPricingForm
              onRulesUpdate={handleManualRulesUpdate}
              onPricingConfigUpdate={handlePricingConfigUpdate}
              serviceAreaVerification={serviceAreaVerification}
              initialRules={manualRules}
              initialConfig={pricingConfig}
            />
          </div>
        )}

        {/* Regional Brain File Upload */}
        {selectedOption === 'regional-brain' && !regionalBrainActive && (
          <div className="mt-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Brain className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Upload Regional Rate Sheets</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Upload a CSV file containing regional rate sheets for NTX, CTX, and STX regions
                  </p>
                </div>
                <div className="mt-6">
                  <FileUpload
                    onFileUpload={handleRegionalBrainFileUpload}
                    acceptedTypes=".csv"
                    maxSize={10}
                    label="Upload Regional Rate Sheets CSV"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Single Location Generate Quotes Button */}
      {isSingleLocation && showSingleLocationGenerateButton && (isConfigured || savedData?.isConfigured) && (
        <div className="bg-white border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Generate Quote</h3>
              <p className="text-gray-600">
                Single location pricing configuration applied. Click "Generate Quote" to proceed to Step 2 and calculate the final pricing.
              </p>
            </div>
            <button
              onClick={handleContinue}
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
