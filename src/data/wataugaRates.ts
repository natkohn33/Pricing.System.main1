// Built-in Watauga Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(WATAUGA).csv"
// Effective 08/01/2023

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const WATAUGA_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Watauga',
  state: 'Texas',
  rates: [
    // Commercial Cart Pricing
    {
      id: 'watauga-1cart-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 31.50,
      deliveryFee: 0, // Carts typically don't have delivery fees
      franchiseFee: 0, // Franchise fee included in rates
      salesTax: 8.25
    },
    {
      id: 'watauga-1cart-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '2x/week',
      equipmentType: 'Cart',
      monthlyRate: 54.60,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'watauga-extra-cart-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: 'Extra-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 22.05,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'watauga-extra-cart-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: 'Extra-Cart',
      frequency: '2x/week',
      equipmentType: 'Cart',
      monthlyRate: 37.80,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 2YD
    {
      id: 'watauga-2yd-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 72.21,
      deliveryFee: 115.50,
      franchiseFee: 0, // Franchise fee included in rates
      salesTax: 8.25,
      extraPickupRate: 41.65
    },
    {
      id: 'watauga-2yd-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 139.03,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 41.65
    },
    {
      id: 'watauga-2yd-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 218.94,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 41.65
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'watauga-3yd-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 92.30,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 50.00
    },
    {
      id: 'watauga-3yd-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 193.92,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 50.00
    },
    {
      id: 'watauga-3yd-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 305.41,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 50.00
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'watauga-4yd-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 110.80,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 58.35
    },
    {
      id: 'watauga-4yd-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 232.70,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 58.35
    },
    {
      id: 'watauga-4yd-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 366.50,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 58.35
    },
    {
      id: 'watauga-4yd-4xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 559.74,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 58.35
    },
    {
      id: 'watauga-4yd-5xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 795.84,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 58.35
    },
    {
      id: 'watauga-4yd-6xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1079.97,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 58.35
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'watauga-6yd-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 144.69,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 66.60
    },
    {
      id: 'watauga-6yd-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 303.66,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 66.60
    },
    {
      id: 'watauga-6yd-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 456.55,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 66.60
    },
    {
      id: 'watauga-6yd-4xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 639.15,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 66.60
    },
    {
      id: 'watauga-6yd-5xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 838.87,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 66.60
    },
    {
      id: 'watauga-6yd-6xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1308.68,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 66.60
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'watauga-8yd-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 161.96,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 74.99
    },
    {
      id: 'watauga-8yd-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 340.27,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 74.99
    },
    {
      id: 'watauga-8yd-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 511.35,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 74.99
    },
    {
      id: 'watauga-8yd-4xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 715.86,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 74.99
    },
    {
      id: 'watauga-8yd-5xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 939.58,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 74.99
    },
    {
      id: 'watauga-8yd-6xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1469.27,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 74.99
    },

    // 6YD Compactor Pricing
    {
      id: 'watauga-6yd-compactor-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 325.08,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 165.90
    },
    {
      id: 'watauga-6yd-compactor-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 650.15,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 165.90
    },
    {
      id: 'watauga-6yd-compactor-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Compactor',
      monthlyRate: 975.23,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 165.90
    },
    {
      id: 'watauga-6yd-compactor-4xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1300.30,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 165.90
    },
    {
      id: 'watauga-6yd-compactor-5xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1625.38,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 165.90
    },
    {
      id: 'watauga-6yd-compactor-6xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1950.45,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 165.90
    },

    // 8YD Compactor Pricing
    {
      id: 'watauga-8yd-compactor-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 390.09,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 184.80
    },
    {
      id: 'watauga-8yd-compactor-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 780.18,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 184.80
    },
    {
      id: 'watauga-8yd-compactor-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1170.27,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 184.80
    },
    {
      id: 'watauga-8yd-compactor-4xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1560.36,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 184.80
    },
    {
      id: 'watauga-8yd-compactor-5xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1950.45,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 184.80
    },
    {
      id: 'watauga-8yd-compactor-6xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Compactor',
      monthlyRate: 2340.53,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 184.80
    },

    // Recycling Pricing - 6YD
    {
      id: 'watauga-6yd-recycle-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 90.02,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 34.65
    },
    {
      id: 'watauga-6yd-recycle-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 165.04,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 34.65
    },
    {
      id: 'watauga-6yd-recycle-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 225.06,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 34.65
    },
    {
      id: 'watauga-6yd-recycle-4xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 3000.07, // Note: This appears to be an error in the original CSV
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 34.65
    },
    {
      id: 'watauga-6yd-recycle-5xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 412.60,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 34.65
    },
    {
      id: 'watauga-6yd-recycle-6xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 495.12,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 34.65
    },

    // Recycling Pricing - 8YD
    {
      id: 'watauga-8yd-recycle-1xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 100.02,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 46.20
    },
    {
      id: 'watauga-8yd-recycle-2xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 180.04,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 46.20
    },
    {
      id: 'watauga-8yd-recycle-3xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 270.06,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 46.20
    },
    {
      id: 'watauga-8yd-recycle-4xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 400.09,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 46.20
    },
    {
      id: 'watauga-8yd-recycle-5xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 550.13,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 46.20
    },
    {
      id: 'watauga-8yd-recycle-6xweek',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 660.16,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 46.20
    },

    // Roll-off Pricing
    {
      id: 'watauga-rolloff-20yd',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 175.19, // Monthly rental
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'watauga-rolloff-30yd',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 175.19,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'watauga-rolloff-40yd',
      city: 'Watauga',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 175.19,
      deliveryFee: 115.50,
      franchiseFee: 0,
      salesTax: 8.25
    },

    // Compactor Roll-off
    {
      id: 'watauga-compactor-rolloff',
      city: 'Watauga',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 433.13, // Haul rate as monthly
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(WATAUGA).csv'
};

// Helper function to get Watauga municipal pricing data
export function getWataugaMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Watauga municipal contract pricing:', {
    totalRates: WATAUGA_MUNICIPAL_PRICING.rates.length,
    cartRates: WATAUGA_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: WATAUGA_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    compactorRates: WATAUGA_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length,
    rollOffRates: WATAUGA_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length
  });
  
  return WATAUGA_MUNICIPAL_PRICING;
}