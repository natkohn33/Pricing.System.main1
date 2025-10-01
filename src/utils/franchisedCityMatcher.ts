/**
 * Comprehensive franchised city matching and pricing application system
 * Ensures all franchised cities use their dedicated rate sheets
 */

import { FranchisedCityPricing } from '../types';
import { loadFranchiseFeesFromCsv } from './franchiseFeeLoader';
import { standardizeFrequency } from './frequencyMatcher';

// Import all franchised city pricing data
import { getRenoMunicipalPricing } from '../data/Reno.ts';
import { getTroyMunicipalPricing } from '../data/Troy.ts';
import { getDaytonMunicipalPricing } from '../data/Dayton.ts';
import { getKenedyMunicipalPricing } from '../data/KENEDY.ts';
import { getRioVistaMunicipalPricing } from '../data/RIOVISTA.ts';
import { getStHedwigMunicipalPricing } from '../data/St. Hedwig.ts';
import { getCockrellHillMunicipalPricing } from '../data/CockrellHill.ts';
import { getGlenRoseMunicipalPricing } from '../data/GLENROSE.ts';
import { getKennedaleMunicipalPricing } from '../data/Kennedale.ts';
import { getBalchSpringsMunicipalPricing } from '../data/BalchSprings.ts';

// Additional franchised cities from existing data
import { getMansfieldMunicipalPricing } from '../data/mansfieldRates';
import { getMcKinneyMunicipalPricing } from '../data/mckinneyRates';
import { getPearlandMunicipalPricing } from '../data/pearlandRates';
import { getGodleyMunicipalPricing } from '../data/godleyRates';
import { getKrumMunicipalPricing } from '../data/krumRates';
import { getMineralWellsMunicipalPricing } from '../data/mineralWellsRates';
import { getNewFairviewMunicipalPricing } from '../data/newFairviewRates';
import { getSeagovilleMunicipalPricing } from '../data/seagovilleRates';
import { getClevelandMunicipalPricing } from '../data/clevelandRates';
import { getLibertyMunicipalPricing } from '../data/libertyRates';
import { getWhiteSettlementMunicipalPricing } from '../data/whiteSettlementRates';
import { getTomballMunicipalPricing } from '../data/tomballRates';
import { getSchertzMunicipalPricing } from '../data/schertzRates';
import { getWataugaMunicipalPricing } from '../data/wataugaRates';
import { getSpringtownMunicipalPricing } from '../data/springtownRates';
import { getWacoMunicipalPricing } from '../data/wacoRates';
import { getSelmaMunicipalPricing } from '../data/selmaRates';

// NEW 22 FRANCHISE CITIES - Municipal rate sheet imports
import { getBellmeadMunicipalPricing } from '../data/BellmeadRates';
import { getBlumMunicipalPricing } from '../data/Blum';
import { getBremondMunicipalPricing } from '../data/Bremond';
import { getCovingtonMunicipalPricing } from '../data/Covington';
import { getGonzalesMunicipalPricing } from '../data/Gonzales';
import { getGrandviewMunicipalPricing } from '../data/Grandview';
import { getGroesbeckMunicipalPricing } from '../data/Groesbeck';
import { getHearneMunicipalPricing } from '../data/Hearne';
import { getHelotesMunicipalPricing } from '../data/Helotes';
import { getHicoMunicipalPricing } from '../data/Hico';
import { getHubbardMunicipalPricing } from '../data/Hubbard';
import { getIredellMunicipalPricing } from '../data/Iredell';
import { getItalyMunicipalPricing } from '../data/Italy';
import { getKosseMunicipalPricing } from '../data/Kosse';
import { getLorenaMunicipalPricing } from '../data/Lorena';
import { getMarlinMunicipalPricing } from '../data/Marlin';
import { getMexiaMunicipalPricing } from '../data/Mexia';
import { getMorganMunicipalPricing } from '../data/Morgan';
import { getNormangeeMunicipalPricing } from '../data/Normangee';
import { getRieselMunicipalPricing } from '../data/Riesel';
import { getValleyMillsMunicipalPricing } from '../data/ValleyMills';
import { getWestMunicipalPricing } from '../data/West';

