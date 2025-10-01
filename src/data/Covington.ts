// Built-in Covington Municipal Contract Pricing Data

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const COVINGTON_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Covington',
  state: 'Texas',
  rates: [
    // Roll-off Dumpster Pricing - 20/30/40YD
    {
      id: 'covington-rolloff-20-30-40yd',
      city: 'Covington',
      state: 'Texas',
      containerSize: '20/30/40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 150.94,
      deliveryFee: 238.97,
      disposalFee: 62.89, // Per ton
      haulFee: 301.87,
      franchiseFee: 0, // NO FRANCHISE FEE
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'COVINGTON CITY'
    },

    // Compactor Pricing
    {
      id: 'covington-compactor',
      city: 'Covington',
      state: 'Texas',
      containerSize: 'Compactor',
      frequency: 'On-demand',
      equipmentType: 'Compactor',
      monthlyRate: 0, // Negotiable
      deliveryFee: 0, // Negotiable
      disposalFee: 62.89, // Per ton
      haulFee: 456.85,
      franchiseFee: 0,
      salesTax: 0,
      billingGroup: 'ROLL OFF',
      taxCode: 'COVINGTON CITY',
      notes: 'Delivery and monthly rates are negotiable (NEG)'
    }
  ],
  additionalNotes: [
    'RESIDENTIAL & COMMERCIAL IS BILLED THROUGH THE CITY',
    'RESIDENTIAL COLLECTION IS ONCE A WEEK ON TUESDAY - HILLSBORO',
    'WE DO NOT OFFER RECYCLE IN COVINGTON',
    'ALL TRASH MUST BE IN CARTS WE PROVIDE',
    'ADDITIONAL CARTS ARE REQUESTED THROUGH THE CITY ONLY',
    '*RESIDENTS PAY INDIVIDUALLY FOR BULK COLLECTION USING CURRENT BULK PRICING',
    'TAKE PYMT ON ACCTH 128728 & MAKE WO THRU NAVUSOFT W/ ADDRESS',
    'RESIDENTS CAN CONTACT FRONTIER OR CITY FOR MISSED TRASH - CONTACT SUPERVISOR',
    'DUMPSTERS ARE FL CONTAINERS',
    'BILLING GROUP - MUNICIPAL FOR FRONT-LOAD DUMPSTERS',
    'BILLING GROUP - ROLL OFF FOR ROLL-OFF/COMPACTOR SERVICES',
    'TAX CODE - COVINGTON CITY',
    'NO FRANCHISE FEE'
  ],
  serviceDetails: {
    residentialCollection: 'Once weekly (Tuesday) - Hillsboro',
    recycling: 'Not offered',
    bulkCollection: 'Residents pay individually using current bulk pricing',
    cartPolicy: 'City-provided carts only',
    dumpsterType: 'FL Containers',
    bulkPayment: 'Take payment on account #128728 & make WO thru Navusoft with address'
  },
  billingInfo: {
    frontLoadBilling: 'MUNICIPAL',
    rollOffBilling: 'ROLL OFF',
    taxCode: 'COVINGTON CITY'
  },
  franchiseFee: 0,
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Covington.png'
};

export function getCovingtonMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Covington municipal contract pricing');
  return COVINGTON_MUNICIPAL_PRICING;
}
