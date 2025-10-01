// Built-in St. Hedwig Municipal Contract Pricing Data
// Parsed from "FWS Pricing tool -TOOLBOX - ST. HEDWIG.csv"
// Effective as of file date

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const ST_HEDWIG_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'St. Hedwig',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD
    {
      id: 'st-hedwig-2yd-1xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 80.86,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 46.71,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },
    {
      id: 'st-hedwig-2yd-2xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 161.71,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 46.71,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },

    // Commercial Dumpster Pricing - 3YD
    {
      id: 'st-hedwig-3yd-1xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 100.58,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 57.09,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },
    {
      id: 'st-hedwig-3yd-2xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 201.15,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 57.09,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },

    // Commercial Dumpster Pricing - 4YD
    {
      id: 'st-hedwig-4yd-1xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 120.30,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 67.47,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },
    {
      id: 'st-hedwig-4yd-2xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 240.59,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 67.47,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },

    // Commercial Dumpster Pricing - 6YD
    {
      id: 'st-hedwig-6yd-1xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 140.02,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 77.85,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },
    {
      id: 'st-hedwig-6yd-2xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 246.51,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 77.85,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },

    // Commercial Dumpster Pricing - 8YD
    {
      id: 'st-hedwig-8yd-1xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 159.74,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 88.22,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },
    {
      id: 'st-hedwig-8yd-2xweek',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 281.02,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      extraPickupRate: 88.22,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },

    // Additional Services
    {
      id: 'st-hedwig-casters',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'Monthly',
      equipmentType: 'Additional Service',
      serviceType: 'Casters',
      monthlyRate: 36.33,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },
    {
      id: 'st-hedwig-lockbar',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'Monthly',
      equipmentType: 'Additional Service',
      serviceType: 'Lockbar',
      monthlyRate: 11.42,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      billingGroup: 'Monthly Dumpsters',
      taxCode: 'St Hedwig City'
    },

    // Residential/Commercial Cart Services (Quarterly billing)
    {
      id: 'st-hedwig-residential-cart',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: 'Residential Cart',
      frequency: 'Weekly',
      equipmentType: 'Residential Cart',
      quarterlyRate: 65.05,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      notes: 'Billed quarterly + tax'
    },
    {
      id: 'st-hedwig-extra-cart',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: 'Extra Cart',
      frequency: 'Weekly',
      equipmentType: 'Residential Cart',
      quarterlyRate: 15.57,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      notes: 'Billed quarterly + tax'
    },
    {
      id: 'st-hedwig-commercial-cart',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: 'Commercial Cart',
      frequency: 'Weekly',
      equipmentType: 'Commercial Cart',
      quarterlyRate: 65.05,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0,
      notes: 'Billed quarterly + tax'
    },
    {
      id: 'st-hedwig-stolen-cart',
      city: 'St. Hedwig',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'One-time',
      equipmentType: 'Replacement Service',
      serviceType: 'Stolen/Missing Cart',
      monthlyRate: 75.00,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 0
    }
  ],
  additionalNotes: [
    'COMMERCIAL DUMPSTERS BILLED BY FRONTIER',
    'NO 3X WEEK SERVICE FOR COMMERCIAL DUMPSTERS',
    'RESIDENTIAL & COMMERCIAL CARTS: $65.05/QUARTER + TAX',
    'EXTRA CART: $15.57/QUARTER + TAX',
    'NO RECYCLING SERVICE IN CITY LIMITS',
    'NO FUEL CHARGE',
    'STOLEN/MISSING CART: $75.00',
    'ROLL-OFF PROVIDED FOR CITY-WIDE CLEANUPS (SPRING & FALL)',
    'BULK ITEMS CHARGED INDIVIDUALLY AT CURRENT RATES',
    'REQUIRES EMPLOYMENT IDENTIFICATION NUMBER (EIN) FORM PROVING BUSINESS STATUS FOR COMMERCIAL DUMPSTERS',
    'BILLING GROUP: MONTHLY DUMPSTERS',
    'TAX CODE: ST HEDWIG CITY'
  ],
  serviceDetails: {
    recycling: 'Not offered',
    fuelCharge: 'No fuel charge',
    bulkCollection: 'Charged individually at current rates',
    cityCleanups: 'Roll-off provided for city-wide cleanups (Spring & Fall)'
  },
  requirements: {
    commercialDumpsters: 'Requires Employment Identification Number (EIN) form proving business status'
  },
  billingInfo: {
    billingGroup: 'Monthly Dumpsters',
    taxCode: 'St Hedwig City',
    cartBilling: 'Quarterly + tax'
  },
  lastUpdated: new Date().toISOString(),
  sourceFile: 'FWS Pricing tool -TOOLBOX - ST. HEDWIG.csv'
};

// Helper function to get St. Hedwig municipal pricing data
export function getStHedwigMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading St. Hedwig municipal contract pricing:', {
    totalRates: ST_HEDWIG_MUNICIPAL_PRICING.rates.length,
    commercialRates: ST_HEDWIG_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    cartRates: ST_HEDWIG_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Residential Cart' || r.equipmentType === 'Commercial Cart').length,
    additionalServices: ST_HEDWIG_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Additional Service' || r.equipmentType === 'Replacement Service').length,
    features: 'Quarterly cart billing, EIN requirement for commercial, no 3x week service'
  });
  
  return ST_HEDWIG_MUNICIPAL_PRICING;
}