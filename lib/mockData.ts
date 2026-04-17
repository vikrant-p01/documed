export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
}

export interface DiagnosisRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  doctorName: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  date: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctorName: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  date: string;
  testName: string;
  result: string;
  fileName: string;
}

export interface PharmacyRecord {
  id: string;
  prescriptionId: string;
  patientName: string;
  medication: string;
  dispensed: boolean;
  dispensedDate?: string;
  pharmacistName: string;
}

// Mock patients
export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'John Doe',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
  },
  {
    id: 'P002',
    name: 'Jane Smith',
    dateOfBirth: '1990-07-22',
    gender: 'Female',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 234-5678',
  },
  {
    id: 'P003',
    name: 'Robert Johnson',
    dateOfBirth: '1975-11-08',
    gender: 'Male',
    email: 'robert.johnson@email.com',
    phone: '+1 (555) 345-6789',
  },
];

// Mock diagnosis records
export const mockDiagnosis: DiagnosisRecord[] = [
  {
    id: 'D001',
    patientId: 'P001',
    date: '2024-01-20',
    diagnosis: 'Hypertension',
    description: 'Stage 2 hypertension. Patient advised to maintain low-sodium diet and exercise daily.',
    severity: 'moderate',
    doctorName: 'Dr. Sarah Martinez',
  },
  {
    id: 'D002',
    patientId: 'P001',
    date: '2024-01-10',
    diagnosis: 'Type 2 Diabetes',
    description: 'Newly diagnosed. Baseline HbA1c at 7.8%. Lifestyle modifications recommended.',
    severity: 'moderate',
    doctorName: 'Dr. James Wilson',
  },
  {
    id: 'D003',
    patientId: 'P002',
    date: '2024-01-15',
    diagnosis: 'Acute Sinusitis',
    description: 'Upper respiratory infection with sinus inflammation. Course of antibiotics prescribed.',
    severity: 'mild',
    doctorName: 'Dr. Sarah Martinez',
  },
  {
    id: 'D004',
    patientId: 'P003',
    date: '2024-01-18',
    diagnosis: 'Chronic Back Pain',
    description: 'Lower back pain from degenerative disc disease. Physical therapy recommended.',
    severity: 'moderate',
    doctorName: 'Dr. James Wilson',
  },
];

// Mock prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: 'Rx001',
    patientId: 'P001',
    date: '2024-01-20',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: '30 days',
    doctorName: 'Dr. Sarah Martinez',
  },
  {
    id: 'Rx002',
    patientId: 'P001',
    date: '2024-01-10',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '90 days',
    doctorName: 'Dr. James Wilson',
  },
  {
    id: 'Rx003',
    patientId: 'P002',
    date: '2024-01-15',
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    doctorName: 'Dr. Sarah Martinez',
  },
  {
    id: 'Rx004',
    patientId: 'P003',
    date: '2024-01-18',
    medication: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'As needed',
    duration: '14 days',
    doctorName: 'Dr. James Wilson',
  },
];

// Mock lab reports
export const mockLabReports: LabReport[] = [
  {
    id: 'L001',
    patientId: 'P001',
    date: '2024-01-20',
    testName: 'Complete Blood Count (CBC)',
    result: 'Normal range',
    fileName: 'CBC_Report_P001.pdf',
  },
  {
    id: 'L002',
    patientId: 'P001',
    date: '2024-01-15',
    testName: 'Fasting Glucose',
    result: '145 mg/dL (Elevated)',
    fileName: 'FG_Report_P001.pdf',
  },
  {
    id: 'L003',
    patientId: 'P002',
    date: '2024-01-18',
    testName: 'Thyroid Function Test (TSH)',
    result: '2.1 mIU/L (Normal)',
    fileName: 'TSH_Report_P002.pdf',
  },
];

// Mock pharmacy records
export const mockPharmacy: PharmacyRecord[] = [
  {
    id: 'Ph001',
    prescriptionId: 'Rx001',
    patientName: 'John Doe',
    medication: 'Lisinopril 10mg',
    dispensed: true,
    dispensedDate: '2024-01-21',
    pharmacistName: 'Mike Thompson',
  },
  {
    id: 'Ph002',
    prescriptionId: 'Rx002',
    patientName: 'John Doe',
    medication: 'Metformin 500mg',
    dispensed: true,
    dispensedDate: '2024-01-11',
    pharmacistName: 'Emma Davis',
  },
  {
    id: 'Ph003',
    prescriptionId: 'Rx003',
    patientName: 'Jane Smith',
    medication: 'Amoxicillin 500mg',
    dispensed: false,
    pharmacistName: 'Mike Thompson',
  },
  {
    id: 'Ph004',
    prescriptionId: 'Rx004',
    patientName: 'Robert Johnson',
    medication: 'Ibuprofen 400mg',
    dispensed: false,
    pharmacistName: 'Emma Davis',
  },
];
