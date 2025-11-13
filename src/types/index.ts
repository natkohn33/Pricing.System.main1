// src/types/index.ts - COMPLETE FILE WITH ALL UPDATES

/* ============================
   Service Area Types
   ============================ */

export interface ServiceAreaResult {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number | null;
  longitude?: number | null;
  status: 'serviceable' | 'not-serviceable' | 'manual-review';
  failureReason?: string;
  division?: string;
  franchiseFee?: number | null;
  companyName?: string;
  equipmentType?: string;
  containerSize?: string;
  frequency?: string;
  materialType?: string;
  addOns?: string[];
  binQuantity?: number;
  isFranchisedCity?: boolean;
  franchisedCityName?: string;
  divisionData?: {
    name: string;
    franchiseFee: number | null;
    region?: string;
    serviceRegion?: string;
    csrCenter?: string;
  };
}

export interface ServiceAreaVerificationData {
  totalProcessed: number;
  serviceableCount: number;
  notServiceableCount: number;
  manualReviewCount: number;
  results: ServiceAreaResult[];
}

export interface ServiceBoundary {
  division: string;
  cities: string[];
  zipCodes: string[];
  coordinates?: any; // GeoJSON polygon data
}

/* ============================
   Container & Pricing Rules
   ============================ */

export interface ContainerSpecificPricingRule {
  id: string;
  city?: string;
  state?: string;
  containerSize: string;
  equipmentType: string;
  pricePerYard?: number;
  largeContainerPricePerYard?: number;
}

/**
 * NEW: Container-specific pricing override within a Global Pricing Rule
 * Equipment Type is OPTIONAL - if blank/null, it applies to ALL equipment types
 */
export interface ContainerSpecificOverride {
  equipmentType?: string; // Optional: blank = matches all equipment types
  containerSize: string;  // Required: specific container size (e.g., "2YD", "4YD")
  pricePerYard: number;   // Required: override price per yard
}

/**
 * Roll-off and Compactor specific pricing structure
 */
export interface RollOffPricing {
  deliveryFee: number;
  deliveryFeeNegotiable?: boolean;
  dailyRental?: number;
  dailyRentalNegotiable?: boolean;
  monthlyRent?: number;
  monthlyRentNegotiable?: boolean;
  haulRate: number;
  haulRateNegotiable?: boolean;
  disposalPerTon: number;
  disposalPerTonNegotiable?: boolean;
  dryRun?: number;
  dryRunNegotiable?: boolean;
  deposit?: number;
  depositNegotiable?: boolean;
  depositCities?: string[];  // Cities where deposit applies
}

/**
 * NEW: Global Pricing Rule for bulk upload workflow
 * Each rule represents a specific service configuration with its own pricing
 */
export interface GlobalPricingRule {
  id: string;
  
  // Service Parameters (can be "auto-inherit" or specific values)
  equipmentType: string;      // e.g., "auto-inherit", "Front-Load", "Rear-Load", "Roll-off", "Compactor"
  containerSize: string;      // e.g., "auto-inherit", "2YD", "4YD", "8YD"
  frequency: string;          // e.g., "auto-inherit", "1x/week", "2x/week"
  materialType: string;       // e.g., "auto-inherit", "Solid Waste", "Recycling"
  
  // Base Pricing (PRIORITY 2 - fallback when no container override exists)
  // Optional for Roll-off/Compactor equipment
  smallContainerPricePerYard?: number;  // For 2-4 YD containers
  largeContainerPricePerYard?: number;  // For 6-10 YD containers
  
  // Fees
  deliveryFee?: number;
  fuelSurchargePercent?: number;
  franchiseFeePercent?: number;
  taxPercent?: number;
  extraPickupRate?: number;
  
  // Container-Specific Overrides (PRIORITY 1 - highest priority)
  containerSpecificPricing?: ContainerSpecificOverride[];
  
  // NEW: Roll-off/Compactor specific pricing
  isRollOffOrCompactor?: boolean;
  rollOffPricing?: RollOffPricing;
}

export interface DivisionData {
  csrCenter: string;
  serviceRegion: string;
  franchiseFee: number;
  salesTax: number;
  containerSpecificPricingRules: ContainerSpecificPricingRule[];
}

/* ============================
   Rate & Quote Types
   ============================ */

export interface RateData {
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
  source?: 'broker' | 'custom';
}

export interface ServiceRequest {
  id: string;
  customerName?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  equipmentType: string;
  containerSize: string;
  frequency: string;
  materialType: string;
  addOns?: string[];
  notes?: string;
  binQuantity?: number;
}

export interface Quote {
  id: string;
  serviceRequest: ServiceRequest;
  matchedRate: RateData | null;
  pricingSource: string;
  baseRate: number;
  totalMonthlyVolume: number;
  numberOfUnits: number;
  pickupsPerWeek: number;
  franchiseFeeAmount: number;
  localTaxAmount: number;
  fuelSurchargeAmount: number;
  fuelSurchargeRate: number;
  franchiseFeeRate: number;
  localTaxRate: number;
  deliveryFee: number;
  subtotal: number;
  valueC: number;
  addOnsCost: number;
  totalPrice: number;
  totalMonthlyCost: number;
  status: 'success' | 'failed';
  failureReason?: string;
  notes?: string;
  extraPickupRate?: number;
  addOnDetails?: Array<{
    category: string;
    originalPrice: number;
    originalFrequency: string;
    monthlyEquivalent: number;
  }>;
  
