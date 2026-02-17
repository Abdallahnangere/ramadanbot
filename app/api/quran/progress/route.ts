import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// Mark this route as dynamic to allow query parameters
export const dynamic = 'force-dynamic';

/**
 * GET /api/quran/progress?userId=...
 * Retrieve user's gamified Qur'ān progress and completed phases
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get current progress
    const progressResult = await pool.query(
      `SELECT current_day, current_phase, last_read_at FROM quran_progress_gamified WHERE user_id = $1`,
      [userId]
    );

    // Get all completed phases
    const completedResult = await pool.query(
      `SELECT day, phase, completed_at FROM quran_completed_phases_gamified WHERE user_id = $1 ORDER BY day, phase`,
      [userId]
    );

    const progress = progressResult.rows[0] || {
      current_day: 1,
      current_phase: 1,
      last_read_at: null,
    };

    const completedPhases = completedResult.rows.map(row => ({
      day: row.day,
      phase: row.phase,
      completedAt: row.completed_at,
    }));

    // Calculate total phases completed
    const totalCompletedPhases = completedPhases.length;
    const totalPhases = 145; // 29 days × 5 phases = 145
    const completionPercentage = Math.round((totalCompletedPhases / totalPhases) * 100);

    return NextResponse.json({
      success: true,
      currentDay: progress.current_day,
      currentPhase: progress.current_phase,
      lastReadAt: progress.last_read_at,
      completedPhases,
      totalCompletedPhases,
      totalPhases,
      completionPercentage,
    });
  } catch (error) {
    console.error('Failed to fetch Qur\'ān progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
