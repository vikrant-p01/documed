import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    
    if (email) {
      const results = await query('SELECT id, email, name, role, doctor_id, patient_id FROM users WHERE email = ?', [email]);
      if (Array.isArray(results) && results.length > 0) {
        return NextResponse.json(results[0]);
      }
      return NextResponse.json(null, { status: 404 });
    }

    const results = await query('SELECT id, email, name, role, doctor_id, patient_id FROM users');
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Database error:', error?.message);
    if (error?.message?.includes('not configured')) {
      return NextResponse.json({ 
        error: 'Database not configured. Please set environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME' 
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password_hash, name, role, doctor_id, patient_id } = body;

    await query(
      'INSERT INTO users (id, email, password_hash, name, role, doctor_id, patient_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), email, password_hash, name, role, doctor_id || null, patient_id || null]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Database error:', error?.message);
    if (error?.message?.includes('not configured')) {
      return NextResponse.json({ 
        error: 'Database not configured. Please set environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME' 
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
