'use server';

import pool, { safeUser } from '../lib/db';
import { User, AnalyticsData } from '../types';
import { SignJWT } from 'jose';
import { differenceInCalendarDays, isSameDay } from 'date-fns';
import { generateMessage } from '../lib/gemini';
import { createHash } from 'crypto';

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

// --- UTILS ---

const hashPin = (pin: string) => {
  return createHash('sha256').update(pin).digest('hex');
};

// --- AUTHENTICATION ---

export async function loginUser(name: string, pin: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const client = await pool.connect();
  try {
    const hashedPin = hashPin(pin);
    
    // Check if user exists
    const res = await client.query('SELECT * FROM users WHERE lower(name) = lower($1)', [name]);
    
    if (res.rows.length > 0) {
      const user = res.rows[0];
      if (user.pin_hash !== hashedPin) {
        return { success: false, error: "Incorrect PIN." };
      }
      if (user.is_banned) {
        return { success: false, error: "Account suspended." };
      }

      // Update Login Time
      const updated = await client.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING *',
        [user.id]
      );
      return { success: true, user: safeUser(updated.rows[0]) };
    } else {
      // Create New User
      const newUser = await client.query(
        `INSERT INTO users (name, pin_hash, role) VALUES ($1, $2, 'user') RETURNING *`,
        [name, hashedPin]
      );
      return { success: true, user: safeUser(newUser.rows[0]) };
    }
  } catch (e) {
    console.error("Login Error", e);
    return { success: false, error: "Database Connection Failed" };
  } finally {
    client.release();
  }
}

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string }> {
  if (password === ADMIN_PASS) {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(JWT_SECRET);
    return { success: true, token };
  }
  return { success: false };
}

// --- GENERATION LOGIC ---

export async function checkLimitAndGenerate(userId: string, topic: string, day: number, hint?: string) {
  const client = await pool.connect();
  try {
    // 1. Get User
    const userRes = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    
    if (!user) return { success: false, error: "User not found" };
    if (user.is_banned) return { success: false, error: "User is banned" };

    // 2. Check Rate Limit
    const limit = user.rate_limit_override || 3;
    const now = new Date();
    
    // Count generations today
    const countRes = await client.query(
      `SELECT COUNT(*) FROM generations 
       WHERE user_id = $1 AND created_at >= (NOW() - INTERVAL '24 hours')`, 
      [userId]
    );
    const usedToday = parseInt(countRes.rows[0].count);

    if (usedToday >= limit && user.role !== 'admin') {
      return { success: false, error: "Daily limit reached." };
    }

    // 3. Generate AI Content
    const aiRes = await generateMessage(topic, day, hint);
    if (!aiRes.success) return aiRes;

    // 4. Log Transaction
    await client.query('BEGIN');
    
    // Update User Streak
    let newStreak = user.streak;
    if (user.last_generation_date) {
        const lastDate = new Date(user.last_generation_date);
        const diff = differenceInCalendarDays(now, lastDate);
        if (diff === 1) newStreak++;
        else if (diff > 1) newStreak = 1;
    } else {
        newStreak = 1;
    }

    const updatedUser = await client.query(
      `UPDATE users SET 
        last_generation_date = NOW(), 
        generation_count = generation_count + 1,
        streak = $1
       WHERE id = $2 RETURNING *`,
      [newStreak, userId]
    );

    // Insert Generation Record
    await client.query(
      'INSERT INTO generations (user_id, topic) VALUES ($1, $2)',
      [userId, topic]
    );

    await client.query('COMMIT');

    return { success: true, text: aiRes.text, user: safeUser(updatedUser.rows[0]), error: undefined };

  } catch (e) {
    await client.query('ROLLBACK');
    console.error("Gen Error", e);
    return { success: false, error: "System Error" };
  } finally {
    client.release();
  }
}

// --- ADMIN FEATURES ---

