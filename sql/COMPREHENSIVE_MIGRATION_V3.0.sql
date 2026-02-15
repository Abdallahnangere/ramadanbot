-- ====================================================================
-- RAMADIAN BOT v3.0+ COMPREHENSIVE DATABASE MIGRATION
-- Combined migration script for production deployment
-- Safe to run multiple times (idempotent operations)
-- Last Updated: February 2025
-- ====================================================================

-- NOTE: This script combines all migrations from previous versions
-- and adds enhancements for v3.0+ features

-- ====================================================================
-- PART 1: Core Tables (Base Schema)
-- ====================================================================

-- Users table with authentication and tracking
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  pin_hash VARCHAR(64) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  streak INT DEFAULT 0,
  generation_count INT DEFAULT 0,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  last_generation_date TIMESTAMPTZ,
  rate_limit_override INT DEFAULT 3,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Qur'ān tracking columns (v2.5+)
  quran_current_day INT DEFAULT 0,
  quran_current_phase INT DEFAULT 0,
  quran_current_page INT DEFAULT 1,
  quran_total_pages_read INT DEFAULT 0,
  quran_streak INT DEFAULT 0,
  quran_last_read_date TIMESTAMPTZ,
  quran_started_at TIMESTAMPTZ,
  quran_completed_at TIMESTAMPTZ,
  -- v3.0 enhancement columns
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'
);

-- Generations table (reflections history)
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Qur'ān progress tracking (v2.5+)
CREATE TABLE IF NOT EXISTS quran_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day INT NOT NULL CHECK (day >= 1 AND day <= 29),  -- Updated to 29 days for v3.0
  phase INT NOT NULL CHECK (phase >= 1 AND phase <= 5),
  page_start INT NOT NULL,
  page_end INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day, phase)
);

-- Qur'ān sharing history (v2.5+)
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

-- Qur'ān pages metadata (v2.5+)
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
-- PART 2: v3.0+ Enhancement Tables
-- ====================================================================

-- Reader state persistence (current reading position)
CREATE TABLE IF NOT EXISTS reader_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_page INT NOT NULL CHECK (current_page >= 1 AND current_page <= 604),
  current_day INT NOT NULL CHECK (current_day >= 1 AND current_day <= 29),
  current_phase INT NOT NULL CHECK (current_phase >= 1 AND current_phase <= 5),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gamified Qur'ān progress (29-day journey)
CREATE TABLE IF NOT EXISTS quran_progress_gamified (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_day INT NOT NULL CHECK (current_day >= 1 AND current_day <= 29),
  current_phase INT NOT NULL CHECK (current_phase >= 1 AND current_phase <= 5),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gamified completed phases (unlock tracking 145 total phases: 28*5 + 5 = 145)
CREATE TABLE IF NOT EXISTS quran_completed_phases_gamified (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day INT NOT NULL CHECK (day >= 1 AND day <= 29),
  phase INT NOT NULL CHECK (phase >= 1 AND phase <= 5),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day, phase)
);

-- Reader preferences (zoom, dark mode, etc.)
CREATE TABLE IF NOT EXISTS quran_reader_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  zoom_level INT DEFAULT 100 CHECK (zoom_level >= 50 AND zoom_level <= 150),
  dark_mode_enabled BOOLEAN DEFAULT FALSE,
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading session history (for analytics)
CREATE TABLE IF NOT EXISTS quran_reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  pages_read INT DEFAULT 0,
  duration_minutes INT,
  day_started INT,
  phase_started INT,
  day_ended INT,
  phase_ended INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PART 3: Add Missing Columns (Idempotent)
-- ====================================================================

DO $$ 
BEGIN
  -- Users table enhancements
  ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();
  ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
  
  -- Qur'ān columns
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
-- PART 4: Indexes for Performance
-- ====================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_name_lower ON users(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);
CREATE INDEX IF NOT EXISTS idx_users_last_login_desc ON users(last_login DESC);
CREATE INDEX IF NOT EXISTS idx_users_streak_desc ON users(streak DESC);
CREATE INDEX IF NOT EXISTS idx_users_created_at_desc ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_quran_current_day ON users(quran_current_day);
CREATE INDEX IF NOT EXISTS idx_users_quran_completed ON users(quran_completed_at);

-- Generations indexes
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_user_created ON generations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_topic ON generations(topic);

-- Reader state indexes
CREATE INDEX IF NOT EXISTS idx_reader_state_user_id ON reader_state(user_id);
CREATE INDEX IF NOT EXISTS idx_reader_state_last_read ON reader_state(last_read_at DESC);

