// Hico Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const HICO_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Hico',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'hico-rolloff-20yd',
      city: 'Hico',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 5.25,
      deliveryFee: 229.98,
      haulFee: 709.63,
      disposalFee: 78.85,
      disposalMinimum: 3,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'hico-rolloff-30yd',
      city: 'Hico',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 5.25,
      deliveryFee: 229.98,
      haulFee: 775.34,
      disposalFee: 78.85,
      disposalMinimum: 4,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'hico-rolloff-40yd',
      city: 'Hico',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 5.25,
      deliveryFee: 229.98,
      haulFee: 841.05,
      disposalFee: 78.85,
      disposalMinimum: 5,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'hico-rolloff-40yd-comp',
      city: 'Hico',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      haulFee: 841.05,
      disposalFee: 78.85,
      disposalMinimum: 5,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-10-01T00:00:00.000Z',
  sourceFile: 'Hico.png'
};

export function getHicoMunicipalPricing(): FranchisedCityPricing {
  return HICO_MUNICIPAL_PRICING;
}

