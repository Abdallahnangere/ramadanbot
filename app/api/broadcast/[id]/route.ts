import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminId, message, actionText, actionUrl, status, expiresAt } = await request.json();
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

    // Verify message exists and is owned by this admin
    const messageCheck = await pool.query(
      'SELECT id FROM broadcast_messages WHERE id = $1 AND admin_id = $2',
      [messageId, adminId]
    );

    if (!messageCheck.rows || messageCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update the message
    const result = await pool.query(`
        UPDATE broadcast_messages
        SET 
          message = COALESCE($2, message),
          action_text = COALESCE($3, action_text),
          action_url = COALESCE($4, action_url),
          status = COALESCE($5, status),
          expires_at = COALESCE($6, expires_at),
          updated_at = NOW()
        WHERE id = $1
        RETURNING id, admin_id, message, action_text, action_url, status, created_at, updated_at, expires_at
      `,
      [
        messageId,
        message || null,
        actionText || null,
        actionUrl || null,
        status || null,
        expiresAt || null
      ]
    );

    if (!result.rows || result.rows.length === 0) {
      throw new Error('Failed to update message');
    }

    return NextResponse.json({
      success: true,
      message: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to update broadcast message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Delete the message
    const result = await pool.query(`
      UPDATE broadcast_messages
      SET status = 'deleted', updated_at = NOW()
      WHERE id = $1 AND admin_id = $2
      RETURNING id
    `,
    [messageId, adminId]
    );

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete broadcast message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
