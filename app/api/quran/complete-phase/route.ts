import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * POST /api/quran/complete-phase
 * Mark a phase as completed and update progress
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, day, phase } = await request.json();

    if (!userId || day === undefined || phase === undefined) {
      return NextResponse.json(
        { error: 'userId, day, and phase are required' },
        { status: 400 }
      );
    }

    // Validate ranges
    if (day < 1 || day > 29 || phase < 1 || phase > 5) {
      return NextResponse.json(
        { error: 'Invalid day or phase values' },
        { status: 400 }
      );
    }

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Mark phase as completed
      await client.query(
        `INSERT INTO quran_completed_phases_gamified (user_id, day, phase, completed_at, created_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (user_id, day, phase) DO NOTHING`,
        [userId, day, phase]
      );

      // Update current progress (move to next phase or day)
      let nextDay = day;
      let nextPhase = phase + 1;

      if (nextPhase > 5) {
        nextPhase = 1;
        nextDay = day + 1;

        // If completed all 29 days, keep at day 29, phase 5
        if (nextDay > 29) {
          nextDay = 29;
          nextPhase = 5;
        }
      }

      // Upsert progress
      await client.query(
        `INSERT INTO quran_progress_gamified (user_id, current_day, current_phase, last_read_at, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW(), NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET current_day = $2, current_phase = $3, last_read_at = NOW(), updated_at = NOW()`,
        [userId, nextDay, nextPhase]
      );

      await client.query('COMMIT');

      // Get updated stats
      const completedResult = await pool.query(
        `SELECT COUNT(*) as count FROM quran_completed_phases_gamified WHERE user_id = $1`,
        [userId]
      );

      const totalCompleted = parseInt(completedResult.rows[0].count || 0);
      const totalPhases = 145;
      const completionPercentage = Math.round((totalCompleted / totalPhases) * 100);

      return NextResponse.json({
        success: true,
        message: `Phase ${phase} of Day ${day} completed!`,
        nextDay,
        nextPhase,
        totalCompletedPhases: totalCompleted,
        completionPercentage,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to complete phase:', error);
    return NextResponse.json(
      { error: 'Failed to complete phase' },
      { status: 500 }
    );
  }
}
