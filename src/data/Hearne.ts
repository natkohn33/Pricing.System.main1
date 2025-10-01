// Hearne Municipal Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const HEARNE_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Hearne',
  state: 'Texas',
  rates: [
    // Open Market Pricing
    {
      id: 'hearne-trash-cart',
      city: 'Hearne',
      state: 'Texas',
      serviceType: 'Trash Cart',
      monthlyRate: 36.94,
      deliveryFee: 40.00,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'hearne-additional-cart',
      city: 'Hearne',
      state: 'Texas',
      serviceType: 'Additional Cart',
      monthlyRate: 18.47,
      franchiseFee: 0,
      salesTax: 8.25
    },

    // Dumpster Services
    {
      id: 'hearne-dumpster-2yd',
      city: 'Hearne',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Dumpster',
      monthlyRate: 109.66,
      deliveryFee: 100.00,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'hearne-dumpster-3yd',
      city: 'Hearne',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Dumpster',
      monthlyRate: 132.74,
      deliveryFee: 100.00,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'hearne-dumpster-4yd',
      city: 'Hearne',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Dumpster',
      monthlyRate: 150.06,
      deliveryFee: 100.00,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'hearne-dumpster-6yd',
      city: 'Hearne',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Dumpster',
      monthlyRate: 282.00,
      deliveryFee: 100.00,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'hearne-dumpster-8yd',
      city: 'Hearne',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Dumpster',
      monthlyRate: 236.53,
      deliveryFee: 100.00,
      franchiseFee: 0,
      salesTax: 8.25
    },

    // Roll-off Services
    {
      id: 'hearne-rolloff-20-40yd',
      city: 'Hearne',
      state: 'Texas',
      containerSize: '20/30/40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 3.67,
      deliveryFee: 100.00,
      haulFee: 280.17,
      disposalFee: 58.64,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-10-01T00:00:00.000Z',
  sourceFile: 'Hearne.png'
};

export function getHearneMunicipalPricing(): FranchisedCityPricing {
  return HEARNE_MUNICIPAL_PRICING;
}