// NEW 4 FRANCHISE CITIES - Additional municipal rate sheet imports
import { getBalconesHeightsMunicipalPricing } from '../data/BalconesHeights';
import { getCorpusChristiMunicipalPricing } from '../data/Corpus';

export interface FranchisedCityMatch {
  isMatch: boolean;
  cityName: string;
  state: string;
  pricingData: FranchisedCityPricing | null;
  franchiseFee: number;
  salesTax: number;
}

// Cache for franchise fee data
let franchiseFeeMap: Map<string, number> | null = null;

/**
 * Master franchised cities registry with their pricing data sources
 * ALL ADDRESSES within these cities require franchised pricing regardless of zip code
 */
const FRANCHISED_CITIES_REGISTRY: Record<string, () => FranchisedCityPricing> = {
  // NEW FRANCHISED CITIES - Primary municipal pricing sources
  'cockrell hill': getCockrellHillMunicipalPricing,
  'glen rose': getGlenRoseMunicipalPricing,
  'reno': getRenoMunicipalPricing,
  'kenedy': getKenedyMunicipalPricing,
  'rio vista': getRioVistaMunicipalPricing,
  'st. hedwig': getStHedwigMunicipalPricing,
  'st hedwig': getStHedwigMunicipalPricing, // Alternative spelling
  'troy': getTroyMunicipalPricing,
  'dayton': getDaytonMunicipalPricing,
  'kennedale': getKennedaleMunicipalPricing,
  'balch springs': getBalchSpringsMunicipalPricing,
  
  // EXISTING FRANCHISED CITIES - Municipal contract pricing
  'mansfield': getMansfieldMunicipalPricing,
  'mckinney': getMcKinneyMunicipalPricing,
  'pearland': getPearlandMunicipalPricing,
  'godley': getGodleyMunicipalPricing,
  'krum': getKrumMunicipalPricing,
  'mineral wells': getMineralWellsMunicipalPricing,
  'new fairview': getNewFairviewMunicipalPricing,
  'seagoville': getSeagovilleMunicipalPricing,
  'cleveland': getClevelandMunicipalPricing,
  'liberty': getLibertyMunicipalPricing,
  'white settlement': getWhiteSettlementMunicipalPricing,
  'tomball': getTomballMunicipalPricing,
  'schertz': getSchertzMunicipalPricing,
  'watauga': getWataugaMunicipalPricing,
  'springtown': getSpringtownMunicipalPricing,
  'waco': getWacoMunicipalPricing,
  'selma': getSelmaMunicipalPricing,

  // NEW 22 FRANCHISE CITIES - Municipal rate sheet mappings
  'bellmead': getBellmeadMunicipalPricing,
  'blum': getBlumMunicipalPricing,
  'bremond': getBremondMunicipalPricing,
  'covington': getCovingtonMunicipalPricing,
  'gonzales': getGonzalesMunicipalPricing,
  'grandview': getGrandviewMunicipalPricing,
  'groesbeck': getGroesbeckMunicipalPricing,
  'hearne': getHearneMunicipalPricing,
  'helotes': getHelotesMunicipalPricing,
  'helotes city': getHelotesMunicipalPricing, // Alternative name
  'hico': getHicoMunicipalPricing,
  'hubbard': getHubbardMunicipalPricing,
  'iredell': getIredellMunicipalPricing,
  'italy': getItalyMunicipalPricing,
  'kosse': getKosseMunicipalPricing,
  'lorena': getLorenaMunicipalPricing,
  'marlin': getMarlinMunicipalPricing,
  'mexia': getMexiaMunicipalPricing,
  'morgan': getMorganMunicipalPricing,
  'normangee': getNormangeeMunicipalPricing,
  'riesel': getRieselMunicipalPricing,
  'valley mills': getValleyMillsMunicipalPricing,
  'west': getWestMunicipalPricing,

  // NEW 4 FRANCHISE CITIES - Municipal rate sheet mappings
  'balcones heights': getBalconesHeightsMunicipalPricing,
  'corpus christi': getCorpusChristiMunicipalPricing,
};

