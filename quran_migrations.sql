-- Ramadan Bot Quran Integration Migrations
-- Run this script on Neon to add Quran tracking features
-- Safe to run multiple times (uses IF NOT EXISTS and idempotent ALTER operations)

-- Add Quran progress tracking columns to users table
DO $$ 
BEGIN
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quran_current_day INT DEFAULT 0;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quran_current_phase INT DEFAULT 0;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quran_current_page INT DEFAULT 1;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quran_total_pages_read INT DEFAULT 0;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quran_streak INT DEFAULT 0;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quran_last_read_date TIMESTAMPTZ;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quran_started_at TIMESTAMPTZ;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quran_completed_at TIMESTAMPTZ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create quran_progress table to track daily phase completions
CREATE TABLE IF NOT EXISTS quran_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day INT NOT NULL,
  phase INT NOT NULL,
  page_start INT NOT NULL,
  page_end INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Unique constraint: one completion record per user per day per phase
  UNIQUE(user_id, day, phase)
);

-- Create quran_sharing table to track shared progress PNG exports
CREATE TABLE IF NOT EXISTS quran_sharing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day INT NOT NULL,
  phase INT NOT NULL,
  flyer_url TEXT,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quran_progress_user_id ON quran_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_progress_user_day ON quran_progress(user_id, day);
CREATE INDEX IF NOT EXISTS idx_quran_progress_completed ON quran_progress(completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_quran_sharing_user_id ON quran_sharing(user_id);
CREATE INDEX IF NOT EXISTS idx_users_quran_streak ON users(quran_streak);
CREATE INDEX IF NOT EXISTS idx_users_quran_current_day ON users(quran_current_day);

-- Create view for user Quran stats (useful for admin dashboard and leaderboards)
CREATE OR REPLACE VIEW user_quran_stats AS
SELECT 
  u.id,
  u.name,
  u.quran_current_day,
  u.quran_current_phase,
  u.quran_current_page,
  u.quran_total_pages_read,
  u.quran_streak,
  u.quran_last_read_date,
  u.quran_started_at,
  u.quran_completed_at,
  COUNT(CASE WHEN qp.completed = true THEN 1 END) as phases_completed,
  COUNT(DISTINCT qp.day) as days_started,
  u.streak,
  u.generation_count
FROM users u
LEFT JOIN quran_progress qp ON u.id = qp.user_id
GROUP BY u.id, u.name, u.quran_current_day, u.quran_current_phase, u.quran_current_page,
         u.quran_total_pages_read, u.quran_streak, u.quran_last_read_date, u.quran_started_at,
         u.quran_completed_at, u.streak, u.generation_count;

-- Quran metadata table (604 pages mapped to surahs, ayahs)
CREATE TABLE IF NOT EXISTS quran_pages (
  page_number INT PRIMARY KEY,
  surah_number INT NOT NULL,
  surah_name VARCHAR(255) NOT NULL,
  ayah_start INT NOT NULL,
  ayah_end INT NOT NULL,
  arabic_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quran_pages_surah ON quran_pages(surah_number);

-- Note: quran_pages table can be populated via seeding script or API calls
-- Each page has mapped surah and ayah numbers for quran.com API integration