export async function getAnalytics(): Promise<AnalyticsData> {
  const client = await pool.connect();
  try {
    const totalUsers = await client.query('SELECT COUNT(*) FROM users');
    const totalGens = await client.query('SELECT COUNT(*) FROM generations');
    const activeToday = await client.query('SELECT COUNT(DISTINCT user_id) FROM generations WHERE created_at::date = CURRENT_DATE');
    const bannedUsers = await client.query('SELECT COUNT(*) FROM users WHERE is_banned = true');
    
    const recent = await client.query(`
        SELECT g.id, g.topic, g.created_at, u.name as user_name 
        FROM generations g 
        JOIN users u ON g.user_id = u.id 
        ORDER BY g.created_at DESC LIMIT 10
    `);

    return {
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalGenerations: parseInt(totalGens.rows[0].count),
      activeToday: parseInt(activeToday.rows[0].count),
      bannedUsers: parseInt(bannedUsers.rows[0].count),
      recentGenerations: recent.rows.map(r => ({
          ...r, 
          created_at: r.created_at.toISOString()
      }))
    };
  } finally {
    client.release();
  }
}

export async function fetchAllUsers() {
  const client = await pool.connect();
  try {
    // Fetch users with their last generation topic
    const res = await client.query(`
      SELECT 
        u.*,
        g.topic as last_topic,
        g.created_at as last_topic_date
      FROM users u
      LEFT JOIN (
        SELECT DISTINCT ON (user_id) user_id, topic, created_at 
        FROM generations 
        ORDER BY user_id, created_at DESC
      ) g ON u.id = g.user_id
      ORDER BY u.last_login DESC
      LIMIT 100
    `);
    return res.rows.map(row => ({
      ...safeUser(row),
      last_topic: row.last_topic || 'N/A',
      last_topic_date: row.last_topic_date?.toISOString() || null
    }));
  } finally {
    client.release();
  }
}

export async function updateUserName(userId: string, newName: string) {
  const client = await pool.connect();
  try {
    // Check if name already exists
    const existing = await client.query('SELECT id FROM users WHERE lower(name) = lower($1) AND id != $2', [newName, userId]);
    if (existing.rows.length > 0) {
      return { success: false, error: 'Name already in use' };
    }
    
    const res = await client.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [newName, userId]);
    return { success: true, user: safeUser(res.rows[0]) };
  } catch (e) {
    console.error('Update name error:', e);
    return { success: false, error: 'Failed to update name' };
  } finally {
    client.release();
  }
}

export async function updateUserLimit(userId: string, newLimit: number) {
  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET rate_limit_override = $1 WHERE id = $2', [newLimit, userId]);
    return { success: true };
  } catch(e) { return { success: false }; }
  finally { client.release(); }
}

export async function toggleUserBan(userId: string, status: boolean) {
  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET is_banned = $1 WHERE id = $2', [status, userId]);
    return { success: true };
  } finally { client.release(); }
}

export async function deleteUser(userId: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Delete all generations for this user (cascade will handle this from schema, but explicit is safer)
    await client.query('DELETE FROM generations WHERE user_id = $1', [userId]);
    // Delete the user
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    await client.query('COMMIT');
    return { success: true };
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Delete user error:', e);
    return { success: false };
  } finally { client.release(); }
}

export async function resetAllStreaks() {
  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET streak = 0 WHERE role = $1', ['user']);
    return { success: true };
  } catch (e) {
    console.error('Reset streaks error:', e);
    return { success: false };
  } finally {
    client.release();
  }
}

export async function resetAllQuranProgress() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Delete all Quran progress records
    await client.query('DELETE FROM quran_progress');
    // Delete all Quran sharing records
    await client.query('DELETE FROM quran_sharing');
    // Reset Quran columns in users
    await client.query(`
      UPDATE users SET 
        quran_current_day = 0,
        quran_current_phase = 0,
        quran_current_page = 1,
        quran_total_pages_read = 0,
        quran_streak = 0,
        quran_last_read_date = NULL,
        quran_started_at = NULL,
        quran_completed_at = NULL
      WHERE role = $1
    `, ['user']);
    await client.query('COMMIT');
    return { success: true };
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Reset Quran progress error:', e);
    return { success: false };
  } finally {
    client.release();
  }
}