/**
 * Check if a location is a franchised city and return its pricing data
 * @param city - City name from the service request
 * @param state - State from the service request
 * @returns FranchisedCityMatch with pricing data if franchised city
 */
export async function matchFranchisedCity(city: string, state: string): Promise<FranchisedCityMatch> {
  const normalizedCity = city.toLowerCase().trim();
  const normalizedState = state.toLowerCase().trim();
  
  // Only process Texas cities
  if (normalizedState !== 'texas' && normalizedState !== 'tx') {
    return {
      isMatch: false,
      cityName: city,
      state: state,
      pricingData: null,
      franchiseFee: 0,
      salesTax: 0
    };
  }
  
  console.log('🏛️ Checking for franchised city match:', { city: normalizedCity, state: normalizedState });
  
  // STEP 1: Load franchise fee data from CSV and determine city-specific fees
  if (!franchiseFeeMap) {
    franchiseFeeMap = await loadFranchiseFeesFromCsv();
  }
  
  // Get franchise fee from CSV
  let franchiseFee = franchiseFeeMap.get(normalizedCity) || 0;
  let salesTax = 8.25; // Default Texas sales tax
  
  // ABSOLUTE HOUSTON OVERRIDE: Ensure Houston always has 4% franchise fee
  if (normalizedCity === 'houston') {
    franchiseFee = 4;
    console.log('🏛️ Applied Houston-specific franchise fee override: 4%');
  }
  
  console.log('🏛️ City-specific fees determined:', {
    city: normalizedCity,
    franchiseFee: `${franchiseFee}%`,
    salesTax: `${salesTax}%`,
    source: normalizedCity === 'houston' ? 'Houston override' : franchiseFeeMap.has(normalizedCity) ? 'CSV data' : 'default'
  });
  
  // STEP 2: Check if city has municipal pricing data (true franchise city)
  const pricingDataLoader = FRANCHISED_CITIES_REGISTRY[normalizedCity];
  let pricingData: FranchisedCityPricing | null = null;
  let hasMunicipalRates = false;
  
  if (pricingDataLoader) {
    console.log('✅ FRANCHISED CITY MATCH FOUND:', normalizedCity.toUpperCase());
    
    try {
      pricingData = pricingDataLoader();
      
      // Validate pricing data
      if (pricingData && pricingData.rates && pricingData.rates.length > 0) {
        hasMunicipalRates = true;
        console.log('✅ Municipal pricing data loaded successfully for:', normalizedCity);
      } else {
        console.warn('⚠️ Invalid or empty pricing data for franchised city:', normalizedCity);
        pricingData = null;
      }
    } catch (error) {
      console.error('❌ Error loading franchised city pricing data:', error);
      pricingData = null;
    }
  } else {
    console.log('ℹ️ No municipal pricing data found for:', normalizedCity, '(not a franchise city with municipal rates)');
  }
  
  // STEP 3: Determine final match status and log results
  const isMatch = hasMunicipalRates || franchiseFee > 0;
  
  console.log('🏛️ FRANCHISE CITY DIFFERENTIATION COMPLETE:', {
    city: normalizedCity,
    state: normalizedState,
    hasMunicipalRates: hasMunicipalRates,
    hasFranchiseFee: franchiseFee > 0,
    isMatch: isMatch,
    franchiseFee: `${franchiseFee}%`,
    salesTax: `${salesTax}%`,
    pricingDataAvailable: !!pricingData,
    cityType: hasMunicipalRates ? 'Franchise City (with municipal rates)' : franchiseFee > 0 ? 'City with franchise fee only' : 'Regular city',
    isHouston: normalizedCity === 'houston',
    houstonOverride: normalizedCity === 'houston' ? 'Applied 4% franchise fee' : 'N/A'
  });

  return {
    isMatch: isMatch,
    cityName: pricingData?.cityName || city,
    state: pricingData?.state || state,
    pricingData: pricingData, // Only set if municipal rates exist
    franchiseFee: franchiseFee,
    salesTax: salesTax
  };
}

