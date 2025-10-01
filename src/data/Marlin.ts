// Marlin Municipal Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const MARLIN_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Marlin',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'marlin-rolloff-20-40yd',
      city: 'Marlin',
      state: 'Texas',
      containerSize: '20-40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 6.82,
      deliveryFee: 258.87,
      haulFee: 306.57,
      disposalFee: 74.93,
      disposalMinimum: 3,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'marlin-rolloff-compactor',
      city: 'Marlin',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      haulFee: 510.94,
      disposalFee: 74.93,
      disposalMinimum: 3,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-01-01T00:00:00.000Z',
  sourceFile: 'Marlin.png'
};

export function getMarlinMunicipalPricing(): FranchisedCityPricing {
  return MARLIN_MUNICIPAL_PRICING;
}
