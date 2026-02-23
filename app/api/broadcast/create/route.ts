import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { adminId, message, actionText, actionUrl, expiresAt } = await request.json();

    // If no adminId provided, try to find the first admin user
    let finalAdminId = adminId;
    
    if (!finalAdminId) {
      // Look for admin or super users
      const adminLookup = await pool.query(
        `SELECT id FROM users WHERE role = $1 OR role = $2 ORDER BY created_at ASC LIMIT 1`,
        ['admin', 'super']
      );
      
      if (adminLookup.rows && adminLookup.rows.length > 0) {
        finalAdminId = adminLookup.rows[0].id;
      }
    }

    if (!finalAdminId) {
      return NextResponse.json(
        { success: false, error: 'No admin user found in database. Please ensure at least one admin user exists.' },
        { status: 400 }
      );
    }

    // Verify the user exists and has proper role
    const adminCheck = await pool.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [finalAdminId]
    );

    if (!adminCheck.rows || adminCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found. Please verify the user exists.' },
        { status: 403 }
      );
    }

    const adminRole = adminCheck.rows[0].role;
    if (adminRole !== 'admin' && adminRole !== 'super') {
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
      finalAdminId,
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
