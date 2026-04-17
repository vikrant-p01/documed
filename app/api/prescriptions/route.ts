import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get('patientId');

    if (patientId) {
      const results = await query(
        `SELECT p.id, p.patient_id, p.doctor_id, p.medication, p.dosage, p.frequency, p.duration, p.date,
                u.name as doctor_name
         FROM prescriptions p
         JOIN users u ON p.doctor_id = u.id
         WHERE p.patient_id = ?
         ORDER BY p.date DESC`,
        [patientId]
      );
      return NextResponse.json(results);
    }

    const results = await query(
      `SELECT p.id, p.patient_id, p.doctor_id, p.medication, p.dosage, p.frequency, p.duration, p.date,
              u.name as doctor_name
       FROM prescriptions p
       JOIN users u ON p.doctor_id = u.id
       ORDER BY p.date DESC`
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
    const { patient_id, doctor_id, medication, dosage, frequency, duration, date } = body;
    const prescriptionId = crypto.randomUUID();

    await query(
      'INSERT INTO prescriptions (id, patient_id, doctor_id, medication, dosage, frequency, duration, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [prescriptionId, patient_id, doctor_id, medication, dosage, frequency, duration, date]
    );

    const patientResults = await query(
      `SELECT u.name
       FROM patients p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [patient_id]
    );

    const pharmacyResults = await query(
      `SELECT id
       FROM users
       WHERE role = 'pharmacy'
       ORDER BY created_at ASC
       LIMIT 1`
    );

    const patientName = Array.isArray(patientResults) && patientResults.length > 0
      ? patientResults[0].name
      : 'Unknown Patient';
    const pharmacyId = Array.isArray(pharmacyResults) && pharmacyResults.length > 0
      ? pharmacyResults[0].id
      : null;

    if (pharmacyId) {
      await query(
        `INSERT INTO pharmacy_records
         (id, prescription_id, patient_id, pharmacy_id, medication, patient_name, quantity, dispensed)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), prescriptionId, patient_id, pharmacyId, medication, patientName, null, false]
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
