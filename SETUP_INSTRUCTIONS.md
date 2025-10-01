# Database Setup Instructions

## Quick Start

Your Supabase database integration is ready! Follow these simple steps to activate it:

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `0ec90b57d6e95fcbda19832f`

### Step 2: Run the Database Setup

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button
3. Open the file `database_setup.sql` from this project
4. Copy ALL the SQL content
5. Paste it into the SQL Editor
6. Click **"Run"** button (or press Ctrl/Cmd + Enter)

### Step 3: Verify Setup

You should see success messages for:
- ✅ verification_sessions table created
- ✅ verification_results table created
- ✅ pricing_configurations table created
- ✅ Indexes created
- ✅ Row Level Security enabled
- ✅ Policies created

### Step 4: Start Using the App

That's it! The application will now automatically:
- Save all verification results to the database
- Persist pricing configurations
- Track session history
- Provide session IDs for reference

## What Gets Saved?

**Every time you verify locations:**
- Complete address and location details
- Service requirements (container size, equipment type, material type, frequency)
- Verification status and reasons
- Geographic coordinates
- Division and regional assignments
- Franchise fees
- Bin quantities and add-ons

**Session Information:**
- File name or location description
- Total counts (serviceable, not serviceable, manual review)
- Timestamp of when verification was performed

## Visual Confirmation

After running a verification, look for:
- 💾 "Saving to database..." (animated) - Data is being saved
- ✅ "Saved to database (Session: xxxxxxxx...)" - Save successful
- Session ID displayed for tracking

## Troubleshooting

**If you see "Failed to save to database":**

1. Verify the SQL script ran successfully in Supabase
2. Check your internet connection
3. Refresh the Supabase dashboard and verify tables exist
4. Look in browser console for detailed error messages

**To check if tables exist:**

In Supabase SQL Editor, run:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('verification_sessions', 'verification_results', 'pricing_configurations');
```

You should see all 3 tables listed.

## Database File Location

The complete SQL setup script is located at:
```
database_setup.sql
```

## Support

- **Supabase Issues**: [Supabase Documentation](https://supabase.com/docs)
- **Application Issues**: Check browser developer console (F12)
- **SQL Errors**: Review error messages in Supabase SQL Editor

---

## Already Have Data?

The SQL script uses `IF NOT EXISTS` clauses, so it's safe to run multiple times. It won't delete or overwrite existing data.
