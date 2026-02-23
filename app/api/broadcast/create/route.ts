import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { message, actionText, actionUrl } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use a default admin ID for broadcasts (can be updated later)
    const adminId = 'admin-broadcast-system';

    // Create the broadcast message
    const result = await pool.query(`
      INSERT INTO broadcast_messages 
      (title, message, action_label, action_link, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, message, action_label, action_link, status, created_at, updated_at
    `, [
      message.trim(),
      message.trim(),
      actionText || 'Learn More',
      actionUrl || null,
      'active',
      adminId
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
