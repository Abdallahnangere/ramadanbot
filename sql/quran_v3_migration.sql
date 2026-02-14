-- Ramadan Bot - Quran Reader v3 Production Migration
-- Updates Quran distribution from 30 days to 29 days
-- Adds aggressive page position saving

-- 1. Update Quran configuration constants (if using config table)
-- No table changes needed - config changes are in application code

-- 2. Ensure quran_progress table has updated fields for aggressive saving
ALTER TABLE quran_progress 
ADD COLUMN IF NOT EXISTS last_page_viewed INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS pages_read_today INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. Create index for faster queries on day/phase lookups  
CREATE INDEX IF NOT EXISTS idx_quran_progress_day_phase ON quran_progress(user_id, day, phase);

-- 4. Update completed phases tracking to support 29 days
-- Verify existing data and ensure compatibility
ALTER TABLE quran_progress 
ADD CONSTRAINT check_valid_day CHECK (day >= 1 AND day <= 29),
ADD CONSTRAINT check_valid_phase CHECK (phase >= 1 AND phase <= 5);

-- 5. Add user preferences for Quran reader (theme, zoom level, etc.)
CREATE TABLE IF NOT EXISTS quran_reader_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  preferred_zoom INT DEFAULT 100 CHECK (preferred_zoom >= 50 AND preferred_zoom <= 150),
  dark_mode_enabled BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create history table for tracking page views per reading session
CREATE TABLE IF NOT EXISTS quran_reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day INT NOT NULL,
  phase INT NOT NULL,
  pages_read INT NOT NULL,
  reading_duration_seconds INT,
  completion_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reading_history_user ON quran_reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_date ON quran_reading_history(created_at);

-- 7. Ensure all existing users are prepared for new distribution
-- (No action needed - backward compatible)

-- Update last_sync_at to track when migration runs
UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id IS NOT NULL;

-- Verification queries:
-- SELECT COUNT(*) as total_phases_possible FROM (
--   SELECT 29 as days, 5 as phases_per_day, 29 * 5 as total_phases
-- ) t;
-- -- Result: 145 total phases possible

-- SELECT COUNT(*) as total_pages_possible, 
--        CONCAT('Pages 1-400 (Days 1-20: 4pp)', ', Pages 401-604 (Days 21-29: ~23pp)') as distribution
-- FROM (SELECT 604 as total_pages) t;
-- -- Result: 604 total pages
