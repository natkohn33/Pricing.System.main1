// Italy Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const ITALY_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Italy',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'italy-rolloff-10yd',
      city: 'Italy',
      state: 'Texas',
      containerSize: '10YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 3.11,
      deliveryFee: 138.09,
      haulFee: 352.75,
      disposalFee: 56.50,
      disposalMinimum: 1,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'italy-rolloff-15yd',
      city: 'Italy',
      state: 'Texas',
      containerSize: '15YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 3.11,
      deliveryFee: 138.09,
      haulFee: 352.75,
      disposalFee: 56.50,
      disposalMinimum: 2,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'italy-rolloff-20yd',
      city: 'Italy',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 4.02,
      deliveryFee: 138.09,
      haulFee: 392.76,
      disposalFee: 56.50,
      disposalMinimum: 3,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'italy-rolloff-30yd',
      city: 'Italy',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 4.68,
      deliveryFee: 138.09,
      haulFee: 446.11,
      disposalFee: 56.50,
      disposalMinimum: 4,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'italy-rolloff-40yd',
      city: 'Italy',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 5.35,
      deliveryFee: 138.09,
      haulFee: 499.46,
      disposalFee: 56.50,
      disposalMinimum: 5,
      franchiseFee: 10,
      salesTax: 8.25
    },
    {
      id: 'italy-rolloff-compactor',
      city: 'Italy',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: '1x/month',
      equipmentType: 'Compactor',
      haulFee: 748.85,
      disposalFee: 56.50,
      disposalMinimum: 5,
      franchiseFee: 10,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-10-01T00:00:00.000Z',
  sourceFile: 'Italy.png'
};

export function getItalyMunicipalPricing(): FranchisedCityPricing {
  return ITALY_MUNICIPAL_PRICING;
}
