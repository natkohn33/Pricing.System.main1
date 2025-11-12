// Helotes Municipal Pricing Data

// Built-in Helotes Municipal Contract Pricing Data
// Parsed from "Screenshot 2025-10-08 at 9.28.49 AM.png"
// Effective 2025

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const HELOTES_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Helotes',
  state: 'Texas',
  rates: [
    // Handload Services - Residential
    {
      id: 'helotes-residential-rate',
      city: 'Helotes',
      state: 'Texas',
      containerSize: 'Residential',
      frequency: '1x/week',
      equipmentType: 'Handload Service',
      monthlyRate: 31.26,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 0
    },
    {
      id: 'helotes-resi-extra-cart',
      city: 'Helotes',
      state: 'Texas',
      containerSize: 'Residential Extra Cart',
      frequency: '1x/week',
      equipmentType: 'Handload Service',
      monthlyRate: 15.55,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 0
    },

    // Handload Services - Commercial
    {
      id: 'helotes-commercial-cart',
      city: 'Helotes',
      state: 'Texas',
      containerSize: 'Commercial Cart',
      frequency: '1x/week',
      equipmentType: 'Handload Service',
      monthlyRate: 22.86,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 0
    },
    {
      id: 'helotes-commercial-extra-cart',
      city: 'Helotes',
      state: 'Texas',
      containerSize: 'Commercial Extra Cart',
      frequency: '1x/week',
      equipmentType: 'Handload Service',
      monthlyRate: 16.33,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 0
    },

    // Bulk Item Handload Services
    {
      id: 'helotes-bulk-mattress',
      city: 'Helotes',
      state: 'Texas',
      containerSize: 'Bulk Item',
      frequency: 'Per Item',
      equipmentType: 'Handload Service',
      monthlyRate: 0,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 10.89
    },
    {
      id: 'helotes-bulk-whitegood',
      city: 'Helotes',
      state: 'Texas',
      containerSize: 'Bulk Item',
      frequency: 'Per Item',
      equipmentType: 'Handload Service',
      monthlyRate: 0,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 21.78
    },
    {
      id: 'helotes-bulk-furniture',
      city: 'Helotes',
      state: 'Texas',
      containerSize: 'Bulk Item',
      frequency: 'Per Item',
      equipmentType: 'Handload Service',
      monthlyRate: 0,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 10.89
    },
    {
      id: 'helotes-bulk-other',
      city: 'Helotes',
      state: 'Texas',
      containerSize: 'Bulk Item',
      frequency: 'Per 2 CY',
      equipmentType: 'Handload Service',
      monthlyRate: 0,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 27.22
    },

    // Front-Load Dumpster Pricing - 2YD
    {
      id: 'helotes-2yd-1xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 69.55,
      deliveryFee: 0, // Delivery fee not specified in sheet
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 27.22
    },
    {
      id: 'helotes-2yd-2xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 118.99,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 27.22
    },
    {
      id: 'helotes-2yd-3xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 151.45,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 27.22
    },
    {
      id: 'helotes-2yd-4xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 185.45,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 27.22
    },
    {
      id: 'helotes-2yd-5xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 231.82,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 27.22
    },
    {
      id: 'helotes-2yd-6xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 266.84,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 27.22
    },

    // Front-Load Dumpster Pricing - 3YD
    {
      id: 'helotes-3yd-1xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 88.10,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 32.66
    },
    {
      id: 'helotes-3yd-2xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 143.72,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 32.66
    },
    {
      id: 'helotes-3yd-3xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 216.35,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 32.66
    },
    {
      id: 'helotes-3yd-4xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 278.16,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 32.66
    },
    {
      id: 'helotes-3yd-5xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 332.25,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 32.66
    },
    {
      id: 'helotes-3yd-6xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '3YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 400.28,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 32.66
    },

    // Front-Load Dumpster Pricing - 4YD
    {
      id: 'helotes-4yd-1xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 94.26,
      deliveryFee: 0,
      franchiseFee: 0,
      salesTax: 8.25,
      extraPickupRate: 38.11
    },
    {
      id: 'helotes-4yd-2xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 162.27,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 38.11
    },
    {
      id: 'helotes-4yd-3xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 231.82,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 38.11
    },
    {
      id: 'helotes-4yd-4xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 309.08,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 38.11
    },
    {
      id: 'helotes-4yd-5xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 386.34,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 38.11
    },
    {
      id: 'helotes-4yd-6xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 480.34,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 38.11
    },

    // Front-Load Dumpster Pricing - 6YD
    {
      id: 'helotes-6yd-1xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 115.90,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 57.17
    },
    {
      id: 'helotes-6yd-2xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 208.63,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 57.17
    },
    {
      id: 'helotes-6yd-3xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 285.88,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 57.17
    },
    {
      id: 'helotes-6yd-4xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 363.15,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 57.17
    },
    {
      id: 'helotes-6yd-5xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 448.16,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 57.17
    },
    {
      id: 'helotes-6yd-6xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 560.40,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 57.17
    },

    // Front-Load Dumpster Pricing - 8YD
    {
      id: 'helotes-8yd-1xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 146.81,
      deliveryFee: 0,
      franchiseFee: 6,
      salesTax: 8.25,
      extraPickupRate: 76.21
    },
    {
      id: 'helotes-8yd-2xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 239.51,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 76.21
    },
    {
      id: 'helotes-8yd-3xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '3x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 355.44,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 76.21
    },
    {
      id: 'helotes-8yd-4xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '4x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 455.88,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 76.21
    },
    {
      id: 'helotes-8yd-5xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '5x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 548.58,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 76.21
    },
    {
      id: 'helotes-8yd-6xweek',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '6x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 747.18,
      deliveryFee: 0,
      franchiseFee: 6, 
      salesTax: 8.25,
      extraPickupRate: 76.21
    },

    // Roll-off Pricing
    {
      id: 'helotes-rolloff-10yd',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '10YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 136.10, // Monthly rental
      deliveryFee: 163.32,
      franchiseFee: 6,
      salesTax: 8.25,
      haulFee: 326.63 
    },
    {
      id: 'helotes-rolloff-20yd',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 146.99, // Monthly rental
      deliveryFee: 163.32,
      franchiseFee: 6,
      salesTax: 8.25,
      haulFee: 326.63
    },
    {
      id: 'helotes-rolloff-30yd',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 163.32, // Monthly rental
      deliveryFee: 163.32,
      franchiseFee: 6,
      salesTax: 8.25,
      haulFee: 326.63 // Haul fee
    },
    {
      id: 'helotes-rolloff-40yd',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 195.98, // Monthly rental
      deliveryFee: 163.32,
      franchiseFee: 6,
      salesTax: 8.25,
      haulFee: 326.63 // Haul fee
    },
    {
      id: 'helotes-rolloff-30yd-commercial',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '30YD',
      frequency: '1x/month',
      equipmentType: 'Commercial Compactor',
      monthlyRate: 0, // NEG in original sheet
      deliveryFee: 0, // NEG in original sheet
      franchiseFee: 6,
      salesTax: 8.25,
      haulFee: 419.18 // Haul fee
    },
    {
      id: 'helotes-rolloff-35yd-commercial',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '35YD',
      frequency: '1x/month',
      equipmentType: 'Commercial Compactor',
      monthlyRate: 0, // NEG in original sheet
      deliveryFee: 0, // NEG in original sheet
      franchiseFee: 6,
      salesTax: 8.25,
      haulFee: 419.18 // Haul fee
    },
    {
      id: 'helotes-rolloff-40yd-commercial',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '40YD',
      frequency: '1x/month',
      equipmentType: 'Commercial Compactor',
      monthlyRate: 0, // NEG in original sheet
      deliveryFee: 0, // NEG in original sheet
      franchiseFee: 6,
      salesTax: 8.25,
      haulFee: 419.18 // Haul fee
    },
    {
      id: 'helotes-rolloff-40cy-receiver',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '40CY',
      frequency: '1x/month',
      equipmentType: 'Receiver Box',
      monthlyRate: 217.76, // Monthly rental
      deliveryFee: 163.32,
      franchiseFee: 6,
      salesTax: 8.25,
      haulFee: 402.85 // Haul fee
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Screenshot 2025-10-08 at 9.28.49 AM.png'
};

// Helper function to get Helotes municipal pricing data
export function getHelotesMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Helotes municipal contract pricing:', {
    totalRates: HELOTES_MUNICIPAL_PRICING.rates.length,
    handloadRates: HELOTES_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Handload Service').length,
    frontLoadRates: HELOTES_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: HELOTES_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Roll-off').length,
    compactorRates: HELOTES_MUNICIPAL_PRICING.rates.filter(r => r.equipmentType === 'Commercial Compactor').length
  });

  return HELOTES_MUNICIPAL_PRICING;
}