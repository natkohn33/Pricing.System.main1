// Built-in Blum Municipal Contract Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const BLUM_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Blum',
  state: 'Texas',
  rates: [
    // Roll-off Dumpster Pricing - 20/30YD
    {
      id: 'blum-rolloff-20-30yd',
      city: 'Blum',
      state: 'Texas',
      containerSize: '20/30YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      dailyRate: 12.38,
      deliveryFee: 526.17,
      disposalFee: 61.90, // Per ton after included tons
      includedTons: 2, // First 2 tons included
      haulFee: 526.17,
      franchiseFee: 0, // NO FRANCHISE FEE
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'BLUM CITY'
    },

    // Roll-off Dumpster Pricing - 40YD
    {
      id: 'blum-rolloff-40yd',
      city: 'Blum',
      state: 'Texas',
      containerSize: '40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      dailyRate: 12.38,
      deliveryFee: 557.12,
      disposalFee: 61.90, // Per ton after included tons
      includedTons: 3, // First 3 tons included
      haulFee: 742.82,
      franchiseFee: 0,
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'BLUM CITY'
    }
  ],
  additionalNotes: [
    'RESIDENTIAL & COMMERCIAL IS BILLED THROUGH THE CITY',
    'RESIDENTIAL COLLECTION IS ONCE A WEEK ON MONDAY - HILLSBORO',
    'WE DO NOT OFFER RECYCLE IN BLUM',
    'ALL TRASH MUST BE IN CARTS WE PROVIDE',
    'ADDITIONAL CARTS ARE REQUESTED THROUGH THE CITY ONLY',
    '*BULK & BRUSH COLLECTION IS ONCE A MONTH ON THEIR LAST PICK UP DAY W/ A 3YD LIMIT',
    'RESIDENT MUST CONTACT CITY TO SCHEDULE PICK UP',
    'RESIDENTS CAN CONTACT FRONTIER OR CITY FOR MISSED TRASH - CONTACT SUPERVISOR',
    'DUMPSTERS ARE FL CONTAINERS. SET UP & ROUTE IN TRASH FLOW AS FOLLOWS: XF41T',
    'BILLING GROUP - MUNICIPAL FOR FRONT-LOAD DUMPSTERS',
    'BILLING GROUP - ROLL OFF FOR ROLL-OFF SERVICES',
    'TAX CODE - BLUM CITY',
    'NO FRANCHISE FEE',
    '*QUOTE MINI ROLL OFF USING ROLL OFF MATRIX SPREADSHEET- ZIP: 76627'
  ],
  serviceDetails: {
    residentialCollection: 'Once weekly (Monday) - Hillsboro',
    recycling: 'Not offered',
    bulkCollection: 'Once monthly on last pickup day with 3YD limit - must contact city to schedule',
    cartPolicy: 'City-provided carts only',
    dumpsterSetup: 'Set up & route in trash flow as follows: XF41T',
    miniRollOff: 'Quote using roll off matrix spreadsheet - ZIP: 76627'
  },
  billingInfo: {
    frontLoadBilling: 'MUNICIPAL',
    rollOffBilling: 'ROLL OFF',
    taxCode: 'BLUM CITY'
  },
  franchiseFee: 0,
  lastUpdated: '2024-08-01T00:00:00.000Z',
  sourceFile: 'Blum.png'
};

// Helper function to get Blum municipal pricing data
export function getBlumMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Blum municipal contract pricing:', {
    totalRates: BLUM_MUNICIPAL_PRICING.rates.length,
    rollOffRates: BLUM_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    franchiseFee: '0%',
    features: 'Included tons, monthly bulk collection, no franchise fee'
  });
  
  return BLUM_MUNICIPAL_PRICING;
}
