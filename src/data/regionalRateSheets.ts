// Built-in Regional Rate Sheets Data
// This data is parsed from the "Rates NTX _ STX.xlsx - charts.csv" file
// and embedded directly into the system for automatic activation

import { RegionalPricingData, RegionalRateSheet } from '../types';

export const BUILT_IN_REGIONAL_PRICING_DATA: RegionalPricingData = {
  rateSheets: [
    // NTX Rate Sheet 2025 - Dallas/Fort Worth
    {
      region: 'NTX',
      regionName: 'Dallas/Fort Worth',
      rates: [
        // 2YD rates
        { containerSize: '2YD', frequency: '1x/week', price: 69.28 },
        { containerSize: '2YD', frequency: '2x/week', price: 138.56 },
        { containerSize: '2YD', frequency: '3x/week', price: 207.84 },
        { containerSize: '2YD', frequency: '4x/week', price: 277.12 },
        { containerSize: '2YD', frequency: '5x/week', price: 346.40 },
        { containerSize: '2YD', frequency: '6x/week', price: 415.68 },
        
        // 3YD rates
        { containerSize: '3YD', frequency: '1x/week', price: 77.94 },
        { containerSize: '3YD', frequency: '2x/week', price: 155.88 },
        { containerSize: '3YD', frequency: '3x/week', price: 214.34 },
        { containerSize: '3YD', frequency: '4x/week', price: 285.78 },
        { containerSize: '3YD', frequency: '5x/week', price: 357.23 },
        { containerSize: '3YD', frequency: '6x/week', price: 428.67 },
        
        // 4YD rates
        { containerSize: '4YD', frequency: '1x/week', price: 86.60 },
        { containerSize: '4YD', frequency: '2x/week', price: 173.20 },
        { containerSize: '4YD', frequency: '3x/week', price: 259.80 },
        { containerSize: '4YD', frequency: '4x/week', price: 346.40 },
        { containerSize: '4YD', frequency: '5x/week', price: 433.00 },
        { containerSize: '4YD', frequency: '6x/week', price: 519.60 },
        
        // 6YD rates
        { containerSize: '6YD', frequency: '1x/week', price: 93.53 },
        { containerSize: '6YD', frequency: '2x/week', price: 187.06 },
        { containerSize: '6YD', frequency: '3x/week', price: 280.58 },
        { containerSize: '6YD', frequency: '4x/week', price: 374.11 },
        { containerSize: '6YD', frequency: '5x/week', price: 467.64 },
        { containerSize: '6YD', frequency: '6x/week', price: 561.17 },
        
        // 8YD rates
        { containerSize: '8YD', frequency: '1x/week', price: 110.85 },
        { containerSize: '8YD', frequency: '2x/week', price: 221.70 },
        { containerSize: '8YD', frequency: '3x/week', price: 332.55 },
        { containerSize: '8YD', frequency: '4x/week', price: 443.40 },
        { containerSize: '8YD', frequency: '5x/week', price: 554.25 },
        { containerSize: '8YD', frequency: '6x/week', price: 665.10 }
      ]
    },
    
    // STX Rate Sheet 2025 - Houston
    {
      region: 'STX',
      regionName: 'Houston',
      rates: [
        // 2YD rates
        { containerSize: '2YD', frequency: '1x/week', price: 69.28 },
        { containerSize: '2YD', frequency: '2x/week', price: 138.56 },
        { containerSize: '2YD', frequency: '3x/week', price: 207.84 },
        { containerSize: '2YD', frequency: '4x/week', price: 277.12 },
        { containerSize: '2YD', frequency: '5x/week', price: 346.40 },
        { containerSize: '2YD', frequency: '6x/week', price: 415.68 },
        
        // 3YD rates
        { containerSize: '3YD', frequency: '1x/week', price: 77.94 },
        { containerSize: '3YD', frequency: '2x/week', price: 155.88 },
        { containerSize: '3YD', frequency: '3x/week', price: 214.34 },
        { containerSize: '3YD', frequency: '4x/week', price: 285.78 },
        { containerSize: '3YD', frequency: '5x/week', price: 357.23 },
        { containerSize: '3YD', frequency: '6x/week', price: 428.67 },
        
        // 4YD rates
        { containerSize: '4YD', frequency: '1x/week', price: 86.60 },
        { containerSize: '4YD', frequency: '2x/week', price: 173.20 },
        { containerSize: '4YD', frequency: '3x/week', price: 259.80 },
        { containerSize: '4YD', frequency: '4x/week', price: 346.40 },
        { containerSize: '4YD', frequency: '5x/week', price: 433.00 },
        { containerSize: '4YD', frequency: '6x/week', price: 519.60 },
        
        // 6YD rates
        { containerSize: '6YD', frequency: '1x/week', price: 93.53 },
        { containerSize: '6YD', frequency: '2x/week', price: 187.06 },
        { containerSize: '6YD', frequency: '3x/week', price: 280.58 },
        { containerSize: '6YD', frequency: '4x/week', price: 374.11 },
        { containerSize: '6YD', frequency: '5x/week', price: 467.64 },
        { containerSize: '6YD', frequency: '6x/week', price: 561.17 },
        
        // 8YD rates (STX has different 8YD pricing than NTX)
        { containerSize: '8YD', frequency: '1x/week', price: 116.04 },
        { containerSize: '8YD', frequency: '2x/week', price: 232.09 },
        { containerSize: '8YD', frequency: '3x/week', price: 348.12 },
        { containerSize: '8YD', frequency: '4x/week', price: 464.16 },
        { containerSize: '8YD', frequency: '5x/week', price: 580.20 },
        { containerSize: '8YD', frequency: '6x/week', price: 696.24 }
      ]
    },
    
    // CTX Rate Sheet 2025 - San Antonio/San Marcos/Austin
    {
      region: 'CTX',
      regionName: 'San Antonio/San Marcos/Austin',
      rates: [
        // 2YD rates
        { containerSize: '2YD', frequency: '1x/week', price: 72.00 },
        { containerSize: '2YD', frequency: '2x/week', price: 132.00 },
        { containerSize: '2YD', frequency: '3x/week', price: 216.00 },
        { containerSize: '2YD', frequency: '4x/week', price: 288.00 },
        { containerSize: '2YD', frequency: '5x/week', price: 360.00 },
        { containerSize: '2YD', frequency: '6x/week', price: 432.00 },
        
        // 3YD rates
        { containerSize: '3YD', frequency: '1x/week', price: 82.00 },
        { containerSize: '3YD', frequency: '2x/week', price: 152.00 },
        { containerSize: '3YD', frequency: '3x/week', price: 222.00 },
        { containerSize: '3YD', frequency: '4x/week', price: 292.00 },
        { containerSize: '3YD', frequency: '5x/week', price: 362.00 },
        { containerSize: '3YD', frequency: '6x/week', price: 467.00 },
        
        // 4YD rates
        { containerSize: '4YD', frequency: '1x/week', price: 92.00 },
        { containerSize: '4YD', frequency: '2x/week', price: 172.00 },
        { containerSize: '4YD', frequency: '3x/week', price: 252.00 },
        { containerSize: '4YD', frequency: '4x/week', price: 332.00 },
        { containerSize: '4YD', frequency: '5x/week', price: 412.00 },
        { containerSize: '4YD', frequency: '6x/week', price: 532.00 },
        
        // 6YD rates
        { containerSize: '6YD', frequency: '1x/week', price: 126.00 },
        { containerSize: '6YD', frequency: '2x/week', price: 252.00 },
        { containerSize: '6YD', frequency: '3x/week', price: 378.00 },
        { containerSize: '6YD', frequency: '4x/week', price: 480.00 },
        { containerSize: '6YD', frequency: '5x/week', price: 630.00 },
        { containerSize: '6YD', frequency: '6x/week', price: 875.00 },
        
        // 8YD rates
        { containerSize: '8YD', frequency: '1x/week', price: 168.00 },
        { containerSize: '8YD', frequency: '2x/week', price: 336.00 },
        { containerSize: '8YD', frequency: '3x/week', price: 504.00 },
        { containerSize: '8YD', frequency: '4x/week', price: 666.00 },
        { containerSize: '8YD', frequency: '5x/week', price: 840.00 },
        { containerSize: '8YD', frequency: '6x/week', price: 1170.00 }
      ]
    }
  ],
  lastUpdated: '2025-01-01T00:00:00.000Z',
  source: 'built-in'
};

// Helper function to get regional pricing data
export function getBuiltInRegionalPricingData(): RegionalPricingData {
  console.log('🧠 Loading built-in regional pricing data:', {
    totalSheets: BUILT_IN_REGIONAL_PRICING_DATA.rateSheets.length,
    regions: BUILT_IN_REGIONAL_PRICING_DATA.rateSheets.map(sheet => sheet.region),
    totalRates: BUILT_IN_REGIONAL_PRICING_DATA.rateSheets.reduce((sum, sheet) => sum + sheet.rates.length, 0)
  });
  
  return BUILT_IN_REGIONAL_PRICING_DATA;
}