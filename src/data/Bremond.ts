// Built-in Bremond Municipal Contract Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const BREMOND_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Bremond',
  state: 'Texas',
  rates: [
    // Commercial Cart Pricing
    {
      id: 'bremond-commercial-cart-1xweek',
      city: 'Bremond',
      state: 'Texas',
      containerSize: 'Commercial Cart',
      frequency: '1x/week',
      equipmentType: 'Commercial Cart',
      monthlyRate: 9.76,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 0,
      billingGroup: 'MONTHLY DUMPSTERS'
    },
    {
      id: 'bremond-commercial-cart-2xweek',
      city: 'Bremond',
      state: 'Texas',
      containerSize: 'Commercial Cart',
      frequency: '2x/week',
      equipmentType: 'Commercial Cart',
      monthlyRate: 19.35,
      deliveryFee: 0,
      franchiseFee: 5,
      salesTax: 0,
      extraPickupRate: 0,
      billingGroup: 'MONTHLY DUMPSTERS'
    }
  ],
  additionalNotes: [
    'RESIDENTIAL ONLY IS BILLED THROUGH THE CITY',
    'RESIDENTIAL COLLECTION IS ONCE A WEEK ON THURSDAY - HEARNE',
    'WE DO NOT OFFER RECYCLE IN BREMOND',
    'ALL TRASH MUST BE IN CARTS WE PROVIDE',
    'ADDITIONAL CARTS ARE REQUESTED THROUGH THE CITY ONLY',
    '*BULK & BRUSH COLLECTION IS ONCE A MONTH ON THEIR LAST PICK UP DAY W/A 1YD LIMIT',
    'RESIDENT MUST CONTACT CITY TO SCHEDULE PICK UP',
    'RESIDENT WILL CONTACT CITY FOR MISSED TRASH',
    'DUMPSTERS ARE SL CONTAINERS',
    'BILLING GROUP - MONTHLY DUMPSTERS',
    '5% FRANCHISE FEE IN ADDITION TO THESE RATES'
  ],
  serviceDetails: {
    residentialCollection: 'Once weekly (Thursday) - Hearne',
    recycling: 'Not offered',
    bulkCollection: 'Once monthly on last pickup day with 1YD limit - must contact city to schedule',
    cartPolicy: 'City-provided carts only',
    dumpsterType: 'SL Containers'
  },
  franchiseFee: 5,
  billingInfo: {
    billingGroup: 'MONTHLY DUMPSTERS'
  },
  lastUpdated: new Date().toISOString(),
  sourceFile: 'Bremond.png'
};

export function getBremondMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Bremond municipal contract pricing');
  return BREMOND_MUNICIPAL_PRICING;
}
