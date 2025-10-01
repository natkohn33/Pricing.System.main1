 // Lorena Municipal Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const LORENA_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Lorena',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'lorena-rolloff-20-40yd',
      city: 'Lorena',
      state: 'Texas',
      containerSize: '20-40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 4.41,
      deliveryFee: 291.06,
      haulFee: 173.81,
      disposalFee: 49.61,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'lorena-rolloff-compactor',
      city: 'Lorena',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      haulFee: 231.17,
      disposalFee: 49.61,
      franchiseFee: 5,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-10-01T00:00:00.000Z',
  sourceFile: 'Lorena.png'
};

export function getLorenaMunicipalPricing(): FranchisedCityPricing {
  return LORENA_MUNICIPAL_PRICING;
}
 
