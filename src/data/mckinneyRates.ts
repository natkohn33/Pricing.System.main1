// Built-in McKinney Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(MCKINNEY).csv"
// Effective 10/01/2024

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const MCKINNEY_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'McKinney',
  state: 'Texas',
  rates: [
    // Commercial Cart Pricing
    {
      id: 'mckinney-1cart-1xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 26.08,
      deliveryFee: 0, // Carts typically don't have delivery fees
      franchiseFee: 5, // 5% City of McKinney
      salesTax: 8.25
    },
    {
      id: 'mckinney-1cart-2xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '2x/week',
      equipmentType: 'Cart',
      monthlyRate: 52.54,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'mckinney-3yd-1xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 117.60,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 38.21
    },
    {
      id: 'mckinney-3yd-2xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 230.22,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 38.21
    },
    {
      id: 'mckinney-3yd-3xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 297.07,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 38.21
    },
    {
      id: 'mckinney-3yd-4xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 387.58,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 38.21
    },
    {
      id: 'mckinney-3yd-5xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 463.50,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 38.21
    },
    {
      id: 'mckinney-3yd-6xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 573.65,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 38.21
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'mckinney-4yd-1xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 150.32,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 52.71
    },
    {
      id: 'mckinney-4yd-2xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 271.77,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 52.71
    },
    {
      id: 'mckinney-4yd-3xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 406.08,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 52.71
    },
    {
      id: 'mckinney-4yd-4xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 533.46,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 52.71
    },
    {
      id: 'mckinney-4yd-5xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 632.58,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 52.71
    },
    {
      id: 'mckinney-4yd-6xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 755.85,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 52.71
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'mckinney-6yd-1xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 208.70,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 72.46
    },
    {
      id: 'mckinney-6yd-2xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 337.33,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 72.46
    },
    {
      id: 'mckinney-6yd-3xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 507.89,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 72.46
    },
    {
      id: 'mckinney-6yd-4xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 651.08,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 72.46
    },
    {
      id: 'mckinney-6yd-5xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 763.07,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 72.46
    },
    {
      id: 'mckinney-6yd-6xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 927.97,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 72.46
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'mckinney-8yd-1xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 254.76,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 86.96
    },
    {
      id: 'mckinney-8yd-2xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 471.67,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 86.96
    },
    {
      id: 'mckinney-8yd-3xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 669.97,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 86.96
    },
    {
      id: 'mckinney-8yd-4xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 890.81,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 86.96
    },
    {
      id: 'mckinney-8yd-5xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1092.86,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 86.96
    },
    {
      id: 'mckinney-8yd-6xweek',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1304.33,
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25,
      extraPickupRate: 86.96
    },

    // Roll-off Pricing
    {
      id: 'mckinney-rolloff-20yd',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 157.50, // Monthly rental
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'mckinney-rolloff-30yd',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 157.50, // Monthly rental
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'mckinney-rolloff-40yd',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 157.50, // Monthly rental
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'mckinney-rolloff-15yd-compactor',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '15YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 157.50, // Monthly rental
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'mckinney-rolloff-20yd-compactor',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 157.50, // Monthly rental
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'mckinney-rolloff-30yd-compactor',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 157.50, // Monthly rental
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'mckinney-rolloff-35yd-compactor',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '35YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 157.50, // Monthly rental
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'mckinney-rolloff-40yd-compactor',
      city: 'McKinney',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 157.50, // Monthly rental
      deliveryFee: 99.75,
      franchiseFee: 5,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(MCKINNEY).csv'
};

// Helper function to get McKinney municipal pricing data
export function getMcKinneyMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading McKinney municipal contract pricing:', {
    totalRates: MCKINNEY_MUNICIPAL_PRICING.rates.length,
    cartRates: MCKINNEY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: MCKINNEY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: MCKINNEY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off' || r.equipmentType === 'Compactor').length
  });
  
  return MCKINNEY_MUNICIPAL_PRICING;
}