import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const messageId = params.id;

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

    // Pause the message
    const result = await pool.query(`
      UPDATE broadcast_messages
      SET is_paused = TRUE, paused_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND admin_id = $2
      RETURNING id, is_paused, paused_at
    `,
    [messageId, adminId]
    );

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to pause broadcast message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to pause message' },
      { status: 500 }
    );
  }
}