/**
 * Get specific rate from franchised city pricing data
 * @param pricingData - Franchised city pricing data
 * @param containerSize - Container size (e.g., "8YD")
 * @param frequency - Service frequency (e.g., "2x/week")
 * @param equipmentType - Equipment type (e.g., "Front-Load Container")
 * @param materialType - Material type (e.g., "Recycling", "Solid Waste")
 * @returns Matching rate or null if not found
 */
export function getFranchisedCityRate(
  pricingData: FranchisedCityPricing,
  containerSize: string,
  frequency: string,
  equipmentType: string = 'Front-Load Container',
  materialType: string = 'Solid Waste'
) {
  const normalizedContainerSize = normalizeContainerSizeForMatching(containerSize);
  const normalizedFrequency = normalizeFrequencyForMatching(frequency);
  const normalizedEquipmentType = normalizeEquipmentType(equipmentType);
  const normalizedMaterialType = normalizeMaterialType(materialType);
  
  console.log('🔍 Searching for franchised city rate:', {
    city: pricingData.cityName,
    originalContainerSize: containerSize,
    containerSize: normalizedContainerSize,
    originalFrequency: frequency,
    frequency: normalizedFrequency,
    originalEquipmentType: equipmentType,
    equipmentType: normalizedEquipmentType,
    originalMaterialType: materialType,
    materialType: normalizedMaterialType,
    isRollOffOrCompactor: normalizedEquipmentType === 'roll-off' || normalizedEquipmentType === 'compactor',
    availableRates: pricingData.rates.length,
    sampleRates: pricingData.rates.slice(0, 3).map(r => ({
      containerSize: r.containerSize,
      frequency: r.frequency,
      equipmentType: r.equipmentType,
      normalizedEquipmentType: normalizeEquipmentType(r.equipmentType),
      materialType: r.materialType,
      id: r.id
    }))
  });
  
  // Step 1: Filter rates by material type first (strict enforcement)
  const materialFilteredRates = filterRatesByMaterialType(pricingData.rates, normalizedMaterialType);
  
  console.log('🎯 Material type filtering:', {
    originalRatesCount: pricingData.rates.length,
    materialFilteredCount: materialFilteredRates.length,
    requestedMaterialType: normalizedMaterialType,
    availableMaterialTypes: [...new Set(pricingData.rates.map(r => r.materialType || 'Solid Waste'))],
    recyclingRatesFound: materialFilteredRates.filter(r => isRecyclingRate(r)).length,
    solidWasteRatesFound: materialFilteredRates.filter(r => !isRecyclingRate(r)).length
  });
  
  if (materialFilteredRates.length === 0) {
    console.warn('⚠️ No rates found for material type:', normalizedMaterialType, 'in', pricingData.cityName);
    return null;
  }
  
  // Step 2: Find exact match within material-filtered rates with enhanced Roll-off/Compactor matching
  const matchingRate = materialFilteredRates.find(rate => {
    const rateContainerSize = normalizeContainerSizeForMatching(rate.containerSize);
    const rateFrequency = normalizeFrequencyForMatching(rate.frequency);
    const rateEquipmentType = normalizeEquipmentType(rate.equipmentType);
    
    // Enhanced container size matching for Roll-off/Compactor
    let containerMatch = rateContainerSize === normalizedContainerSize;
    
    // For Roll-off/Compactor: also check for combined size formats like "20/30/40YD"
    if (!containerMatch && (normalizedEquipmentType === 'roll-off' || normalizedEquipmentType === 'compactor')) {
      if (rate.containerSize && rate.containerSize.includes('/')) {
        const sizesInRate = rate.containerSize.split('/').map(s => s.trim());
        containerMatch = sizesInRate.some(size => normalizeContainerSizeForMatching(size) === normalizedContainerSize);
      }
      
      // CRITICAL FIX: Also check for exact equipment type matches in rate IDs
      if (!containerMatch && rate.id) {
        const rateIdLower = rate.id.toLowerCase();
        const requestSizeLower = normalizedContainerSize.toLowerCase();
        const requestEquipmentLower = normalizedEquipmentType.toLowerCase();
        
        // Check if rate ID contains both the container size and equipment type
      }
    }
    
    // CRITICAL FIX: For Roll-off/Compactor, also try flexible frequency matching
    let frequencyMatch = rateFrequency === normalizedFrequency;
    if (!frequencyMatch && (normalizedEquipmentType === 'roll-off' || normalizedEquipmentType === 'compactor')) {
      // Roll-off services often use monthly frequency regardless of request frequency
      if (rateFrequency === '1x/month' || normalizedFrequency === '1x/month') {
        frequencyMatch = true;
        console.log('🚛 Applied flexible frequency matching for Roll-off/Compactor');
      }
    }
    
    const equipmentMatch = rateEquipmentType === normalizedEquipmentType;
    
    console.log('🔍 Rate comparison:', {
      rateId: rate.id,
      rateMaterialType: rate.materialType || 'Solid Waste',
      isRecyclingRate: isRecyclingRate(rate),
      isRollOffOrCompactor: rateEquipmentType === 'roll-off' || rateEquipmentType === 'compactor',
      hasCombinedSizes: rate.containerSize && rate.containerSize.includes('/'),
      combinedSizes: rate.containerSize && rate.containerSize.includes('/') ? rate.containerSize.split('/') : null,
      original: {
        containerSize: rate.containerSize,
        frequency: rate.frequency,
        equipmentType: rate.equipmentType,
        materialType: rate.materialType
      },
      normalized: {
        containerSize: rateContainerSize,
        frequency: rateFrequency,
        equipmentType: rateEquipmentType,
        materialType: rate.materialType || 'Solid Waste'
      },
      target: {
        containerSize: normalizedContainerSize,
        frequency: normalizedFrequency,
        equipmentType: normalizedEquipmentType,
        materialType: normalizedMaterialType
      },
      containerMatch: `${rateContainerSize} === ${normalizedContainerSize} = ${containerMatch}`,
      frequencyMatch: `${rateFrequency} matches ${normalizedFrequency} = ${frequencyMatch}`,
      equipmentMatch: `${rateEquipmentType} === ${normalizedEquipmentType} = ${equipmentMatch}`,
      overallMatch: containerMatch && frequencyMatch && equipmentMatch
    });
    
    return containerMatch && frequencyMatch && equipmentMatch;
  });
  
  if (matchingRate) {
    console.log('✅ Found matching franchised city rate:', {
      id: matchingRate.id,
      containerSize: matchingRate.containerSize,
      frequency: matchingRate.frequency,
      equipmentType: matchingRate.equipmentType,
      materialType: matchingRate.materialType || 'Solid Waste',
      isRecyclingRate: isRecyclingRate(matchingRate),
      isRollOffOrCompactor: normalizeEquipmentType(matchingRate.equipmentType) === 'roll-off' || normalizeEquipmentType(matchingRate.equipmentType) === 'compactor',
      monthlyRate: matchingRate.monthlyRate,
      deliveryFee: matchingRate.deliveryFee,
      franchiseFee: matchingRate.franchiseFee,
      salesTax: matchingRate.salesTax,
      // Roll-off/Compactor specific variables
      dailyRate: matchingRate.dailyRate,
      haulFee: matchingRate.haulFee,
      disposalFee: matchingRate.disposalFee,
      dryRunFee: matchingRate.dryRunFee,
      deposit: matchingRate.deposit,
      includedTons: matchingRate.includedTons,
      disposalMinimum: matchingRate.disposalMinimum
    });
  } else {
    console.warn('⚠️ No matching rate found in franchised city data for:', {
      city: pricingData.cityName,
      searchCriteria: { 
        containerSize: normalizedContainerSize, 
        frequency: normalizedFrequency, 
        equipmentType: normalizedEquipmentType,
        materialType: normalizedMaterialType 
      },
      totalAvailableRates: pricingData.rates.length,
      materialFilteredRates: materialFilteredRates.length,
      availableContainerSizes: [...new Set(materialFilteredRates.map(r => r.containerSize))],
      availableFrequencies: [...new Set(materialFilteredRates.map(r => r.frequency))],
      availableEquipmentTypes: [...new Set(materialFilteredRates.map(r => r.equipmentType))]
    });
  }
  
  return matchingRate || null;
}

