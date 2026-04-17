import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get('patientId');
    const status = req.nextUrl.searchParams.get('status');

    let sql = `
      SELECT la.id, la.patient_id, la.doctor_id, la.lab_id, la.test_name, la.instructions,
             la.appointment_date, la.status, la.created_at,
             patient_user.name AS patient_name, doctor_user.name AS doctor_name
      FROM lab_appointments la
      JOIN patients p ON la.patient_id = p.id
      JOIN users patient_user ON p.user_id = patient_user.id
      JOIN users doctor_user ON la.doctor_id = doctor_user.id
    `;
    const params: any[] = [];
    const whereClauses: string[] = [];

    if (patientId) {
      whereClauses.push('la.patient_id = ?');
      params.push(patientId);
    }

    if (status && status !== 'all') {
      whereClauses.push('la.status = ?');
      params.push(status);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    sql += ' ORDER BY la.appointment_date ASC, la.created_at DESC';

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
    const { patient_id, doctor_id, test_name, instructions, appointment_date } = body;

    const labResults = await query(
      `SELECT id
       FROM users
       WHERE role = 'laboratory'
       ORDER BY created_at ASC
       LIMIT 1`
    );

    const labId = Array.isArray(labResults) && labResults.length > 0 ? labResults[0].id : null;

    await query(
      `INSERT INTO lab_appointments
       (id, patient_id, doctor_id, lab_id, test_name, instructions, appointment_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), patient_id, doctor_id, labId, test_name, instructions || null, appointment_date, 'scheduled']
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
    const { id, status } = body;

    await query(
      'UPDATE lab_appointments SET status = ? WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
