// Built-in Krum Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(KRUM).csv"
// Effective 06/01/2023

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const KRUM_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Krum',
  state: 'Texas',
  rates: [
    // Commercial Cart Pricing
    {
      id: 'krum-95gal-trash-1xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '95-Gallon',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 26.50,
      deliveryFee: 0, // Carts typically don't have delivery fees
      franchiseFee: 6, // 6% City of Krum
      salesTax: 8.25
    },
    {
      id: 'krum-95gal-extra-trash',
      city: 'Krum',
      state: 'Texas',
      containerSize: '95-Gallon-Extra',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 15.90,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'krum-65gal-recycle',
      city: 'Krum',
      state: 'Texas',
      containerSize: '65-Gallon',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 10.60,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'krum-65gal-extra-recycle',
      city: 'Krum',
      state: 'Texas',
      containerSize: '65-Gallon-Extra',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 6.36,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 2YD
    {
      id: 'krum-2yd-1xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 68.82,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 47.70
    },
    {
      id: 'krum-2yd-2xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 128.53,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 47.70
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'krum-3yd-1xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 86.02,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 53.00
    },
    {
      id: 'krum-3yd-2xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 158.47,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 53.00
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'krum-4yd-1xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 110.24,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 58.30
    },
    {
      id: 'krum-4yd-2xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 201.93,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 58.30
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'krum-6yd-1xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 151.58,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 63.60
    },
    {
      id: 'krum-6yd-2xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 289.38,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 63.60
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'krum-8yd-1xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 192.92,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 74.20
    },
    {
      id: 'krum-8yd-2xweek',
      city: 'Krum',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 348.74,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 74.20
    },

    // Roll-off Pricing
    {
      id: 'krum-rolloff-20yd',
      city: 'Krum',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 181.86, // Monthly rental
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'krum-rolloff-30yd',
      city: 'Krum',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 181.86,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'krum-rolloff-40yd',
      city: 'Krum',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 181.86,
      deliveryFee: 125.00,
      franchiseFee: 6,
      salesTax: 8.25
    },

    // Compactor Pricing
    {
      id: 'krum-compactor-monthly',
      city: 'Krum',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 375.00, // Haul rate as monthly
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(KRUM).csv'
};

// Helper function to get Krum municipal pricing data
export function getKrumMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Krum municipal contract pricing:', {
    totalRates: KRUM_MUNICIPAL_PRICING.rates.length,
    cartRates: KRUM_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: KRUM_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: KRUM_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: KRUM_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length
  });
  
  return KRUM_MUNICIPAL_PRICING;
}