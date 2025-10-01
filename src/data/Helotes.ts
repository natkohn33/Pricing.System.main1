// Helotes Municipal Pricing Data


import { FranchisedCityPricing, FranchisedCityRate } from '../types';

export const HELOTES_MUNICIPAL_PRICING: FranchisedCityPricing = {
  cityName: 'Helotes',
  state: 'Texas',
  rates: [
    // Extra Pickup Fees for Dumpster Services
    {
      id: 'helotes-extra-pickup-2cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '2CY',
      frequency: 'Extra Pickup',
      equipmentType: 'Dumpster',
      extraPickupRate: 26.25,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'helotes-extra-pickup-3cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '3CY',
      frequency: 'Extra Pickup',
      equipmentType: 'Dumpster',
      extraPickupRate: 31.50,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'helotes-extra-pickup-4cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '4CY',
      frequency: 'Extra Pickup',
      equipmentType: 'Dumpster',
      extraPickupRate: 36.75,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'helotes-extra-pickup-6cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '6CY',
      frequency: 'Extra Pickup',
      equipmentType: 'Dumpster',
      extraPickupRate: 55.13,
      franchiseFee: 5,
      salesTax: 8.25
    },
    {
      id: 'helotes-extra-pickup-8cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '8CY',
      frequency: 'Extra Pickup',
      equipmentType: 'Dumpster',
      extraPickupRate: 73.50,
      franchiseFee: 5,
      salesTax: 8.25
    },

    // Roll-off Services
    {
      id: 'helotes-rolloff-10cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '10CY',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 131.25,
      deliveryFee: 157.50,
      haulFee: 315.00,
      disposalFee: 57.75,
      disposalMinimum: 4,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-rolloff-20cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '20CY',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 141.75,
      deliveryFee: 157.50,
      haulFee: 315.00,
      disposalFee: 57.75,
      disposalMinimum: 4,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-rolloff-30cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '30CY',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 157.50,
      deliveryFee: 157.50,
      haulFee: 315.00,
      disposalFee: 57.75,
      disposalMinimum: 4,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-rolloff-40cy',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '40CY',
      frequency: '1x/month',
      equipmentType: 'Roll-off',
      monthlyRate: 189.00,
      deliveryFee: 157.50,
      haulFee: 315.00,
      disposalFee: 57.75,
      disposalMinimum: 4,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-rolloff-40cy-receiver',
      city: 'Helotes',
      state: 'Texas',
      containerSize: '40CY',
      frequency: '1x/month',
      equipmentType: 'Receiver Box',
      monthlyRate: 210.00,
      deliveryFee: 157.50,
      haulFee: 388.50,
      disposalFee: 57.75,
      disposalMinimum: 4,
      franchiseFee: 6,
      salesTax: 8.25
    },

    // Other Fees for Commercial and Roll-off Services
    {
      id: 'helotes-lock-fee',
      city: 'Helotes',
      state: 'Texas',
      serviceType: 'Lock',
      serviceFee: 2.15,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-casters-fee',
      city: 'Helotes',
      state: 'Texas',
      serviceType: 'Set of Casters',
      serviceFee: 5.46,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-enclosure-fee',
      city: 'Helotes',
      state: 'Texas',
      serviceType: 'Opening and Closing of Enclosures',
      serviceFee: 3.22,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-deodorizing-fee',
      city: 'Helotes',
      state: 'Texas',
      serviceType: 'Deodorizing Crystals',
      serviceFee: 35.35,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-fel-swap-fee',
      city: 'Helotes',
      state: 'Texas',
      serviceType: 'FEL Swap Out Fee',
      serviceFee: 161.17,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-replacement-fee',
      city: 'Helotes',
      state: 'Texas',
      serviceType: 'Replacement of burnt or damaged dumpster',
      serviceFee: 555.50,
      franchiseFee: 6,
      salesTax: 8.25
    },
    {
      id: 'helotes-compactor-rental',
      city: 'Helotes',
      state: 'Texas',
      serviceType: 'FEL Compactor Rental',
      serviceFee: 805.85,
      frequency: 'per month',
      franchiseFee: 6,
      salesTax: 8.25
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  sourceFile: 'Helotes City.png'
};

export function getHelotesMunicipalPricing(): FranchisedCityPricing {
  return HELOTES_MUNICIPAL_PRICING;
}

