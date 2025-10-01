// Iredell Municipal Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const IREDELL_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Iredell',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'iredell-rolloff-20yd',
      city: 'Iredell',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 2.91,
      deliveryFee: 203.90,
      haulFee: 629.17,
      disposalFee: 69.90,
      disposalMinimum: 4,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'iredell-rolloff-30yd',
      city: 'Iredell',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 2.91,
      deliveryFee: 203.90,
      haulFee: 687.41,
      disposalFee: 69.90,
      disposalMinimum: 4,
      franchiseFee: 0,
      salesTax: 8.25
    },
    {
      id: 'iredell-rolloff-40yd',
      city: 'Iredell',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 2.91,
      deliveryFee: 203.90,
      haulFee: 745.68,
      disposalFee: 69.90,
      disposalMinimum: 4,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-10-01T00:00:00.000Z',
  sourceFile: 'Iredell.png'
};

export function getIredellMunicipalPricing(): FranchisedCityPricing {
  return IREDELL_MUNICIPAL_PRICING;
}
