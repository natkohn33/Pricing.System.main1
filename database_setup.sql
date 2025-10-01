-- Service Area Verification Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database tables

-- ============================================================
-- VERIFICATION SESSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS verification_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name text NOT NULL,
  total_processed integer NOT NULL DEFAULT 0,
  serviceable_count integer NOT NULL DEFAULT 0,
  not_serviceable_count integer NOT NULL DEFAULT 0,
  manual_review_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- VERIFICATION RESULTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS verification_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES verification_sessions(id) ON DELETE CASCADE,
  company_name text,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  status text NOT NULL CHECK (status IN ('serviceable', 'not-serviceable', 'manual-review')),
  reason text,
  bin_quantity integer DEFAULT 1,
  container_size text,
  equipment_type text,
  material_type text DEFAULT 'Solid Waste',
  frequency text,
  add_ons text[],
  division text,
  service_region text,
  franchise_fee numeric,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- PRICING CONFIGURATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES verification_sessions(id) ON DELETE CASCADE,
  pricing_logic text NOT NULL CHECK (pricing_logic IN ('franchised-supplementary', 'franchised-direct', 'open-market', 'custom')),
  custom_config jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_verification_results_session_id
  ON verification_results(session_id);

CREATE INDEX IF NOT EXISTS idx_verification_results_status
  ON verification_results(status);

CREATE INDEX IF NOT EXISTS idx_verification_sessions_created_at
  ON verification_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pricing_configurations_session_id
  ON pricing_configurations(session_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE verification_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_configurations ENABLE ROW LEVEL SECURITY;

-- Policies for verification_sessions
CREATE POLICY "Allow public read access to verification sessions"
  ON verification_sessions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow insert for all users"
  ON verification_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow update for all users"
  ON verification_sessions
  FOR UPDATE
  TO public
  USING (true);

-- Policies for verification_results
CREATE POLICY "Allow public read access to verification results"
  ON verification_results
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow insert for all users"
  ON verification_results
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow update for all users"
  ON verification_results
  FOR UPDATE
  TO public
  USING (true);

-- Policies for pricing_configurations
CREATE POLICY "Allow public read access to pricing configurations"
  ON pricing_configurations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow insert for all users"
  ON pricing_configurations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow update for all users"
  ON pricing_configurations
  FOR UPDATE
  TO public
  USING (true);

-- ============================================================
-- VERIFICATION COMPLETE
-- ============================================================
-- Database schema created successfully!
-- You can now use the application to save verification results.
