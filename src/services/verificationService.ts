import { supabase } from '../lib/supabase';
import { ServiceAreaVerificationData, ServiceAreaResult } from '../types';

export class VerificationService {
  /**
   * Save verification session and results to database
   */
  static async saveVerificationSession(
    sessionName: string,
    verificationData: ServiceAreaVerificationData
  ): Promise<{ sessionId: string | null; error: Error | null }> {
    try {
      console.log('💾 Saving verification session to database:', { sessionName, resultCount: verificationData.results.length });

      // Create verification session
      const { data: session, error: sessionError } = await supabase
        .from('verification_sessions')
        .insert({
          session_name: sessionName,
          total_processed: verificationData.totalProcessed,
          serviceable_count: verificationData.serviceableCount,
          not_serviceable_count: verificationData.notServiceableCount,
          manual_review_count: verificationData.manualReviewCount
        })
        .select()
        .maybeSingle();

      if (sessionError) {
        console.error('❌ Error creating verification session:', sessionError);
        return { sessionId: null, error: sessionError };
      }

      if (!session) {
        console.error('❌ No session returned after insert');
        return { sessionId: null, error: new Error('Failed to create session') };
      }

      console.log('✅ Verification session created:', session.id);

      // Prepare results for bulk insert
      const resultsToInsert = verificationData.results.map((result: ServiceAreaResult) => ({
        session_id: session.id,
        company_name: result.companyName || null,
        address: result.address,
        city: result.city,
        state: result.state,
        zip_code: result.zipCode || null,
        status: result.status,
        reason: result.reason || null,
        bin_quantity: result.binQuantity || 1,
        container_size: result.containerSize || null,
        equipment_type: result.equipmentType || null,
        material_type: result.materialType || 'Solid Waste',
        frequency: result.frequency || null,
        add_ons: result.addOns || null,
        division: result.division || null,
        service_region: result.serviceRegion || null,
        franchise_fee: result.franchiseFee || null,
        latitude: result.latitude || null,
        longitude: result.longitude || null
      }));

      // Insert all results
      const { error: resultsError } = await supabase
        .from('verification_results')
        .insert(resultsToInsert);

      if (resultsError) {
        console.error('❌ Error inserting verification results:', resultsError);
        return { sessionId: session.id, error: resultsError };
      }

      console.log('✅ All verification results saved successfully');
      return { sessionId: session.id, error: null };

    } catch (error) {
      console.error('❌ Unexpected error saving verification session:', error);
      return { sessionId: null, error: error as Error };
    }
  }

  /**
   * Retrieve verification session by ID
   */
  static async getVerificationSession(sessionId: string) {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('verification_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionError) {
        console.error('❌ Error fetching verification session:', sessionError);
        return { session: null, error: sessionError };
      }

      const { data: results, error: resultsError } = await supabase
        .from('verification_results')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (resultsError) {
        console.error('❌ Error fetching verification results:', resultsError);
        return { session, results: [], error: resultsError };
      }

      return { session, results: results || [], error: null };

    } catch (error) {
      console.error('❌ Unexpected error fetching verification session:', error);
      return { session: null, results: [], error: error as Error };
    }
  }

  /**
   * Update verification result status (for manual review workflow)
   */
  static async updateResultStatus(
    resultId: string,
    status: 'serviceable' | 'not-serviceable' | 'manual-review',
    reason?: string
  ) {
    try {
      const { error } = await supabase
        .from('verification_results')
        .update({
          status,
          reason: reason || null
        })
        .eq('id', resultId);

      if (error) {
        console.error('❌ Error updating result status:', error);
        return { success: false, error };
      }

      console.log('✅ Result status updated:', resultId, status);
      return { success: true, error: null };

    } catch (error) {
      console.error('❌ Unexpected error updating result status:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Get recent verification sessions
   */
  static async getRecentSessions(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('verification_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching recent sessions:', error);
        return { sessions: [], error };
      }

      return { sessions: data || [], error: null };

    } catch (error) {
      console.error('❌ Unexpected error fetching recent sessions:', error);
      return { sessions: [], error: error as Error };
    }
  }
}
