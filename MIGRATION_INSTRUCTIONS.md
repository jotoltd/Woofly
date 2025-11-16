# Database Migration Instructions

## New Features Added

This migration adds the following features to WoofTrace:

1. **Location Sharing & Email Alerts** - Track when/where pet tags are scanned with GPS location
2. **Unlimited Contacts** - Add multiple contacts per pet (owner, vet, friends, family)
3. **Additional Pet Fields** - Sex and Color fields for pet profiles

## How to Run the Migration

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of:
   `backend/prisma/migrations/20250116000000_add_contacts_location_scans_and_pet_fields/migration.sql`
5. Click **Run** to execute the migration
6. Verify the tables were created by going to **Table Editor**

### Option 2: Using Prisma Migrate (If direct connection available)

```bash
cd backend
DATABASE_URL="your-direct-supabase-url" npx prisma migrate deploy
```

## What This Migration Does

### New Tables Created:

#### Contact
- Stores unlimited contacts for each pet
- Fields: name, relation, phone, email, address, facebook, instagram
- Priority field for display ordering

#### LocationScan
- Records when someone scans a pet's QR/NFC tag
- Captures GPS coordinates (latitude, longitude, accuracy)
- Tracks user agent and IP address
- Email notification status

### Pet Table Updates:

- Added `sex` field (Male, Female, Unknown)
- Added `color` field

## After Migration

Once the migration is complete, the backend will automatically use the new schema when deployed to Vercel.

## Verification

To verify the migration succeeded:

1. Check that these tables exist in Supabase:
   - Contact
   - LocationScan

2. Check that Pet table has new columns:
   - sex
   - color

3. Run this query in Supabase SQL Editor:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('Contact', 'LocationScan');
```

You should see both tables listed.
