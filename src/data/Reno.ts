// Built-in Reno Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1) - RENO.csv"
// Effective 8/1/23

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const RENO_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Reno',
  state: 'Texas',
  rates: [
    // Roll-off Dumpster Pricing - 20YD
    {
      id: 'reno-rolloff-20yd',
      city: 'Reno',
      state: 'Texas',
      containerSize: '20YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 103.66, // Monthly rental
      deliveryFee: 142.34,
      disposalFee: 51.81, // Per ton after included tons
      includedTons: 4, // First 4 tons included for 20YD
      haulFee: 466.88,
      additionalFee: 1044.44, // Additional fee (unspecified purpose)
      franchiseFee: 0, // NO FRANCHISE FEE
      salesTax: 0, // Tax handled by city billing
      billingGroup: 'ROLL OFF',
      taxCode: 'RENO CITY'
    },

    // Roll-off Dumpster Pricing - 30YD
    {
      id: 'reno-rolloff-30yd',
      city: 'Reno',
      state: 'Texas',
      containerSize: '30YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 103.66, // Monthly rental
      deliveryFee: 142.34,
      disposalFee: 51.81, // Per ton after included tons
      includedTons: 5, // First 5 tons included for 30YD
      haulFee: 518.12,
      additionalFee: 1065.33, // Additional fee (unspecified purpose)
      franchiseFee: 0,
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'RENO CITY'
    },

    // Roll-off Dumpster Pricing - 40YD
    {
      id: 'reno-rolloff-40yd',
      city: 'Reno',
      state: 'Texas',
      containerSize: '40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 103.66, // Monthly rental
      deliveryFee: 142.34,
      disposalFee: 51.81, // Per ton after included tons
      includedTons: 6, // First 6 tons included for 40YD
      haulFee: 569.93,
      additionalFee: 1126.90, // Additional fee (unspecified purpose)
      franchiseFee: 0,
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'RENO CITY'
    }
  ],
  additionalNotes: [
    'RESIDENTIAL & COMMERCIAL IS BILLED THROUGH THE CITY',
    'RESIDENTIAL COLLECTION IS ONCE WEEK ON MON, TUE OR THU - JUSTIN',
    'RESIDENTIAL IS HAND LOAD COLLECTION W/ A 2YD LIMIT PER WEEK',
    'ADDITIONAL CARTS ARE REQUESTED THROUGH THE CITY ONLY',
    '*RESIDENTS ARE ALLOWED UP TO 2YDS OF BULK PER WEEK - Need to contact the city to schedule it.',
    'RESIDENTS WILL CONTACT CITY FOR MISSED TRASH',
    'DUMPSTERS ARE BILLED THROUGH THE CITY',
    'BILLING GROUP - ROLL OFF',
    'TAX CODE - RENO CITY',
    'RETURN ANY COMPLETED WORK ORDERS TO BILLING DEPARTMENT',
    'Additional fees apply (see rate details)'
  ],
  serviceDetails: {
    residentialCollection: 'Once weekly (Mon, Tue, or Thu) - JUSTIN',
    collectionType: 'Hand load collection',
    weeklyLimit: '2YD limit per week',
    bulkCollection: 'Up to 2YDs of bulk per week - must contact city to schedule',
    cartPolicy: 'City-provided carts only'
  },
  contactInfo: {
    city: '(817) 221-2500'
  },
  billingInfo: {
    billingGroup: 'ROLL OFF',
    taxCode: 'RENO CITY'
  },
  lastUpdated: '2023-08-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1) - RENO.csv'
};

// Helper function to get Reno municipal pricing data
export function getRenoMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Reno municipal contract pricing:', {
    totalRates: RENO_MUNICIPAL_PRICING.rates.length,
    rollOffRates: RENO_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    features: 'Different included tons by container size, hand load residential collection, additional fees apply'
  });
  
  return RENO_MUNICIPAL_PRICING;
}