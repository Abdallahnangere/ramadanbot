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

    // Use a default admin ID for broadcasts
    const adminId = null; // Will be nullable based on schema

    // Create the broadcast message using correct columns from COMPREHENSIVE_MIGRATION_V3.0.sql
    const result = await pool.query(`
      INSERT INTO broadcast_messages 
      (admin_id, message, action_text, action_url, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, message, action_text, action_url, status, created_at, updated_at
    `, [
      adminId,
      message.trim(),
      actionText || 'Learn More',
      actionUrl || null,
      'active'
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
