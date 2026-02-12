-- ====================================================================
-- RAMADAN BOT v2.5 - COMPREHENSIVE DATABASE MIGRATION SCRIPT
-- Combined updates for admin dashboard enhancements and Quran features
-- Safe to run multiple times (uses IF NOT EXISTS and idempotent operations)
-- Run this on Neon PostgreSQL database
-- ====================================================================

-- ====================================================================
-- PART 1: Core Schema Enhancement
-- ====================================================================

-- Ensure users table has all new columns
DO $$ 
BEGIN
  -- Quran tracking columns
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

-- ====================================================================
-- PART 2: Quran Progress Tracking Tables
-- ====================================================================

-- Track daily phase completions
CREATE TABLE IF NOT EXISTS quran_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day INT NOT NULL CHECK (day >= 1 AND day <= 30),
  phase INT NOT NULL CHECK (phase >= 1 AND phase <= 5),
  page_start INT NOT NULL,
  page_end INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Unique constraint: one record per user per day per phase
  UNIQUE(user_id, day, phase)
);

-- Track shared Quran progress (PNG exports)
CREATE TABLE IF NOT EXISTS quran_sharing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day INT NOT NULL,
  phase INT NOT NULL,
  flyer_url TEXT,
  shared_platform VARCHAR(50),
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quran page to surah/ayah mapping (604 pages)
CREATE TABLE IF NOT EXISTS quran_pages (
  page_number INT PRIMARY KEY CHECK (page_number >= 1 AND page_number <= 604),
  surah_number INT NOT NULL,
  surah_name VARCHAR(255) NOT NULL,
  surah_english_name VARCHAR(255),
  ayah_start INT NOT NULL,
  ayah_end INT NOT NULL,
  arabic_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PART 3: Performance Indexes
-- ====================================================================

-- Quran progress indexes
CREATE INDEX IF NOT EXISTS idx_quran_progress_user_id ON quran_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_progress_user_day ON quran_progress(user_id, day ASC);
CREATE INDEX IF NOT EXISTS idx_quran_progress_completed ON quran_progress(completed, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quran_progress_day_phase ON quran_progress(day, phase);

-- Quran sharing indexes
CREATE INDEX IF NOT EXISTS idx_quran_sharing_user_id ON quran_sharing(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_sharing_date ON quran_sharing(shared_at DESC);

-- User Quran tracking indexes
CREATE INDEX IF NOT EXISTS idx_users_quran_streak ON users(quran_streak DESC);
CREATE INDEX IF NOT EXISTS idx_users_quran_current_day ON users(quran_current_day);
CREATE INDEX IF NOT EXISTS idx_users_quran_completed ON users(quran_completed_at);

-- Generation indexes (for admin dashboard)
CREATE INDEX IF NOT EXISTS idx_generations_user_created ON generations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_topic ON generations(topic);

-- User indexes (for admin dashboard)
CREATE INDEX IF NOT EXISTS idx_users_last_login_desc ON users(last_login DESC);
CREATE INDEX IF NOT EXISTS idx_users_streak_desc ON users(streak DESC);

-- ====================================================================
-- PART 4: Statistics Views
-- ====================================================================

-- User Quran statistics view for leaderboards and admin dashboard
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
  COUNT(CASE WHEN qp.completed = true THEN 1 END)::INT as phases_completed,
  COUNT(DISTINCT qp.day)::INT as days_started,
  u.streak,
  u.generation_count,
  u.rate_limit_override,
  u.is_banned,
  u.created_at
FROM users u
LEFT JOIN quran_progress qp ON u.id = qp.user_id
GROUP BY u.id, u.name, u.quran_current_day, u.quran_current_phase, u.quran_current_page,
         u.quran_total_pages_read, u.quran_streak, u.quran_last_read_date, u.quran_started_at,
         u.quran_completed_at, u.streak, u.generation_count, u.rate_limit_override, 
         u.is_banned, u.created_at;

-- Daily statistics view for admin dashboard
CREATE OR REPLACE VIEW daily_statistics AS
SELECT 
  CURRENT_DATE as stat_date,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT CASE WHEN u.is_banned = false THEN u.id END) as active_users,
  COUNT(DISTINCT CASE WHEN u.is_banned = true THEN u.id END) as banned_users,
  COUNT(DISTINCT CASE WHEN g.created_at::date = CURRENT_DATE THEN g.user_id END) as users_generated_today,
  COUNT(CASE WHEN g.created_at::date = CURRENT_DATE THEN g.id END) as total_generations_today,
  COUNT(DISTINCT CASE WHEN qp.completed_at::date = CURRENT_DATE THEN qp.user_id END) as users_completed_quran_today,
  COUNT(CASE WHEN qp.completed_at::date = CURRENT_DATE THEN qp.id END) as total_phases_completed_today,
  AVG(u.streak)::NUMERIC(10,2) as avg_streak,
  MAX(u.streak) as max_streak,
  AVG(u.generation_count)::NUMERIC(10,2) as avg_generations_per_user
FROM users u
LEFT JOIN generations g ON u.id = g.user_id
LEFT JOIN quran_progress qp ON u.id = qp.user_id;

-- User engagement view for analytics
CREATE OR REPLACE VIEW user_engagement AS
SELECT 
  u.id,
  u.name,
  u.created_at,
  u.last_login,
  u.streak,
  u.generation_count,
  COUNT(DISTINCT g.id) as total_generations,
  COUNT(DISTINCT CASE WHEN g.created_at >= NOW() - INTERVAL '30 days' THEN g.id END) as generations_last_30_days,
  COUNT(DISTINCT CASE WHEN qp.completed = true THEN qp.day END) as days_completed_quran,
  COALESCE(MAX(qp.completed_at), u.last_login) as last_activity,
  CASE 
    WHEN u.last_login >= NOW() - INTERVAL '24 hours' THEN 'Active Today'
    WHEN u.last_login >= NOW() - INTERVAL '7 days' THEN 'Active Week'
    WHEN u.last_login >= NOW() - INTERVAL '30 days' THEN 'Active Month'
    ELSE 'Inactive'
  END as engagement_status
FROM users u
LEFT JOIN generations g ON u.id = g.user_id
LEFT JOIN quran_progress qp ON u.id = qp.user_id
GROUP BY u.id, u.name, u.created_at, u.last_login, u.streak, u.generation_count;

-- ====================================================================
-- PART 5: Helper Functions
-- ====================================================================

-- Function to calculate Quran reading progress
CREATE OR REPLACE FUNCTION get_user_quran_progress(user_id UUID)
RETURNS TABLE (
  current_day INT,
  current_phase INT,
  current_page INT,
  total_pages_read INT,
  streak INT,
  phases_completed INT,
  is_completed BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.quran_current_day,
    u.quran_current_phase,
    u.quran_current_page,
    u.quran_total_pages_read,
    u.quran_streak,
    COUNT(CASE WHEN qp.completed = true THEN 1 END)::INT,
    u.quran_completed_at IS NOT NULL
  FROM users u
  LEFT JOIN quran_progress qp ON u.id = qp.user_id
  WHERE u.id = user_id
  GROUP BY u.id, u.quran_current_day, u.quran_current_phase, u.quran_current_page,
           u.quran_total_pages_read, u.quran_streak, u.quran_completed_at;
END;
$$ LANGUAGE plpgsql;

-- Function to reset user Quran progress
CREATE OR REPLACE FUNCTION reset_user_quran_progress(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM quran_progress WHERE user_id = user_id;
  DELETE FROM quran_sharing WHERE user_id = user_id;
  UPDATE users SET 
    quran_current_day = 0,
    quran_current_phase = 0,
    quran_current_page = 1,
    quran_total_pages_read = 0,
    quran_streak = 0,
    quran_last_read_date = NULL,
    quran_started_at = NULL,
    quran_completed_at = NULL
  WHERE id = user_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to reset all users' streaks (admin feature)
CREATE OR REPLACE FUNCTION reset_all_streaks()
RETURNS INT AS $$
DECLARE
  count INT;
BEGIN
  UPDATE users SET streak = 0 WHERE role = 'user';
  GET DIAGNOSTICS count = ROW_COUNT;
  RETURN count;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- PART 6: Triggers for Automated Updates
-- ====================================================================

-- Trigger to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION update_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_users_timestamp();

-- Trigger to update quran_progress updated_at
CREATE OR REPLACE FUNCTION update_quran_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_quran_progress_updated_at ON quran_progress;
CREATE TRIGGER trigger_quran_progress_updated_at BEFORE UPDATE ON quran_progress
FOR EACH ROW EXECUTE FUNCTION update_quran_progress_timestamp();

-- ====================================================================
-- PART 7: Data Validation Checks
-- ====================================================================

-- Add constraints to ensure data integrity
DO $$
BEGIN
  -- Users check constraints
  ALTER TABLE users ADD CONSTRAINT check_rate_limit POSITIVE CHECK (rate_limit_override > 0);
  ALTER TABLE users ADD CONSTRAINT check_quota_limit_valid CHECK (rate_limit_override <= 100);
  
  -- Quran progress check constraints
  ALTER TABLE quran_progress ADD CONSTRAINT check_quran_page_range 
    CHECK (page_start >= 1 AND page_end <= 604 AND page_start <= page_end);
  ALTER TABLE quran_progress ADD CONSTRAINT check_quran_day_range 
    CHECK (day >= 1 AND day <= 30);
  ALTER TABLE quran_progress ADD CONSTRAINT check_quran_phase_range 
    CHECK (phase >= 1 AND phase <= 5);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ====================================================================
-- END OF MIGRATION SCRIPT
-- Run the following command to verify the schema:
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- ===================================================================
