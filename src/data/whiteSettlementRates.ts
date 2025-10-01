// Built-in White Settlement Municipal Contract Pricing Data
// Parsed from "WHITE SETTLEMENT NEW RATES - Sheet1.csv"
// Effective 07/01/2024

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const WHITE_SETTLEMENT_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'White Settlement',
  state: 'Texas',
  rates: [
    // Residential Cart Pricing
    {
      id: 'white-settlement-residential-cart',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: 'Residential-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 18.46,
      deliveryFee: 0,
      franchiseFee: 10, // 10% FF
      salesTax: 8.25
    },
    {
      id: 'white-settlement-additional-cart',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: 'Additional-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 7.72,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Cart Pricing
    {
      id: 'white-settlement-1cart-1xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 28.67,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 14.50
    },
    {
      id: 'white-settlement-1cart-2xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '2x/week',
      equipmentType: 'Cart',
      monthlyRate: 52.19,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 14.50
    },
    {
      id: 'white-settlement-2carts-1xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '2-Carts',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 44.61,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 29.00
    },
    {
      id: 'white-settlement-2carts-2xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '2-Carts',
      frequency: '2x/week',
      equipmentType: 'Cart',
      monthlyRate: 86.99,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 29.00
    },
    {
      id: 'white-settlement-3carts-1xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '3-Carts',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 60.54,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 43.49
    },
    {
      id: 'white-settlement-additional-commercial-cart',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: 'Additional-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 14.50,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 2YD
    {
      id: 'white-settlement-2yd-1xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 102.64,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 44.10
    },
    {
      id: 'white-settlement-2yd-2xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 133.77,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 44.10
    },
    {
      id: 'white-settlement-2yd-3xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 180.45,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 44.10
    },
    {
      id: 'white-settlement-2yd-4xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 283.13,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 44.10
    },
    {
      id: 'white-settlement-2yd-5xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 339.12,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 44.10
    },
    {
      id: 'white-settlement-2yd-6xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 374.91,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 44.10
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'white-settlement-3yd-1xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 116.67,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.61
    },
    {
      id: 'white-settlement-3yd-2xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 158.66,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.61
    },
    {
      id: 'white-settlement-3yd-3xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 241.14,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.61
    },
    {
      id: 'white-settlement-3yd-4xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 331.37,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.61
    },
    {
      id: 'white-settlement-3yd-5xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 382.69,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.61
    },
    {
      id: 'white-settlement-3yd-6xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 451.13,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.61
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'white-settlement-4yd-1xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 130.67,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },
    {
      id: 'white-settlement-4yd-2xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 192.93,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },
    {
      id: 'white-settlement-4yd-3xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 290.89,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },
    {
      id: 'white-settlement-4yd-4xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 390.47,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },
    {
      id: 'white-settlement-4yd-5xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 452.68,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },
    {
      id: 'white-settlement-4yd-6xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 574.03,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'white-settlement-6yd-1xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 158.66,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.15
    },
    {
      id: 'white-settlement-6yd-2xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 248.90,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.15
    },
    {
      id: 'white-settlement-6yd-3xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 398.22,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.15
    },
    {
      id: 'white-settlement-6yd-4xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 508.68,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.15
    },
    {
      id: 'white-settlement-6yd-5xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 600.48,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.15
    },
    {
      id: 'white-settlement-6yd-6xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 714.06,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.15
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'white-settlement-8yd-1xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 210.02,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 71.66
    },
    {
      id: 'white-settlement-8yd-2xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 286.23,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 71.66
    },
    {
      id: 'white-settlement-8yd-3xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 460.48,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 71.66
    },
    {
      id: 'white-settlement-8yd-4xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 560.03,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 71.66
    },
    {
      id: 'white-settlement-8yd-5xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 633.13,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 71.66
    },
    {
      id: 'white-settlement-8yd-6xweek',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 732.70,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 71.66
    },

    // Roll-off Pricing
    {
      id: 'white-settlement-rolloff-20yd',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 198.60, // Daily rent * 30 days
      deliveryFee: 137.81,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'white-settlement-rolloff-30yd',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 198.60,
      deliveryFee: 137.81,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'white-settlement-rolloff-40yd',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 198.60,
      deliveryFee: 137.81,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Compactor Pricing
    {
      id: 'white-settlement-compactor-monthly',
      city: 'White Settlement',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 385.88,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'WHITE SETTLEMENT NEW RATES - Sheet1.csv'
};

// Helper function to get White Settlement municipal pricing data
export function getWhiteSettlementMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading White Settlement municipal contract pricing:', {
    totalRates: WHITE_SETTLEMENT_MUNICIPAL_PRICING.rates.length,
    cartRates: WHITE_SETTLEMENT_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: WHITE_SETTLEMENT_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: WHITE_SETTLEMENT_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: WHITE_SETTLEMENT_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length
  });
  
  return WHITE_SETTLEMENT_MUNICIPAL_PRICING;
}