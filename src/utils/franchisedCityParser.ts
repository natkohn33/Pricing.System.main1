import { FranchisedCityPricing, FranchisedCityRate } from '../types';
import { isFranchisedCity as isRegisteredFranchisedCity, getFranchisedCityName as getRegisteredFranchisedCityName } from './franchisedCityMatcher';

/**
 * Parse Mansfield city pricing from the municipal contract CSV
 */
export function parseMansfieldPricing(csvText: string): FranchisedCityPricing {
  console.log('🏛️ Parsing Mansfield municipal contract pricing...');
  
  const lines = csvText.trim().split('\n');
  const rates: FranchisedCityRate[] = [];
  
  let isInCommercialSection = false;
  let isInRollOffSection = false;
  let deliveryFee = 96.30; // Default from rate sheet
  let franchiseFee = 8; // 8% City of Mansfield franchise fee
  let salesTax = 8.25; // 8.25% sales tax
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and headers
    if (!line || line.startsWith('CITY OF MANSFIELD') || line.startsWith('RESIDENTIAL')) {
      continue;
    }
    
    // Detect sections
    if (line.includes('Mansfield Commercial Pricing')) {
      isInCommercialSection = true;
      isInRollOffSection = false;
      console.log('📊 Found commercial pricing section');
      continue;
    }
    
    if (line.includes('Mansfield Roll Off Pricing')) {
      isInCommercialSection = false;
      isInRollOffSection = true;
      console.log('📊 Found roll-off pricing section');
      continue;
    }
    
    // Extract delivery fee
    if (line.includes('Delivery') && line.includes('$')) {
      const deliveryMatch = line.match(/\$(\d+\.?\d*)/);
      if (deliveryMatch) {
        deliveryFee = parseFloat(deliveryMatch[1]);
        console.log(`💰 Found delivery fee: $${deliveryFee}`);
      }
      continue;
    }
    
    // Extract franchise fee percentage
    if (line.includes('% CITY OF MANSFIELD') || line.includes('8% CITY OF MANSFILD')) {
      const ffMatch = line.match(/(\d+)%/);
      if (ffMatch) {
        franchiseFee = parseFloat(ffMatch[1]);
        console.log(`🏛️ Found franchise fee: ${franchiseFee}%`);
      }
      continue;
    }
    
    // Parse commercial pricing data
    if (isInCommercialSection && line.includes('yd') && line.includes('$')) {
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      
      if (cells.length >= 7) {
        const containerSize = cells[0];
        const frequencies = ['1x/week', '2x/week', '3x/week', '4x/week', '5x/week', '6x/week'];
        
        // Parse each frequency column
        for (let j = 1; j <= 6; j++) {
          const priceCell = cells[j];
          if (priceCell && priceCell.includes('$')) {
            const priceMatch = priceCell.replace(/[\$,]/g, '').match(/\d+\.?\d*/);
            if (priceMatch) {
              const monthlyRate = parseFloat(priceMatch[0]);
              
              rates.push({
                id: `mansfield-${containerSize}-${frequencies[j-1]}-${Date.now()}`,
                city: 'Mansfield',
                state: 'Texas',
                containerSize: normalizeContainerSize(containerSize),
                frequency: frequencies[j-1],
                equipmentType: containerSize.includes('COMPACTOR') ? 'Compactor' : 'Front-Load Container',
                monthlyRate,
                deliveryFee,
                franchiseFee,
                salesTax,
                extraPickupRate: parseExtraPickupRate(cells[7])
              });
              
              console.log(`📋 Added Mansfield rate: ${containerSize} - ${frequencies[j-1]} = $${monthlyRate}`);
            }
          }
        }
      }
    }
    
    // Parse roll-off pricing data
    if (isInRollOffSection && line.includes('YD') && line.includes('$')) {
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      
      if (cells.length >= 4) {
        const containerSize = cells[0];
        const deliveryPrice = parsePrice(cells[1]);
        const monthlyRental = parsePrice(cells[2]);
        const disposalRate = parsePrice(cells[3]);
        const haulRate = parsePrice(cells[4]);
        
        if (deliveryPrice > 0 && monthlyRental > 0) {
          rates.push({
            id: `mansfield-rolloff-${containerSize}-${Date.now()}`,
            city: 'Mansfield',
            state: 'Texas',
            containerSize: normalizeContainerSize(containerSize),
            frequency: '1x/month', // Roll-off default
            equipmentType: 'Roll-off',
            monthlyRate: monthlyRental,
            deliveryFee: deliveryPrice,
            franchiseFee,
            salesTax
          });
          
          console.log(`📋 Added Mansfield roll-off rate: ${containerSize} = $${monthlyRental}/month + $${deliveryPrice} delivery`);
        }
      }
    }
  }
  
  console.log('🏛️ Mansfield pricing parsing complete:', {
    totalRates: rates.length,
    commercialRates: rates.filter(r => r.equipmentType !== 'Roll-off').length,
    rollOffRates: rates.filter(r => r.equipmentType === 'Roll-off').length,
    franchiseFee: `${franchiseFee}%`,
    salesTax: `${salesTax}%`,
    deliveryFee: `$${deliveryFee}`
  });
  
  return {
    cityName: 'Mansfield',
    state: 'Texas',
    rates,
    lastUpdated: new Date().toISOString(),
    sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(MANSFIELD).csv'
  };
}

