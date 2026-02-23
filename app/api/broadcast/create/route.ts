import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { message, actionText, actionUrl, expiresAt } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create the broadcast message directly without admin lookup or validation
    const result = await pool.query(`
      INSERT INTO broadcast_messages 
      (message, action_text, action_url, status, is_paused, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, message, action_text, action_url, status, created_at, updated_at, expires_at
    `, [
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