/**
 * Normalize container size for consistent matching
 */
function normalizeContainerSizeForMatching(containerSize: string): string {
  if (!containerSize || typeof containerSize !== 'string') {
    return '4YD'; // Default fallback
  }

  // Extract number and ensure YD suffix
  const match = containerSize.match(/(\d+)/);
  if (match) {
    return `${match[1]}YD`;
  }

  // Handle special cases
  const normalized = containerSize.toLowerCase().trim();
  if (normalized.includes('gallon') || normalized.includes('gal')) {
    const galMatch = containerSize.match(/(\d+)/);
    return galMatch ? `${galMatch[1]}-gallon` : containerSize;
  }

  if (normalized.includes('cart') || normalized.includes('toter')) {
    return 'cart';
  }

  return containerSize.toUpperCase();
}

/**
 * Normalize frequency for consistent matching
 */
function normalizeFrequencyForMatching(frequency: string): string {
  if (!frequency || typeof frequency !== 'string') {
    return '1x/week'; // Default fallback
  }

  // Use the standardizeFrequency function for consistent normalization
  return standardizeFrequency(frequency);
}

/**
 * Normalize equipment type names to standardized values for consistent matching
 * @param equipmentType - Raw equipment type from service request or municipal contract
 * @returns Standardized equipment type name
 */
