// Built-in Pearland Municipal Contract Pricing Data
// Parsed from "COMMERCIAL RATE SCHEDULE 10/2024-09/2025"
// Effective 10/1/24 - 09/30/25

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const PEARLAND_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Pearland',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'pearland-2yd-1xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 80.42,
      deliveryFee: 0, // Not specified in rate sheet
      franchiseFee: 15, // 15% City of Pearland
      salesTax: 8.25,
      extraPickupRate: 35.12
    },
    {
      id: 'pearland-2yd-2xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 117.29,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 35.12
    },
    {
      id: 'pearland-2yd-3xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 154.13,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 35.12
    },
    {
      id: 'pearland-2yd-4xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 191.55,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 35.12
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'pearland-3yd-1xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 97.89,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 53.12
    },
    {
      id: 'pearland-3yd-2xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 148.30,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 53.12
    },
    {
      id: 'pearland-3yd-3xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 198.70,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 53.12
    },
    {
      id: 'pearland-3yd-4xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 249.11,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 53.12
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'pearland-4yd-1xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 117.71,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 64.93
    },
    {
      id: 'pearland-4yd-2xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 173.50,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 64.93
    },
    {
      id: 'pearland-4yd-3xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 233.61,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 64.93
    },
    {
      id: 'pearland-4yd-4xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 293.73,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 64.93
    },
    {
      id: 'pearland-4yd-5xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 353.85,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 64.93
    },
    {
      id: 'pearland-4yd-6xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 412.82,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 64.93
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'pearland-6yd-1xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 140.58,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 70.83
    },
    {
      id: 'pearland-6yd-2xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 231.65,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 70.83
    },
    {
      id: 'pearland-6yd-3xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 293.97,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 70.83
    },
    {
      id: 'pearland-6yd-4xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 391.02,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 70.83
    },
    {
      id: 'pearland-6yd-5xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 488.04,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 70.83
    },
    {
      id: 'pearland-6yd-6xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 585.08,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 70.83
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'pearland-8yd-1xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 165.51,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 88.53
    },
    {
      id: 'pearland-8yd-2xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 284.00,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 88.53
    },
    {
      id: 'pearland-8yd-3xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 391.01,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 88.53
    },
    {
      id: 'pearland-8yd-4xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 520.39,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 88.53
    },
    {
      id: 'pearland-8yd-5xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 649.80,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 88.53
    },
    {
      id: 'pearland-8yd-6xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 779.13,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      extraPickupRate: 88.53
    },

    // Commercial Cart Pricing - 95-gallon
    {
      id: 'pearland-95gal-1xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '95-gallon',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 23.55,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25
    },
    {
      id: 'pearland-95gal-2xweek',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '95-gallon',
      frequency: '2x/week',
      equipmentType: 'Cart',
      monthlyRate: 29.45,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25
    },
    {
      id: 'pearland-95gal-recycle',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '95-gallon',
      frequency: '1x/week',
      equipmentType: 'Recycling Cart',
      monthlyRate: 8.85,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25
    },

    // Roll-off Pricing
    {
      id: 'pearland-rolloff-20yd',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 3.54, // Daily rent × 30 days (approximately)
      deliveryFee: 59.02,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 265.60,
      perTonRate: 53.12
    },
    {
      id: 'pearland-rolloff-30yd',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 3.54, // Daily rent × 30 days (approximately)
      deliveryFee: 88.53,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 265.60,
      perTonRate: 53.12
    },
    {
      id: 'pearland-rolloff-40yd',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 3.54, // Daily rent × 30 days (approximately)
      deliveryFee: 88.53,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 301.02,
      perTonRate: 53.12
    },

    // Compactor Pricing
    {
      id: 'pearland-compactor-15yd',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '15YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 466.29,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 265.60,
      perTonRate: 53.12
    },
    {
      id: 'pearland-compactor-20yd',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 466.29,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 265.60,
      perTonRate: 53.12
    },
    {
      id: 'pearland-compactor-25yd',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '25YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 531.22,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 265.60,
      perTonRate: 53.12
    },
    {
      id: 'pearland-compactor-30yd',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 584.34,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 265.60,
      perTonRate: 53.12
    },
    {
      id: 'pearland-compactor-35yd',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '35YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 584.34,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 324.63,
      perTonRate: 53.12
    },
    {
      id: 'pearland-compactor-40yd-receiver',
      city: 'Pearland',
      state: 'Texas',
      containerSize: '40YD',
      frequency: 'on-call',
      equipmentType: 'Compactor',
      monthlyRate: 186.52,
      deliveryFee: 0,
      franchiseFee: 15,
      salesTax: 8.25,
      haulRate: 265.60,
      perTonRate: 53.12
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'COMMERCIAL RATE SCHEDULE 10/2024-09/2025'
};

// Helper function to get Pearland municipal pricing data
export function getPearlandMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Pearland municipal contract pricing:', {
    totalRates: PEARLAND_MUNICIPAL_PRICING.rates.length,
    frontLoadRates: PEARLAND_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    cartRates: PEARLAND_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType.includes('Cart')).length,
    rollOffRates: PEARLAND_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: PEARLAND_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length
  });
  
  return PEARLAND_MUNICIPAL_PRICING;
}