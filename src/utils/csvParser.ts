import type { RegionalRateSheet, RegionalRateEntry, RegionalPricingData } from '../types';

// Local type definitions for CSV parsing
interface RateData {
  id: string;
  city: string;
  state: string;
  equipmentType: string;
  containerSize: string;
  frequency: string;
  baseRate: number;
  franchiseFee: number;
  localTax: number;
  fuelSurcharge: number;
  division: string;
}

interface ServiceRequest {
  id: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  equipmentType: string;
  containerSize: string;
  frequency: string;
  materialType: string;
  zipCode: string;
  addOns: string[];
  notes: string;
  binQuantity: number;
}

export function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split('\n');
  const allRows = lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  });
  
  return allRows;
}

/**
 * Parse CSV with automatic header detection
 * Returns the headers and data rows separately
 */
export function parseCSVWithHeaderDetection(csvText: string): { headers: string[]; data: string[][] } {
  const allRows = parseCSV(csvText);
  
  if (allRows.length === 0) {
    return { headers: [], data: [] };
  }
  
  // Detect which row is the header
  const headerRowIndex = detectCSVHeaderRow(allRows);
  
  // Extract headers and data
  const headers = allRows[headerRowIndex] || [];
  const data = allRows.slice(headerRowIndex + 1);
  
  console.log('📊 CSV parsed with header detection:', {
    totalRows: allRows.length,
    headerRowIndex,
    headers,
    dataRows: data.length
  });
  
  return { headers, data };
}

/**
 * Detect header row in CSV data using same logic as Excel
 */
export function detectCSVHeaderRow(data: string[][]): number {
  if (!data || data.length === 0) return 0;
  
  const maxRowsToCheck = Math.min(10, data.length);
  let bestScore = -1;
  let bestRowIndex = 0;
  
  for (let rowIndex = 0; rowIndex < maxRowsToCheck; rowIndex++) {
    const row = data[rowIndex];
    if (!row || row.length === 0) continue;
    
    const score = calculateCSVHeaderScore(row);
    console.log(`🔍 CSV Row ${rowIndex + 1} header score:`, score, 'Content:', row.slice(0, 5));
    
    if (score > bestScore) {
      bestScore = score;
      bestRowIndex = rowIndex;
    }
  }
  
  console.log('🎯 Best CSV header row detected:', bestRowIndex + 1, 'with score:', bestScore);
  return bestRowIndex;
}

/**
 * Calculate header score for CSV rows (same logic as Excel)
 */
function calculateCSVHeaderScore(row: string[]): number {
  let score = 0;
  const nonEmptyCount = row.filter(cell => cell && cell.toString().trim() !== '').length;
  
  // Base score: number of non-empty cells
  score += nonEmptyCount * 2;
  
  // Bonus for having multiple non-empty cells
  if (nonEmptyCount >= 3) score += 10;
  if (nonEmptyCount >= 5) score += 15;
  
  // Check each cell for header-like characteristics
  row.forEach(cell => {
    if (!cell || cell.toString().trim() === '') return;
    
    const cellValue = cell.toString().trim();
    
    // Penalty for numeric-only values
    if (/^\d+(\.\d+)?$/.test(cellValue)) {
      score -= 5;
      return;
    }
    
    // Bonus for text content
    if (/^[a-zA-Z\s]+$/.test(cellValue)) {
      score += 3;
    }
    
    // High bonus for recognized header keywords
    const headerKeywords = [
      'address', 'street', 'location', 'site',
      'city', 'state', 'zip', 'postal', 'province',
      'company', 'business', 'customer', 'client', 'name',
      'equipment', 'container', 'size', 'frequency', 'service', 'pickup',
      'material', 'waste', 'addon', 'extra', 'special',
      'latitude', 'longitude', 'lat', 'lng', 'coord'
    ];
    
    const normalizedCell = cellValue.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matchedKeywords = headerKeywords.filter(keyword => 
      normalizedCell.includes(keyword) || keyword.includes(normalizedCell)
    );
    
    if (matchedKeywords.length > 0) {
      score += 20;
    }
    
    // Bonus for common header patterns
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(cellValue)) {
      score += 5;
    }
    
    if (cellValue.includes('_') || cellValue.includes('-')) {
      score += 3;
    }
    
    // Penalty for very long text
    if (cellValue.length > 50) {
      score -= 10;
    }
    
    // Penalty for date-like patterns
    if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(cellValue)) {
      score -= 15;
    }
  });
  
  return score;
}

