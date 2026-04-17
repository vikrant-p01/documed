import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get('patientId');

    if (patientId) {
      const results = await query(
        `SELECT l.id, l.patient_id, l.lab_id, l.test_name, l.test_type, l.result, l.normal_range, l.date, l.file_path,
                u.name as lab_name
         FROM lab_reports l
         JOIN users u ON l.lab_id = u.id
         WHERE l.patient_id = ?
         ORDER BY l.date DESC`,
        [patientId]
      );
      return NextResponse.json(results);
    }

    const results = await query(
      `SELECT l.id, l.patient_id, l.lab_id, l.test_name, l.test_type, l.result, l.normal_range, l.date, l.file_path,
              u.name as lab_name
       FROM lab_reports l
       JOIN users u ON l.lab_id = u.id
       ORDER BY l.date DESC`
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
    const { patient_id, lab_id, test_name, test_type, result, normal_range, date, file_path } = body;

    await query(
      'INSERT INTO lab_reports (id, patient_id, lab_id, test_name, test_type, result, normal_range, date, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), patient_id, lab_id, test_name, test_type, result, normal_range, date, file_path]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