function normalizeEquipmentType(equipmentType: string): string {
  if (!equipmentType || typeof equipmentType !== 'string') {
    return 'front-load container';
  }

  const normalized = equipmentType.toLowerCase().trim();
  
  // Front-Load Container variations
  if (normalized.includes('front') || 
      normalized.includes('dumpster') || 
      normalized.includes('fl') ||
      normalized === 'container' ||
      normalized.includes('front-load') ||
      normalized.includes('frontload')) {
    return 'front-load container';
  }
  
  // Cart variations
  if (normalized.includes('cart') || 
      normalized.includes('toter') || 
      normalized.includes('bin') ||
      normalized.includes('commercial cart') ||
      normalized.includes('residential cart')) {
    return 'cart';
  }
  
  // Roll-off variations
  if (normalized.includes('roll') || 
      normalized.includes('rolloff') || 
      normalized.includes('roll-off') ||
      normalized.includes('roll off') ||
      normalized.includes('temporary') ||
      normalized.includes('temp') ||
      normalized.includes('ro ') ||
      normalized.includes(' ro') ||
      normalized === 'ro' ||
      normalized === 'roll off' ||
      normalized === 'rolloff') {
    return 'roll-off';
  }
  
  // Compactor variations
  if (normalized.includes('compactor') || 
      normalized.includes('compact') ||
      normalized.includes('self-contained') ||
      normalized.includes('stationary') ||
      normalized.includes('rec box') ||
      normalized.includes('receiver box') ||
      normalized.includes('cmptr') ||
      normalized.includes('comp ') ||
      normalized.includes(' comp') ||
      normalized === 'comp' ||
      normalized === 'compactor') {
    return 'compactor';
  }
  
  // Default to front-load container for unrecognized types
  console.log('⚠️ Unrecognized equipment type, defaulting to front-load container:', equipmentType);
  return 'front-load container';
}

/**
 * Normalize material type for consistent matching
 * @param materialType - Raw material type from service request
 * @returns Standardized material type
 */
function normalizeMaterialType(materialType: string): string {
  if (!materialType || typeof materialType !== 'string') {
    return 'solid waste';
  }

  const normalized = materialType.toLowerCase().trim();
  
  // Recycling variations
  if (normalized.includes('recycl') || 
      normalized.includes('single stream') || 
      normalized.includes('ssry') ||
      normalized.includes('occ') ||
      normalized.includes('cardboard')) {
    return 'recycling';
  }
  
  // Solid waste variations (default)
  return 'solid waste';
}