export function detectColumns(headers: string[]): Record<string, number> {
  const columnMap: Record<string, number> = {};
  
  headers.forEach((header, index) => {
    const normalizedHeader = header.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    
    console.log(`🔍 Column detection - Index ${index}: "${header}" -> normalized: "${normalizedHeader}"`);
    
    // City detection
    if (normalizedHeader === 'city' || 
        normalizedHeader === 'cityname' || 
        normalizedHeader === 'cityname') {
      columnMap['city'] = index;
      console.log(`✅ City column detected at index ${index}`);
    }
    
    // State detection
    if (normalizedHeader === 'state' || 
        normalizedHeader === 'stateorprovince' || 
        normalizedHeader === 'st') {
      columnMap['state'] = index;
      console.log(`✅ State column detected at index ${index}`);
    }
    
    // Address detection
    if (normalizedHeader === 'address' || 
        normalizedHeader === 'addressline1' || 
        normalizedHeader === 'address1' || 
        normalizedHeader === 'streetaddress' ||
        normalizedHeader === 'serviceaddress' ||
        normalizedHeader === 'street' ||
        normalizedHeader === 'locationaddress' ||
        normalizedHeader === 'location') {
      columnMap['address'] = index;
      console.log(`✅ Address column detected at index ${index}`);
    }
    
    // Zip code detection
    if (normalizedHeader === 'zipcode' || 
        normalizedHeader === 'postalcode' || 
        normalizedHeader === 'zip' || 
        normalizedHeader === 'postal' ||
        normalizedHeader === 'zipcode4' ||
        normalizedHeader === 'zipcode+4') {
      columnMap['zipCode'] = index;
      console.log(`✅ Zip code column detected at index ${index}`);
    }
    
    // Enhanced equipment type detection
    if (normalizedHeader === 'equipmenttype' || normalizedHeader === 'equipment' || 
        normalizedHeader === 'containertype' || normalizedHeader === 'servicetype' ||
        normalizedHeader === 'wastetype' || normalizedHeader === 'dumpstertype' ||
        normalizedHeader === 'removaltype') {
      columnMap['equipmentType'] = index;
      console.log(`✅ Equipment type column detected at index ${index}`);
    }
    
    // Enhanced container size detection
    if ((normalizedHeader.includes('container') && normalizedHeader.includes('size')) || 
        normalizedHeader === 'containersize' || normalizedHeader === 'binsize' ||
        normalizedHeader === 'yardsize' || normalizedHeader === 'size') {
      columnMap['containerSize'] = index;
      console.log(`✅ Container size column detected at index ${index}`);
    }
    
    // CRITICAL FIX: Enhanced frequency detection with exact "freq" matching
    if (normalizedHeader === 'frequency' || normalizedHeader === 'servicefrequency' ||
        normalizedHeader === 'pickupfrequency' || normalizedHeader === 'schedule' ||
        normalizedHeader === 'serviceschedule' || normalizedHeader === 'collectionfrequency' ||
        normalizedHeader === 'frequencyperweek' || normalizedHeader === 'pickupfrequency' ||
        normalizedHeader === 'pickupsperweek' || normalizedHeader === 'pickups' ||
        normalizedHeader === 'weeklyfrequency' || normalizedHeader === 'timesperweek' ||
        normalizedHeader === 'freq') {
      columnMap['frequency'] = index;
      console.log(`✅ Frequency column detected at index ${index} with header "${header}"`);
    }
    
    // Enhanced quantity detection - comprehensive patterns
    if (normalizedHeader === 'quantity' || normalizedHeader === 'containerquantity' ||
        normalizedHeader === 'binquantity' || normalizedHeader === 'numberofbins' ||
        normalizedHeader === 'numberofcontainers' || normalizedHeader === 'qty') {
      columnMap['binQuantity'] = index;
      console.log(`✅ Bin quantity column detected at index ${index}`);
    }
    
    // Additional bin quantity detection patterns
    if (normalizedHeader === 'bins' || normalizedHeader === 'containers' ||
        normalizedHeader === 'count' || normalizedHeader === 'units' ||
        normalizedHeader === 'bincount' || normalizedHeader === 'containercount') {
      columnMap['binQuantity'] = index;
      console.log(`✅ Bin quantity column (alternative) detected at index ${index}`);
    }
    
    if (normalizedHeader.includes('base') && normalizedHeader.includes('rate')) columnMap['baseRate'] = index;
    if (normalizedHeader.includes('franchise')) columnMap['franchiseFee'] = index;
    if (normalizedHeader.includes('tax')) columnMap['localTax'] = index;
    if (normalizedHeader.includes('fuel')) columnMap['fuelSurcharge'] = index;
    if (normalizedHeader.includes('division')) columnMap['division'] = index;
    if (normalizedHeader.includes('customer') && normalizedHeader.includes('name')) columnMap['customerName'] = index;
    if (normalizedHeader.includes('material')) columnMap['materialType'] = index;
    
    // Add-ons detection
    if (normalizedHeader.includes('addon') || normalizedHeader.includes('extra') || 
        normalizedHeader.includes('lockbar') || normalizedHeader.includes('lock')) columnMap['addOns'] = index;
    
    // Notes detection
    if (normalizedHeader.includes('note') || normalizedHeader.includes('comment')) columnMap['notes'] = index;
    
    // Enhanced material type detection - prioritize specific material type keywords
    if (normalizedHeader === 'materialtype' || normalizedHeader === 'material' ||
        normalizedHeader === 'wastetype' || normalizedHeader === 'producttype' ||
        normalizedHeader === 'streamtype' || normalizedHeader === 'recyclabletype' ||
        normalizedHeader === 'singlestream' || normalizedHeader === 'occ' ||
        normalizedHeader === 'cardboard' || normalizedHeader === 'recyclable' ||
        normalizedHeader === 'wastestream' || normalizedHeader === 'materialstream') {
      columnMap['materialType'] = index;
      console.log('🎯 Material type column detected:', header, 'at index', index);
    }
    
    // Fallback material type detection - only if no specific match found
    if (!columnMap['materialType'] && 
        (normalizedHeader.includes('material') || normalizedHeader.includes('waste') || 
         normalizedHeader.includes('product') || normalizedHeader.includes('stream') ||
         normalizedHeader.includes('type'))) {
      // Only assign if this looks like a material type column and we haven't found one yet
      if (normalizedHeader.length <= 15) { // Avoid very long headers that might not be material type
        columnMap['materialType'] = index;
        console.log('🔄 Fallback material type column detected:', header, 'at index', index);
      }
    }
  });
  
  console.log('📊 Final column mapping:', columnMap);
  console.log('🎯 Frequency column mapped to index:', columnMap['frequency'], '(should be 7 for column H)');
  
  return columnMap;
}

export function parseRateData(csvData: string[][], columnMap: Record<string, number>): RateData[] {
  return csvData.slice(1).map((row, index) => ({
    id: `rate-${index}`,
    city: columnMap['city'] !== undefined ? row[columnMap['city']] || '' : '',
    state: columnMap['state'] !== undefined ? row[columnMap['state']] || 'TX' : 'TX',
    equipmentType: columnMap['equipmentType'] !== undefined ? row[columnMap['equipmentType']] || '' : '',
    containerSize: normalizeContainerSize(
      columnMap['containerSize'] !== undefined ? row[columnMap['containerSize']] || '' : ''
    ),
    frequency: normalizeFrequency(
      columnMap['frequency'] !== undefined ? row[columnMap['frequency']] || '' : ''
    ),
    baseRate: columnMap['baseRate'] !== undefined ? parseFloat(row[columnMap['baseRate']] || '0') || 0 : 0,
    franchiseFee: columnMap['franchiseFee'] !== undefined ? parseFloat(row[columnMap['franchiseFee']] || '0') || 0 : 0,
    localTax: columnMap['localTax'] !== undefined ? parseFloat(row[columnMap['localTax']] || '0') || 0 : 0,
    fuelSurcharge: columnMap['fuelSurcharge'] !== undefined ? parseFloat(row[columnMap['fuelSurcharge']] || '0') || 0 : 0,
    division: columnMap['division'] !== undefined ? row[columnMap['division']] || '' : ''
  }));
}

export function parseServiceRequests(csvData: string[][], columnMap: Record<string, number>): ServiceRequest[] {
  return csvData.slice(1).map((row, index) => {
    const addressColIdx = columnMap['address'];
    const cityColIdx = columnMap['city'];
    const stateColIdx = columnMap['state'];
    const zipColIdx = columnMap['zipCode'];
    const binQuantityColIdx = columnMap['binQuantity'];
    
    const addressField = addressColIdx !== undefined ? row[addressColIdx] || '' : '';
    const parsedAddress = parseAddressField(addressField);
    const binQtyValue = binQuantityColIdx !== undefined && binQuantityColIdx >= 0 ? row[binQuantityColIdx] : undefined;
    const addOnsValue = columnMap['addOns'] !== undefined ? row[columnMap['addOns']] : undefined;
    
    return {
      id: `request-${index}`,
      customerName: (columnMap['customerName'] !== undefined ? row[columnMap['customerName']] : undefined) || 
                    (columnMap['companyName'] !== undefined ? row[columnMap['companyName']] : undefined) || 
                    `Customer ${index + 1}`,
      address: parsedAddress.streetAddress || addressField || '',
      city: parsedAddress.city || (cityColIdx !== undefined ? row[cityColIdx] || '' : ''),
      state: convertStateAbbreviation(
        parsedAddress.state || 
        (stateColIdx !== undefined ? row[stateColIdx] || '' : '') || 
        'TX'
      ),
      equipmentType: columnMap['equipmentType'] !== undefined ? row[columnMap['equipmentType']] || '' : '',
      containerSize: normalizeContainerSize(
        columnMap['containerSize'] !== undefined ? row[columnMap['containerSize']] || '' : ''
      ),
      frequency: normalizeFrequency(
        columnMap['frequency'] !== undefined ? row[columnMap['frequency']] || '' : ''
      ),
      materialType: normalizeMaterialType(
        columnMap['materialType'] !== undefined ? row[columnMap['materialType']] || 'Solid Waste' : 'Solid Waste'
      ),
      zipCode: parsedAddress.zipCode || (zipColIdx !== undefined ? row[zipColIdx] || '' : ''),
      addOns: addOnsValue && addOnsValue.trim() !== '' 
        ? addOnsValue.split(',').map(s => s.trim()) 
        : [],
      notes: columnMap['notes'] !== undefined ? row[columnMap['notes']] || '' : '',
      binQuantity: binQtyValue !== undefined ? parseInt(String(binQtyValue)) || 1 : 1
    };
  });
}

export function normalizeContainerSize(size: string): string {
  const normalized = size.toLowerCase().replace(/[^0-9yd]/g, '');
  const match = normalized.match(/(\d+)/);
  return match ? `${match[1]}YD` : size;
}

/**
 * Normalize material type for consistent categorization
 * Export this function so it can be used by other modules
 */
