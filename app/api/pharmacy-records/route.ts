import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get('patientId');
    const status = req.nextUrl.searchParams.get('status');

    let sql = `SELECT p.id, p.prescription_id, p.patient_id, p.pharmacy_id, p.medication, p.patient_name, 
                      p.quantity, p.dispensed, p.dispensed_date
               FROM pharmacy_records p`;
    const params: any[] = [];

    if (patientId) {
      sql += ' WHERE p.patient_id = ?';
      params.push(patientId);

      if (status === 'pending') {
        sql += ' AND p.dispensed = FALSE';
      } else if (status === 'dispensed') {
        sql += ' AND p.dispensed = TRUE';
      }
    } else if (status && status !== 'all') {
      if (status === 'pending') {
        sql += ' WHERE p.dispensed = FALSE';
      } else if (status === 'dispensed') {
        sql += ' WHERE p.dispensed = TRUE';
      }
    }

    sql += ' ORDER BY p.created_at DESC';

    const results = await query(sql, params);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prescription_id, patient_id, pharmacy_id, medication, patient_name, quantity } = body;

    await query(
      'INSERT INTO pharmacy_records (id, prescription_id, patient_id, pharmacy_id, medication, patient_name, quantity, dispensed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), prescription_id, patient_id, pharmacy_id, medication, patient_name, quantity, false]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, dispensed } = body;

    await query(
      'UPDATE pharmacy_records SET dispensed = ?, dispensed_date = ? WHERE id = ?',
      [dispensed, dispensed ? new Date().toISOString() : null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
