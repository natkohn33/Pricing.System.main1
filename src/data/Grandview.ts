
// Built-in Grandview Municipal Contract Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const GRANDVIEW_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Grandview',
  state: 'Texas',
  rates: [
    // Roll-off Dumpster Pricing - 20/30/40YD
    {
      id: 'grandview-rolloff-20-30-40yd',
      city: 'Grandview',
      state: 'Texas',
      containerSize: '20/30/40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      dailyRate: 4.00,
      deliveryFee: 219.01,
      disposalFee: 56.31, // Per ton
      disposalMin: 3, // 3 ton minimum
      haulFee: 237.78,
      franchiseFee: 7,
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'GRANDVIEW CITY',
      notes: '7% franchise fee on haul only'
    }
  ],
  additionalNotes: [
    'RESIDENTIAL & COMMERCIAL IS BILLED THROUGH THE CITY',
    'RESIDENTIAL COLLECTION IS ONCE A WEEK ON WEDNESDAY - HILLSBORO',
    'WE DO NOT OFFER RECYCLE IN GRANDVIEW',
    'ALL TRASH MUST BE IN CART WE PROVIDE',
    'ADDITIONAL CARTS ARE REQUESTED THROUGH THE CITY ONLY',
    '*BULK & BRUSH COLLECTION IS ON THE FIRST WEDNESDAY OF THE MONTH W/ A 2YD LIMIT',
    'RESIDENTS CAN CONTACT FRONTIER OR CITY FOR MISSED TRASH - CONTACT SUPERVISOR',
    'DUMPSTERS ARE FL CONTAINERS',
    'BILLING GROUP - MUNICIPAL FOR FRONT-LOAD DUMPSTERS',
    'BILLING GROUP - ROLL OFF FOR ROLL-OFF SERVICES',
    'TAX CODE - GRANDVIEW CITY',
    '7% FRANCHISE FEE ON HAUL ONLY'
  ],
  serviceDetails: {
    residentialCollection: 'Once weekly (Wednesday) - Hillsboro',
    recycling: 'Not offered',
    bulkCollection: 'First Wednesday of the month with 2YD limit',
    cartPolicy: 'City-provided carts only',
    dumpsterType: 'FL Containers'
  },
  franchiseFee: 7,
  franchiseFeeNote: '7% franchise fee on haul only',
  billingInfo: {
    frontLoadBilling: 'MUNICIPAL',
    rollOffBilling: 'ROLL OFF',
    taxCode: 'GRANDVIEW CITY'
  },
  lastUpdated: '2024-12-01T00:00:00.000Z',
  sourceFile: 'Grandview.png'
};

export function getGrandviewMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Grandview municipal contract pricing');
  return GRANDVIEW_MUNICIPAL_PRICING;
}
