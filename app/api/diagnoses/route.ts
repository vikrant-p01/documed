import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get('patientId');

    if (patientId) {
      const results = await query(
        `SELECT d.id, d.patient_id, d.doctor_id, d.diagnosis, d.description, d.severity, d.date,
                u.name as doctor_name
         FROM diagnoses d
         JOIN users u ON d.doctor_id = u.id
         WHERE d.patient_id = ?
         ORDER BY d.date DESC`,
        [patientId]
      );
      return NextResponse.json(results);
    }

    const results = await query(
      `SELECT d.id, d.patient_id, d.doctor_id, d.diagnosis, d.description, d.severity, d.date,
              u.name as doctor_name
       FROM diagnoses d
       JOIN users u ON d.doctor_id = u.id
       ORDER BY d.date DESC`
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
    const { patient_id, doctor_id, diagnosis, description, severity, date } = body;

    await query(
      'INSERT INTO diagnoses (id, patient_id, doctor_id, diagnosis, description, severity, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), patient_id, doctor_id, diagnosis, description, severity, date]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
