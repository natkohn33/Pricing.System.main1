// Built-in Springtown Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(SPRINGTOWN).csv"
// Effective 08/01/2023

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const SPRINGTOWN_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Springtown',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'springtown-2yd-1xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 79.84,
      deliveryFee: 237.35,
      franchiseFee: 0, // Franchise fee included in rates
      salesTax: 8.25,
      extraPickupRate: 41.58
    },
    {
      id: 'springtown-2yd-2xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 133.07,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 41.58
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'springtown-3yd-1xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 93.15,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 53.46
    },
    {
      id: 'springtown-3yd-2xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 146.38,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 53.46
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'springtown-4yd-1xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 106.45,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 59.41
    },
    {
      id: 'springtown-4yd-2xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 166.33,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 59.41
    },
    {
      id: 'springtown-4yd-3xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 246.18,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 59.41
    },
    {
      id: 'springtown-4yd-4xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 326.02,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 59.41
    },
    {
      id: 'springtown-4yd-5xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 454.61,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 59.41
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'springtown-6yd-1xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 122.39,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 71.29
    },
    {
      id: 'springtown-6yd-2xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 246.18,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 71.29
    },
    {
      id: 'springtown-6yd-3xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 365.93,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 71.29
    },
    {
      id: 'springtown-6yd-4xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 492.35,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 71.29
    },
    {
      id: 'springtown-6yd-5xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 731.87,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 71.29
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'springtown-8yd-1xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 162.34,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 83.17
    },
    {
      id: 'springtown-8yd-2xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 326.02,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 83.17
    },
    {
      id: 'springtown-8yd-3xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 492.35,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 83.17
    },
    {
      id: 'springtown-8yd-4xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 791.75,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 83.17
    },
    {
      id: 'springtown-8yd-5xweek',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1031.27,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 83.17
    },

    // Roll-off Pricing
    {
      id: 'springtown-rolloff-20yd',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 146.70, // Monthly rental
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'springtown-rolloff-30yd',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 146.70,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'springtown-rolloff-40yd',
      city: 'Springtown',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 146.70,
      deliveryFee: 237.35,
      franchiseFee: 0,
      salesTax: 8.25
    },

    // Compactor Pricing
    {
      id: 'springtown-compactor-monthly',
      city: 'Springtown',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 569.65, // Haul rate as monthly
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(SPRINGTOWN).csv'
};

// Helper function to get Springtown municipal pricing data
export function getSpringtownMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Springtown municipal contract pricing:', {
    totalRates: SPRINGTOWN_MUNICIPAL_PRICING.rates.length,
    cartRates: SPRINGTOWN_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: SPRINGTOWN_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    compactorRates: SPRINGTOWN_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length,
    rollOffRates: SPRINGTOWN_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length
  });
  
  return SPRINGTOWN_MUNICIPAL_PRICING;
}