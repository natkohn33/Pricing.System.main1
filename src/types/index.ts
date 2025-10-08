// Service Area Types
export interface ServiceAreaResult {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  status: 'serviceable' | 'not-serviceable' | 'manual-review';
  failureReason?: string;
  division?: string;
  franchiseFee?: number;
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

// Division and Container Types
export interface ContainerSpecificPricingRule {
  city?: string;
  state?: string;
  equipmentType: string;
  pricePerYard?: number;
  largeContainerPricePerYard?: number;
}

export interface DivisionData {
  csrCenter: string;
  serviceRegion: string;
  franchiseFee: number;
  salesTax: number;
  containerSpecificPricingRules: ContainerSpecificPricingRule[];
}

// Rate and Service Types
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
  customerName: string;
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

// Quote Types
export interface Quote {
  id: string;
  serviceRequest: ServiceRequest;
  matchedRate: RateData | null;
  pricingSource: 'Broker Upload' | 'Custom Division Logic' | 'Not Found';
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
  addOnDetails?: Array<{
    category: string;
    originalPrice: number;
    originalFrequency: string;
    monthlyEquivalent: number;
  }>;
}

export interface BulkProcessResult {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  quotes: Quote[];
  failedQuotes: Quote[];
}

// Pricing Types
export interface CustomPricingRule {
  id: string;
  pricePerYard: number;
  frequency: string;
  containerSize: string;
  deliveryFee?: number;
  fuelSurcharge?: number;
  franchiseFee: number;
  tax: number;
  pricePerYardAddon: number;
  equipmentType: string;
  materialType: string;
  assignedDivisions: string[];
  excludeTaxesAndFees?: boolean;
  taxExempt?: boolean;
  specificDivisionPricing?: boolean;
  specificDivision?: string;
}

export interface AdditionalFee {
  id: string;
  category: string;
  price: number;
  frequency: string;
  assignedDivisions: string[];
}

export interface PricingConfig {
  smallContainerPrice: number; // 2/3/4 YD
  largeContainerPrice: number; // 6/8/10 YD
  Frequency: string;
  frequencyDiscounts: {
    twoThreeTimesWeek: number; // percentage
    fourTimesWeek: number; // percentage
  };
  franchiseFee: number; // percentage
  tax: number; // percentage
  deliveryFee: number;
  fuelSurcharge: number; // percentage
  additionalFees: AdditionalFee[];
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

// Regional Pricing Types
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

// Franchised City Types
export interface FranchisedCityRate {
  id: string;
  city: string;
  state: string;
  containerSize: string;
  frequency: string;
  equipmentType: string;
  monthlyRate: number;
  deliveryFee: number;
  franchiseFee: number; // percentage
  salesTax: number; // percentage
  extraPickupRate?: number;
  compactorRate?: number;
  enclosureRate?: number;
  casterRate?: number;
  lockRate?: number;
}

export interface FranchisedCityPricing {
  cityName: string;
  state: string;
  rates: FranchisedCityRate[];
  lastUpdated: string;
  sourceFile: string;
}

// Supplementary Pricing Types
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

// Override Types
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

// Component Props Types
export interface ServiceAreaVerificationProps {
  category: 'Lockbar' | 'Caster' | 'Other' | '';
  customName?: string;
  onVerificationComplete: (verification: ServiceAreaVerificationData) => void;
  onContinue?: () => void;
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'per-service-frequency';
  description?: string;
  onFileNameUpdate: (fileName: string) => void;
}