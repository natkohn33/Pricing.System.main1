// Groesbeck Municipal Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const GROESBECK_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Groesbeck',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'groesbeck-rolloff-20-40yd',
      city: 'Groesbeck',
      state: 'Texas',
      containerSize: '20/30/40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 6.23,
      deliveryFee: 342.74,
      haulFee: 261.73,
      disposalFee: 62.32,
      disposalMinimum: 5,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-06-01T00:00:00.000Z',
  sourceFile: 'Groesbeck.png'
};

export function getGroesbeckMunicipalPricing(): FranchisedCityPricing {
  return GROESBECK_MUNICIPAL_PRICING;
}

