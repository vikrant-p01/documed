// Record immutability and audit trail system
export interface AuditEntry {
  id: string;
  action: 'created' | 'viewed' | 'dispensed' | 'uploaded';
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'doctor' | 'patient' | 'laboratory' | 'pharmacy';
  details?: string;
}

export interface ImmutableRecord {
  id: string;
  createdAt: string;
  createdBy: string;
  createdByRole: 'doctor' | 'laboratory' | 'pharmacy';
  locked: true; // Always true - records are immutable
  auditTrail: AuditEntry[];
}

// Diagnosis record is immutable once created by a doctor
export interface ImmutableDiagnosis extends ImmutableRecord {
  patientId: string;
  diagnosis: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  doctorName: string;
}

// Prescription is immutable once created by a doctor
export interface ImmutablePrescription extends ImmutableRecord {
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctorName: string;
}

// Lab report is immutable once uploaded
export interface ImmutableLabReport extends ImmutableRecord {
  patientId: string;
  testName: string;
  result: string;
  fileName: string;
  labName: string;
}

// Create audit entry
export function createAuditEntry(
  action: AuditEntry['action'],
  userId: string,
  userName: string,
  userRole: AuditEntry['userRole'],
  details?: string
): AuditEntry {
  return {
    id: `audit-${Date.now()}-${Math.random()}`,
    action,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    userRole,
    details,
  };
}

// Convert diagnosis to immutable record
export function createImmutableDiagnosis(
  diagnosis: any,
  doctorId: string,
  doctorName: string
): ImmutableDiagnosis {
  const now = new Date().toISOString();
  return {
    ...diagnosis,
    locked: true,
    createdAt: diagnosis.date || now,
    createdBy: doctorId,
    createdByRole: 'doctor',
    auditTrail: [
      createAuditEntry('created', doctorId, doctorName, 'doctor', 'Diagnosis created'),
    ],
  };
}

// Convert prescription to immutable record
export function createImmutablePrescription(
  prescription: any,
  doctorId: string,
  doctorName: string
): ImmutablePrescription {
  const now = new Date().toISOString();
  return {
    ...prescription,
    locked: true,
    createdAt: prescription.date || now,
    createdBy: doctorId,
    createdByRole: 'doctor',
    auditTrail: [
      createAuditEntry('created', doctorId, doctorName, 'doctor', 'Prescription issued'),
    ],
  };
}

// Convert lab report to immutable record
export function createImmutableLabReport(
  report: any,
  labId: string,
  labName: string
): ImmutableLabReport {
  const now = new Date().toISOString();
  return {
    ...report,
    locked: true,
    createdAt: report.date || now,
    createdBy: labId,
    createdByRole: 'laboratory',
    auditTrail: [
      createAuditEntry('created', labId, labName, 'laboratory', 'Lab report uploaded'),
    ],
  };
}

// Add view audit entry to record
export function addViewAudit(
  record: ImmutableRecord,
  userId: string,
  userName: string,
  userRole: AuditEntry['userRole']
): ImmutableRecord {
  return {
    ...record,
    auditTrail: [
      ...record.auditTrail,
      createAuditEntry('viewed', userId, userName, userRole, `Record viewed by ${userRole}`),
    ],
  };
}

// Verify record is immutable
export function isRecordLocked(record: ImmutableRecord): boolean {
  return record.locked === true;
}

// Get record creation info
export function getRecordMetadata(record: ImmutableRecord) {
  return {
    createdAt: record.createdAt,
    createdBy: record.createdBy,
    createdByRole: record.createdByRole,
    locked: record.locked,
    auditTrailCount: record.auditTrail.length,
  };
}
