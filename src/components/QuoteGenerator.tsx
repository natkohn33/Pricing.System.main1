import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { PricingEngine } from '../utils/pricingEngine';
import { ServiceAreaVerificationData, Quote, ServiceRequest } from '../types';

interface QuoteGeneratorProps {
  pricingEngine: PricingEngine;
  serviceAreaVerification: ServiceAreaVerificationData;
  onQuotesGenerated: (allProcessedQuotes: Quote[]) => void;
}

const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({
  pricingEngine,
  serviceAreaVerification,
  onQuotesGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateQuotes = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const allProcessedQuotes: Quote[] = [];

      // CRITICAL FIX: Process ALL locations from verification data to maintain 1:1 import/export ratio
      // and preserve original import order
      const allLocations = serviceAreaVerification.results;

      console.log('🚀 Starting quote generation for', allLocations.length, 'total locations (including non-serviceable)');
      console.log('📊 Location breakdown:', {
        total: allLocations.length,
        serviceable: allLocations.filter(r => r.status === 'serviceable').length,
        notServiceable: allLocations.filter(r => r.status === 'not-serviceable').length,
        manualReview: allLocations.filter(r => r.status === 'manual-review').length
      });

      // CRITICAL FIX: Process ALL locations in exact original import order to maintain 1:1 correspondence
      for (let i = 0; i < allLocations.length; i++) {
        const location = allLocations[i];
        
        // Update progress
        setGenerationProgress(Math.round(((i + 1) / allLocations.length) * 100));

        try {
          // Convert service area result to service request - preserve original data
          const serviceRequest: ServiceRequest = {
            id: location.id,
            customerName: location.companyName || `Location ${i + 1}`,
            address: location.address,
            city: location.city,
            state: location.state,
            zipCode: location.zipCode,
            equipmentType: location.equipmentType || 'Front-Load Container',
            containerSize: location.containerSize || '8YD',
            frequency: location.frequency || '1x/week',
            materialType: location.materialType || 'Solid Waste',
            addOns: location.addOns || [],
            notes: '',
            binQuantity: location.binQuantity || 1
          };

          console.log('💰 Generating quote for location:', {
            id: location.id,
            originalIndex: i + 1,
            company: serviceRequest.customerName,
            address: serviceRequest.address,
            city: serviceRequest.city,
            status: location.status,
            service: `${serviceRequest.containerSize} ${serviceRequest.equipmentType} - ${serviceRequest.frequency}`
          });

          // CRITICAL FIX: Create quote objects for ALL locations to maintain 1:1 import/export ratio
          let quote: Quote;
          
          if (location.status === 'serviceable') {
            // Generate quote using pricing engine for serviceable locations
            quote = await pricingEngine.generateQuote(serviceRequest);
          } else {
            // Create failed quote for non-serviceable/manual-review locations to maintain 1:1 ratio
            quote = {
              id: `non-serviceable-${location.id}`,
              serviceRequest,
              matchedRate: null,
              pricingSource: 'Not Serviceable',
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
              extraPickupRate: 0,
              failureReason: location.failureReason || `${location.city}, ${location.state} is not in our service area`
            };
          }

          // CRITICAL FIX: Push ALL quotes to single array to preserve exact import order
          allProcessedQuotes.push(quote);
          
          if (quote.status === 'success') {
            console.log('✅ Quote generated successfully:', {
              id: quote.id,
              originalIndex: i + 1,
              arrayIndex: allProcessedQuotes.length - 1,
              totalCost: quote.totalMonthlyCost,
              pricingSource: quote.pricingSource
            });
          } else {
            console.log('❌ Quote generation failed:', {
              id: quote.id,
              originalIndex: i + 1,
              arrayIndex: allProcessedQuotes.length - 1,
              reason: quote.failureReason
            });
          }

        } catch (error) {
          console.error('❌ Error generating quote for location:', location.id, error);
          
          // Create failed quote for this location to maintain 1:1 ratio
          const failedQuote: Quote = {
            id: `failed-${location.id}`,
            serviceRequest: {
              id: location.id,
              customerName: location.companyName || `Location ${i + 1}`,
              address: location.address,
              city: location.city,
              state: location.state,
              zipCode: location.zipCode,
              equipmentType: location.equipmentType || 'Front-Load Container',
              containerSize: location.containerSize || '8YD',
              frequency: location.frequency || '1x/week',
              materialType: location.materialType || 'Solid Waste',
              addOns: location.addOns || [],
              notes: '',
              binQuantity: location.binQuantity || 1
            },
            matchedRate: null,
            pricingSource: 'Not Found',
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
            failureReason: error instanceof Error ? error.message : 'Unknown error occurred'
          };
          
          // CRITICAL FIX: Push to single array to preserve exact import order
          allProcessedQuotes.push(failedQuote);
        }

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const successfulCount = allProcessedQuotes.filter(q => q.status === 'success').length;
      const failedCount = allProcessedQuotes.filter(q => q.status === 'failed').length;
      
      console.log('🎯 CRITICAL: Quote generation complete with PERFECT ORDER PRESERVATION:', {
        totalProcessed: allLocations.length,
        successful: successfulCount,
        failed: failedCount,
        totalExported: allProcessedQuotes.length,
        successRate: `${Math.round((successfulCount / allLocations.length) * 100)}%`,
        CRITICAL_DATA_INTEGRITY_CHECK: {
          importCount: allLocations.length,
          exportCount: allProcessedQuotes.length,
          isComplete: allProcessedQuotes.length === allLocations.length,
          REQUIREMENT_1_COMPLETE_EXPORT: allProcessedQuotes.length === allLocations.length ? 'PASSED' : 'FAILED',
          REQUIREMENT_2_ORDER_PRESERVED: 'PERFECT - Single array maintains exact import sequence',
          firstQuoteId: allProcessedQuotes[0]?.serviceRequest.id,
          lastQuoteId: allProcessedQuotes[allProcessedQuotes.length - 1]?.serviceRequest.id
        }
      });

      // CRITICAL VALIDATION: Ensure 1:1 location count match
      if (allProcessedQuotes.length !== allLocations.length) {
        console.error('🚨 CRITICAL ERROR: Export count does not match import count!', {
          imported: allLocations.length,
          exported: allProcessedQuotes.length,
          missing: allLocations.length - allProcessedQuotes.length
        });
        alert('Critical Error: Export count does not match import count. Please check the console for details.');
        return;
      }

      // CRITICAL FIX: Pass single ordered array to maintain perfect import order
      onQuotesGenerated(allProcessedQuotes);

    } catch (error) {
      console.error('❌ Critical error during quote generation:', error);
      alert('An error occurred during quote generation. Please check the console for details.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const allLocationsCount = serviceAreaVerification.results.length;
  const serviceableCount = serviceAreaVerification.results.filter(r => r.status === 'serviceable').length;
  const notServiceableCount = serviceAreaVerification.results.filter(r => r.status === 'not-serviceable').length;
  const manualReviewCount = serviceAreaVerification.results.filter(r => r.status === 'manual-review').length;

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calculator className="mr-3 text-blue-600" size={28} />
                Quote Generator
              </h2>
              <p className="text-gray-600 mt-2">
                Generate quotes for your verified service locations using configured pricing logic
              </p>
            </div>
          </div>

          {/* Service Area Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{allLocationsCount}</div>
              <div className="text-sm text-blue-700">Total Locations</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{serviceableCount}</div>
              <div className="text-sm text-green-700">Will Get Quotes</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{notServiceableCount + manualReviewCount}</div>
              <div className="text-sm text-red-700">Tracked Only</div>
            </div>
          </div>

          {/* Pricing Engine Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Pricing Engine Status</h3>
            <div className="text-sm text-blue-700">
              <p>• Pricing Logic: {pricingEngine.getPricingLogic()?.type || 'Not configured'}</p>
              {pricingEngine.getPricingLogic()?.type === 'custom' && (
                <p>• Custom Rules: {pricingEngine.getPricingLogic()?.customRules?.length || 0} configured</p>
              )}
              {pricingEngine.getPricingLogic()?.type === 'regional-brain' && (
                <p>• Regional Rate Sheets: {pricingEngine.getPricingLogic()?.regionalPricingData?.rateSheets?.length || 0} loaded</p>
              )}
              {pricingEngine.getPricingLogic()?.type === 'broker' && (
                <p>• Broker Rates: {pricingEngine.getPricingLogic()?.brokerRates?.length || 0} loaded</p>
              )}
            </div>
          </div>

          {/* Generate Quotes Button */}
          <div className="text-center">
            <Button
              onClick={generateQuotes}
              disabled={isGenerating || allLocationsCount === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Quotes... {generationProgress}%
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Generate Quotes for {allLocationsCount} Locations
                </>
              )}
            </Button>
            
            {allLocationsCount === 0 && (
              <p className="text-red-600 text-sm mt-2">
                No locations found. Please complete service area verification first.
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-6">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Processing location {Math.ceil((generationProgress / 100) * allLocationsCount)} of {allLocationsCount}
              </p>
            </div>
          )}

          {/* Sample Data Table (for reference) */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Output Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-2 py-2 text-left">Address</th>
                    <th className="border px-2 py-2 text-left">City</th>
                    <th className="border px-2 py-2 text-left">State</th>
                    <th className="border px-2 py-2 text-left">Zip Code</th>
                    <th className="border px-2 py-2 text-left">Equipment</th>
                    <th className="border px-2 py-2 text-left">Frequency</th>
                    <th className="border px-2 py-2 text-left">Container</th>
                    <th className="border px-2 py-2 text-left">Bin Qty</th>
                    <th className="border px-2 py-2 text-left">Status</th>
                    <th className="border px-2 py-2 text-left">Franchise Fee</th>
                    <th className="border px-2 py-2 text-left">Sales Tax (8.25%)</th>
                    <th className="border px-2 py-2 text-left">Fuel Surcharge</th>
                    <th className="border px-2 py-2 text-left">Add-ons</th>
                    <th className="border px-2 py-2 text-left">Monthly Base Rate</th>
                    <th className="border px-2 py-2 text-left">Total Monthly Cost</th>
                    <th className="border px-2 py-2 text-left">Total Monthly Cost</th>
                    <th className="border px-2 py-2 text-left">Delivery Fee</th>
                    <th className="border px-2 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-2 text-gray-500 italic" colSpan={17}>
                      Click "Generate Quotes" to populate this table with your quote results
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteGenerator;