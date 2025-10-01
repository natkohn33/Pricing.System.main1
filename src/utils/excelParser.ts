import * as XLSX from 'xlsx';

export interface ExcelParseResult {
  data: string[][];
  sheetName: string;
  totalSheets: number;
}

export function parseExcelFile(file: File): Promise<ExcelParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // First, get all data to analyze for header detection
        const allData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '',
          raw: false,
        }) as string[][];
        
        // Detect header row automatically
        const headerRowIndex = detectHeaderRow(allData);
        console.log('📊 Detected header row at index:', headerRowIndex);
        
        // Extract data starting from detected header row
        const jsonData = allData.slice(headerRowIndex);
        
        console.log('📊 Excel file parsed successfully:', {
          sheetName,
          totalSheets: workbook.SheetNames.length,
          detectedHeaderRow: headerRowIndex + 1, // +1 for human-readable row number
          rows: jsonData.length,
          columns: jsonData[0]?.length || 0,
          headers: jsonData[0],
          sampleData: jsonData.slice(0, 3)
        });
        
        resolve({
          data: jsonData,
          sheetName,
          totalSheets: workbook.SheetNames.length
        });
      } catch (error) {
        console.error('❌ Error parsing Excel file:', error);
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Automatically detect which row contains the column headers
 * Uses heuristics to identify the most likely header row
 */
function detectHeaderRow(data: string[][]): number {
  if (!data || data.length === 0) return 0;
  
  const maxRowsToCheck = Math.min(10, data.length); // Check first 10 rows max
  let bestScore = -1;
  let bestRowIndex = 0;
  
  for (let rowIndex = 0; rowIndex < maxRowsToCheck; rowIndex++) {
    const row = data[rowIndex];
    if (!row || row.length === 0) continue;
    
    const score = calculateHeaderScore(row);
    console.log(`🔍 Row ${rowIndex + 1} header score:`, score, 'Content:', row.slice(0, 5));
    
    if (score > bestScore) {
      bestScore = score;
      bestRowIndex = rowIndex;
    }
  }
  
  console.log('🎯 Best header row detected:', bestRowIndex + 1, 'with score:', bestScore);
  return bestRowIndex;
}

/**
 * Calculate a score for how likely a row is to be a header row
 * Higher scores indicate more likely header rows
 */
function calculateHeaderScore(row: string[]): number {
  let score = 0;
  const nonEmptyCount = row.filter(cell => cell && cell.toString().trim() !== '').length;
  
  // Base score: number of non-empty cells
  score += nonEmptyCount * 2;
  
  // Bonus for having multiple non-empty cells (headers usually span multiple columns)
  if (nonEmptyCount >= 3) score += 10;
  if (nonEmptyCount >= 5) score += 15;
  
  // Check each cell for header-like characteristics
  row.forEach(cell => {
    if (!cell || cell.toString().trim() === '') return;
    
    const cellValue = cell.toString().trim();
    
    // Penalty for numeric-only values (headers are usually text)
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
      // Address fields
      'address', 'street', 'location', 'site',
      // Geographic fields  
      'city', 'state', 'zip', 'postal', 'province',
      // Business fields
      'company', 'business', 'customer', 'client', 'name',
      // Service fields
      'equipment', 'container', 'size', 'frequency', 'service', 'pickup',
      'material', 'waste', 'addon', 'extra', 'special',
      // Coordinate fields
      'latitude', 'longitude', 'lat', 'lng', 'coord'
    ];
    
    const normalizedCell = cellValue.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matchedKeywords = headerKeywords.filter(keyword => 
      normalizedCell.includes(keyword) || keyword.includes(normalizedCell)
    );
    
    if (matchedKeywords.length > 0) {
      score += 20; // High bonus for header keywords
    }
    
    // Bonus for common header patterns
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(cellValue)) {
      score += 5; // Title case
    }
    
    if (cellValue.includes('_') || cellValue.includes('-')) {
      score += 3; // Common header separators
    }
    
    // Penalty for very long text (likely data, not headers)
    if (cellValue.length > 50) {
      score -= 10;
    }
    
    // Penalty for date-like patterns (likely data)
    if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(cellValue)) {
      score -= 15;
    }
  });
  
  return score;
}
export function isExcelFile(file: File): boolean {
  const excelExtensions = ['.xlsx', '.xls'];
  const fileName = file.name.toLowerCase();
  return excelExtensions.some(ext => fileName.endsWith(ext));
}

export function isSupportedFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  return fileName.endsWith('.csv') || isExcelFile(file);
}