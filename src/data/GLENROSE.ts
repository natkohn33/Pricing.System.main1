// Built-in Glen Rose Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1) - GLEN ROSE.csv"
// Effective 10/1/24

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const GLEN_ROSE_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Glen Rose',
  state: 'Texas',
  rates: [
    // Roll-off Dumpster Pricing - 20YD
    {
      id: 'glen-rose-rolloff-20yd',
      city: 'Glen Rose',
      state: 'Texas',
      containerSize: '20YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 190.65, // Monthly rental
      deliveryFee: 165.12,
      disposalFee: 42.29, // Per ton after 4 included tons
      includedTons: 4, // First 4 tons included
      haulFee: 608.75,
      deposit: 1200.00, // $1,200 deposit required
      dryRunFee: 137.60, // Dry run fee
      franchiseFee: 0, // NO FRANCHISE FEE
      salesTax: 0, // Tax handled by city billing
      billingGroup: 'ROLL OFF',
      taxCode: 'GLEN ROSE CITY'
    },

    // Roll-off Dumpster Pricing - 30YD
    {
      id: 'glen-rose-rolloff-30yd',
      city: 'Glen Rose',
      state: 'Texas',
      containerSize: '30YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 190.65, // Monthly rental
      deliveryFee: 165.12,
      disposalFee: 42.29, // Per ton after 4 included tons
      includedTons: 4, // First 4 tons included
      haulFee: 608.75,
      deposit: 1200.00, // $1,200 deposit required
      franchiseFee: 0,
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'GLEN ROSE CITY'
    },

    // Roll-off Dumpster Pricing - 40YD
    {
      id: 'glen-rose-rolloff-40yd',
      city: 'Glen Rose',
      state: 'Texas',
      containerSize: '40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 190.65, // Monthly rental
      deliveryFee: 165.12,
      disposalFee: 42.29, // Per ton after 4 included tons
      includedTons: 4, // First 4 tons included
      haulFee: 608.75,
      deposit: 1200.00, // $1,200 deposit required
      franchiseFee: 0,
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'GLEN ROSE CITY'
    }
  ],
  additionalNotes: [
    'RESIDENTIAL & COMMERCIAL IS BILLED THROUGH THE CITY',
    'RESIDENTIAL COLLECTION IS ONCE A WEEK ON TUESDAY & WEDNESDAY - CRESSON',
    'WE DO NOT OFFER RECYCLE IN GLEN ROSE',
    'ALL TRASH MUST BE IN CART WE PROVIDE - CART CONTENT ONLY',
    'ADDITIONAL CARTS ARE REQUESTED THROUGH THE CITY ONLY',
    '*BULK & BRUSH COLLECTION IS ONCE A QUARTER (FIRST 2 FRIDAYS OF EVERY QUARTER) W/ A 3YD LIMIT',
    'AUTOMATIC - THEY DO NOT NEED TO CONTACT THE CITY',
    'RESIDENT WILL CONTACT FRONTIER WASTE OR THE CITY FOR MISSED TRASH',
    'DUMPSTERS BILLED THROUGH CITY',
    'BILLING GROUP - ROLL OFF',
    'TAX CODE - GLEN ROSE CITY',
    'RETURN ANY COMPLETED WORK ORDERS TO BILLING DEPARTMENT',
    'Includes 4 tons in base rate',
    '$1,200 deposit required',
    '$137.60 dry run fee for 20YD containers'
  ],
  serviceDetails: {
    residentialCollection: 'Once weekly (Tuesday/Wednesday) - CRESSON',
    recycling: 'Not offered',
    bulkCollection: 'Quarterly (first 2 Fridays of every quarter) with 3YD limit',
    cartPolicy: 'City-provided carts only, cart content only',
    bulkAutomatic: 'Automatic - no contact required'
  },
  contactInfo: {
    city: '(254) 897-2272'
  },
  billingInfo: {
    billingGroup: 'ROLL OFF',
    taxCode: 'GLEN ROSE CITY'
  },
  lastUpdated: '2024-10-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1) - GLEN ROSE.csv'
};

// Helper function to get Glen Rose municipal pricing data
export function getGlenRoseMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Glen Rose municipal contract pricing:', {
    totalRates: GLEN_ROSE_MUNICIPAL_PRICING.rates.length,
    rollOffRates: GLEN_ROSE_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    features: 'Includes 4 tons, $1200 deposit required, unique quarterly bulk collection'
  });
  
  return GLEN_ROSE_MUNICIPAL_PRICING;
}