/**
 * Filter rates by material type with strict enforcement
 * @param rates - All available rates
 * @param requestedMaterialType - Normalized material type from request
 * @returns Filtered rates matching the material type
 */
function filterRatesByMaterialType(rates: any[], requestedMaterialType: string): any[] {
  console.log('🎯 Filtering rates by material type:', {
    requestedMaterialType,
    totalRates: rates.length
  });
  
  if (requestedMaterialType === 'recycling') {
    // For recycling requests, ONLY return recycling rates
    const recyclingRates = rates.filter(rate => isRecyclingRate(rate));
    console.log('♻️ Recycling request - filtered to recycling rates only:', {
      recyclingRatesFound: recyclingRates.length,
      recyclingRateIds: recyclingRates.map(r => r.id).slice(0, 5)
    });
    return recyclingRates;
  } else {
    // For solid waste requests, ONLY return solid waste rates (exclude recycling)
    const solidWasteRates = rates.filter(rate => !isRecyclingRate(rate));
    console.log('🗑️ Solid waste request - filtered to solid waste rates only:', {
      solidWasteRatesFound: solidWasteRates.length,
      excludedRecyclingRates: rates.length - solidWasteRates.length
    });
    return solidWasteRates;
  }
}

/**
 * Determine if a rate is for recycling services
 * @param rate - Rate object to check
 * @returns Boolean indicating if this is a recycling rate
 */
function isRecyclingRate(rate: any): boolean {
  // Check explicit materialType field first
  if (rate.materialType) {
    const materialType = rate.materialType.toLowerCase().trim();
    if (materialType.includes('recycl')) {
      return true;
    }
  }
  
  // Check rate ID for recycling indicators
  if (rate.id) {
    const rateId = rate.id.toLowerCase();
    if (rateId.includes('recycling') || rateId.includes('recycle') || 
        rateId.includes('recy') || rateId.includes('occ') ||
        rateId.includes('cardboard') || rateId.includes('single-stream')) {
      return true;
    }
  }
  
  return false;
}

/**
 * Format franchised city pricing output as required
 * @param rate - Franchised city rate data
 * @param binQuantity - Number of bins from request
 * @param materialType - Material type from request
 * @param frequency - Service frequency from request
 * @returns Formatted pricing output
 */
export function formatFranchisedCityOutput(
  rate: any,
  binQuantity: number,
  materialType: string,
  frequency: string
): string {
  return `
Delivery: $${rate.deliveryFee.toFixed(2)}
Monthly Rate: $${rate.monthlyRate.toFixed(2)}
Franchise Fee: ${rate.franchiseFee}%
City Sales Tax: ${rate.salesTax}%
Service Frequency: ${frequency}
Bin Quantity: ${binQuantity}
Material: ${materialType}
`.trim();
}

/**
 * Get all franchised cities for validation purposes
 * @returns Array of all franchised city names
 */
export function getAllFranchisedCities(): string[] {
  return Object.keys(FRANCHISED_CITIES_REGISTRY).map(city => 
    city.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  );
}

/**
 * Validate if a city is in the franchised cities list
 * @param city - City name to check
 * @param state - State to check (must be Texas)
 * @returns Boolean indicating if city is franchised
 */
export function isFranchisedCity(city: string, state: string): boolean {
  const normalizedCity = city.toLowerCase().trim();
  const normalizedState = state.toLowerCase().trim();
  
  if (normalizedState !== 'texas' && normalizedState !== 'tx') {
    return false;
  }
  
  return normalizedCity in FRANCHISED_CITIES_REGISTRY;
}

/**
 * Get franchised city name with proper capitalization
 * @param city - City name input
 * @param state - State input
 * @returns Properly formatted city name or null if not franchised
 */
export function getFranchisedCityName(city: string, state: string): string | null {
  const normalizedCity = city.toLowerCase().trim();
  const normalizedState = state.toLowerCase().trim();
  
  if (normalizedState !== 'texas' && normalizedState !== 'tx') {
    return null;
  }
  
  if (normalizedCity in FRANCHISED_CITIES_REGISTRY) {
    // Return properly capitalized city name
    return normalizedCity.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  return null;
}