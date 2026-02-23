import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all active broadcast messages
    const result = await pool.query(`
      SELECT 
        id,
        title,
        message,
        action_label,
        action_link,
        status,
        created_at,
        updated_at
      FROM broadcast_messages
      WHERE status = 'active'
      ORDER BY created_at DESC
    `);

    const messages = result.rows || [];

    return NextResponse.json({ 
      success: true, 
      messages 
    });
  } catch (error) {
    console.error('Failed to fetch active broadcast messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
