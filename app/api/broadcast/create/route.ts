import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { adminId, message, actionText, actionUrl, expiresAt } = await request.json();

    // Validate admin (check if user is admin)
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Check if user is admin
    const adminCheck = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [adminId]
    );

    if (!adminCheck.rows || adminCheck.rows[0]?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create the broadcast message
    const result = await pool.query(`
      INSERT INTO broadcast_messages 
      (admin_id, message, action_text, action_url, status, is_paused, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, admin_id, message, action_text, action_url, status, created_at, updated_at, expires_at
    `, [
      adminId,
      message.trim(),
      actionText || null,
      actionUrl || null,
      'active',
      false,
      expiresAt || null
    ]);

    if (!result.rows || result.rows.length === 0) {
      throw new Error('Failed to create broadcast message');
    }

    return NextResponse.json({
      success: true,
      message: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to create broadcast message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
