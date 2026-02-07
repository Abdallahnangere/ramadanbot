# SQL Scripts for Neon - Ramadan Bot v2.0

## ⚡ Quick Reference: SQL to Run in Neon

Copy and paste these scripts into your Neon SQL Editor to complete the v2.0 deployment.

---

## 🔧 Script 1: Create Performance Index (REQUIRED)

**Purpose**: Optimize ban status queries for faster admin dashboard performance  
**Execution Time**: < 1 second  
**Breaking**: No

```sql
-- Create index on is_banned field for faster filtering
CREATE INDEX idx_users_is_banned ON users(is_banned);
```

**Copy Everything Above ↑ and paste into Neon SQL Editor**

---

## ✅ Script 2: Verify Index Was Created (OPTIONAL)

Run this AFTER Script 1 to confirm the index exists:

```sql
-- Verify the index was created successfully
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE indexname = 'idx_users_is_banned';
```

**Expected Result**: One row showing the index definition

---

## 📊 Script 3: Check Index Usage (OPTIONAL)

Run this after a few days to see if the index is being used:

```sql
-- Check index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE indexname = 'idx_users_is_banned';
```

**Expected Result**: Shows scan and tuple fetch counts (will be 0 immediately after creation)

---

## 🔄 Script 4: Rollback (Only if Needed)

If you need to undo the index creation for any reason:

```sql
-- Drop the index (reversible)
DROP INDEX IF EXISTS idx_users_is_banned;
```

---

## 🧪 Script 5: Database Health Check (OPTIONAL)

Run this anytime to verify your database schema is healthy:

```sql
-- Verify tables exist
SELECT 
    table_name,
    table_type,
    table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Result**: Should show tables including:
- users
- generations
- (any other existing tables)

```sql
-- Verify users table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

**Expected Columns**: Should include `id`, `name`, `role`, `streak`, `generation_count`, `last_login`, `last_generation_date`, `rate_limit_override`, `is_banned`, `created_at`

---

## 📋 Step-by-Step Execution Guide

### Step 1: Login to Neon
1. Go to https://console.neon.tech
2. Sign in with your account
3. Select your "ramadanbot" project
4. Click on your database

### Step 2: Open SQL Editor
1. Click "SQL Editor" from the left menu
2. Or click "New Query"
3. You should see an empty SQL editor

### Step 3: Run Script 1 (REQUIRED)
1. Copy the entire Script 1 above (the CREATE INDEX statement)
2. Paste into the SQL Editor
3. Click "Execute" button (or press Ctrl+Enter)
4. Wait for success message: `CREATE INDEX`

### Step 4: Run Script 2 (Verify)
1. Copy Script 2 (the verification query)
2. Paste into a new SQL Editor tab
3. Click "Execute"
4. You should see one row result showing the index

### Step 5: Done!
Your database is now updated for v2.0. The delete user feature and other optimizations are ready.

---

## 🔍 Troubleshooting SQL Execution

### Error: "Index already exists"
```
ERROR: relation "idx_users_is_banned" already exists
```

**Meaning**: The index was already created (possibly in a previous setup)  
**Action**: This is safe! No action needed. Your database is already optimized.  
**Fix** (if you want to force recreation):
```sql
DROP INDEX IF EXISTS idx_users_is_banned;
CREATE INDEX idx_users_is_banned ON users(is_banned);
```

### Error: "Table does not exist"
```
ERROR: relation "users" does not exist
```

**Meaning**: Your database schema hasn't been initialized  
**Action**: You need to run your initial schema setup first  
**Contact**: Reach out - we'll provide the full schema

### Error: "Permission denied"
```
ERROR: permission denied for schema public
```

**Meaning**: Your Neon API key or database user lacks permissions  
**Action**:
1. Check that you're connected as the database owner
2. Verify connection string includes correct user
3. Try a different user role in Neon dashboard

### Slow Execution
```
Query running for > 30 seconds...
```

**Meaning**: Large user table and index creation is slow  
**Action**: This is normal for huge tables. Wait for completion.  
**Time**: Typically completes in < 1 minute

---

## 📌 Important Notes

1. **No Downtime Required**: Index creation doesn't lock tables
2. **Data Safe**: This only adds an index; no data is modified
3. **Reversible**: Can be dropped anytime if needed
4. **Non-Breaking**: Existing queries will still work, just faster

---

## ✨ After Running Scripts

Once you've run Script 1, the following features are immediately available:

✅ User banning is faster  
✅ Admin dashboard loads faster  
✅ Ban/unban operations are quicker  
✅ Analytics queries are optimized  
✅ Delete user feature is fully functional  

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify scripts are copied exactly (no extra spaces)
3. Try running scripts individually
4. Check Neon status page: https://status.neon.tech

**Contact for help**:
- Email: abdallahnangere@gmail.com
- WhatsApp: +234 816 413 5836

---

## 📝 Execution Checklist

- [ ] Logged into Neon console
- [ ] Selected ramadanbot project
- [ ] Opened SQL Editor
- [ ] Ran Script 1 (CREATE INDEX)
- [ ] Ran Script 2 (verification)
- [ ] Saw success results
- [ ] Database is updated ✅

---

**Version**: 2.0  
**Last Updated**: February 7, 2026  
**Database**: PostgreSQL (Neon)  
**Status**: Ready to execute
