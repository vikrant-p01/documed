import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const userId = req.nextUrl.searchParams.get('userId');
    const search = req.nextUrl.searchParams.get('search');

    if (id) {
      const results = await query(
        `SELECT p.id, p.user_id, u.name, u.email, p.date_of_birth, p.gender, p.phone, p.address
         FROM patients p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`,
        [id]
      );
      return NextResponse.json(Array.isArray(results) && results.length > 0 ? results[0] : null);
    }

    if (userId) {
      const results = await query(
        `SELECT p.id, p.user_id, u.name, u.email, p.date_of_birth, p.gender, p.phone, p.address
         FROM patients p
         JOIN users u ON p.user_id = u.id
         WHERE p.user_id = ?`,
        [userId]
      );
      return NextResponse.json(Array.isArray(results) && results.length > 0 ? results[0] : null);
    }

    if (search) {
      const results = await query(
        `SELECT p.id, p.user_id, u.name, u.email, p.date_of_birth, p.gender, p.phone, p.address 
         FROM patients p
         JOIN users u ON p.user_id = u.id
         WHERE u.name LIKE ? OR u.email LIKE ?`,
        [`%${search}%`, `%${search}%`]
      );
      return NextResponse.json(results);
    }

    const results = await query(
      `SELECT p.id, p.user_id, u.name, u.email, p.date_of_birth, p.gender, p.phone, p.address 
       FROM patients p
       JOIN users u ON p.user_id = u.id`
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, date_of_birth, gender, phone, address } = body;

    await query(
      'INSERT INTO patients (id, user_id, date_of_birth, gender, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), user_id, date_of_birth, gender, phone, address]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
