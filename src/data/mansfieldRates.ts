// Built-in Mansfield Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(MANSFIELD).csv"
// Effective 10/1/24

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const MANSFIELD_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Mansfield',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'mansfield-2yd-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 82.95,
      deliveryFee: 96.30,
      franchiseFee: 8, // 8% City of Mansfield
      salesTax: 8.25,
      extraPickupRate: 0 // Marked as 'S' in rate sheet
    },
    {
      id: 'mansfield-2yd-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 122.96,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-2yd-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 162.10,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-2yd-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 201.70,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-2yd-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 241.26,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-2yd-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 292.01,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'mansfield-3yd-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 97.30,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 46.46
    },
    {
      id: 'mansfield-3yd-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 175.32,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 46.46
    },
    {
      id: 'mansfield-3yd-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 245.93,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 46.46
    },
    {
      id: 'mansfield-3yd-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 321.55,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 46.46
    },
    {
      id: 'mansfield-3yd-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 397.19,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 46.46
    },
    {
      id: 'mansfield-3yd-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 484.31,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 46.46
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'mansfield-4yd-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 122.51,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 59.36
    },
    {
      id: 'mansfield-4yd-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 212.50,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 59.36
    },
    {
      id: 'mansfield-4yd-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 305.30,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 59.36
    },
    {
      id: 'mansfield-4yd-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 398.07,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 59.36
    },
    {
      id: 'mansfield-4yd-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 490.74,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 59.36
    },
    {
      id: 'mansfield-4yd-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 618.21,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 59.36
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'mansfield-6yd-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 154.04,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 77.43
    },
    {
      id: 'mansfield-6yd-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 272.81,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 77.43
    },
    {
      id: 'mansfield-6yd-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 391.61,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 77.43
    },
    {
      id: 'mansfield-6yd-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 510.38,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 77.43
    },
    {
      id: 'mansfield-6yd-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 629.19,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 77.43
    },
    {
      id: 'mansfield-6yd-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 824.25,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 77.43
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'mansfield-8yd-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 204.40,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 103.21
    },
    {
      id: 'mansfield-8yd-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 343.84,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 103.21
    },
    {
      id: 'mansfield-8yd-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 464.34,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 103.21
    },
    {
      id: 'mansfield-8yd-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 584.83,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 103.21
    },
    {
      id: 'mansfield-8yd-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 705.29,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 103.21
    },
    {
      id: 'mansfield-8yd-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 919.31,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 103.21
    },

    // 2YD Compactor Pricing
    {
      id: 'mansfield-2yd-compactor-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 303.53,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 122.69
    },
    {
      id: 'mansfield-2yd-compactor-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 449.96,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 122.69
    },
    {
      id: 'mansfield-2yd-compactor-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Compactor',
      monthlyRate: 593.19,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 122.69
    },
    {
      id: 'mansfield-2yd-compactor-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Compactor',
      monthlyRate: 738.06,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 122.69
    },
    {
      id: 'mansfield-2yd-compactor-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '5x/week',
      equipmentType: 'Compactor',
      monthlyRate: 882.60,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 122.69
    },
    {
      id: 'mansfield-2yd-compactor-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '6x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1068.48,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 122.69
    },

    // 3YD Compactor Pricing
    {
      id: 'mansfield-3yd-compactor-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 355.99,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 169.99
    },
    {
      id: 'mansfield-3yd-compactor-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 641.51,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 169.99
    },
    {
      id: 'mansfield-3yd-compactor-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Compactor',
      monthlyRate: 899.82,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 169.99
    },
    {
      id: 'mansfield-3yd-compactor-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1176.52,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 169.99
    },
    {
      id: 'mansfield-3yd-compactor-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1453.32,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 169.99
    },
    {
      id: 'mansfield-3yd-compactor-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1772.13,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 169.99
    },

    // 4YD Compactor Pricing
    {
      id: 'mansfield-4yd-compactor-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 448.28,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 217.19
    },
    {
      id: 'mansfield-4yd-compactor-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 777.59,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 217.19
    },
    {
      id: 'mansfield-4yd-compactor-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1117.12,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 217.19
    },
    {
      id: 'mansfield-4yd-compactor-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1456.60,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 217.19
    },
    {
      id: 'mansfield-4yd-compactor-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1795.68,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 217.19
    },
    {
      id: 'mansfield-4yd-compactor-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Compactor',
      monthlyRate: 2262.10,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 217.19
    },

    // 6YD Compactor Pricing
    {
      id: 'mansfield-6yd-compactor-1xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 563.61,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 283.30
    },
    {
      id: 'mansfield-6yd-compactor-2xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 998.25,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 283.30
    },
    {
      id: 'mansfield-6yd-compactor-3xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1432.91,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 283.30
    },
    {
      id: 'mansfield-6yd-compactor-4xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1867.53,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 283.30
    },
    {
      id: 'mansfield-6yd-compactor-5xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Compactor',
      monthlyRate: 2635.60,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 283.30
    },
    {
      id: 'mansfield-6yd-compactor-6xweek',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Compactor',
      monthlyRate: 3016.05,
      deliveryFee: 96.30,
      franchiseFee: 8,
      salesTax: 8.25,
      extraPickupRate: 283.30
    },

    // Roll-off Pricing
    {
      id: 'mansfield-rolloff-20yd',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 149.26, // Monthly rental
      deliveryFee: 137.66,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-rolloff-30yd',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 149.26, // Monthly rental
      deliveryFee: 137.66,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-rolloff-40yd',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 149.26, // Monthly rental
      deliveryFee: 137.66,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-rolloff-30yd-compactor',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 149.26, // Monthly rental (NEGO in original, using standard)
      deliveryFee: 137.66,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-rolloff-35yd-compactor',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '35YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 149.26, // Monthly rental (NEGO in original, using standard)
      deliveryFee: 137.66,
      franchiseFee: 8,
      salesTax: 8.25
    },
    {
      id: 'mansfield-rolloff-40yd-compactor',
      city: 'Mansfield',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      monthlyRate: 149.26, // Monthly rental (NEGO in original, using standard)
      deliveryFee: 137.66,
      franchiseFee: 8,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(MANSFIELD).csv'
};

// Helper function to get Mansfield municipal pricing data
export function getMansfieldMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Mansfield municipal contract pricing:', {
    totalRates: MANSFIELD_MUNICIPAL_PRICING.rates.length,
    frontLoadRates: MANSFIELD_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    compactorRates: MANSFIELD_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length,
    rollOffRates: MANSFIELD_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length
  });
  
  return MANSFIELD_MUNICIPAL_PRICING;
}