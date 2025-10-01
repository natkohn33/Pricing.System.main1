/**
 * Franchise Fee Loader
 * Loads and caches franchise fee data from FF - Sheet1.csv
 */

import { parseCSV } from './csvParser';
import { detectCSVHeaderRow } from './csvParser';
import csvUrl from '../data/FF - Sheet1.csv?url';

interface FranchiseFeeData {
  city: string;
  franchiseFee: number;
}

// Cache for franchise fee data
let franchiseFeeMap: Map<string, number> | null = null;

/**
 * Load franchise fees from the CSV file and cache them
 * @returns Promise<Map<string, number>> - Map of normalized city names to franchise fee percentages
 */
export async function loadFranchiseFeesFromCsv(): Promise<Map<string, number>> {
  // Return cached data if already loaded
  if (franchiseFeeMap) {
    console.log('📋 Using cached franchise fee data:', franchiseFeeMap.size, 'cities');
    return franchiseFeeMap;
  }

  try {
    console.log('📋 Loading franchise fees from FF - Sheet1.csv...');
    
    // Fetch the CSV file using Vite's URL import
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch franchise fee CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log('📄 CSV file loaded, parsing data...');

    // Parse CSV using existing utility
    const csvData = parseCSV(csvText);
    
    if (!csvData || csvData.length < 2) {
      throw new Error('Invalid CSV data: insufficient rows');
    }

    // Detect header row index and extract headers
    const headerRowIndex = detectCSVHeaderRow(csvData);
    const headers = csvData[headerRowIndex];
    const dataRows = csvData.slice(headerRowIndex + 1);
    
    console.log('📊 CSV headers:', headers);

    // Find column indices
    // Create normalized headers for robust column detection
    const normalizedHeaders = headers.map(header => 
      header.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
    );
    
    console.log('📊 Normalized headers:', normalizedHeaders);
    
    const cityColumnIndex = normalizedHeaders.findIndex(header => 
      header === 'city'
    );
    const franchiseFeeColumnIndex = normalizedHeaders.findIndex(header => 
      header === 'franchisefee'
    );

    if (cityColumnIndex === -1 || franchiseFeeColumnIndex === -1) {
      console.error('❌ Column detection failed:', {
        originalHeaders: headers,
        normalizedHeaders: normalizedHeaders,
        cityColumnIndex,
        franchiseFeeColumnIndex
      });
      throw new Error(`Required columns not found in FF - Sheet1.csv. City column: ${cityColumnIndex}, Franchise Fee column: ${franchiseFeeColumnIndex}. Available headers: ${headers.join(', ')}`);
    }

    console.log('📍 Column mapping:', {
      cityColumn: cityColumnIndex,
      franchiseFeeColumn: franchiseFeeColumnIndex
    });

    // Initialize the map
    franchiseFeeMap = new Map<string, number>();

    // Process each data row (skip header)
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      
      if (row.length > Math.max(cityColumnIndex, franchiseFeeColumnIndex)) {
        const city = row[cityColumnIndex]?.trim();
        const franchiseFeeText = row[franchiseFeeColumnIndex]?.trim();

        if (city && franchiseFeeText) {
          // Parse franchise fee percentage
          const franchiseFeeMatch = franchiseFeeText.match(/(\d+(?:\.\d+)?)/);
          if (franchiseFeeMatch) {
            const franchiseFee = parseFloat(franchiseFeeMatch[1]);
            const normalizedCity = city.toLowerCase().trim();
            
            franchiseFeeMap.set(normalizedCity, franchiseFee);
            
            console.log(`📋 Added franchise fee: ${city} -> ${franchiseFee}%`);
          } else {
            console.warn(`⚠️ Could not parse franchise fee for ${city}: ${franchiseFeeText}`);
          }
        }
      }
    }

    console.log('✅ Franchise fee data loaded successfully:', {
      totalCities: franchiseFeeMap.size,
      cities: Array.from(franchiseFeeMap.keys()).slice(0, 10) // Show first 10 cities
    });

    return franchiseFeeMap;

  } catch (error) {
    console.error('❌ Error loading franchise fees from CSV:', error);
    
    // Return empty map on error to prevent crashes
    franchiseFeeMap = new Map<string, number>();
    return franchiseFeeMap;
  }
}

/**
 * Get franchise fee for a specific city
 * @param city - City name
 * @returns Franchise fee percentage or null if not found
 */
export async function getFranchiseFeeForCity(city: string): Promise<number | null> {
  const franchiseFees = await loadFranchiseFeesFromCsv();
  const normalizedCity = city.toLowerCase().trim();
  
  return franchiseFees.get(normalizedCity) || null;
}

/**
 * Clear the franchise fee cache (useful for testing or data refresh)
 */
export function clearFranchiseFeeCache(): void {
  franchiseFeeMap = null;
  console.log('🗑️ Franchise fee cache cleared');
}