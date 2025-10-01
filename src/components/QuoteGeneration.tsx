import React from 'react';
import { PricingEngine } from '../utils/pricingEngine';
import { ServiceAreaVerificationData } from '../types';
import QuoteGenerator from './QuoteGenerator';
import { QuotePreview } from './QuotePreview';
import EnhancedQuoteGenerator from './EnhancedQuoteGenerator';
import { BarChart3 } from 'lucide-react';

interface QuoteGenerationProps {
  pricingEngine: PricingEngine;
  serviceAreaVerification: ServiceAreaVerificationData | null;
}

export function QuoteGeneration({ pricingEngine, serviceAreaVerification }: QuoteGenerationProps) {
  const [allProcessedQuotes, setAllProcessedQuotes] = React.useState<any[]>([]);
  const [showEnhancedGenerator, setShowEnhancedGenerator] = React.useState(false);
  const [hasGeneratedQuotes, setHasGeneratedQuotes] = React.useState(false);

  const handleQuotesUpdated = (updatedQuotes: any[]) => {
    // This callback receives the updated quotes from QuotePreview
    // and updates the main state, which will then re-render QuotePreview with the latest data
    setAllProcessedQuotes(updatedQuotes);
    console.log('📊 Quotes updated from QuotePreview:', updatedQuotes.length);
  };

  // **ENHANCED DEBUG: Add debugging for additional fees when component mounts**
  React.useEffect(() => {
    if (pricingEngine) {
      console.log('🔧 QUOTE GENERATION: Component mounted with pricing engine');
      console.log('🔧 PRICING ENGINE DEBUG:', {
        hasPricingLogic: !!pricingEngine.getPricingLogic(),
        pricingLogicType: pricingEngine.getPricingLogic()?.type,
        hasCustomRules: !!(pricingEngine.getPricingLogic()?.customRules?.length),
        customRulesCount: pricingEngine.getPricingLogic()?.customRules?.length || 0,
        hasPricingConfig: !!pricingEngine.getPricingLogic()?.pricingConfig
      });

      // Test fee source identification
      const feeSource = pricingEngine.identifyFeeSource();
      console.log('📍 FEE SOURCE IDENTIFICATION:', feeSource);

      // Create a sample request to test additional fees detection
      const sampleRequest = {
        customerName: 'Test Customer',
        city: 'Houston',
        state: 'TX',
        equipmentType: 'front load',
        containerSize: '8 YD',
        frequency: '1x/week',
        materialType: 'solid waste',
        binQuantity: 1,
        additionalServices: ['lock service', 'cleaning service'] // Test with sample services
      };

      console.log('🧪 TESTING SAMPLE REQUEST FOR ADDITIONAL FEES:');
      const debugInfo = pricingEngine.debugAdditionalFees(sampleRequest);
      console.log('✅ SAMPLE DEBUG RESULT:', debugInfo);
    }
  }, [pricingEngine]);

  const handleQuotesGenerated = (processedQuotes: any[]) => {
    setAllProcessedQuotes(processedQuotes);
    setHasGeneratedQuotes(true);
  };

  const handleCustomizeReport = () => {
    setShowEnhancedGenerator(true);
  };

  const handleReturnToPricing = () => {
    setHasGeneratedQuotes(false);
    setAllProcessedQuotes([]);
  };

  if (!serviceAreaVerification) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Service Area Data</h4>
        <p className="text-gray-600">
          Please complete service area verification first to generate quotes
        </p>
      </div>
    );
  }

  // ADD THIS NEW CHECK FOR PRICING ENGINE:
  if (!pricingEngine) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Pricing Engine Not Ready</h4>
        <p className="text-gray-600">
          Please configure pricing logic first to generate quotes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showEnhancedGenerator ? (
        <div>
          <button
            onClick={() => setShowEnhancedGenerator(false)}
            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            ← Back to Quote Preview
          </button>
          <EnhancedQuoteGenerator processedQuotes={allProcessedQuotes} />
        </div>
      ) : hasGeneratedQuotes ? (
        <QuotePreview
          processedQuotes={allProcessedQuotes}
          onReturnToPricing={handleReturnToPricing}
          onCustomizeReport={handleCustomizeReport}
          onQuotesUpdated={handleQuotesUpdated}
        />
      ) : (
        <QuoteGenerator 
          pricingEngine={pricingEngine} 
          serviceAreaVerification={serviceAreaVerification}
          onQuotesGenerated={handleQuotesGenerated}
        />
      )}
    </div>
  );
}