  // Roll-off/Compactor specific fields
  isRollOffOrCompactor?: boolean;
  rollOffPricing?: RollOffPricing;
}

export interface BulkProcessResult {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  quotes: Quote[];
  failedQuotes: Quote[];
}

/* ============================
   Custom Pricing Rules
   ============================ */

export interface CustomPricingRule {
  id: string;
  city?: string;
  state?: string;
  pricePerYard: number;
  largeContainerPricePerYard?: number;
  frequency: string;
  containerSize: string;
  deliveryFee?: number;
  fuelSurcharge?: number;
  franchiseFee?: number;
  tax?: number;
  extraPickupRate?: number;
  pricePerYardAddon?: number;
  equipmentType: string;
  materialType: string;
  assignedDivisions?: string[];
  excludeTaxesAndFees?: boolean;
  taxExempt?: boolean;
  specificDivisionPricing?: boolean;
  specificDivision?: string;
}

/**
 * UPDATED: Additional Fee with location-specific support for bulk uploads
 * New fields allow fees to be applied to specific locations during bulk upload workflow
 */
export interface AdditionalFee {
  id: string;
  category: string;
  price: number;
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  
  // ✅ NEW FIELDS for bulk upload location-specific fees (Phase 1)
  locationId?: string;        // Optional: References ServiceAreaResult.id for location-specific fees
  locationDisplay?: string;   // Optional: Human-readable location (e.g., "Chipotle - 190 W Bitters Rd, San Antonio, TX")
}

/**
 * UPDATED: Pricing Configuration with Global Pricing Rules support
 */
export interface PricingConfig {
  smallContainerPrice: number;
  largeContainerPrice: number;
  defaultEquipmentType?: string;
  defaultContainerSize?: string;
  defaultFrequency?: string;
  defaultMaterialType?: string;
  franchiseFee: number;
  tax: number;
  deliveryFee: number;
  fuelSurcharge: number;
  extraPickupRate: number;
  frequencyDiscounts?: {
    twoThreeTimesWeek?: number;
    fourTimesWeek?: number;
  };
  containerSpecificPricingRules: ContainerSpecificPricingRule[];
  additionalFees: AdditionalFee[];
  
  // NEW FIELD: Array of global pricing rules for bulk upload
  globalPricingRules?: GlobalPricingRule[];
}

export interface PricingLogic {
  type: 'broker' | 'custom' | 'regional-brain';
  brokerRates?: RateData[];
  customRules?: CustomPricingRule[];
  pricingConfig?: PricingConfig;
  regionalPricingData?: RegionalPricingData;
  franchisedCityPricing?: Record<string, FranchisedCityPricing>;
  franchisedCitySupplementary?: Record<string, FranchisedCitySupplementaryPricing>;
}

/* ============================
   Regional Pricing
   ============================ */

export interface RegionalRateEntry {
  containerSize: string;
  frequency: string;
  price: number;
}

export interface RegionalRateSheet {
  region: 'NTX' | 'CTX' | 'STX';
  regionName: string;
  rates: RegionalRateEntry[];
}

export interface RegionalPricingData {
  rateSheets: RegionalRateSheet[];
  lastUpdated: string;
  source?: string;
}

/* ============================
   Franchised City Pricing
   ============================ */

export interface FranchisedCityRate {
  id: string;
  city: string;
  state: string;
  containerSize: string;
  frequency: string;
  equipmentType: string;
  monthlyRate: number;
  deliveryFee: number;
  franchiseFee: number;
  salesTax: number;
  extraPickupRate?: number;
  compactorRate?: number;
  enclosureRate?: number;
  casterRate?: number;
  lockRate?: number;
  fuelSurcharge?: number;
  materialType?: string;
}

export interface FranchisedCityPricing {
  cityName: string;
  state: string;
  rates: FranchisedCityRate[];
  lastUpdated: string;
  sourceFile: string;
}

export interface SupplementaryCost {
  id: string;
  category: string;
  description: string;
  amount: number;
  frequency: string;
  justification: string;
  addedBy?: string;
  addedAt: string;
  cityName: string;
}

export interface FranchisedCitySupplementaryPricing {
  cityName: string;
  state: string;
  supplementaryCosts: SupplementaryCost[];
  lastUpdated: string;
}

/* ============================
   Price Overrides
   ============================ */

export interface PriceOverride {
  id: string;
  quoteId: string;
  fieldName: string;
  originalValue: number;
  overriddenValue: number;
  reason: string;
  overriddenBy?: string;
  overriddenAt: string;
  isActive: boolean;
}

export interface FranchisedCityOverride {
  id: string;
  quoteId: string;
  cityName: string;
  state: string;
  fieldName: string;
  originalValue: number;
  overriddenValue: number;
  reason: string;
  overriddenBy: string;
  overriddenAt: string;
  isActive: boolean;
}
