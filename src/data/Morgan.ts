// Morgan Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const MORGAN_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Morgan',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'morgan-rolloff-20yd',
      city: 'Morgan',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 6.27,
      deliveryFee: 501.34,
      haulFee: 501.34,
      disposalFee: 59.39,
      disposalMinimum: 2,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'morgan-rolloff-30yd',
      city: 'Morgan',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 6.27,
      deliveryFee: 626.68,
      haulFee: 626.68,
      disposalFee: 59.39,
      disposalMinimum: 3,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'morgan-rolloff-40yd',
      city: 'Morgan',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 6.27,
      deliveryFee: 752.02,
      haulFee: 752.02,
      disposalFee: 59.39,
      disposalMinimum: 4,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-07-01T00:00:00.000Z',
  sourceFile: 'Morgan.png'
};

export function getMorganMunicipalPricing(): FranchisedCityPricing {
  return MORGAN_MUNICIPAL_PRICING;
}
