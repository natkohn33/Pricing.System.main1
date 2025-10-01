// Built-in Cleveland Municipal Contract Pricing Data
// Parsed from "Franchise rates.xlsx - Cleveland.csv"
// Effective Current

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const CLEVELAND_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Cleveland',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'cleveland-2yd-1xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 48.30,
      deliveryFee: 0, // Not specified in rate sheet
      franchiseFee: 11, // 11% for commercial accounts
      salesTax: 8.25
    },
    {
      id: 'cleveland-2yd-2xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 95.04,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-2yd-3xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 142.56,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-2yd-4xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 190.08,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-2yd-5xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 237.60,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-2yd-6xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 285.12,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'cleveland-3yd-1xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 72.47,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-3yd-2xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 133.24,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-3yd-3xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 199.86,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-3yd-4xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 266.49,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-3yd-5xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 333.11,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-3yd-6xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 399.73,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'cleveland-4yd-1xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 96.61,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-4yd-2xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 177.63,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-4yd-3xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 266.44,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-4yd-4xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 355.25,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-4yd-5xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 444.07,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-4yd-6xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 532.88,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'cleveland-6yd-1xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 144.91,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-6yd-2xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 266.42,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-6yd-3xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 399.63,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-6yd-4xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 532.84,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-6yd-5xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 666.05,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-6yd-6xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 799.26,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'cleveland-8yd-1xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 191.29,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-8yd-2xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 351.37,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-8yd-3xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 527.06,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-8yd-4xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 702.75,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-8yd-5xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 878.43,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-8yd-6xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1054.12,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },

    // Compactor Pricing - 4YD
    {
      id: 'cleveland-4yd-compactor-1xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 128.50,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-4yd-compactor-2xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 225.46,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },

    // Compactor Pricing - 6YD
    {
      id: 'cleveland-6yd-compactor-1xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 203.53,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },
    {
      id: 'cleveland-6yd-compactor-2xweek',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 352.55,
      deliveryFee: 0,
      franchiseFee: 11,
      salesTax: 8.25
    },

    // Roll-off Pricing
    {
      id: 'cleveland-rolloff-20yd',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 185.40, // Daily rental * 30 days
      deliveryFee: 113.21,
      franchiseFee: 6, // 6% for roll-off accounts
      salesTax: 8.25
    },
    {
      id: 'cleveland-rolloff-30yd',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 185.40,
      deliveryFee: 113.21,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'cleveland-rolloff-40yd',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 185.40,
      deliveryFee: 113.21,
      franchiseFee: 6,
      salesTax: 8.25
    },

    // Compactor Roll-off Pricing
    {
      id: 'cleveland-30yd-compactor-rolloff',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 185.40, // Daily rental * 30 days
      deliveryFee: 0, // Negotiated
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'cleveland-33yd-compactor-rolloff',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '33YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 185.40,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'cleveland-34yd-compactor-rolloff',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '34YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 185.40,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'cleveland-35yd-compactor-rolloff',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '35YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 185.40,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'cleveland-40yd-compactor-rolloff',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 185.40,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'cleveland-42yd-compactor-rolloff',
      city: 'Cleveland',
      state: 'Texas',
      containerSize: '42YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 185.40,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Franchise rates.xlsx - Cleveland.csv'
};

// Helper function to get Cleveland municipal pricing data
export function getClevelandMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Cleveland municipal contract pricing:', {
    totalRates: CLEVELAND_MUNICIPAL_PRICING.rates.length,
    dumpsterRates: CLEVELAND_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    compactorRates: CLEVELAND_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length,
    rollOffRates: CLEVELAND_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length
  });
  
  return CLEVELAND_MUNICIPAL_PRICING;
}