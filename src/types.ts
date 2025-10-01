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
  serviceRegion?: string;
  franchiseFee?: number;

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

export type PricingLogic =
  | 'franchised-supplementary'
  | 'franchised-direct'
  | 'open-market'
  | 'custom';

export interface PricingConfig {
  logic: PricingLogic;
  customConfig?: {
    baseRate?: number;
    perYardRate?: number;
    monthlyRate?: number;
    pickupFee?: number;
    deliveryFee?: number;
    environmentalFee?: number;
  };
  isConfigured: boolean;
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
