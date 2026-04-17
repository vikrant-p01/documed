-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('doctor', 'patient', 'laboratory', 'pharmacy') NOT NULL,
  doctor_id VARCHAR(36),
  patient_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Create Patients table
CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  diagnosis VARCHAR(255) NOT NULL,
  description TEXT,
  severity ENUM('mild', 'moderate', 'severe') NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_date (date)
);

-- Create Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  medication VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_date (date)
);

-- Create Lab Reports table
CREATE TABLE IF NOT EXISTS lab_reports (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  lab_id VARCHAR(36) NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  test_type VARCHAR(100),
  result TEXT,
  normal_range VARCHAR(100),
  date DATE NOT NULL,
  file_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (lab_id) REFERENCES users(id),
  INDEX idx_patient (patient_id),
  INDEX idx_lab (lab_id),
  INDEX idx_date (date)
);

-- Create Lab Appointments table
CREATE TABLE IF NOT EXISTS lab_appointments (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  lab_id VARCHAR(36),
  test_name VARCHAR(255) NOT NULL,
  instructions TEXT,
  appointment_date DATE NOT NULL,
  status ENUM('scheduled', 'completed') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  FOREIGN KEY (lab_id) REFERENCES users(id),
  INDEX idx_patient (patient_id),
  INDEX idx_status (status),
  INDEX idx_appointment_date (appointment_date)
);

-- Create Pharmacy Records table
CREATE TABLE IF NOT EXISTS pharmacy_records (
  id VARCHAR(36) PRIMARY KEY,
  prescription_id VARCHAR(36) NOT NULL,
  patient_id VARCHAR(36) NOT NULL,
  pharmacy_id VARCHAR(36) NOT NULL,
  medication VARCHAR(255) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  quantity INT,
  dispensed BOOLEAN DEFAULT FALSE,
  dispensed_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (pharmacy_id) REFERENCES users(id),
  INDEX idx_patient (patient_id),
  INDEX idx_pharmacy (pharmacy_id),
  INDEX idx_dispensed (dispensed)
);

-- Create Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  license_number VARCHAR(100),
  specialization VARCHAR(255),
  phone VARCHAR(20),
  clinic_name VARCHAR(255),
  address TEXT,
  years_of_experience INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Laboratory Staff table
CREATE TABLE IF NOT EXISTS laboratory_staff (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  lab_name VARCHAR(255),
  license_number VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  specialization VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Pharmacy Staff table
CREATE TABLE IF NOT EXISTS pharmacy_staff (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  pharmacy_name VARCHAR(255),
  license_number VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  registration_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Audit Log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(36) NOT NULL,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user (user_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_action (action)
);

-- Insert demo users
INSERT INTO users (id, email, password_hash, name, role, doctor_id) VALUES
('D001', 'sam@documed.com', '$2b$10$demo', 'Dr. Sam Wilson', 'doctor', 'D001'),
('D002', 'sarah@documed.com', '$2b$10$demo', 'Dr. Sarah Johnson', 'doctor', 'D002'),
('P001', 'john@documed.com', '$2b$10$demo', 'John Doe', 'patient', NULL),
('P002', 'jane@documed.com', '$2b$10$demo', 'Jane Smith', 'patient', NULL),
('LAB001', 'lab@documed.com', '$2b$10$demo', 'Dr. Alex Lab', 'laboratory', NULL),
('PHARM001', 'pharmacy@documed.com', '$2b$10$demo', 'Maria Pharmacist', 'pharmacy', NULL);

-- Insert demo patients
INSERT INTO patients (id, user_id, date_of_birth, gender, phone, address) VALUES
('P001', 'P001', '1990-05-15', 'male', '555-0101', '123 Main St'),
('P002', 'P002', '1985-08-22', 'female', '555-0102', '456 Oak Ave');

-- Insert demo diagnoses
INSERT INTO diagnoses (id, patient_id, doctor_id, diagnosis, description, severity, date) VALUES
('DG001', 'P001', 'D001', 'Hypertension', 'High blood pressure readings', 'moderate', '2024-01-15'),
('DG002', 'P001', 'D001', 'Type 2 Diabetes', 'Fasting glucose elevated', 'moderate', '2024-02-01'),
('DG003', 'P002', 'D002', 'Migraine', 'Chronic headaches', 'mild', '2024-01-20');

-- Insert demo prescriptions
INSERT INTO prescriptions (id, patient_id, doctor_id, medication, dosage, frequency, duration, date) VALUES
('RX001', 'P001', 'D001', 'Lisinopril', '10mg', 'Once daily', '30 days', '2024-01-15'),
('RX002', 'P001', 'D001', 'Metformin', '500mg', 'Twice daily', '30 days', '2024-02-01'),
('RX003', 'P002', 'D002', 'Ibuprofen', '400mg', 'As needed', '14 days', '2024-01-20');

-- Insert demo lab reports
INSERT INTO lab_reports (id, patient_id, lab_id, test_name, test_type, result, normal_range, date) VALUES
('LAB001', 'P001', 'LAB001', 'Blood Glucose Test', 'Blood Test', '145 mg/dL', '70-100 mg/dL', '2024-02-05'),
('LAB002', 'P001', 'LAB001', 'Lipid Panel', 'Blood Test', 'High cholesterol', 'Normal', '2024-02-05'),
('LAB003', 'P002', 'LAB001', 'Complete Blood Count', 'Blood Test', 'Normal', 'Normal', '2024-01-25');

-- Insert demo pharmacy records
INSERT INTO pharmacy_records (id, prescription_id, patient_id, pharmacy_id, medication, patient_name, quantity, dispensed, dispensed_date) VALUES
('PH001', 'RX001', 'P001', 'PHARM001', 'Lisinopril', 'John Doe', 30, TRUE, '2024-01-16 10:30:00'),
('PH002', 'RX002', 'P001', 'PHARM001', 'Metformin', 'John Doe', 60, TRUE, '2024-02-02 11:00:00'),
('PH003', 'RX003', 'P002', 'PHARM001', 'Ibuprofen', 'Jane Smith', 14, FALSE, NULL);
