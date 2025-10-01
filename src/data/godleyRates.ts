// Built-in Godley Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(GODLEY).csv"
// Effective 04/01/2025

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const GODLEY_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Godley',
  state: 'Texas',
  rates: [
    // Commercial Cart Pricing
    {
      id: 'godley-95gal-1xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '95-Gallon',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 24.50,
      deliveryFee: 0, // Carts typically don't have delivery fees
      franchiseFee: 10, // 10% City of Godley
      salesTax: 8.25
    },
    {
      id: 'godley-95gal-extra',
      city: 'Godley',
      state: 'Texas',
      containerSize: '95-Gallon-Extra',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 12.25,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 2YD
    {
      id: 'godley-2yd-1xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 85.78,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 42.88
    },
    {
      id: 'godley-2yd-2xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 153.16,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 42.88
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'godley-3yd-1xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 98.03,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.02
    },
    {
      id: 'godley-3yd-2xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 177.67,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.02
    },
    {
      id: 'godley-3yd-3xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 318.58,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 49.02
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'godley-4yd-1xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 110.27,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },
    {
      id: 'godley-4yd-2xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 196.04,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },
    {
      id: 'godley-4yd-3xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 355.34,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 55.13
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'godley-6yd-1xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 159.30,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 79.64
    },
    {
      id: 'godley-6yd-2xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 287.95,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 79.64
    },
    {
      id: 'godley-6yd-3xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 392.10,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 79.64
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'godley-8yd-1xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 177.67,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 88.83
    },
    {
      id: 'godley-8yd-2xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 318.58,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 88.83
    },
    {
      id: 'godley-8yd-3xweek',
      city: 'Godley',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 453.36,
      deliveryFee: 95.00,
      franchiseFee: 10,
      salesTax: 8.25,
      extraPickupRate: 88.83
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(GODLEY).csv'
};

// Helper function to get Godley municipal pricing data
export function getGodleyMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Godley municipal contract pricing:', {
    totalRates: GODLEY_MUNICIPAL_PRICING.rates.length,
    cartRates: GODLEY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: GODLEY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: GODLEY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: GODLEY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length
  });
  
  return GODLEY_MUNICIPAL_PRICING;
}