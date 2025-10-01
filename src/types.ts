export interface ServiceAreaResult {
  id: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'serviceable' | 'not-serviceable' | 'manual-review';
  reason: string;

  // Service Data
  binQuantity?: number;
  containerSize?: string;
  equipmentType?: string;
  materialType?: string;
  frequency?: string;
  addOns?: string[];

  // Assignment Data
  division?: string;
  divisionData?: DivisionData;
  serviceRegion?: string;
  franchiseFee?: number;
  failureReason?: string;

  // Geolocation Data
  latitude?: number | null;
  longitude?: number | null;
}

export interface ServiceAreaVerificationData {
  totalProcessed: number;
  serviceableCount: number;
  notServiceableCount: number;
  manualReviewCount: number;
  results: ServiceAreaResult[];
}

export interface LocationRequest {
  id: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  equipmentType: string;
  containerSize: string;
  frequency: string;
  materialType: string;
  addOns: string[];
  binQuantity: number;
  latitude: number | null;
  longitude: number | null;
}

export type PricingLogicType =
  | 'franchised-supplementary'
  | 'franchised-direct'
  | 'open-market'
  | 'custom'
  | 'regional-brain';

export interface PricingLogic {
  type: PricingLogicType;
  customRules?: CustomPricingRule[];
  pricingConfig?: PricingConfig;
  brokerRates?: RateData[];
  regionalPricingData?: RegionalPricingData;
  franchisedCitySupplementary?: Record<string, FranchisedCitySupplementaryPricing>;
}

export interface PricingConfig {
  logic?: PricingLogicType;
  smallContainerPrice?: number;
  largeContainerPrice?: number;
  defaultFrequency?: string;
  frequencyDiscounts?: {
    twoThreeTimesWeek: number;
    fourTimesWeek: number;
  };
  franchiseFee?: number;
  tax?: number;
  deliveryFee?: number;
  fuelSurcharge?: number;
  extraPickupRate?: number;
  additionalFees?: AdditionalFee[];
  containerSpecificPricingRules?: ContainerSpecificPricingRule[];
  customConfig?: {
    baseRate?: number;
    perYardRate?: number;
    monthlyRate?: number;
    pickupFee?: number;
    deliveryFee?: number;
    environmentalFee?: number;
  };
  isConfigured?: boolean;
}

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

export interface AddOnItem {
  category: 'Lockbar' | 'Caster' | 'Other' | '';
  customName?: string;
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'per-service-frequency';
  description?: string;
}

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
}

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
  division: string;
}

export interface CustomPricingRule {
  id: string;
  city?: string;
  state?: string;
  division?: string;
  equipmentType?: string;
  containerSize?: string;
  frequency?: string;
  materialType?: string;
  pricePerYard?: number;
  basePrice?: number;
  franchiseFee?: number;
  deliveryFee?: number;
  fuelSurcharge?: number;
  tax?: number;
  priority?: number;
}

export interface FranchisedCitySupplementaryPricing {
  cityName: string;
  state: string;
  supplementaryCosts: SupplementaryCost[];
}

export interface SupplementaryCost {
  id: string;
  name: string;
  description?: string;
  costType: 'fixed' | 'per-yard' | 'per-pickup' | 'percentage';
  amount: number;
  appliesTo?: 'all' | 'specific-containers';
  containerSizes?: string[];
}

export interface AdditionalFee {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
  appliesTo?: string;
}

export interface FranchisedCityPricing {
  cityName: string;
  state: string;
  rates: FranchisedCityRate[];
}

export interface FranchisedCityRate {
  containerSize: string;
  frequency: string;
  price: number;
}

export interface ServiceRequest {
  id: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  containerSize: string;
  equipmentType: string;
  frequency: string;
  materialType: string;
  binQuantity: number;
  division?: string;
  franchiseFee?: number;
  addOns?: string[];
}

export interface Quote {
  id: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  containerSize: string;
  equipmentType: string;
  frequency: string;
  materialType: string;
  binQuantity: number;
  baseRate: number;
  franchiseFee: number;
  tax: number;
  fuelSurcharge: number;
  deliveryFee: number;
  additionalFees: number;
  totalMonthly: number;
  totalAnnual: number;
  division?: string;
  notes?: string;
}
