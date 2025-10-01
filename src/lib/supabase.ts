import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      verification_sessions: {
        Row: {
          id: string;
          session_name: string;
          total_processed: number;
          serviceable_count: number;
          not_serviceable_count: number;
          manual_review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_name: string;
          total_processed?: number;
          serviceable_count?: number;
          not_serviceable_count?: number;
          manual_review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_name?: string;
          total_processed?: number;
          serviceable_count?: number;
          not_serviceable_count?: number;
          manual_review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      verification_results: {
        Row: {
          id: string;
          session_id: string;
          company_name: string | null;
          address: string;
          city: string;
          state: string;
          zip_code: string | null;
          status: 'serviceable' | 'not-serviceable' | 'manual-review';
          reason: string | null;
          bin_quantity: number | null;
          container_size: string | null;
          equipment_type: string | null;
          material_type: string | null;
          frequency: string | null;
          add_ons: string[] | null;
          division: string | null;
          service_region: string | null;
          franchise_fee: number | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          company_name?: string | null;
          address: string;
          city: string;
          state: string;
          zip_code?: string | null;
          status: 'serviceable' | 'not-serviceable' | 'manual-review';
          reason?: string | null;
          bin_quantity?: number | null;
          container_size?: string | null;
          equipment_type?: string | null;
          material_type?: string | null;
          frequency?: string | null;
          add_ons?: string[] | null;
          division?: string | null;
          service_region?: string | null;
          franchise_fee?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          company_name?: string | null;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string | null;
          status?: 'serviceable' | 'not-serviceable' | 'manual-review';
          reason?: string | null;
          bin_quantity?: number | null;
          container_size?: string | null;
          equipment_type?: string | null;
          material_type?: string | null;
          frequency?: string | null;
          add_ons?: string[] | null;
          division?: string | null;
          service_region?: string | null;
          franchise_fee?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
      };
      pricing_configurations: {
        Row: {
          id: string;
          session_id: string;
          pricing_logic: 'franchised-supplementary' | 'franchised-direct' | 'open-market' | 'custom';
          custom_config: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          pricing_logic: 'franchised-supplementary' | 'franchised-direct' | 'open-market' | 'custom';
          custom_config?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          pricing_logic?: 'franchised-supplementary' | 'franchised-direct' | 'open-market' | 'custom';
          custom_config?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
