// Built-in Cockrell Hill Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1) - COCKRELL HILL.csv"
// Effective 12/1/23

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const COCKRELL_HILL_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Cockrell Hill',
  state: 'Texas',
  rates: [
    // Roll-off Dumpster Pricing - 20/30/40YD (combined rate)
    {
      id: 'cockrell-hill-rolloff-20-30-40yd',
      city: 'Cockrell Hill',
      state: 'Texas',
      containerSize: '20/30/40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 144.88, // Monthly rental
      deliveryFee: 179.30,
      disposalFee: 49.01, // Per ton
      haulFee: 280.89,
      franchiseFee: 0, // NO FRANCHISE FEE
      salesTax: 0 // Tax handled by city billing
    },

    // Compactor Pricing
    {
      id: 'cockrell-hill-compactor',
      city: 'Cockrell Hill',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: 'On-demand',
      equipmentType: 'Compactor',
      monthlyRate: 0, // NEG (Negotiable)
      deliveryFee: 0, // NEG (Negotiable)
      disposalFee: 49.01, // Per ton
      haulFee: 352.60,
      franchiseFee: 0,
      salesTax: 0,
      notes: 'Rates are negotiable (NEG)'
    }
  ],
  additionalNotes: [
    'RESIDENTIAL & COMMERCIAL IS BILLED THROUGH THE CITY',
    'RESIDENTIAL COLLECTION IS TWICE WEEKLY ON WED/SAT - DALLAS EAST',
    'WE DO NOT OFFER RECYCLING IN COCKRELL HILL',
    'ALL TRASH MUST BE IN CARTS WE PROVIDE',
    'ADDITIONAL CARTS ARE REQUESTED THROUGH THE CITY ONLY',
    '*BULK & BRUSH COLLECTION IS ON WEDNESDAY W/ A 3YD LIMIT PER WEEK',
    'RESIDENTS CAN CONTACT FRONTIER OR CITY FOR MISSED TRASH-MAKE WO THRU TRACEZ',
    'DUMPSTERS ARE BILLED THROUGH CITY',
    'BILLING GROUP - ROLL OFF',
    'TAX CODE - COCKRELL HILL CITY',
    'RETURN ANY COMPLETED WORK ORDERS TO BILLING DEPARTMENT',
    'CITY: (214) 330-6333'
  ],
  serviceDetails: {
    residentialCollection: 'Twice weekly (Wednesday/Saturday)',
    recycling: 'Not offered',
    bulkCollection: 'Wednesday with 3YD limit per week',
    cartProvider: 'City-provided carts only'
  },
  lastUpdated: '2023-12-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1) - COCKRELL HILL.csv'
};

// Helper function to get Cockrell Hill municipal pricing data
export function getCockrellHillMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Cockrell Hill municipal contract pricing:', {
    totalRates: COCKRELL_HILL_MUNICIPAL_PRICING.rates.length,
    rollOffRates: COCKRELL_HILL_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: COCKRELL_HILL_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length
  });
  
  return COCKRELL_HILL_MUNICIPAL_PRICING;
}