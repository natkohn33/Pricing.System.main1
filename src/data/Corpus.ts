// Built-in Corpus Christi Municipal Contract Pricing Data
// Parsed from "FWS Pricing tool -TOOLBOX - Corpus.csv"

import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const CORPUS_CHRISTI_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Corpus Christi',
  state: 'Texas',
  rates: [
    // Commercial Dumpster Pricing - 2YD (Inside City Limits)
    {
      id: 'corpus-2yd-1xweek-inside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 34.00, // $8.50/yd × 4 weeks
      deliveryFee: 75,
      franchiseFee: 0.91, // $0.91 per yard
      salesTax: 8,
      fuelSurcharge: 10
    },
    {
      id: 'corpus-2yd-2xweek-inside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 68.00, // $8.50/yd × 8 weeks
      deliveryFee: 75,
      franchiseFee: 0.91,
      salesTax: 8,
      fuelSurcharge: 10
    },
    // Add more frequencies as needed

    // Commercial Dumpster Pricing - 4YD (Inside City Limits)
    {
      id: 'corpus-4yd-1xweek-inside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 100.00, // $6.25/yd × 4 weeks × 4yd
      deliveryFee: 75,
      franchiseFee: 3.64, // $0.91 × 4yd
      salesTax: 8,
      fuelSurcharge: 10
    },
    {
      id: 'corpus-4yd-2xweek-inside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '4YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 200.00, // $6.25/yd × 8 weeks × 4yd
      deliveryFee: 75,
      franchiseFee: 3.64,
      salesTax: 8,
      fuelSurcharge: 10
    },
    // Add more frequencies as needed

    // Commercial Dumpster Pricing - 6YD (Inside City Limits)
    {
      id: 'corpus-6yd-1xweek-inside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 96.00, // $4.00/yd × 4 weeks × 6yd
      deliveryFee: 75,
      franchiseFee: 5.46, // $0.91 × 6yd
      salesTax: 8,
      fuelSurcharge: 10
    },
    {
      id: 'corpus-6yd-2xweek-inside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '6YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 192.00, // $4.00/yd × 8 weeks × 6yd
      deliveryFee: 75,
      franchiseFee: 5.46,
      salesTax: 8,
      fuelSurcharge: 10
    },
    // Add more frequencies as needed

    // Commercial Dumpster Pricing - 8YD (Inside City Limits)
    {
      id: 'corpus-8yd-1xweek-inside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 128.00, // $4.00/yd × 4 weeks × 8yd
      deliveryFee: 75,
      franchiseFee: 7.28, // $0.91 × 8yd
      salesTax: 8,
      fuelSurcharge: 10
    },
    {
      id: 'corpus-8yd-2xweek-inside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '8YD',
      frequency: '2x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 256.00, // $4.00/yd × 8 weeks × 8yd
      deliveryFee: 75,
      franchiseFee: 7.28,
      salesTax: 8,
      fuelSurcharge: 10
    },
    // Add more frequencies as needed

    // Outside City Limits Rates (similar structure but with different rates)
    {
      id: 'corpus-2yd-1xweek-outside',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '2YD',
      frequency: '1x/week',
      equipmentType: 'Front-Load Container',
      monthlyRate: 60.00, // $15/yd × 4 weeks
      deliveryFee: 125,
      franchiseFee: 0, // No franchise fee outside city limits
      salesTax: 8,
      fuelSurcharge: 10
    },
    // Add more outside city limits rates

    // Roll-off Pricing
    {
      id: 'corpus-rolloff-20yd',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: '20YD',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 250.00, // Haul fee
      deliveryFee: 75,
      franchiseFee: 18.20, // $0.91 × 20yd
      salesTax: 8,
      fuelSurcharge: 10,
      perTonRate: 42.84,
      ccmswFee: 15.16
    },
    // Add 30yd and 40yd roll-off containers

    // Accessories
    {
      id: 'corpus-lock-bar',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'one-time',
      equipmentType: 'Accessory',
      monthlyRate: 10,
      installationFee: 75
    },
    {
      id: 'corpus-castors',
      city: 'Corpus Christi',
      state: 'Texas',
      containerSize: 'N/A',
      frequency: 'one-time',
      equipmentType: 'Accessory',
      monthlyRate: 15,
      installationFee: 75
    }
  ],
  lastUpdated: new Date().toISOString(),
  sourceFile: 'FWS Pricing tool -TOOLBOX - Corpus.csv'
};

// Helper function to get Corpus Christi municipal pricing data
export function getCorpusChristiMunicipalPricing(): FranchisedCityPricing {
  console.log('🏛️ Loading Corpus Christi municipal contract pricing:', {
    totalRates: CORPUS_CHRISTI_MUNICIPAL_PRICING.rates.length
  });
  
  return CORPUS_CHRISTI_MUNICIPAL_PRICING;
}
