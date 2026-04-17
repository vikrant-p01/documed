import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, date_of_birth, gender, phone, address } = body;

    const id = crypto.randomUUID();
    
    await query(
      'INSERT INTO patients (id, user_id, date_of_birth, gender, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [id, user_id, date_of_birth, gender, phone, address]
    );

    await query(
      'UPDATE users SET patient_id = ? WHERE id = ?',
      [id, user_id]
    );

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    console.error('Database error:', error?.message);
    if (error?.message?.includes('not configured')) {
      return NextResponse.json({ 
        error: 'Database not configured. Please set environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME' 
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
