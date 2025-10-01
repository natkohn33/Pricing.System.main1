// Built-in Rio Vista Municipal Contract Pricing Data
// Parsed from "FWS Pricing tool -TOOLBOX - Rio Vista.csv"
// Effective as of file date

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const RIO_VISTA_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Rio Vista',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'rio-vista-2yd-1xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 79.65,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 39.83
    },
    {
      id: 'rio-vista-2yd-2xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 143.40,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 39.83
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'rio-vista-3yd-1xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 92.94,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 46.47
    },
    {
      id: 'rio-vista-3yd-2xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 167.28,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 46.47
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'rio-vista-4yd-1xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 106.20,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 53.10
    },
    {
      id: 'rio-vista-4yd-2xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 191.19,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 53.10
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'rio-vista-6yd-1xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 165.95,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 82.98
    },
    {
      id: 'rio-vista-6yd-2xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 298.72,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 82.98
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'rio-vista-8yd-1xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 199.14,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 99.57
    },
    {
      id: 'rio-vista-8yd-2xweek',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 358.47,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0,
      extraPickupRate: 99.57
    },

    // Additional Services
    {
      id: 'rio-vista-lock-casters-enclosure',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'Monthly',
      equipmentType: 'Additional Service',
      serviceType: 'Lock/Casters/Enclosure',
      monthlyRate: 26.55,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 0
    },

    // Roll-off Dumpster Pricing - 20/30/40YD (combined rate)
    {
      id: 'rio-vista-rolloff-20-30-40yd',
      city: 'Rio Vista',
      state: 'Texas',
      containerSize: '20/30/40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 5.31, // Daily rent rate
      deliveryFee: 199.14,
      disposalFee: 54.43, // Per ton
      haulFee: 312.01,
      franchiseFee: 0, // NO FRANCHISE FEE for roll-off
      salesTax: 0,
      billingGroup: 'Roll Off',
      taxCode: 'Rio Vista City'
    }
  ],
  additionalNotes: [
    'RESIDENTIAL & COMMERCIAL CARTS BILLED THROUGH THE CITY',
    'RESIDENTIAL COLLECTION: ONCE WEEKLY (MONDAY - HILLSBORO)',
    'NO RECYCLE SERVICE IN RIO VISTA',
    'RESIDENTIAL IS HAND LOAD COLLECTION WITH 2YD LIMIT PER WEEK',
    'ADDITIONAL CARTS REQUESTED THROUGH CITY ONLY',
    '*RESIDENTS PAY INDIVIDUALLY FOR BULK COLLECTION USING CURRENT BULK PRICING',
    '6% FRANCHISE FEE FOR COMMERCIAL DUMPSTERS',
    'NO FRANCHISE FEE FOR ROLL-OFF SERVICES',
    'BILLING GROUP: ROLL OFF',
    'TAX CODE: RIO VISTA CITY'
  ],
  serviceDetails: {
    residentialCollection: 'Once weekly (Monday) - Hillsboro',
    recycling: 'Not offered',
    collectionType: 'Hand load collection',
    weeklyLimit: '2YD limit per week',
    bulkCollection: 'Residents pay individually using current bulk pricing'
  },
  billingInfo: {
    commercialFranchiseFee: 6,
    rollOffFranchiseFee: 0,
    billingGroup: 'Roll Off',
    taxCode: 'Rio Vista City'
  },
  lastUpdated: new Date().toISOString(),
  sourceFile: 'FWS Pricing tool -TOOLBOX - Rio Vista.csv'
};

// Helper function to get Rio Vista municipal pricing data
export function getRioVistaMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Rio Vista municipal contract pricing:', {
    totalRates: RIO_VISTA_MUNICIPAL_PRICING.rates.length,
    commercialRates: RIO_VISTA_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: RIO_VISTA_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    additionalServices: RIO_VISTA_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Additional Service').length,
    franchiseFee: '6% for commercial, 0% for roll-off'
  });
  
  return RIO_VISTA_MUNICIPAL_PRICING;
}