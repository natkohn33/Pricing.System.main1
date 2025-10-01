// Built-in Seagoville Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(SEAGOVILLE).csv"
// Effective 02/01/2025

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const SEAGOVILLE_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Seagoville',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'seagoville-2yd-1xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 74.92,
      deliveryFee: 110.44,
      franchiseFee: 10, // 10% City of Seagoville
      salesTax: 8.25,
      extraPickupRate: 30.92
    },
    {
      id: 'seagoville-2yd-2xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 132.71,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 30.92
    },
    {
      id: 'seagoville-2yd-3xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 214.11,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 30.92
    },
    {
      id: 'seagoville-2yd-4xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 280.20,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 30.92
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'seagoville-3yd-1xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 89.90,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 43.08
    },
    {
      id: 'seagoville-3yd-2xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 175.56,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 43.08
    },
    {
      id: 'seagoville-3yd-3xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 237.66,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 43.08
    },
    {
      id: 'seagoville-3yd-4xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 342.56,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 43.08
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'seagoville-4yd-1xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 102.74,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 53.01
    },
    {
      id: 'seagoville-4yd-2xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 216.24,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 53.01
    },
    {
      id: 'seagoville-4yd-3xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 333.98,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 53.01
    },
    {
      id: 'seagoville-4yd-4xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 434.60,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 53.01
    },
    {
      id: 'seagoville-4yd-5xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 539.51,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 53.01
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'seagoville-6yd-1xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 154.13,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.27
    },
    {
      id: 'seagoville-6yd-2xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 310.42,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.27
    },
    {
      id: 'seagoville-6yd-3xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 416.09,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.27
    },
    {
      id: 'seagoville-6yd-4xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 535.20,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.27
    },
    {
      id: 'seagoville-6yd-5xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 675.84,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.27
    },
    {
      id: 'seagoville-6yd-6xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 791.93,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 66.27
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'seagoville-8yd-1xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 186.44,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 77.31
    },
    {
      id: 'seagoville-8yd-2xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 338.12,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 77.31
    },
    {
      id: 'seagoville-8yd-3xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 535.20,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 77.31
    },
    {
      id: 'seagoville-8yd-4xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 706.49,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 77.31
    },
    {
      id: 'seagoville-8yd-5xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 909.89,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 77.31
    },
    {
      id: 'seagoville-8yd-6xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1077.56,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 77.31
    },

    // 6YD Compactor Pricing
    {
      id: 'seagoville-6yd-compactor-1xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Compactor',
      monthlyRate: 358.66,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 110.44
    },
    {
      id: 'seagoville-6yd-compactor-2xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Compactor',
      monthlyRate: 717.33,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 110.44
    },
    {
      id: 'seagoville-6yd-compactor-3xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1075.99,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 110.44
    },
    {
      id: 'seagoville-6yd-compactor-4xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1435.65,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 110.44
    },
    {
      id: 'seagoville-6yd-compactor-5xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Compactor',
      monthlyRate: 1793.32,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 110.44
    },
    {
      id: 'seagoville-6yd-compactor-6xweek',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Compactor',
      monthlyRate: 2151.98,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 110.44
    },

    // Roll-off Pricing
    {
      id: 'seagoville-rolloff-20yd',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 217.62, // Monthly rental
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'seagoville-rolloff-30yd',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 217.62,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'seagoville-rolloff-40yd',
      city: 'Seagoville',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 217.62,
      deliveryFee: 110.44,
      franchiseFee: 10,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(SEAGOVILLE).csv'
};

// Helper function to get Seagoville municipal pricing data
export function getSeagovilleMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Seagoville municipal contract pricing:', {
    totalRates: SEAGOVILLE_MUNICIPAL_PRICING.rates.length,
    dumpsterRates: SEAGOVILLE_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    compactorRates: SEAGOVILLE_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length,
    rollOffRates: SEAGOVILLE_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length
  });
  
  return SEAGOVILLE_MUNICIPAL_PRICING;
}