-- Gamified progress indexes
CREATE INDEX IF NOT EXISTS idx_quran_progress_gamified_user_id ON quran_progress_gamified(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_progress_gamified_day ON quran_progress_gamified(current_day);

-- Gamified completed phases indexes
CREATE INDEX IF NOT EXISTS idx_quran_completed_phases_gamified_user_id ON quran_completed_phases_gamified(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_completed_phases_gamified_day_phase ON quran_completed_phases_gamified(day, phase);
CREATE INDEX IF NOT EXISTS idx_quran_completed_phases_gamified_completed_at ON quran_completed_phases_gamified(completed_at DESC);

-- Qur'ān progress indexes
CREATE INDEX IF NOT EXISTS idx_quran_progress_user_id ON quran_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_progress_user_day ON quran_progress(user_id, day ASC);
CREATE INDEX IF NOT EXISTS idx_quran_progress_completed ON quran_progress(completed, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quran_progress_day_phase ON quran_progress(day, phase);

-- Qur'ān sharing indexes
CREATE INDEX IF NOT EXISTS idx_quran_sharing_user_id ON quran_sharing(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_sharing_date ON quran_sharing(shared_at DESC);

-- Reading history indexes
CREATE INDEX IF NOT EXISTS idx_quran_reading_history_user_id ON quran_reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_reading_history_date ON quran_reading_history(session_start DESC);

CREATE INDEX IF NOT EXISTS idx_quran_reader_preferences_user_id ON quran_reader_preferences(user_id);

-- ====================================================================
-- PART 5: Views for Analytics and Admin Dashboard
-- ====================================================================

-- User statistics view
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.name,
  u.streak,
  u.generation_count,
  COUNT(DISTINCT g.id) as total_generations,
  COUNT(DISTINCT CASE WHEN g.created_at::date = CURRENT_DATE THEN g.id END) as today_generations,
  u.quran_current_day,
  u.quran_current_phase,
  u.quran_streak,
  u.rate_limit_override,
  u.is_banned,
  u.created_at,
  u.last_login,
  u.last_activity_at
FROM users u
LEFT JOIN generations g ON u.id = g.user_id
GROUP BY u.id, u.name, u.streak, u.generation_count, u.quran_current_day, u.quran_current_phase, u.quran_streak, u.rate_limit_override, u.is_banned, u.created_at, u.last_login, u.last_activity_at;

-- Qur'ān reading progress view
CREATE OR REPLACE VIEW quran_progress_view AS
SELECT
  qp.user_id,
  u.name,
  qp.day,
  qp.phase,
  qp.completed,
  qp.completed_at,
  u.quran_streak,
  COUNT(*) OVER (PARTITION BY qp.user_id) as phases_completed
FROM quran_progress qp
INNER JOIN users u ON qp.user_id = u.id
ORDER BY qp.user_id, qp.day, qp.phase;

-- Daily engagement view
CREATE OR REPLACE VIEW daily_engagement AS
SELECT
  DATE(g.created_at) as date,
  COUNT(DISTINCT g.user_id) as active_users,
  COUNT(DISTINCT g.id) as total_generations,
  COUNT(DISTINCT CASE WHEN qp.completed THEN qp.user_id END) as reading_users
FROM generations g
LEFT JOIN quran_progress qp ON DATE(qp.completed_at) = DATE(g.created_at)
GROUP BY DATE(g.created_at)
ORDER BY DATE(g.created_at) DESC;

-- ====================================================================
-- PART 6: Stored Procedures (Optional but Recommended)
-- ====================================================================

-- Function to safely update user activity
CREATE OR REPLACE FUNCTION update_user_activity(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET last_activity_at = NOW() WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-complete phase
CREATE OR REPLACE FUNCTION complete_quran_phase(
  user_id UUID,
  phase_day INT,
  phase_num INT
)
RETURNS BOOLEAN AS $$
DECLARE
  inserted BOOLEAN;
BEGIN
  INSERT INTO quran_progress (user_id, day, phase, page_start, page_end, completed, completed_at)
  VALUES (user_id, phase_day, phase_num, 1, 100, TRUE, NOW())
  ON CONFLICT (user_id, day, phase) DO UPDATE
  SET completed = TRUE, completed_at = NOW(), updated_at = NOW();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- PART 7: Cleanup and Maintenance
-- ====================================================================

-- Update constraint on quran_progress to allow 29 days (if not already)
-- Note: If this table was created with day <= 30, the check constraint will allow 29

-- Add any system-wide settings needed
INSERT INTO users (name, pin_hash, role, created_at)
SELECT 'SYSTEM', 'XXXXXXX', 'admin', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'SYSTEM');

-- ====================================================================
-- PART 8: Verification Queries (Run after migration)
-- ====================================================================

-- Check table counts:
-- SELECT COUNT(*) FROM users;
-- SELECT COUNT(*) FROM generations;
-- SELECT COUNT(*) FROM quran_progress;
-- SELECT COUNT(*) FROM quran_reader_preferences;
--
-- Check data consistency:
-- SELECT * FROM user_stats LIMIT 10;
-- SELECT * FROM quran_progress_view WHERE user_id = 'YOUR_USER_ID';
--
-- Check latest activity:
-- SELECT name, last_activity_at, quran_current_day, quran_current_phase FROM users ORDER BY last_activity_at DESC LIMIT 10;

-- ====================================================================
-- END OF MIGRATION SCRIPT
-- ====================================================================
-- 
-- DEPLOYMENT INSTRUCTIONS:
-- 1. Open Neon SQL Editor (https://console.neon.tech)
-- 2. Select your Ramadan Bot database
-- 3. Copy and paste entire script (all parts)
-- 4. Click "Execute" button
-- 5. Check for "Command completed successfully" messages
-- 6. Run verification queries above
-- 7. If successful, deploy updated code to Vercel
--
-- ROLLBACK (if needed):
-- Note: This migration is designed to be non-destructive.
-- It only adds new tables/columns, creates indexes, and views.
-- No data is deleted. To rollback, simply don't deploy the new code.
--
-- SUPPORT:
-- For issues, check Neon logs and error messages.
-- Ensure all NOT NULL constraints are properly defined.
-- Verify foreign key relationships are intact.
-- ====================================================================
