import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET all user limits
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT id, name, role, rate_limit_override as custom_limit, created_at
      FROM users
      WHERE rate_limit_override IS NOT NULL
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      limits: result.rows
    });
  } catch (error) {
    console.error('Failed to fetch limits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch limits' },
      { status: 500 }
    );
  }
}

// POST - Create/Set a limit for a user
export async function POST(request: NextRequest) {
  try {
    const { userId, limit } = await request.json();

    if (!userId || typeof limit !== 'number' || limit < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid userId or limit' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      UPDATE users SET rate_limit_override = $1 WHERE id = $2
      RETURNING id, name, role, rate_limit_override as custom_limit
    `, [limit, userId]);

    if (!result.rows.length) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Limit updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to set limit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set limit' },
      { status: 500 }
    );
  }
}

// DELETE - Remove/reset a limit for a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      UPDATE users SET rate_limit_override = NULL WHERE id = $1
      RETURNING id, name, role, rate_limit_override as custom_limit
    `, [userId]);

    if (!result.rows.length) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Limit removed (reset to default)',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to remove limit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove limit' },
      { status: 500 }
    );
  }
}
