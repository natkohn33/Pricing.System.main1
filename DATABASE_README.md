# Database Setup Guide

This application uses Supabase to persist verification results and pricing configurations.

## Quick Setup

### 1. Database Tables Setup

Run the SQL script in your Supabase SQL Editor:

```bash
# The SQL file is located at: database_setup.sql
```

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `database_setup.sql`
5. Run the query

### 2. Environment Variables

The application automatically uses the environment variables from `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

These are already configured in your project.

## Database Schema

### Tables

#### `verification_sessions`
Stores information about each verification session (file upload or single location check).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_name | text | File name or descriptive name |
| total_processed | integer | Total number of locations processed |
| serviceable_count | integer | Number of serviceable locations |
| not_serviceable_count | integer | Number of non-serviceable locations |
| manual_review_count | integer | Number requiring manual review |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### `verification_results`
Stores individual location verification results.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | Foreign key to verification_sessions |
| company_name | text | Customer company name |
| address | text | Street address |
| city | text | City name |
| state | text | State name |
| zip_code | text | ZIP code |
| status | text | serviceable/not-serviceable/manual-review |
| reason | text | Explanation for status |
| bin_quantity | integer | Number of containers |
| container_size | text | Standardized size (e.g., "6YD") |
| equipment_type | text | Equipment category |
| material_type | text | Material type (Solid Waste/Recycling) |
| frequency | text | Service frequency |
| add_ons | text[] | Array of additional services |
| division | text | Assigned division |
| service_region | text | Service region (NTX/CTX/STX) |
| franchise_fee | numeric | Franchise fee percentage |
| latitude | numeric | Geocoded latitude |
| longitude | numeric | Geocoded longitude |
| created_at | timestamptz | Creation timestamp |

#### `pricing_configurations`
Stores pricing logic configurations for each session.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | Foreign key to verification_sessions |
| pricing_logic | text | Type of pricing logic used |
| custom_config | jsonb | Custom configuration (if applicable) |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow **public read access** for all users (needed for quote generation)
- Allow **insert and update** for all users
- Automatically clean up related records when a session is deleted (CASCADE)

## Features

### Automatic Saving

The application automatically saves verification results to the database when:
1. A file is uploaded and processed
2. A single location is verified

### Visual Indicators

The UI shows:
- 📊 "Saving to database..." with animated icon during save
- ✅ "Saved to database (Session: xxxxxxxx...)" when complete
- Session ID for reference and tracking

### Database Services

Two service classes handle all database operations:

#### `VerificationService`
- `saveVerificationSession()` - Save session and all results
- `getVerificationSession()` - Retrieve session with results
- `updateResultStatus()` - Update individual result status
- `getRecentSessions()` - Get recent verification sessions

#### `PricingService`
- `savePricingConfiguration()` - Save pricing setup
- `getPricingConfiguration()` - Retrieve pricing config
- `updatePricingConfiguration()` - Update pricing settings

## Error Handling

If database operations fail:
- The application continues to work normally
- An alert notifies the user about the database issue
- Verification results remain available in memory
- Users can still proceed to pricing setup

## Querying Data

### Get Recent Sessions
```sql
SELECT * FROM verification_sessions
ORDER BY created_at DESC
LIMIT 10;
```

### Get Session Results
```sql
SELECT vr.*, vs.session_name
FROM verification_results vr
JOIN verification_sessions vs ON vr.session_id = vs.id
WHERE vs.id = 'your-session-id';
```

### Get Serviceable Locations
```sql
SELECT * FROM verification_results
WHERE status = 'serviceable'
AND session_id = 'your-session-id';
```

### Get Manual Review Items
```sql
SELECT * FROM verification_results
WHERE status = 'manual-review'
ORDER BY created_at DESC;
```

## Best Practices

1. **Regular Backups**: Supabase provides automatic backups, but consider exporting important sessions
2. **Session Tracking**: Use the session ID displayed in the UI to track specific verifications
3. **Data Retention**: Implement a cleanup policy for old sessions if needed
4. **Performance**: Indexes are already created for common queries

## Troubleshooting

### "Failed to save to database" Error

1. **Check Supabase Connection**: Verify your Supabase project is running
2. **Verify Environment Variables**: Ensure `.env` has correct URL and keys
3. **Check SQL Setup**: Make sure `database_setup.sql` was run successfully
4. **View Logs**: Check browser console for detailed error messages
5. **Test Connection**: Try a simple query in Supabase SQL Editor

### RLS Policy Issues

If you get permission errors:
```sql
-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename IN (
  'verification_sessions',
  'verification_results',
  'pricing_configurations'
);
```

## Support

For issues related to:
- **Supabase**: Visit [Supabase Documentation](https://supabase.com/docs)
- **Application**: Check browser console for error messages
- **Database**: Use Supabase SQL Editor to test queries