export function normalizeMaterialType(materialType: string): string {
  if (!materialType || typeof materialType !== 'string') {
    return 'Solid Waste';
  }

  const normalized = materialType.toLowerCase().trim();
  
  // Recycling variations - enhanced to include single stream and OCC
  if (normalized.includes('recycl') || 
      normalized.includes('single stream') || 
      normalized.includes('singlestream') ||
      normalized.includes('single-stream') ||
      normalized === 'single stream' ||
      normalized.includes('occ') ||
      normalized.includes('cardboard') ||
      normalized.includes('recyclable') ||
      normalized.includes('recycle') ||
      normalized === 'ssry' ||
      normalized === 'ss' ||
      normalized.includes('mixed recycl') ||
      normalized.includes('mixed recycling')) {
    return 'Recycling';
  }
  
  // Solid waste variations (default)
  if (normalized.includes('trash') ||
      normalized.includes('garbage') ||
      normalized.includes('waste') ||
      normalized.includes('msw') ||
      normalized.includes('solid waste') ||
      normalized.includes('refuse')) {
    return 'Solid Waste';
  }
  
  // Construction/demolition
  if (normalized.includes('construction') ||
      normalized.includes('demolition') ||
      normalized.includes('c&d') ||
      normalized.includes('debris')) {
    return 'Construction';
  }
  
  // Yard waste
  if (normalized.includes('yard') ||
      normalized.includes('green') ||
      normalized.includes('organic') ||
      normalized.includes('compost')) {
    return 'Yard Waste';
  }
  
  // Default to solid waste for unrecognized types
  console.log('⚠️ Unrecognized material type, defaulting to Solid Waste:', materialType);
  return 'Solid Waste';
}

function normalizeFrequency(frequency: string): string {
  console.log('🔄 Normalizing frequency input:', frequency);
  
  if (!frequency || frequency.trim() === '') {
    console.log('❌ Empty frequency input, defaulting to 1x/week');
    return '1x/week';
  }
  
  const lower = frequency.toLowerCase();
  console.log('🔍 Frequency lowercase:', lower);
  
  // CRITICAL FIX: Direct pattern matching for exact format in your data
  const directMatch = frequency.match(/(\d+)x\/week/i);
  if (directMatch) {
    const result = `${directMatch[1]}x/week`;
    console.log('✅ Direct frequency match found:', frequency, '->', result);
    return result;
  }
  
  // Handle decimal frequencies like 0.5x/week
  const decimalMatch = frequency.match(/(0\.5|\.5)x?\/week/i);
  if (decimalMatch) {
    console.log('✅ Decimal frequency match found:', frequency, '-> 0.5x/week');
    return '0.5x/week';
  }
  
  // Handle half-week variations
  if (lower.includes('half') || lower.includes('0.5') || lower.includes('.5')) {
    if (lower.includes('week')) {
      console.log('✅ Half-week frequency detected:', frequency, '-> 0.5x/week');
      return '0.5x/week';
    }
  }
  
  // Handle every other week / biweekly
  if (lower.includes('every other week') || lower.includes('biweekly') || lower.includes('bi-weekly')) {
    console.log('✅ Every other week frequency detected:', frequency, '-> 0.5x/week');
    return '0.5x/week';
  }
  
  if (lower.includes('week')) {
    const match = lower.match(/(\d+)/);
    const times = match && match[1] ? parseInt(match[1]) : 1;
    const result = `${times}x/week`;
    console.log('✅ Weekly frequency parsed:', frequency, '->', result);
    return result;
  }
  
  if (lower.includes('month')) {
    const match = lower.match(/(\d+)/);
    const times = match && match[1] ? parseInt(match[1]) : 1;
    const result = `${times}x/month`;
    console.log('✅ Monthly frequency parsed:', frequency, '->', result);
    return result;
  }
  
  if (lower.includes('daily')) {
    console.log('✅ Daily frequency detected:', frequency, '-> 7x/week');
    return '7x/week';
  }
  if (lower.includes('weekly')) {
    console.log('✅ Weekly frequency detected:', frequency, '-> 1x/week');
    return '1x/week';
  }
  if (lower.includes('biweekly') || lower.includes('bi-weekly')) {
    console.log('✅ Biweekly frequency detected:', frequency, '-> 2x/month');
    return '2x/month';
  }
  if (lower.includes('monthly')) {
    console.log('✅ Monthly frequency detected:', frequency, '-> 1x/month');
    return '1x/month';
  }
  
  console.log('⚠️ Frequency not recognized, returning as-is:', frequency);
  return frequency;
}

