import React, { useState } from 'react';
import { PricingLogic, ServiceAreaVerificationData, PricingConfig } from '../types';
import { PricingEngine } from '../utils/pricingEngine';
import { ServiceAreaVerification as ServiceAreaVerificationComponent } from './ServiceAreaVerification';
import { PricingSetup } from './PricingSetup';
import { ProcessingOptions } from './ProcessingOptions';
import { QuoteGeneration } from './QuoteGeneration';
import { Calculator, Settings, BarChart3, Zap, MapPin } from 'lucide-react';

export function Dashboard() {
  const [currentStep, setCurrentStep] = useState<'verification' | 'setup' | 'processing'>('verification');
  const [serviceAreaVerification, setServiceAreaVerification] = useState<ServiceAreaVerificationData | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [pricingLogic, setPricingLogic] = useState<PricingLogic | null>(null);
  const [pricingEngine] = useState(() => new PricingEngine());
  
  // Maintain user data between steps
  const [savedPricingSetupData, setSavedPricingSetupData] = useState<{
    selectedOption: 'broker' | 'custom' | null;
    brokerFile: File | null;
    brokerRates: any[];
    customRules: any[];
    pricingConfig: PricingConfig;
    isConfigured: boolean;
  }>({
    selectedOption: null,
    brokerFile: null,
    brokerRates: [],
    customRules: [],
    pricingConfig: {
      smallContainerPrice: 0,
      largeContainerPrice: 0,
      defaultFrequency: '1x/week',
      frequencyDiscounts: {
        twoThreeTimesWeek: 0,
        fourTimesWeek: 0
      },
      franchiseFee: 0,
      tax: 0,
      deliveryFee: 0,
      fuelSurcharge: 15,
      extraPickupRate: 0,
      additionalFees: [],
      containerSpecificPricingRules: []
    },
    isConfigured: false
  });

  const handleServiceAreaVerificationComplete = (verification: ServiceAreaVerificationData) => {
    console.log('📊 [Dashboard] handleServiceAreaVerificationComplete called:', {
      totalProcessed: verification.totalProcessed,
      serviceableCount: verification.serviceableCount,
      notServiceableCount: verification.notServiceableCount,
      manualReviewCount: verification.manualReviewCount
    });
    setServiceAreaVerification(verification);
    // CRITICAL FIX: Ensure pricing engine has access to service area data for proper single location detection
    pricingEngine.setServiceAreaData(verification);
    console.log('🔧 [Dashboard] Service area data set in pricing engine for single location detection:', {
      totalProcessed: verification.totalProcessed,
      serviceableCount: verification.serviceableCount,
      isSingleLocation: verification.totalProcessed === 1
    });
  };

  const handleContinueToSetup = () => {
    console.log('🎯 [Dashboard] handleContinueToSetup called - transitioning to setup step');
    console.log('🎯 [Dashboard] Current step before change:', currentStep);
    console.log('🎯 [Dashboard] Service area verification state:', {
      hasVerification: !!serviceAreaVerification,
      serviceableCount: serviceAreaVerification?.serviceableCount || 0
    });
    setCurrentStep('setup');
    console.log('🎯 [Dashboard] Step transition initiated to: setup');
  };

  const handlePricingLogicSet = (logic: PricingLogic) => {
    console.log('🔧 [Dashboard] handlePricingLogicSet called:', logic);
    setPricingLogic(logic);
    pricingEngine.setPricingLogic(logic);
    
    // Set regional pricing data if available
    if (logic.regionalPricingData) {
      pricingEngine.setRegionalPricingData(logic.regionalPricingData);
      console.log('🧠 Regional pricing data set in pricing engine:', logic.regionalPricingData);
    }
    
    // Enhanced logging for debugging
    console.log('🔧 ENHANCED: Pricing logic set in Dashboard with PPY verification:', {
      type: logic.type,
      hasCustomRules: logic.customRules?.length || 0,
      customRulesPPY: logic.customRules?.map(rule => ({
        id: rule.id,
        pricePerYard: rule.pricePerYard,
        equipmentType: rule.equipmentType,
        containerSize: rule.containerSize
      })) || [],
      hasBrokerRates: logic.brokerRates?.length || 0,
      hasPricingConfig: !!logic.pricingConfig,
      pricingConfigDetails: logic.pricingConfig ? {
        smallContainerPrice: logic.pricingConfig.smallContainerPrice,
        largeContainerPrice: logic.pricingConfig.largeContainerPrice,
        franchiseFee: logic.pricingConfig.franchiseFee,
        tax: logic.pricingConfig.tax
      } : null,
      hasRegionalPricingData: !!logic.regionalPricingData,
      additionalFeesCount: logic.pricingConfig?.additionalFees?.length || 0,
      additionalFees: logic.pricingConfig?.additionalFees?.map(fee => ({
        category: fee.category,
        price: fee.price,
        frequency: fee.frequency,
        assignedDivisions: fee.assignedDivisions
      })) || [],
      containerSpecificRulesCount: logic.pricingConfig?.containerSpecificPricingRules?.length || 0,
      containerSpecificRules: logic.pricingConfig?.containerSpecificPricingRules?.map(rule => ({
        id: rule.id,
        containerSize: rule.containerSize,
        equipmentType: rule.equipmentType,
        pricePerYard: rule.pricePerYard
      })) || []
    });
  };

  const handlePricingSetupDataSave = React.useCallback((data: any) => {
    console.log('💾 [Dashboard] handlePricingSetupDataSave called:', data);
    setSavedPricingSetupData(data);
  }, []);

  const handleContinueToProcessing = () => {
    console.log('🚀 [Dashboard] handleContinueToProcessing called - transitioning to processing step');
    setCurrentStep('processing');
  };

  const handleBackToVerification = () => {
    console.log('⬅️ [Dashboard] handleBackToVerification called');
    setCurrentStep('verification');
  };

  const handleBackToSetup = () => {
    console.log('⬅️ [Dashboard] handleBackToSetup called');
    setCurrentStep('setup');
  };

  // Error boundary for PricingSetup component
  const renderPricingSetup = () => {
    try {
      return (
        <PricingSetup
          onPricingLogicSet={handlePricingLogicSet}
          onContinue={handleContinueToProcessing}
          serviceAreaVerification={serviceAreaVerification}
          uploadedFileName={uploadedFileName}
          savedData={savedPricingSetupData}
          onDataSave={handlePricingSetupDataSave}
        />
      );
    } catch (error) {
      console.error('❌ [Dashboard] Error rendering PricingSetup component:', error);
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Pricing Setup</h3>
          <p className="text-red-700 mb-4">
            There was an error loading the pricing setup component. Please check the console for more details.
          </p>
          <button
            onClick={handleBackToVerification}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Back to Verification
          </button>
        </div>
      );
    }
  };

  console.log('🔄 [Dashboard] Rendering with currentStep:', currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Frontier Waste Solutions Smart Pricing Tool</h1>
              <p className="text-gray-600 mt-2">
                Intelligent pricing analyzer with customizable logic and bulk processing capabilities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Current Step: <span className="font-medium capitalize">{currentStep}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className={`flex items-center space-x-2 ${
                currentStep === 'verification' ? 'text-blue-600' : 
                currentStep === 'setup' || currentStep === 'processing' ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'verification' ? 'bg-blue-100' : 
                  currentStep === 'setup' || currentStep === 'processing' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {currentStep === 'verification' ? (
                    <MapPin className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">✓</span>
                  )}
                </div>
                <span className="font-medium">Service Area Verification</span>
              </div>
              
              <div className={`w-12 h-0.5 ${currentStep === 'setup' || currentStep === 'processing' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center space-x-2 ${
                currentStep === 'setup' ? 'text-blue-600' : 
                currentStep === 'processing' ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'setup' ? 'bg-blue-100' : 
                  currentStep === 'processing' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {currentStep === 'setup' ? (
                    <Settings className="h-4 w-4" />
                  ) : currentStep === 'processing' ? (
                    <span className="text-sm font-medium">✓</span>
                  ) : (
                    <Settings className="h-4 w-4" />
                  )}
                </div>
                <span className="font-medium">Step 1: Choose Pricing Logic</span>
              </div>
              
              <div className={`w-12 h-0.5 ${currentStep === 'processing' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center space-x-2 ${
                currentStep === 'processing' ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'processing' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="font-medium">Step 2: Generate Quotes</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {currentStep === 'setup' && (
                <button
                  onClick={handleBackToVerification}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  ← Back to Verification
                </button>
              )}
              {currentStep === 'processing' && (
                <button
                  onClick={handleBackToSetup}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  ← Back to Setup
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {/* Service Area Verification */}
        {currentStep === 'verification' && (
          <ServiceAreaVerificationComponent
            onVerificationComplete={handleServiceAreaVerificationComplete}
            onContinue={() => {
              console.log('🔗 [Dashboard] onContinue prop callback triggered from ServiceAreaVerification');
              handleContinueToSetup();
            }}
            onFileNameUpdate={setUploadedFileName}
          />
        )}

        {/* Pricing Setup */}
        {currentStep === 'setup' && (
          <div>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Debug Info:</strong> Rendering Pricing Setup component. 
                Service Area Data: {serviceAreaVerification ? `${serviceAreaVerification.serviceableCount} serviceable locations` : 'None'}
              </p>
            </div>
            {renderPricingSetup()}
          </div>
        )}

        {/* Processing Mode */}
        {currentStep === 'processing' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Step 2: Generate Quotes</h2>
                <p className="text-gray-600 mt-1">
                  Generate quotes for your verified service locations using your configured pricing logic
                </p>
              </div>
            </div>
            
            {serviceAreaVerification && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Service Area Verified: {serviceAreaVerification.serviceableCount} of {serviceAreaVerification.totalProcessed} locations serviceable
                </p>
                <p className="text-green-700 text-sm mt-1">Coverage: {((serviceAreaVerification.serviceableCount / serviceAreaVerification.totalProcessed) * 100).toFixed(1)}%</p>
              </div>
            )}
            
            {pricingLogic && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  Active Pricing Logic: {pricingLogic.type === 'broker' ? 'Broker Upload' : pricingLogic.type === 'regional-brain' ? 'Regional Pricing Brain' : 'Custom Division Logic'}
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  {pricingLogic.type === 'broker' 
                    ? `Using ${pricingLogic.brokerRates?.length || 0} broker pricing records`
                    : pricingLogic.type === 'regional-brain'
                    ? `Using regional pricing data with ${pricingLogic.regionalPricingData?.rateSheets?.length || 0} rate sheets`
                    : `Using ${pricingLogic.customRules?.length || 0} custom pricing rules`
                  }
                </p>
              </div>
            )}
            
            <QuoteGeneration pricingEngine={pricingEngine} serviceAreaVerification={serviceAreaVerification} />
          </div>
        )}
      </div>
    </div>
  );
}
