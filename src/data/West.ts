// West Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const WEST_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'West',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'west-rolloff-10yd',
      city: 'West',
      state: 'Texas',
      containerSize: '10YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 3.26,
      deliveryFee: 76.02,
      haulFee: 180.51,
      disposalFee: 52.77,
      disposalMinimum: 1,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'west-rolloff-15yd',
      city: 'West',
      state: 'Texas',
      containerSize: '15YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 3.26,
      deliveryFee: 76.02,
      haulFee: 228.86,
      disposalFee: 52.77,
      disposalMinimum: 2,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'west-rolloff-20yd',
      city: 'West',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 3.26,
      deliveryFee: 128.99,
      haulFee: 353.57,
      disposalFee: 52.77,
      disposalMinimum: 3,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'west-rolloff-30yd',
      city: 'West',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 3.26,
      deliveryFee: 128.99,
      haulFee: 401.60,
      disposalFee: 52.77,
      disposalMinimum: 4,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'west-rolloff-40yd',
      city: 'West',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 3.26,
      deliveryFee: 128.99,
      haulFee: 449.64,
      disposalFee: 52.77,
      disposalMinimum: 5,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'west-rolloff-compactor',
      city: 'West',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      haulFee: 673.68,
      disposalFee: 52.77,
      disposalMinimum: 5,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'West.png'
};

export function getWestMunicipalPricing(): FranchisedCityPricing {
  return WEST_MUNICIPAL_PRICING;
}
