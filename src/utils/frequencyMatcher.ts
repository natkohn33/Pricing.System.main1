/**
 * Frequency standardization utility
 * Converts various frequency formats to standardized format
 */

export function standardizeFrequency(frequency: string): string {
  if (!frequency) return '1x/week';
  
  const freq = frequency.toLowerCase().trim();
  
  // Handle weekly frequencies
  if (freq.includes('weekly') || freq.includes('week')) {
    const match = freq.match(/(\d+)/);
    const times = match ? parseInt(match[1]) : 1;
    return `${times}x/week`;
  }
  
  // Handle daily frequencies
  if (freq.includes('daily') || freq.includes('day')) {
    const match = freq.match(/(\d+)/);
    const times = match ? parseInt(match[1]) : 7;
    return `${times}x/week`;
  }
  
  // Handle monthly frequencies
  if (freq.includes('monthly') || freq.includes('month')) {
    const match = freq.match(/(\d+)/);
    const times = match ? parseInt(match[1]) : 1;
    return `${times}x/month`;
  }
  
  // Handle specific patterns
  switch (freq) {
    case '0.5x/week':
    case 'half per week':
    case 'half weekly':
    case '0.5 per week':
    case '.5 per week':
    case 'every other week':
    case 'biweekly':
      return '0.5x/week';
      
    case '1x/week':
    case 'once per week':
    case 'once weekly':
    case 'weekly':
      return '1x/week';
      
    case '2x/week':
    case 'twice per week':
    case 'twice weekly':
    case 'bi-weekly':
      return '2x/week';
      
    case '3x/week':
    case 'three times per week':
    case 'thrice weekly':
      return '3x/week';
      
    case '4x/week':
    case 'four times per week':
      return '4x/week';
      
    case '5x/week':
    case 'five times per week':
    case 'weekdays':
      return '5x/week';
      
    case '6x/week':
    case 'six times per week':
      return '6x/week';
      
    case '7x/week':
    case 'daily':
    case 'every day':
      return '7x/week';
      
    case '1x/month':
    case 'once per month':
    case 'monthly':
      return '1x/month';
      
    case '2x/month':
    case 'twice per month':
    case 'bi-monthly':
      return '2x/month';
      
    case 'on-call':
    case 'as-needed':
    case 'on demand':
      return 'on-call';
      
    default:
      // Try to extract numbers and assume weekly if no clear indication
      const match = freq.match(/(\d+)/);
      if (match) {
        const times = parseInt(match[1]);
        if (times <= 7) {
          return `${times}x/week`;
        } else {
          return `${times}x/month`;
        }
      }
      return '1x/week'; // Default fallback
  }
}

export function getFrequencyMultiplier(frequency: string): number {
  const standardized = standardizeFrequency(frequency);
  
  // Handle 0.5x/week frequency
  if (standardized === '0.5x/week') {
    return 0.5;
  }
  
  if (standardized.includes('/week')) {
    const match = standardized.match(/(\d+)x\/week/);
    return match ? parseInt(match[1]) : 1;
  }
  
  if (standardized.includes('/month')) {
    const match = standardized.match(/(\d+)x\/month/);
    // Convert monthly to weekly equivalent
    return match ? parseInt(match[1]) / 4.33 : 0.23;
  }
  
  if (standardized === 'on-call') {
    return 0; // On-call has no regular frequency
  }
  
  return 1; // Default fallback
}

export function isValidFrequency(frequency: string): boolean {
  const standardized = standardizeFrequency(frequency);
  return standardized !== frequency || 
         standardized.includes('x/week') || 
         standardized.includes('x/month') || 
         standardized === 'on-call';
}