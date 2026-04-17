// Client-side fetch utilities for database operations

export async function fetchPatient(id?: string, userId?: string) {
  const params = new URLSearchParams();
  if (id) params.set('id', id);
  if (userId) params.set('userId', userId);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`/api/patients${query}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchUser(email: string) {
  const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPatients(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`/api/patients${query}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDiagnoses(patientId?: string) {
  const query = patientId ? `?patientId=${patientId}` : '';
  const res = await fetch(`/api/diagnoses${query}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createDiagnosis(data: any) {
  const res = await fetch('/api/diagnoses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create diagnosis');
  return res.json();
}

export async function fetchPrescriptions(patientId?: string) {
  const query = patientId ? `?patientId=${patientId}` : '';
  const res = await fetch(`/api/prescriptions${query}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createPrescription(data: any) {
  const res = await fetch('/api/prescriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create prescription');
  return res.json();
}

export async function fetchLabReports(patientId?: string) {
  const query = patientId ? `?patientId=${patientId}` : '';
  const res = await fetch(`/api/lab-reports${query}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createLabReport(data: any) {
  const res = await fetch('/api/lab-reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create lab report');
  return res.json();
}

export async function fetchLabAppointments(patientId?: string, status?: string) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (status) params.set('status', status);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`/api/lab-appointments${query}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createLabAppointment(data: any) {
  const res = await fetch('/api/lab-appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create lab appointment');
  return res.json();
}

export async function updateLabAppointment(id: string, status: 'scheduled' | 'completed') {
  const res = await fetch('/api/lab-appointments', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) throw new Error('Failed to update lab appointment');
  return res.json();
}

export async function fetchPharmacyRecords(patientId?: string, status?: string) {
  let query = '';
  if (patientId) query += `?patientId=${patientId}`;
  if (status) query += `${query ? '&' : '?'}status=${status}`;
  const res = await fetch(`/api/pharmacy-records${query}`);
  if (!res.ok) return [];
  return res.json();
}

export async function updatePharmacyRecord(id: string, dispensed: boolean) {
  const res = await fetch('/api/pharmacy-records', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, dispensed }),
  });
  if (!res.ok) throw new Error('Failed to update pharmacy record');
  return res.json();
}
