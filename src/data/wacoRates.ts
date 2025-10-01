// Built-in Waco Municipal Contract Pricing Data
// Parsed from "public/data/Rates NTX _ STX.xlsx - waco (2).csv"
// Effective Current

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const WACO_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Waco',
  state: 'Texas',
  rates: [
    // Commercial Front Load Dumpster Pricing - 2YD
    {
      id: 'waco-2yd-1xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 72.00,
      deliveryFee: 100.00,
      franchiseFee: 4, // 4% City of Waco Franchise Fee
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-2yd-2xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 132.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },

    // Commercial Front Load Dumpster Pricing - 3YD
    {
      id: 'waco-3yd-1xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 82.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-3yd-2xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 152.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-3yd-3xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 222.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-3yd-4xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 292.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-3yd-5xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 362.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-3yd-6xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 467.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },

    // Commercial Front Load Dumpster Pricing - 4YD
    {
      id: 'waco-4yd-1xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 92.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-4yd-2xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 172.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-4yd-3xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 252.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-4yd-4xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 332.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-4yd-5xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 412.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-4yd-6xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 532.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },

    // Commercial Front Load Dumpster Pricing - 6YD
    {
      id: 'waco-6yd-1xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 126.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-6yd-2xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 252.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-6yd-3xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 378.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-6yd-4xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 480.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-6yd-5xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 630.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-6yd-6xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 875.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },

    // Commercial Front Load Dumpster Pricing - 8YD
    {
      id: 'waco-8yd-1xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 168.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-8yd-2xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 336.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-8yd-3xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 504.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-8yd-4xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 666.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-8yd-5xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 840.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },
    {
      id: 'waco-8yd-6xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1170.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 100.00
    },

    // VIP Pricing
    {
      id: 'waco-vip-1xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: 'VIP',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 350.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 150.00
    },
    {
      id: 'waco-vip-2xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: 'VIP',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 616.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 150.00
    },
    {
      id: 'waco-vip-3xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: 'VIP',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 882.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 150.00
    },
    {
      id: 'waco-vip-4xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: 'VIP',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1148.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 150.00
    },
    {
      id: 'waco-vip-5xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: 'VIP',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1400.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 150.00
    },
    {
      id: 'waco-vip-6xweek',
      city: 'Waco',
      state: 'Texas',
      containerSize: 'VIP',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1848.00,
      deliveryFee: 100.00,
      franchiseFee: 4,
      salesTax: 8.25,
      extraPickupRate: 150.00
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'public/data/Rates NTX _ STX.xlsx - waco (2).csv'
};

// Helper function to get Waco municipal pricing data
export function getWacoMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Waco specific city pricing:', {
    totalRates: WACO_MUNICIPAL_PRICING.rates.length,
    frontLoadRates: WACO_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    vipRates: WACO_MUNICIPAL_PRICING.rates.filter(r => r.containerSize === 'VIP').length,
    franchiseFee: '4%',
    salesTax: '8.25%',
    deliveryFee: '$100.00',
    extraPickupRate: '$100.00 (standard), $150.00 (VIP)'
  });
  
  return WACO_MUNICIPAL_PRICING;
}