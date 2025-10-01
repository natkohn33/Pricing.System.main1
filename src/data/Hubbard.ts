// Hubbard Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const HUBBARD_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Hubbard',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'hubbard-rolloff-20yd',
      city: 'Hubbard',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 4.00,
      monthlyRate: 124.47,
      deliveryFee: 207.45,
      haulFee: 363.03,
      disposalFee: 57.05,
      disposalMinimum: 3,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'hubbard-rolloff-30yd',
      city: 'Hubbard',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 4.00,
      monthlyRate: 124.47,
      deliveryFee: 207.45,
      haulFee: 466.75,
      disposalFee: 57.05,
      disposalMinimum: 4,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'hubbard-rolloff-40yd',
      city: 'Hubbard',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 4.00,
      monthlyRate: 124.47,
      deliveryFee: 207.45,
      haulFee: 570.47,
      disposalFee: 57.05,
      disposalMinimum: 5,
      franchiseFee: 5,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Hubbard.png'
};

export function getHubbardMunicipalPricing(): FranchisedCityPricing {
  return HUBBARD_MUNICIPAL_PRICING;
}
