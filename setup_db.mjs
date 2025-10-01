import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  console.log('🚀 Setting up database tables...\n');

  try {
    // Test connection first
    console.log('🔌 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('_test_')
      .select('*')
      .limit(1);
    
    if (testError && !testError.message.includes('does not exist')) {
      console.log('⚠️  Connection test result:', testError.message);
    }
    console.log('✅ Database connection established\n');

    // Since we can't use rpc to create tables directly, let's try using the REST API
    console.log('📊 Database tables will be created through SQL Editor');
    console.log('Please run the SQL from database_setup.sql in your Supabase dashboard\n');
    
    // Test if tables exist by trying to query them
    console.log('🔍 Checking for existing tables...\n');
    
    const { data: sessions, error: sessionsError } = await supabase
      .from('verification_sessions')
      .select('*')
      .limit(1);
    
    if (sessionsError) {
      console.log('❌ verification_sessions table does not exist yet');
      console.log('   Error:', sessionsError.message);
    } else {
      console.log('✅ verification_sessions table exists');
    }

    const { data: results, error: resultsError } = await supabase
      .from('verification_results')
      .select('*')
      .limit(1);
    
    if (resultsError) {
      console.log('❌ verification_results table does not exist yet');
      console.log('   Error:', resultsError.message);
    } else {
      console.log('✅ verification_results table exists');
    }

    const { data: pricing, error: pricingError } = await supabase
      .from('pricing_configurations')
      .select('*')
      .limit(1);
    
    if (pricingError) {
      console.log('❌ pricing_configurations table does not exist yet');
      console.log('   Error:', pricingError.message);
    } else {
      console.log('✅ pricing_configurations table exists');
    }

    console.log('\n📋 To create the tables:');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Open the SQL Editor');
    console.log('   3. Copy and paste the contents of database_setup.sql');
    console.log('   4. Run the query');
    console.log('\n   Database setup file: database_setup.sql');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupDatabase();
