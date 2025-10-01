// Built-in Troy Municipal Contract Pricing Data
// Parsed from "FWS Pricing tool -TOOLBOX - TROY.csv"
// Effective as of file date

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const TROY_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Troy',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'troy-2yd-1xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 79.97,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 42.72,
      taxExempt: true
    },
    {
      id: 'troy-2yd-2xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 139.95,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 42.72,
      taxExempt: true
    },
    {
      id: 'troy-2yd-3xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 199.92,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 42.72,
      taxExempt: true
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'troy-3yd-1xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 91.39,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 48.82,
      taxExempt: true
    },
    {
      id: 'troy-3yd-2xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 159.95,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 48.82,
      taxExempt: true
    },
    {
      id: 'troy-3yd-3xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 228.49,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 48.82,
      taxExempt: true
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'troy-4yd-1xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 102.83,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 54.92,
      taxExempt: true
    },
    {
      id: 'troy-4yd-2xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 179.93,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 54.92,
      taxExempt: true
    },
    {
      id: 'troy-4yd-3xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 253.62,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 54.92,
      taxExempt: true
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'troy-6yd-1xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 159.95,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 85.43,
      taxExempt: true
    },
    {
      id: 'troy-6yd-2xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 279.90,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 85.43,
      taxExempt: true
    },
    {
      id: 'troy-6yd-3xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 399.86,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 85.43,
      taxExempt: true
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'troy-8yd-1xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 182.78,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 97.63,
      taxExempt: true
    },
    {
      id: 'troy-8yd-2xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 319.88,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 97.63,
      taxExempt: true
    },
    {
      id: 'troy-8yd-3xweek',
      city: 'Troy',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 456.97,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 97.63,
      taxExempt: true
    },

    // Additional Services
    {
      id: 'troy-caster-lockbar-install',
      city: 'Troy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'One-time',
      equipmentType: 'Additional Service',
      serviceType: 'Caster/Lock Bar Installation',
      monthlyRate: 55.00,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      taxExempt: true
    },
    {
      id: 'troy-caster-service',
      city: 'Troy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'Monthly',
      equipmentType: 'Additional Service',
      serviceType: 'Caster Service Fee',
      monthlyRate: 18.00,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      taxExempt: true
    },
    {
      id: 'troy-lockbar-enclosure-service',
      city: 'Troy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'Monthly',
      equipmentType: 'Additional Service',
      serviceType: 'Lock Bar/Enclosure Service Fee',
      monthlyRate: 10.00,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      taxExempt: true
    }
  ],
  additionalNotes: [
    '5% FRANCHISE FEE ADDED TO ALL RATES',
    'TAX CODE: TAX EXEMPT (WITH PROVIDED TAX EXEMPT FORM)',
    'CASTER/LOCK BAR INSTALLATION: $55.00 PER CONTAINER',
    'CASTER SERVICE FEE: $18.00/MONTH PER CONTAINER',
    'LOCK BAR/ENCLOSURE SERVICE FEE: $10.00/MONTH PER CONTAINER'
  ],
  franchiseFee: 5,
  taxInfo: {
    taxCode: 'Tax Exempt',
    requirement: 'With provided tax exempt form'
  },
  lastUpdated: new Date().toISOString(),
  sourceFile: 'FWS Pricing tool -TOOLBOX - TROY.csv'
};

// Helper function to get Troy municipal pricing data
export function getTroyMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Troy municipal contract pricing:', {
    totalRates: TROY_MUNICIPAL_PRICING.rates.length,
    commercialRates: TROY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    additionalServices: TROY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Additional Service').length,
    franchiseFee: '5%',
    taxStatus: 'Tax exempt with provided form'
  });
  
  return TROY_MUNICIPAL_PRICING;
}