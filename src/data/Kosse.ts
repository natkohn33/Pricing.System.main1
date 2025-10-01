 // Kosse Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const KOSSE_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Kosse',
  state: 'Texas',
  rates: [
    // Commercial Cart Services
    {
      id: 'kosse-commercial-1cart-1xweek',
      city: 'Kosse',
      state: 'Texas',
      containerSize: '1 Cart',
      frequency: '1x/week',
      equipmentType: 'Commercial Cart',
      monthlyRate: 26.27,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'kosse-commercial-extra-cart-1xweek',
      city: 'Kosse',
      state: 'Texas',
      containerSize: 'Extra Cart',
      frequency: '1x/week',
      equipmentType: 'Commercial Cart',
      monthlyRate: 13.13,
      franchiseFee: 5,
      salesTax: 8.25
    },

    // Commercial Dumpster Services
    {
      id: 'kosse-dumpster-2yd-1xweek',
      city: 'Kosse',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Dumpster',
      monthlyRate: 73.79,
      extraPickupRate: 37.46,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'kosse-dumpster-3yd-1xweek',
      city: 'Kosse',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Dumpster',
      monthlyRate: 99.69,
      extraPickupRate: 49.95,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'kosse-dumpster-4yd-1xweek',
      city: 'Kosse',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Dumpster',
      monthlyRate: 121.10,
      extraPickupRate: 62.45,
      franchiseFee: 5,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-06-01T00:00:00.000Z',
  sourceFile: 'Kosse.png'
};

export function getKosseMunicipalPricing(): FranchisedCityPricing {
  return KOSSE_MUNICIPAL_PRICING;
}

