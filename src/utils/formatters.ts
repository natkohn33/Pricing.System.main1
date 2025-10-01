/**
 * Utility functions for formatting numerical values in exports
 * Ensures consistent formatting across all export functionality
 */

/**
 * Format currency values with proper symbols, thousands separators, and decimal precision
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'N/A';
  }
  
  // Handle negative values with proper notation
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);
  
  // Format with thousands separators and exactly 2 decimal places
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(absoluteAmount);
  
  // Return with proper negative notation
  return isNegative ? `(${formatted})` : formatted;
}

/**
 * Format percentage values with proper symbol and decimal precision
 */
export function formatPercentage(value: number | null | undefined, decimalPlaces: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  
  // Format with specified decimal places and % symbol
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value / 100); // Convert from percentage number to decimal for proper formatting
}

/**
 * Format decimal percentage values (where input is already in decimal form like 0.0825)
 */
export function formatDecimalPercentage(value: number | null | undefined, decimalPlaces: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  
  // Input is already in decimal form (0.0825), so format directly
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
}

/**
 * Format numeric values with thousands separators
 */
export function formatNumber(value: number | null | undefined, decimalPlaces: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
}

/**
 * Format container size values
 */
export function formatContainerSize(size: string | null | undefined): string {
  if (!size || size.trim() === '') {
    return 'N/A';
  }
  
  return size.trim();
}

/**
 * Format status values for export
 */
export function formatStatus(status: 'serviceable' | 'not-serviceable' | 'manual-review'): string {
  switch (status) {
    case 'serviceable':
      return 'Serviceable - Quote Generated';
    case 'manual-review':
      return 'Manual Review Required';
    case 'not-serviceable':
      return 'Not Serviceable';
    default:
      return 'Unknown Status';
  }
}

/**
 * Validate that a value is a valid number for formatting
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Safe number conversion with fallback
 */
export function safeNumber(value: any, fallback: number = 0): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isValidNumber(num) ? num : fallback;
}