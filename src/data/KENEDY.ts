// Built-in Kenedy Municipal Contract Pricing Data
// Parsed from "FWS Pricing tool -TOOLBOX - KENEDY.csv"
// Effective as of file date

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const KENEDY_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Kenedy',
  state: 'Texas',
  rates: [
    // Front-Load Dumpster Pricing - 2YD
    {
      id: 'kenedy-2yd-1xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 77.62,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 38.81
    },
    {
      id: 'kenedy-2yd-2xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 155.26,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 38.81
    },
    {
      id: 'kenedy-2yd-3xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 232.89,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 38.81
    },
    {
      id: 'kenedy-2yd-4xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 310.53,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 38.81
    },
    {
      id: 'kenedy-2yd-5xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 388.17,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 38.81
    },

    // Front-Load Dumpster Pricing - 3YD
    {
      id: 'kenedy-3yd-1xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 91.74,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 45.96
    },
    {
      id: 'kenedy-3yd-2xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 183.46,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 45.96
    },
    {
      id: 'kenedy-3yd-3xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 275.20,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 45.96
    },
    {
      id: 'kenedy-3yd-4xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 366.95,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 45.96
    },
    {
      id: 'kenedy-3yd-5xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 458.69,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 45.96
    },

    // Front-Load Dumpster Pricing - 4YD
    {
      id: 'kenedy-4yd-1xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 134.07,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 67.41
    },
    {
      id: 'kenedy-4yd-2xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 268.12,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 67.41
    },
    {
      id: 'kenedy-4yd-3xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 402.20,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 67.41
    },
    {
      id: 'kenedy-4yd-4xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 536.27,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 67.41
    },
    {
      id: 'kenedy-4yd-5xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 670.34,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 67.41
    },

    // Front-Load Dumpster Pricing - 6YD
    {
      id: 'kenedy-6yd-1xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 162.30,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 78.65
    },
    {
      id: 'kenedy-6yd-2xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 324.58,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 78.65
    },
    {
      id: 'kenedy-6yd-3xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 486.87,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 78.65
    },
    {
      id: 'kenedy-6yd-4xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 649.18,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 78.65
    },
    {
      id: 'kenedy-6yd-5xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 811.47,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 78.65
    },

    // Front-Load Dumpster Pricing - 8YD
    {
      id: 'kenedy-8yd-1xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 204.63,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 99.08
    },
    {
      id: 'kenedy-8yd-2xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 409.23,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 99.08
    },
    {
      id: 'kenedy-8yd-3xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 613.87,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 99.08
    },
    {
      id: 'kenedy-8yd-4xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 818.50,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 99.08
    },
    {
      id: 'kenedy-8yd-5xweek',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 1023.13,
      deliveryFee: 117.46,
      franchiseFee: 8,
      salesTax: 0,
      extraPickupRate: 99.08
    },

    // Additional Services
    {
      id: 'kenedy-casters-install',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'One-time',
      equipmentType: 'Additional Service',
      serviceType: 'Casters Install',
      monthlyRate: 102.14,
      deliveryFee: 0,
      franchiseFee: 8,
      salesTax: 0
    },
    {
      id: 'kenedy-casters-monthly',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'Monthly',
      equipmentType: 'Additional Service',
      serviceType: 'Casters Monthly',
      monthlyRate: 11.24,
      deliveryFee: 0,
      franchiseFee: 8,
      salesTax: 0
    },
    {
      id: 'kenedy-gates-enclosures',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'Monthly',
      equipmentType: 'Additional Service',
      serviceType: 'Gates/Enclosures',
      monthlyRate: 2.55,
      deliveryFee: 0,
      franchiseFee: 8,
      salesTax: 0
    },
    {
      id: 'kenedy-lockbars-install',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'One-time',
      equipmentType: 'Additional Service',
      serviceType: 'Lockbars Install',
      monthlyRate: 102.14,
      deliveryFee: 0,
      franchiseFee: 8,
      salesTax: 0
    },
    {
      id: 'kenedy-lockbars-monthly',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'Monthly',
      equipmentType: 'Additional Service',
      serviceType: 'Lockbars Monthly',
      monthlyRate: 11.24,
      deliveryFee: 0,
      franchiseFee: 8,
      salesTax: 0
    },

    // Roll-off Dumpster Pricing - 20YD
    {
      id: 'kenedy-rolloff-20yd',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '20YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 5.11, // Daily rent rate
      deliveryFee: 306.43,
      disposalFee: 56.18, // Per ton
      haulFee: 469.86,
      franchiseFee: 8,
      salesTax: 0
    },

    // Roll-off Dumpster Pricing - 30YD
    {
      id: 'kenedy-rolloff-30yd',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '30YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 5.11, // Daily rent rate
      deliveryFee: 306.43,
      disposalFee: 56.18, // Per ton
      haulFee: 469.86,
      franchiseFee: 8,
      salesTax: 0
    },

    // Roll-off Dumpster Pricing - 40YD
    {
      id: 'kenedy-rolloff-40yd',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '40YD',
      frequency: 'On-demand',
      equipmentType: 'Roll-off',
      monthlyRate: 5.11, // Daily rent rate
      deliveryFee: 306.43,
      disposalFee: 56.18, // Per ton
      haulFee: 469.86,
      franchiseFee: 8,
      salesTax: 0
    },

    // Compactor Roll-off Pricing - 20YD
    {
      id: 'kenedy-rolloff-20comp',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '20YD',
      frequency: 'On-demand',
      equipmentType: 'Compactor',
      monthlyRate: 5.11, // Daily rent rate
      deliveryFee: 0, // Negotiable
      disposalFee: 56.18, // Per ton
      haulFee: 469.86,
      franchiseFee: 8,
      salesTax: 0,
      notes: 'Delivery fee is negotiable'
    },

    // Compactor Roll-off Pricing - 30YD
    {
      id: 'kenedy-rolloff-30comp',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '30YD',
      frequency: 'On-demand',
      equipmentType: 'Compactor',
      monthlyRate: 5.11, // Daily rent rate
      deliveryFee: 0, // Negotiable
      disposalFee: 56.18, // Per ton
      haulFee: 469.86,
      franchiseFee: 8,
      salesTax: 0,
      notes: 'Delivery fee is negotiable'
    },

    // Compactor Roll-off Pricing - 40YD
    {
      id: 'kenedy-rolloff-40comp',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: '40YD',
      frequency: 'On-demand',
      equipmentType: 'Compactor',
      monthlyRate: 5.11, // Daily rent rate
      deliveryFee: 0, // Negotiable
      disposalFee: 56.18, // Per ton
      haulFee: 469.86,
      franchiseFee: 8,
      salesTax: 0,
      notes: 'Delivery fee is negotiable'
    },

    // Special Services
    {
      id: 'kenedy-city-convenience',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'On-demand',
      equipmentType: 'Special Service',
      serviceType: 'City Convenience',
      monthlyRate: 0,
      deliveryFee: 0,
      disposalFee: 56.18,
      haulFee: 399.38,
      franchiseFee: 8,
      salesTax: 0
    },
    {
      id: 'kenedy-city-dry-sludge',
      city: 'Kenedy',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'On-demand',
      equipmentType: 'Special Service',
      serviceType: 'City Dry Sludge',
      monthlyRate: 0,
      deliveryFee: 0,
      disposalFee: 0, // VARIABLE
      haulFee: 399.38,
      franchiseFee: 8,
      salesTax: 0,
      notes: 'Disposal fee is variable'
    }
  ],
  additionalNotes: [
    '8% FRANCHISE FEE APPLIES TO ALL SERVICES',
    'No 6x/week service for front-load dumpsters',
    'Compactor delivery fees are negotiable',
    'City Dry Sludge disposal fee is variable'
  ],
  franchiseFee: 8,
  lastUpdated: new Date().toISOString(),
  sourceFile: 'FWS Pricing tool -TOOLBOX - KENEDY.csv'
};

// Helper function to get Kenedy municipal pricing data
export function getKenedyMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Kenedy municipal contract pricing:', {
    totalRates: KENEDY_MUNICIPAL_PRICING.rates.length,
    frontLoadRates: KENEDY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: KENEDY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: KENEDY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Compactor').length,
    additionalServices: KENEDY_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Additional Service' || r.equipmentType === 'Special Service').length,
    franchiseFee: '8%'
  });
  
  return KENEDY_MUNICIPAL_PRICING;
}