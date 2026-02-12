import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('sslmode=require') 
    ? { rejectUnauthorized: false } 
    : undefined
});

export default pool;

// Helper to sanitize User object for client
export const safeUser = (row: any) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  streak: row.streak,
  generation_count: row.generation_count,
  last_login: row.last_login?.toISOString(),
  last_generation_date: row.last_generation_date?.toISOString() || null,
  rate_limit_override: row.rate_limit_override,
  is_banned: row.is_banned,
  created_at: row.created_at?.toISOString(),
  quran_current_day: row.quran_current_day || 0,
  quran_current_phase: row.quran_current_phase || 0,
  quran_current_page: row.quran_current_page || 1,
  quran_total_pages_read: row.quran_total_pages_read || 0,
  quran_streak: row.quran_streak || 0,
  quran_last_read_date: row.quran_last_read_date?.toISOString() || null,
  quran_started_at: row.quran_started_at?.toISOString() || null,
  quran_completed_at: row.quran_completed_at?.toISOString() || null,
});