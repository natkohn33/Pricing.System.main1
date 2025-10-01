// Built-in Bellmead Municipal Contract Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const BELLMEAD_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Bellmead',
  state: 'Texas',
  rates: [
    // Front-Load Dumpster Pricing (general note - specific rates not provided)
    {
      id: 'bellmead-fl-general',
      city: 'Bellmead',
      state: 'Texas',
      containerSize: 'Various',
      frequency: 'Various',
      equipmentType: 'Front-Load Container',
      monthlyRate: 0, // Specific rates not provided in image
      deliveryFee: 0,
      franchiseFee: 7,
      salesTax: 0,
      billingGroup: 'MUNICIPAL',
      taxCode: 'BELLMEAD CITY',
      notes: 'Specific front-load rates not provided in source document'
    },

    // Roll-off Dumpster Pricing - 20/30/40YD
    {
      id: 'bellmead-rolloff-20-30-40yd',
      city: 'Bellmead',
      state: 'Texas',
      containerSize: '20/30/40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 135.12,
      deliveryFee: 84.45,
      disposalFee: 51.34, // Per ton
      haulFee: 225.20,
      franchiseFee: 7,
      salesTax: 0,
      billingGroup: 'ROLLOFF',
      taxCode: 'BELLMEAD CITY'
    },

    // Permanent Roll-off Dumpster Pricing
    {
      id: 'bellmead-perm-rolloff',
      city: 'Bellmead',
      state: 'Texas',
      containerSize: 'PERM RO',
      frequency: 'Monthly',
      equipmentType: 'Roll-off',
      monthlyRate: 135.12,
      deliveryFee: 0, // No delivery fee for permanent
      disposalFee: 51.34, // Per ton
      haulFee: 225.20,
      franchiseFee: 7,
      salesTax: 0,
      billingGroup: 'ROLLOFF',
      taxCode: 'BELLMEAD CITY'
    },

    // Compactor Pricing
    {
      id: 'bellmead-compactor',
      city: 'Bellmead',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: 'On-demand',
      equipmentType: 'Compactor',
      monthlyRate: 0, // Negotiable
      deliveryFee: 0, // Negotiable
      disposalFee: 51.34, // Per ton
      haulFee: 253.35,
      franchiseFee: 7,
      salesTax: 0,
      billingGroup: 'ROLLOFF',
      taxCode: 'BELLMEAD CITY',
      notes: 'Delivery and monthly rates are negotiable (NEG)'
    }
  ],
  additionalNotes: [
    'DUMPSTERS ARE FL CONTAINERS',
    'BILLING GROUP - MUNICIPAL FOR FRONT-LOAD DUMPSTERS',
    'BILLING GROUP - ROLLOFF FOR ROLL-OFF/COMPACTOR SERVICES',
    'TAX CODE - BELLMEAD CITY',
    '7% FRANCHISE FEE IN ADDITION TO THESE RATES',
    'SPECIFIC FRONT-LOAD DUMPSTER RATES NOT PROVIDED IN SOURCE DOCUMENT'
  ],
  franchiseFee: 7,
  billingInfo: {
    frontLoadBilling: 'MUNICIPAL',
    rollOffBilling: 'ROLLOFF',
    taxCode: 'BELLMEAD CITY'
  },
  lastUpdated: new Date().toISOString(),
  sourceFile: 'IMG_8368.jpg'
};

// Helper function to get Bellmead municipal pricing data
export function getBellmeadMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Bellmead municipal contract pricing:', {
    totalRates: BELLMEAD_MUNICIPAL_PRICING.rates.length,
    frontLoadRates: BELLMEAD_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: BELLMEAD_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: BELLMEAD_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length,
    franchiseFee: '7%',
    warning: 'Specific front-load dumpster rates not provided in source document'
  });
  
  return BELLMEAD_MUNICIPAL_PRICING;
}
