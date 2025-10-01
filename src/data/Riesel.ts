// Riesel Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const RIESEL_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Riesel',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'riesel-rolloff-20-40yd',
      city: 'Riesel',
      state: 'Texas',
      containerSize: '20-40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 166.28,
      deliveryFee: 263.28,
      haulFee: 311.78,
      disposalFee: 62.35,
      disposalMinimum: 3,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'riesel-rolloff-compactor',
      city: 'Riesel',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      haulFee: 519.66,
      disposalFee: 562.35,
      disposalMinimum: 3,
      franchiseFee: 5,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Riesel.png'
};

export function getRieselMunicipalPricing(): FranchisedCityPricing {
  return RIESEL_MUNICIPAL_PRICING;
}