/**
 * Normalize material type for consistent categorization
 */
/**
 * Split the address part before state into street address and city
 */
function splitStreetAndCity(addressPart: string): { streetAddress: string; city: string } {
  if (!addressPart || addressPart.trim() === '') {
    return { streetAddress: '', city: '' };
  }
  
  const trimmed = addressPart.trim();
  
  // Enhanced street suffixes list
  const streetSuffixes = [
    'st', 'street', 'ave', 'avenue', 'rd', 'road', 'blvd', 'boulevard', 
    'dr', 'drive', 'ln', 'lane', 'ct', 'court', 'pl', 'place', 'way', 
    'pkwy', 'parkway', 'cir', 'circle', 'ter', 'terrace', 'trl', 'trail',
    'hwy', 'highway', 'fwy', 'freeway', 'expy', 'expressway'
  ];
  
  // Look for the last occurrence of a street suffix
  let lastSuffixIndex = -1;
  let lastSuffixEnd = -1;
  
  streetSuffixes.forEach(suffix => {
    const regex = new RegExp(`\\b${suffix}\\b`, 'gi');
    let match;
    while ((match = regex.exec(trimmed)) !== null) {
      if (match.index > lastSuffixIndex) {
        lastSuffixIndex = match.index;
        lastSuffixEnd = match.index + match[0].length;
      }
    }
  });
  
  if (lastSuffixIndex !== -1) {
    // Found a street suffix - split after it
    const streetAddress = trimmed.substring(0, lastSuffixEnd).trim();
    const city = trimmed.substring(lastSuffixEnd).trim().replace(/^,\s*/, ''); // Remove leading comma
    
    console.log('🛣️ Split by street suffix:', {
      streetAddress,
      city,
      suffixFound: trimmed.substring(lastSuffixIndex, lastSuffixEnd)
    });
    
    return { streetAddress, city };
  }
  
  // No street suffix found - try comma-based splitting
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      const city = parts[parts.length - 1] || ''; // Last part is city
      const streetAddress = parts.slice(0, -1).join(', '); // Everything else is street
      
      console.log('🏙️ Split by comma:', { streetAddress, city });
      return { streetAddress, city };
    }
  }
  
  // Fallback: Use word-based heuristic
  // Assume the last 1-2 words are the city, rest is street address
  const words = trimmed.split(/\s+/);
  if (words.length >= 3) {
    // Check if last two words could be a city (common two-word cities)
    const lastTwoWords = words.slice(-2).join(' ').toLowerCase();
    const commonTwoWordCities = [
      'fort worth', 'san antonio', 'el paso', 'las vegas', 'new york',
      'los angeles', 'san diego', 'san francisco', 'santa ana', 'long beach',
      'virginia beach', 'colorado springs', 'saint paul', 'corpus christi'
    ];
    
    if (commonTwoWordCities.includes(lastTwoWords)) {
      const city = words.slice(-2).join(' ');
      const streetAddress = words.slice(0, -2).join(' ');
      console.log('🏙️ Split by two-word city heuristic:', { streetAddress, city });
      return { streetAddress, city };
    }
    
    // Default: last word is city
    const city = words[words.length - 1] || '';
    const streetAddress = words.slice(0, -1).join(' ');
    console.log('🏙️ Split by single-word city heuristic:', { streetAddress, city });
    return { streetAddress, city };
  }
  
  // If we can't split intelligently, return the whole thing as street address
  console.log('🤷 Could not split address, using as street address:', trimmed);
  return { streetAddress: trimmed, city: '' };
}

