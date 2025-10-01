// Built-in Liberty Municipal Contract Pricing Data
// Parsed from "Franchise rates.xlsx - Liberty.csv"
// Effective 2025 (5% increase)

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const LIBERTY_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Liberty',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'liberty-2yd-1xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 59.00,
      deliveryFee: 0, // Not specified in rate sheet
      franchiseFee: 10, // 10% franchise fee
      salesTax: 8.25
    },
    {
      id: 'liberty-2yd-2xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 98.32,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-2yd-3xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 131.07,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-2yd-4xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 159.55,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-2yd-5xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 200.56,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-2yd-6xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 254.04,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'liberty-3yd-1xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 85.20,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-3yd-2xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 124.53,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-3yd-3xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 152.28,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-3yd-4xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 191.45,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-3yd-5xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 240.68,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-3yd-6xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 286.86,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'liberty-4yd-1xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 111.42,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-4yd-2xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 190.06,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-4yd-3xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 196.61,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-4yd-4xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 223.36,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-4yd-5xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 261.71,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-4yd-6xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 334.27,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'liberty-6yd-1xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 131.07,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-6yd-2xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 216.28,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-6yd-3xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 262.15,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-6yd-4xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 327.67,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-6yd-5xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 408.94,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-6yd-6xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 534.83,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'liberty-8yd-1xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 150.74,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-8yd-2xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 275.28,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-8yd-3xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 373.57,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-8yd-4xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 504.65,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-8yd-5xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 609.50,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-8yd-6xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 701.97,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Cart Pricing
    {
      id: 'liberty-1cart-1xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 25.99,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'liberty-2carts-1xweek',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '2-Carts',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 38.97,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'liberty-manual-collection',
      city: 'Liberty',
      state: 'Texas',
      containerSize: 'Manual Collection',
      frequency: '1x/week',
      equipmentType: 'Manual Collection',
      monthlyRate: 16.71,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Roll-off Pricing
    {
      id: 'liberty-rolloff-20yd',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 467.96,
      deliveryFee: 133.71,
      franchiseFee: 0, // No fuel or FF on roll offs
      salesTax: 8.25
    },
    {
      id: 'liberty-rolloff-30yd',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 528.14,
      deliveryFee: 133.71,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'liberty-rolloff-40yd',
      city: 'Liberty',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 568.25,
      deliveryFee: 133.71,
      franchiseFee: 0,
      salesTax: 8.25
    },

    // Compactor Pricing
    {
      id: 'liberty-compactor-monthly',
      city: 'Liberty',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 621.74,
      deliveryFee: 0,
      franchiseFee: 0, // No fuel or FF on roll offs
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Franchise rates.xlsx - Liberty.csv'
};

// Helper function to get Liberty municipal pricing data
export function getLibertyMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Liberty municipal contract pricing:', {
    totalRates: LIBERTY_MUNICIPAL_PRICING.rates.length,
    cartRates: LIBERTY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: LIBERTY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: LIBERTY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: LIBERTY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length,
    manualCollectionRates: LIBERTY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Manual Collection').length
  });
  
  return LIBERTY_MUNICIPAL_PRICING;
}