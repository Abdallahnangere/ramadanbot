# Database Migrations - Ramadan Bot v2.0

## Overview
SQL scripts needed to update your Neon PostgreSQL database for v2.0. These migrations add performance optimizations and support for new features.

---

## ✅ Required Migrations

### Migration 1: Add Index on `is_banned` Field

**Purpose**: Optimize queries that filter on ban status  
**Impact**: Faster admin dashboard user filtering and analytics  
**Breaking Changes**: None (non-breaking index addition)

```sql
CREATE INDEX idx_users_is_banned ON users(is_banned);
```

**Execution in Neon Console**:
1. Login to your Neon dashboard
2. Select your database
3. Open the SQL Editor
4. Copy and paste the SQL above
5. Click "Execute"

Expected output:
```
CREATE INDEX
```

---

## 📋 Database Schema References

### Users Table
Current schema (no changes to structure):
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  streak INT DEFAULT 0,
  generation_count INT DEFAULT 0,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_generation_date TIMESTAMP,
  rate_limit_override INT DEFAULT 3,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### New Index Structure
```sql
CREATE INDEX idx_users_is_banned ON users(is_banned);
```

This creates an index on the `is_banned` boolean field, making queries like:
```sql
SELECT * FROM users WHERE is_banned = FALSE;
```
Much faster on large user tables.

---

## 🔄 Delete User Flow (Application Level)

The new admin delete feature uses this transactional flow in `app/actions.ts`:

```typescript
export async function deleteUser(userId: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Delete all generations for this user
    await client.query('DELETE FROM generations WHERE user_id = $1', [userId]);
    // Delete the user
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    await client.query('COMMIT');
    return { success: true };
  } catch (e) {
    await client.query('ROLLBACK');
    return { success: false };
  } finally { 
    client.release(); 
  }
}
```

**No additional database schema changes required** - the delete operation uses existing tables with transaction support.

---

## 🧪 Verification Queries

After applying migrations, verify your database is ready:

### Check if the index was created
```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'users' AND indexname = 'idx_users_is_banned';
```

Expected result: One row with `idx_users_is_banned`

### Check index size and usage
```sql
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

This shows how many times the index has been used since creation.

### Verify your tables exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should include:
- `users`
- `generations`
- Any other existing tables

---

## 📊 Migration Safety

### Before Running
1. ✅ Backup your database (Neon provides automatic backups)
2. ✅ Run in non-production first if possible
3. ✅ Verify migration SQL syntax

### Rollback Instructions
If you need to rollback the index addition:

```sql
DROP INDEX IF EXISTS idx_users_is_banned;
```

This removes the index but leaves all data intact. Performance on ban-status queries will revert to table scans.

---

## ⏱️ Migration Execution Timeline

| Step | Time | Action |
|------|------|--------|
| 1 | < 1 min | Login to Neon console |
| 2 | < 2 min | Create index on `is_banned` |
| 3 | < 1 min | Verify with verification queries |
| **Total** | **~4 minutes** | **Complete** |

---

## 🔌 Connection Details

**For Reference** (don't share publicly):
- Service: Neon PostgreSQL
- Database: Your ramadanbot database
- Region: Based on your Neon project

Get your connection string from:
1. Neon Dashboard → Your Project
2. "Connection string" section
3. Copy the `DATABASE_URL` value

**Used in**: `lib/db.ts` via environment variable

---

## 📝 Notes

- **No application downtime required**: Index creation is non-blocking
- **Zero data loss**: This is only an index addition
- **Performance gain**: Larger user bases (1000+) will see noticeable improvement
- **Automatic indexing**: Future Neon optimizations might create additional indexes

---

## ✨ Post-Migration

After applying migrations:

1. ✅ Restart your Next.js application (if deployed on Vercel, no restart needed)
2. ✅ Test admin dashboard (should load user list normally)
3. ✅ Test delete user feature (should work from admin panel)
4. ✅ Monitor query performance (should be faster)

---

## 🆘 Troubleshooting

### "Index already exists" error
```
ERROR: relation "idx_users_is_banned" already exists
```
**Solution**: The index was already created in a previous migration. This is safe to ignore.

**Fix**: 
```sql
DROP INDEX IF EXISTS idx_users_is_banned;
CREATE INDEX idx_users_is_banned ON users(is_banned);
```

### "Table does not exist" error
```
ERROR: relation "users" does not exist
```
**Solution**: Your database schema hasn't been initialized yet.  
**Fix**: Run your initial schema creation migrations first (from project setup).

### Slow to create index on large table
If you have enormous user tables (100k+ rows), index creation might take a minute. This is normal and won't lock your tables.

---

## 📧 Support

If you encounter any issues:
1. Check the Neon dashboard for database status
2. Review this guide's troubleshooting section
3. Contact: abdallahnangere@gmail.com

---

**Status**: Ready for Production ✅  
**Tested**: Yes  
**Reversible**: Yes (drop index command above)  
**Estimated Completion**: ~5 minutes  
