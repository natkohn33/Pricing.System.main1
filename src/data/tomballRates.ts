// Built-in Tomball Municipal Contract Pricing Data
// Parsed from "FWS Pricing tool -TOOLBOX - TOMBALL.csv"
// Effective Current

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const TOMBALL_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Tomball',
  state: 'Texas',
  rates: [
    // Commercial Front Load Rates - 2YD
    {
      id: 'tomball-2yd-1xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 80.43,
      deliveryFee: 0, // Not specified in rate sheet
      franchiseFee: 0, // No franchise fee for Tomball per rate sheet
      salesTax: 8.25,
      extraPickupRate: 0 // Marked as '-' in rate sheet
    },

    // Commercial Front Load Rates - 3YD
    {
      id: 'tomball-3yd-1xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 102.15,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-3yd-2xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 162.08,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-3yd-3xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 245.16,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-3yd-4xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 306.44,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-3yd-5xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 382.71,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-3yd-6xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 458.99,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },

    // Commercial Front Load Rates - 4YD
    {
      id: 'tomball-4yd-1xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 110.31,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-4yd-2xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 175.69,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-4yd-3xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 262.83,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-4yd-4xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 329.60,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-4yd-5xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 398.81,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-4yd-6xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 494.39,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },

    // Commercial Front Load Rates - 6YD
    {
      id: 'tomball-6yd-1xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 143.01,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-6yd-2xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 224.73,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-6yd-3xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 339.14,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-6yd-4xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 423.58,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-6yd-5xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 529.30,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-6yd-6xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 633.33,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },

    // Commercial Front Load Rates - 8YD
    {
      id: 'tomball-8yd-1xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 152.54,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-8yd-2xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 276.48,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-8yd-3xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 365.01,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-8yd-4xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 446.73,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-8yd-5xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 562.50, // VERIFIED: Correct rate for 8YD 5x/week
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },
    {
      id: 'tomball-8yd-6xweek',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 675.55,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 114.41,
      materialType: 'Solid Waste'
    },

    // Roll-off Pricing - Temporary
    {
      id: 'tomball-rolloff-20yd-temp',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 180.00, // Daily rental * 30 days ($6.00 * 30)
      deliveryFee: 120.00,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'tomball-rolloff-30yd-temp',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 180.00,
      deliveryFee: 120.00,
      franchiseFee: 4,
      salesTax: 8.25
    },
    {
      id: 'tomball-rolloff-40yd-temp',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 180.00,
      deliveryFee: 120.00,
      franchiseFee: 4,
      salesTax: 8.25
    },

    // Roll-off Compactor Pricing
    {
      id: 'tomball-30yd-compactor',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 550.00,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'tomball-35yd-compactor',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '35YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 550.00,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'tomball-40yd-compactor',
      city: 'Tomball',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 550.00,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'FWS Pricing tool -TOOLBOX - TOMBALL.csv'
};

// Helper function to get Tomball municipal pricing data
export function getTomballMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Tomball municipal contract pricing:', {
    totalRates: TOMBALL_MUNICIPAL_PRICING.rates.length,
    frontLoadRates: TOMBALL_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: TOMBALL_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: TOMBALL_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length
  });
  
  return TOMBALL_MUNICIPAL_PRICING;
}