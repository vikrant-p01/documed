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