export function parseAddressField(address: string): {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
} {
  console.log('🔍 PARSING ADDRESS FIELD:', {
    input: address,
    length: address?.length || 0,
    trimmed: address?.trim() || ''
  });

  if (!address || address.trim().length === 0) {
    console.log('❌ Empty address input');
    return { streetAddress: '', city: '', state: '', zipCode: '' };
  }

  // Handle single-cell address parsing like "111 Main St., Houston TX 77587"
  const trimmedAddress = address.trim();
  console.log('📍 Trimmed address for parsing:', trimmedAddress);
  
  // ENHANCED: Look for the rightmost valid City, State ZIP pattern, ignoring trailing data
  // This regex captures: [City], [State] [ZIP] and ignores anything after the ZIP
  const addressPattern = /(.+?)\s*,?\s*([A-Z]{2}|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|District of Columbia)\s+(\d{5}(?:-\d{4,4})?)/i;
  
  console.log('🔍 Testing regex pattern against address...');
  const match = trimmedAddress.match(addressPattern);
  
  console.log('🎯 Regex match result:', {
    hasMatch: !!match,
    matchGroups: match ? {
      fullMatch: match[0],
      beforeState: match[1],
      state: match[2], 
      zipCode: match[3]
    } : null
  });
  
  if (!match) {
    console.warn('⚠️ Could not parse address pattern:', trimmedAddress);
    console.warn('⚠️ Expected format: "Street Address, State ZIP" or "Street Address State ZIP"');
    return { streetAddress: trimmedAddress, city: '', state: '', zipCode: '' };
  }
  
  const beforeState = match[1] || '';
  const stateRaw = match[2] || '';
  const zipCodeMatch = match[3] || '';
  const state = convertStateToAbbreviation(stateRaw.trim());
  const zipCode = zipCodeMatch;
  
  console.log('📍 Address pattern matched:', {
    beforeState: beforeState.trim(),
    stateRaw: stateRaw.trim(),
    state,
    zipCode
  });
  
  // Now split the beforeState part into street address and city
  const { streetAddress, city } = splitStreetAndCity(beforeState.trim());
  
  console.log('✅ Final parsed components:', {
    streetAddress,
    city,
    state,
    zipCode
  });
  
  return {
    streetAddress,
    city,
    state,
    zipCode
  };
}

export function convertStateAbbreviation(stateInput: string): string {
  if (!stateInput) return 'TX';
  
  const stateAbbreviations: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  };
  
  const upperState = stateInput.toUpperCase().trim();
  
  // If it's already a full state name, return as is
  if (Object.values(stateAbbreviations).includes(stateInput)) {
    return stateInput;
  }
  
  // Convert abbreviation to full name
  return stateAbbreviations[upperState] || stateInput;
}

function convertStateToAbbreviation(stateInput: string): string {
  if (!stateInput) return 'TX';
  
  const stateToAbbreviation: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
    'District of Columbia': 'DC'
  };
  
  const trimmedState = stateInput.trim();
  
  // If it's already an abbreviation, return as is
  if (trimmedState.length === 2 && Object.keys(stateToAbbreviation).includes(trimmedState.toUpperCase())) {
    return trimmedState.toUpperCase();
  }
  
  // Convert full name to abbreviation
  return stateToAbbreviation[trimmedState] || trimmedState;
}

/**
 * Parse the regional rate sheets CSV file to extract pricing data for NTX, CTX, and STX regions
 */
