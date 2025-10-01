// Mexia Municipal Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const MEXIA_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Mexia',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'mexia-rolloff-20yd',
      city: 'Mexia',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 5.00,
      deliveryFee: 150.00,
      haulFee: 300.00,
      disposalFee: 50.00,
      fuelSurcharge: 50.00,
      salesTax: 8.25
    },
    {
      id: 'mexia-rolloff-30yd',
      city: 'Mexia',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 5.00,
      deliveryFee: 150.00,
      haulFee: 300.00,
      disposalFee: 50.00,
      fuelSurcharge: 50.00,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Mexia.png'
};

export function getMexiaMunicipalPricing(): FranchisedCityPricing {
  return MEXIA_MUNICIPAL_PRICING;
}
