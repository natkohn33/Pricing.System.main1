// Built-in Mineral Wells Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(MINERAL WELLS ).csv"
// Effective 10/01/2024

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const MINERAL_WELLS_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Mineral Wells',
  state: 'Texas',
  rates: [
    // Commercial Cart Pricing
    {
      id: 'mineral-wells-1cart-1xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 39.92,
      deliveryFee: 0, // Carts typically don't have delivery fees
      franchiseFee: 0, // Franchise fee included in rates
      salesTax: 8.25
    },
    {
      id: 'mineral-wells-1cart-2xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '2x/week',
      equipmentType: 'Cart',
      monthlyRate: 66.72,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'mineral-wells-extra-cart',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: 'Extra-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 14.26,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 2YD
    {
      id: 'mineral-wells-2yd-1xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 95.53,
      deliveryFee: 138.50,
      franchiseFee: 0, // Franchise fee included in rates
      salesTax: 8.25,
      extraPickupRate: 39.13
    },
    {
      id: 'mineral-wells-2yd-2xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 155.28,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 39.13
    },
    {
      id: 'mineral-wells-2yd-3xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 174.40,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 39.13
    },
    {
      id: 'mineral-wells-2yd-4xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 304.59,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 39.13
    },
    {
      id: 'mineral-wells-2yd-5xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 346.89,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 39.13
    },
    {
      id: 'mineral-wells-2yd-6xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 395.67,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 39.13
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'mineral-wells-3yd-1xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 126.67,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 51.85
    },
    {
      id: 'mineral-wells-3yd-2xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 174.40,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 51.85
    },
    {
      id: 'mineral-wells-3yd-3xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 260.45,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 51.85
    },
    {
      id: 'mineral-wells-3yd-4xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 346.89,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 51.85
    },
    {
      id: 'mineral-wells-3yd-5xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 430.11,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 51.85
    },
    {
      id: 'mineral-wells-3yd-6xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 503.60,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 51.85
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'mineral-wells-4yd-1xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 155.33,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 63.60
    },
    {
      id: 'mineral-wells-4yd-2xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 207.86,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 63.60
    },
    {
      id: 'mineral-wells-4yd-3xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 311.69,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 63.60
    },
    {
      id: 'mineral-wells-4yd-4xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 413.38,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 63.60
    },
    {
      id: 'mineral-wells-4yd-5xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 516.06,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 63.60
    },
    {
      id: 'mineral-wells-4yd-6xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 608.64,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 63.60
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'mineral-wells-6yd-1xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 174.40,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 68.17
    },
    {
      id: 'mineral-wells-6yd-2xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 282.06,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 68.17
    },
    {
      id: 'mineral-wells-6yd-3xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 402.89,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 68.17
    },
    {
      id: 'mineral-wells-6yd-4xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 453.94,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 68.17
    },
    {
      id: 'mineral-wells-6yd-5xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 585.36,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 68.17
    },
    {
      id: 'mineral-wells-6yd-6xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 727.74,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 68.17
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'mineral-wells-8yd-1xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 207.86,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 85.14
    },
    {
      id: 'mineral-wells-8yd-2xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 311.79,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 85.14
    },
    {
      id: 'mineral-wells-8yd-3xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 453.94,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 85.14
    },
    {
      id: 'mineral-wells-8yd-4xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 585.36,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 85.14
    },
    {
      id: 'mineral-wells-8yd-5xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 709.62,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 85.14
    },
    {
      id: 'mineral-wells-8yd-6xweek',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 820.05,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 85.14
    },

    // Roll-off Pricing
    {
      id: 'mineral-wells-rolloff-20yd',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 167.92, // Monthly rental
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'mineral-wells-rolloff-30yd',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 167.92,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'mineral-wells-rolloff-40yd',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 167.92,
      deliveryFee: 138.50,
      franchiseFee: 0,
      salesTax: 8.25
    },

    // Compactor Pricing
    {
      id: 'mineral-wells-compactor-monthly',
      city: 'Mineral Wells',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 638.69, // Haul rate as monthly
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(MINERAL WELLS ).csv'
};

// Helper function to get Mineral Wells municipal pricing data
export function getMineralWellsMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Mineral Wells municipal contract pricing:', {
    totalRates: MINERAL_WELLS_MUNICIPAL_PRICING.rates.length,
    cartRates: MINERAL_WELLS_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: MINERAL_WELLS_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: MINERAL_WELLS_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: MINERAL_WELLS_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length
  });
  
  return MINERAL_WELLS_MUNICIPAL_PRICING;
}