export async function getEnhancedAnalytics() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        COUNT(DISTINCT u.id) as totalUsers,
        COUNT(DISTINCT g.id) as totalGenerations,
        COUNT(DISTINCT CASE WHEN g.created_at::date = CURRENT_DATE THEN g.user_id END) as activeToday,
        COUNT(DISTINCT CASE WHEN u.is_banned = true THEN u.id END) as bannedUsers,
        ROUND(AVG(u.generation_count)::numeric, 1)::float as avgGenerationsPerUser,
        MAX(u.generation_count) as maxGenerations,
        MAX(u.streak) as maxStreak,
        COUNT(DISTINCT CASE WHEN u.quran_current_day > 0 THEN u.id END) as quranActiveUsers,
        COUNT(DISTINCT CASE WHEN u.quran_completed_at IS NOT NULL THEN u.id END) as quranCompleted
      FROM users u
      LEFT JOIN generations g ON u.id = g.user_id
    `);

    const stats = result.rows[0];
    return {
      totalUsers: parseInt(stats.totalusers) || 0,
      totalGenerations: parseInt(stats.totalgenerations) || 0,
      activeToday: parseInt(stats.activetoday) || 0,
      bannedUsers: parseInt(stats.bannedusers) || 0,
      avgGenerationsPerUser: stats.avggenerationsperuser || 0,
      maxGenerations: parseInt(stats.maxgenerations) || 0,
      maxStreak: parseInt(stats.maxstreak) || 0,
      quranActiveUsers: parseInt(stats.quranactiveusers) || 0,
      quranCompleted: parseInt(stats.quarancompleted) || 0,
    };
  } finally {
    client.release();
  }
}

// --- QURAN FEATURES ---

export async function completeQuranPhase(userId: string, day: number, phase: number, pageStart: number, pageEnd: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert or update phase completion
    await client.query(`
      INSERT INTO quran_progress (user_id, day, phase, page_start, page_end, completed, completed_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW())
      ON CONFLICT (user_id, day, phase) DO UPDATE SET 
        completed = true,
        completed_at = NOW()
    `, [userId, day, phase, pageStart, pageEnd]);

    // Calculate new Quran progress
    const progressRes = await client.query(`
      SELECT COUNT(*) as phasesCompleted FROM quran_progress 
      WHERE user_id = $1 AND completed = true
    `, [userId]);
    const phasesCompleted = parseInt(progressRes.rows[0].phasescompleted) || 0;
    const pagesRead = phasesCompleted * 4; // 4 pages per phase

    // Update user Quran stats
    const userRes = await client.query(`
      UPDATE users SET 
        quran_current_day = $1,
        quran_current_phase = $2,
        quran_current_page = $3,
        quran_total_pages_read = $4,
        quran_last_read_date = NOW()
      WHERE id = $5
      RETURNING *
    `, [day, phase, pageEnd, pagesRead, userId]);

    await client.query('COMMIT');
    return { success: true, user: safeUser(userRes.rows[0]) };
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Complete Quran phase error:', e);
    return { success: false, error: 'Failed to complete phase' };
  } finally {
    client.release();
  }
}

export async function getQuranUserProgress(userId: string) {
  const client = await pool.connect();
  try {
    const userRes = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return { success: false, error: 'User not found' };
    }

    const user = userRes.rows[0];
    const progressRes = await client.query(`
      SELECT day, phase, page_start, page_end, completed, completed_at
      FROM quran_progress
      WHERE user_id = $1
      ORDER BY day, phase
    `, [userId]);

    return {
      success: true,
      user: safeUser(user),
      progress: progressRes.rows
    };
  } finally {
    client.release();
  }
}

export async function updateQuranStreak(userId: string) {
  const client = await pool.connect();
  try {
    const streakRes = await client.query(`
      WITH daily_progress AS (
        SELECT DISTINCT ON (completed_at::date) completed_at::date as read_date
        FROM quran_progress
        WHERE user_id = $1 AND completed = true
        ORDER BY completed_at::date DESC
      )
      SELECT COUNT(*) as streak FROM daily_progress
      WHERE read_date >= CURRENT_DATE - INTERVAL '30 days'
    `, [userId]);

    const streak = parseInt(streakRes.rows[0].streak) || 0;
    await client.query('UPDATE users SET quran_streak = $1 WHERE id = $2', [streak, userId]);
    return { success: true, streak };
  } finally {
    client.release();
  }
}