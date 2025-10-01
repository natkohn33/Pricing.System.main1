// Built-in New Fairview Municipal Contract Pricing Data
// Parsed from "MUNICIPAL CONTRACTS (NTX) (1)(NEW FAIRVIEW).csv"
// Effective Current

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const NEW_FAIRVIEW_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'New Fairview',
  state: 'Texas',
  rates: [
    // Commercial Cart Pricing
    {
      id: 'new-fairview-1cart-1xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '1-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 24.75,
      deliveryFee: 0, // Carts typically don't have delivery fees
      franchiseFee: 10, // 10% City of New Fairview
      salesTax: 8.25
    },
    {
      id: 'new-fairview-extra-cart',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: 'Extra-Cart',
      frequency: '1x/week',
      equipmentType: 'Cart',
      monthlyRate: 12.38,
      deliveryFee: 0,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 2YD
    {
      id: 'new-fairview-2yd-1xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 68.34,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'new-fairview-2yd-2xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 123.79,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'new-fairview-3yd-1xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 83.19,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'new-fairview-3yd-2xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 146.57,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'new-fairview-4yd-1xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 98.05,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'new-fairview-4yd-2xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 177.27,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'new-fairview-6yd-1xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 113.89,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'new-fairview-6yd-2xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 197.08,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'new-fairview-8yd-1xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 128.75,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'new-fairview-8yd-2xweek',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 216.89,
      deliveryFee: 112.20,
      franchiseFee: 10,
      salesTax: 8.25
    },

    // Roll-off Pricing
    {
      id: 'new-fairview-rolloff-20yd',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 121.24, // Monthly rental
      deliveryFee: 112.20,
      franchiseFee: 0, // No franchise fee on roll-off
      salesTax: 8.25
    },
    {
      id: 'new-fairview-rolloff-30yd',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 121.24,
      deliveryFee: 112.20,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'new-fairview-rolloff-40yd',
      city: 'New Fairview',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 121.24,
      deliveryFee: 112.20,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(NEW FAIRVIEW).csv'
};

// Helper function to get New Fairview municipal pricing data
export function getNewFairviewMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading New Fairview municipal contract pricing:', {
    totalRates: NEW_FAIRVIEW_MUNICIPAL_PRICING.rates.length,
    cartRates: NEW_FAIRVIEW_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: NEW_FAIRVIEW_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: NEW_FAIRVIEW_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length
  });
  
  return NEW_FAIRVIEW_MUNICIPAL_PRICING;
}