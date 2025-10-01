 // Normangee Municipal Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const NORMANGEE_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Normangee',
  state: 'Texas',
  rates: [
    // Roll-off Services
    {
      id: 'normangee-rolloff-30yd',
      city: 'Normangee',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      dailyRate: 7.52,
      deliveryFee: 165.14,
      haulFee: 390.34,
      disposalFee: 60.05,
      disposalMinimum: 3,
      franchiseFee: 0,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2024-10-01T00:00:00.000Z',
  sourceFile: 'Normangee.png'
};

export function getNormangeeMunicipalPricing(): FranchisedCityPricing {
  return NORMANGEE_MUNICIPAL_PRICING;
}