/**
 * Parse McKinney city pricing from the municipal contract CSV
 */
export function parseMcKinneyPricing(csvText: string): FranchisedCityPricing {
  console.log('🏛️ Parsing McKinney municipal contract pricing...');
  
  const lines = csvText.trim().split('\n');
  const rates: FranchisedCityRate[] = [];
  
  let isInCommercialCartsSection = false;
  let isInCommercialDumpstersSection = false;
  let isInRollOffSection = false;
  let deliveryFee = 99.75; // Default from McKinney rate sheet
  let franchiseFee = 5; // 5% City of McKinney franchise fee
  let salesTax = 8.25; // 8.25% sales tax
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and headers
    if (!line || line.startsWith('CITY OF MCKINNEY') || line.startsWith('RESIDENTIAL')) {
      continue;
    }
    
    // Detect sections
    if (line.includes('COMMERCIAL CARTS BILLED BY US')) {
      isInCommercialCartsSection = true;
      isInCommercialDumpstersSection = false;
      isInRollOffSection = false;
      console.log('📊 Found commercial carts section');
      continue;
    }
    
    if (line.includes('COMMERCIAL DUMPSTERS ARE BILLED BY US')) {
      isInCommercialCartsSection = false;
      isInCommercialDumpstersSection = true;
      isInRollOffSection = false;
      console.log('📊 Found commercial dumpsters section');
      continue;
    }
    
    if (line.includes('ROLL OFF IS BILLED BY US')) {
      isInCommercialCartsSection = false;
      isInCommercialDumpstersSection = false;
      isInRollOffSection = true;
      console.log('📊 Found roll-off section');
      continue;
    }
    
    // Extract delivery fee from roll-off section
    if (isInRollOffSection && line.includes('$99.75')) {
      deliveryFee = 99.75;
      console.log(`💰 Found McKinney delivery fee: $${deliveryFee}`);
    }
    
    // Extract franchise fee percentage
    if (line.includes('5% FF') || line.includes('(5% FF')) {
      franchiseFee = 5;
      console.log(`🏛️ Found McKinney franchise fee: ${franchiseFee}%`);
    }
    
    // Parse commercial cart pricing data
    if (isInCommercialCartsSection && line.includes('CART') && line.includes('$')) {
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      
      if (cells.length >= 4) {
        const cartCount = cells[0];
        const frequencies = ['1x/week', '2x/week', '3x/week'];
        
        // Parse each frequency column
        for (let j = 1; j <= 3; j++) {
          const priceCell = cells[j];
          if (priceCell && priceCell.includes('$') && priceCell !== '-') {
            const priceMatch = priceCell.replace(/[\$,]/g, '').match(/\d+\.?\d*/);
            if (priceMatch) {
              const monthlyRate = parseFloat(priceMatch[0]);
              
              rates.push({
                id: `mckinney-cart-${cartCount}-${frequencies[j-1]}-${Date.now()}`,
                city: 'McKinney',
                state: 'Texas',
                containerSize: cartCount.includes('1') ? '1-Cart' : cartCount.includes('2') ? '2-Cart' : '3-Cart',
                frequency: frequencies[j-1],
                equipmentType: 'Cart',
                monthlyRate,
                deliveryFee,
                franchiseFee,
                salesTax,
                extraPickupRate: parseExtraPickupRate(cells[4])
              });
              
              console.log(`📋 Added McKinney cart rate: ${cartCount} - ${frequencies[j-1]} = $${monthlyRate}`);
            }
          }
        }
      }
    }
    
    // Parse commercial dumpster pricing data
    if (isInCommercialDumpstersSection && line.includes('YD') && line.includes('$')) {
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      
      if (cells.length >= 7) {
        const containerSize = cells[0];
        const frequencies = ['1x/week', '2x/week', '3x/week', '4x/week', '5x/week', '6x/week'];
        
        // Parse each frequency column
        for (let j = 1; j <= 6; j++) {
          const priceCell = cells[j];
          if (priceCell && priceCell.includes('$') && priceCell !== '-') {
            const priceMatch = priceCell.replace(/[\$,]/g, '').match(/\d+\.?\d*/);
            if (priceMatch) {
              const monthlyRate = parseFloat(priceMatch[0]);
              
              rates.push({
                id: `mckinney-${containerSize}-${frequencies[j-1]}-${Date.now()}`,
                city: 'McKinney',
                state: 'Texas',
                containerSize: normalizeContainerSize(containerSize),
                frequency: frequencies[j-1],
                equipmentType: 'Front-Load Container',
                monthlyRate,
                deliveryFee,
                franchiseFee,
                salesTax,
                extraPickupRate: parseExtraPickupRate(cells[7])
              });
              
              console.log(`📋 Added McKinney dumpster rate: ${containerSize} - ${frequencies[j-1]} = $${monthlyRate}`);
            }
          }
        }
      }
    }
    
    // Parse roll-off pricing data
    if (isInRollOffSection && line.includes('YD') && line.includes('$')) {
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      
      if (cells.length >= 6) {
        const containerSize = cells[0];
        const deliveryPrice = parsePrice(cells[1]);
        const monthlyRental = parsePrice(cells[2]);
        const haulRate = parsePrice(cells[5]);
        
        if (deliveryPrice > 0 && monthlyRental > 0) {
          rates.push({
            id: `mckinney-rolloff-${containerSize}-${Date.now()}`,
            city: 'McKinney',
            state: 'Texas',
            containerSize: normalizeContainerSize(containerSize),
            frequency: '1x/month', // Roll-off default
            equipmentType: 'Roll-off',
            monthlyRate: monthlyRental,
            deliveryFee: deliveryPrice,
            franchiseFee,
            salesTax
          });
          
          console.log(`📋 Added McKinney roll-off rate: ${containerSize} = $${monthlyRental}/month + $${deliveryPrice} delivery`);
        }
      }
    }
  }
  
  console.log('🏛️ McKinney pricing parsing complete:', {
    totalRates: rates.length,
    cartRates: rates.filter(r => r.equipmentType === 'Cart').length,
    dumpsterRates: rates.filter(r => r.equipmentType === 'Front-Load Container').length,
    rollOffRates: rates.filter(r => r.equipmentType === 'Roll-off').length,
    franchiseFee: `${franchiseFee}%`,
    salesTax: `${salesTax}%`,
    deliveryFee: `$${deliveryFee}`
  });
  
  return {
    cityName: 'McKinney',
    state: 'Texas',
    rates,
    lastUpdated: new Date().toISOString(),
    sourceFile: 'MUNICIPAL CONTRACTS (NTX) (1)(MCKINNEY).csv'
  };
}

/**
 * Normalize container size format
 */
function normalizeContainerSize(size: string): string {
  const normalized = size.toLowerCase().replace(/[^0-9yd]/g, '');
  const match = normalized.match(/(\d+)/);
  return match ? `${match[1]}YD` : size;
}

/**
 * Parse price from cell value
 */
function parsePrice(priceCell: string): number {
  if (!priceCell) return 0;
  const match = priceCell.replace(/[\$,]/g, '').match(/\d+\.?\d*/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * Parse extra pickup rate
 */
function parseExtraPickupRate(extraCell: string): number {
  if (!extraCell || extraCell === 'S') return 0;
  return parsePrice(extraCell);
}

/**
 * Check if a city is a franchised city
 * Updated to use the comprehensive franchised cities registry
 */
export function isFranchisedCity(city: string, state: string): boolean {
  return isRegisteredFranchisedCity(city, state);
}

/**
 * Get franchised city name for identification
 * Updated to use the comprehensive franchised cities registry
 */
export function getFranchisedCityName(city: string, state: string): string | null {
  return getRegisteredFranchisedCityName(city, state);
}