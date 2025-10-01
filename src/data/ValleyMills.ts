// Valley Mills Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const VALLEY_MILLS_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Valley Mills',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'valley-mills-rolloff-20-30-40yd',
      city: 'Valley Mills',
      state: 'Texas',
      containerSize: '20-30-40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 6.27,
      deliveryFee: 626.50,
      haulFee: 607.02,
      disposalFee: 59.37,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Valley Mills.png'
};

export function getValleyMillsMunicipalPricing(): FranchisedCityPricing {
  return VALLEY_MILLS_MUNICIPAL_PRICING;
}