export function parseRegionalRateSheets(csvText: string): RegionalPricingData {
  console.log('🧠 Parsing regional rate sheets CSV...');
  
  const lines = csvText.trim().split('\n');
  const rateSheets: RegionalRateSheet[] = [];
  
  let currentRegion: 'NTX' | 'CTX' | 'STX' | null = null;
  let currentRegionName = '';
  let currentRates: RegionalRateEntry[] = [];
  let isInDataSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    
    // Skip empty lines
    if (!line) {
      // If we were in a data section and hit an empty line, save the current rate sheet
      if (isInDataSection && currentRegion && currentRates.length > 0) {
        rateSheets.push({
          region: currentRegion,
          regionName: currentRegionName,
          rates: [...currentRates]
        });
        console.log(`✅ Saved ${currentRegion} rate sheet with ${currentRates.length} rates`);
        currentRates = [];
        isInDataSection = false;
      }
      continue;
    }
    
    const cells = line.split(',').map(cell => cell.trim().replace(/"/g, '').replace(/\$/g, ''));
    
    console.log(`📋 Processing line ${i + 1}: "${line}"`);
    console.log(`📋 Parsed cells:`, cells);
    
    // Detect region headers
    const firstCell = (cells[0] || '').toLowerCase();
    
    if (firstCell.includes('ntx') || firstCell.includes('dallas') || firstCell.includes('fort worth')) {
      currentRegion = 'NTX';
      currentRegionName = 'Dallas/Fort Worth';
      currentRates = [];
      isInDataSection = false;
      console.log('🎯 Found NTX rate sheet header');
      continue;
    }
    
    if (firstCell.includes('stx') || firstCell.includes('houston')) {
      currentRegion = 'STX';
      currentRegionName = 'Houston';
      currentRates = [];
      isInDataSection = false;
      console.log('🎯 Found STX rate sheet header');
      continue;
    }
    
    if (firstCell.includes('ctx') || firstCell.includes('san antonio') || firstCell.includes('san marcos') || firstCell.includes('austin')) {
      currentRegion = 'CTX';
      currentRegionName = 'San Antonio/San Marcos/Austin';
      currentRates = [];
      isInDataSection = false;
      console.log('🎯 Found CTX rate sheet header');
      continue;
    }
    
    // Detect data header row (Size, 1x week, 2x week, etc.)
    if (firstCell === 'size' && cells.some(cell => cell.includes('week'))) {
      isInDataSection = true;
      console.log(`📊 Found data header for ${currentRegion}`);
      console.log(`📊 Header cells:`, cells);
      continue;
    }
    
    // Parse data rows
    if (isInDataSection && currentRegion && cells.length > 1) {
      const containerSize = cells[0];
      
      // Skip if first cell doesn't look like a container size
      if (!containerSize || !containerSize.includes('yd')) {
        console.log(`⚠️ Skipping non-container row: "${containerSize}"`);
        continue;
      }
      
      // Normalize container size (e.g., "2yd" -> "2YD")
      const normalizedSize = containerSize.toUpperCase().replace(/[^0-9YD]/g, '');
      console.log(`📦 Processing container size: "${containerSize}" -> "${normalizedSize}"`);
      
      // Parse each frequency column (skip first column which is container size)
      for (let j = 1; j < cells.length; j++) {
        const priceCell = cells[j];
        if (!priceCell || priceCell.trim() === '') continue;
        
        // Extract price (remove $ and commas)
        const priceMatch = priceCell.replace(/[\$,]/g, '').match(/\d+\.?\d*/);
        if (!priceMatch) continue;
        
        const price = parseFloat(priceMatch[0]);
        if (isNaN(price) || price <= 0) continue;
        
        // Determine frequency based on column position
        const frequency = getFrequencyFromColumnIndex(j);
        if (!frequency) {
          console.log(`⚠️ Could not determine frequency for column ${j}`);
          continue;
        }
        
        currentRates.push({
          containerSize: normalizedSize,
          frequency: frequency,
          price: price
        });
        
        console.log(`📋 Added rate: ${currentRegion} - ${normalizedSize} - ${frequency} = $${price}`);
      }
    }
  }
  
  // Save the last rate sheet if we ended in a data section
  if (isInDataSection && currentRegion && currentRates.length > 0) {
    rateSheets.push({
      region: currentRegion,
      regionName: currentRegionName,
      rates: [...currentRates]
    });
    console.log(`✅ Saved final ${currentRegion} rate sheet with ${currentRates.length} rates`);
  }
  
  console.log('🧠 Regional rate sheets parsing complete:', {
    totalSheets: rateSheets.length,
    sheets: rateSheets.map(sheet => ({
      region: sheet.region,
      regionName: sheet.regionName,
      rateCount: sheet.rates.length
    }))
  });
  
  return {
    rateSheets,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Map column index to frequency string
 */
function getFrequencyFromColumnIndex(columnIndex: number): string | null {
  const frequencyMap: Record<number, string> = {
    1: '1x/week',
    2: '2x/week', 
    3: '3x/week',
    4: '4x/week',
    5: '5x/week',
    6: '6x/week'
  };
  
  return frequencyMap[columnIndex] || null;
}
