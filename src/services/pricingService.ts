import { supabase } from '../lib/supabase';
import { PricingLogic, PricingConfig } from '../types';

export class PricingService {
  /**
   * Save pricing configuration to database
   */
  static async savePricingConfiguration(
    sessionId: string,
    pricingLogic: PricingLogic,
    customConfig?: Record<string, any>
  ) {
    try {
      console.log('💾 Saving pricing configuration to database:', { sessionId, pricingLogic });

      const { data, error } = await supabase
        .from('pricing_configurations')
        .insert({
          session_id: sessionId,
          pricing_logic: pricingLogic,
          custom_config: customConfig || null
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error saving pricing configuration:', error);
        return { data: null, error };
      }

      console.log('✅ Pricing configuration saved successfully');
      return { data, error: null };

    } catch (error) {
      console.error('❌ Unexpected error saving pricing configuration:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get pricing configuration for a session
   */
  static async getPricingConfiguration(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('pricing_configurations')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching pricing configuration:', error);
        return { data: null, error };
      }

      return { data, error: null };

    } catch (error) {
      console.error('❌ Unexpected error fetching pricing configuration:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update pricing configuration
   */
  static async updatePricingConfiguration(
    configId: string,
    pricingLogic: PricingLogic,
    customConfig?: Record<string, any>
  ) {
    try {
      const { data, error } = await supabase
        .from('pricing_configurations')
        .update({
          pricing_logic: pricingLogic,
          custom_config: customConfig || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', configId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error updating pricing configuration:', error);
        return { data: null, error };
      }

      console.log('✅ Pricing configuration updated successfully');
      return { data, error: null };

    } catch (error) {
      console.error('❌ Unexpected error updating pricing configuration:', error);
      return { data: null, error: error as Error };
    }
  }
}
