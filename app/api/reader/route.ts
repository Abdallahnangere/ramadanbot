import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET /api/reader/state - Retrieve saved reader state for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      SELECT current_page, current_day, current_phase, last_read_at
      FROM reader_state
      WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          currentPage: 1,
          currentDay: 1,
          currentPhase: 1,
          lastReadAt: null,
        }
      );
    }

    const row = result.rows[0];
    return NextResponse.json({
      currentPage: row.current_page,
      currentDay: row.current_day,
      currentPhase: row.current_phase,
      lastReadAt: row.last_read_at,
    });
  } catch (error) {
    console.error('Failed to fetch reader state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reader state' },
      { status: 500 }
    );
  }
}

// POST /api/reader/state - Save reader state for user
export async function POST(request: NextRequest) {
  try {
    const { userId, currentPage, currentDay, currentPhase } = await request.json();

    if (!userId || currentPage === undefined || currentDay === undefined || currentPhase === undefined) {
      return NextResponse.json(
        { error: 'userId, currentPage, currentDay, and currentPhase are required' },
        { status: 400 }
      );
    }

    // Validate ranges
    if (currentPage < 1 || currentPage > 604 ||
        currentDay < 1 || currentDay > 29 ||
        currentPhase < 1 || currentPhase > 5) {
      return NextResponse.json(
        { error: 'Invalid page, day, or phase values' },
        { status: 400 }
      );
    }

    // Upsert reader state
    const result = await pool.query(`
      INSERT INTO reader_state (user_id, current_page, current_day, current_phase, last_read_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET current_page = $2, current_day = $3, current_phase = $4, last_read_at = NOW(), updated_at = NOW()
      RETURNING current_page, current_day, current_phase, last_read_at
    `, [userId, currentPage, currentDay, currentPhase]);

    return NextResponse.json({
      success: true,
      currentPage: result.rows[0].current_page,
      currentDay: result.rows[0].current_day,
      currentPhase: result.rows[0].current_phase,
      lastReadAt: result.rows[0].last_read_at,
    });
  } catch (error) {
    console.error('Failed to save reader state:', error);
    return NextResponse.json(
      { error: 'Failed to save reader state' },
      { status: 500 }
    );
  }
}
