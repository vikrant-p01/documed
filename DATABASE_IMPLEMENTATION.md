# DocuMed MySQL Database Implementation Guide

## Overview
DocuMed now integrates with MySQL for persistent data storage. All user data, medical records, prescriptions, lab reports, and pharmacy records are stored in the database.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MySQL Environment Variables
Create or update your `.env.local` file with:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=documed
```

### 3. Create the Database
```bash
mysql -u root -p
CREATE DATABASE documed;
exit
```

### 4. Initialize Schema
```bash
mysql -u root -p documed < scripts/init-db.sql
```

### 5. Start the Application
```bash
npm run dev
```

## Database Architecture

### Core Tables

**users**
- Stores authentication credentials and user roles
- Fields: id, email, password_hash, name, role, doctor_id, patient_id

**patients**
- Patient demographics and contact information
- Linked to users table via user_id
- Fields: id, user_id, date_of_birth, gender, phone, address

**diagnoses**
- Medical diagnoses recorded by doctors (immutable records)
- Linked to patients and doctors
- Fields: id, patient_id, doctor_id, diagnosis, description, severity, date

**prescriptions**
- Medications prescribed by doctors (immutable records)
- Linked to patients and doctors
- Fields: id, patient_id, doctor_id, medication, dosage, frequency, duration, date

**lab_reports**
- Laboratory test results uploaded by lab staff
- Linked to patients and laboratory users
- Fields: id, patient_id, lab_id, test_name, test_type, result, normal_range, date, file_path

**pharmacy_records**
- Prescription fulfillment tracking
- Linked to prescriptions, patients, and pharmacy users
- Fields: id, prescription_id, patient_id, pharmacy_id, medication, patient_name, quantity, dispensed, dispensed_date

**audit_logs**
- Compliance tracking for all significant actions
- Fields: id, user_id, action, entity_type, entity_id, details, created_at

## API Endpoints

### Users
- `GET /api/users?email=` - Get user by email
- `POST /api/users` - Create new user

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients?search=` - Search patients by name/email
- `POST /api/patients` - Create new patient

### Diagnoses
- `GET /api/diagnoses` - List all diagnoses
- `GET /api/diagnoses?patientId=` - Get diagnoses for specific patient
- `POST /api/diagnoses` - Create new diagnosis

### Prescriptions
- `GET /api/prescriptions` - List all prescriptions
- `GET /api/prescriptions?patientId=` - Get prescriptions for specific patient
- `POST /api/prescriptions` - Create new prescription

### Lab Reports
- `GET /api/lab-reports` - List all lab reports
- `GET /api/lab-reports?patientId=` - Get lab reports for specific patient
- `POST /api/lab-reports` - Create new lab report

### Pharmacy Records
- `GET /api/pharmacy-records` - List all pharmacy records
- `GET /api/pharmacy-records?status=pending|dispensed` - Filter by status
- `PATCH /api/pharmacy-records` - Update dispensed status

## Demo Credentials

After running the initialization script, login with:

| Role | Email | Password |
|------|-------|----------|
| Doctor | sam@documed.com | (any 6+ chars) |
| Doctor | sarah@documed.com | (any 6+ chars) |
| Patient | john@documed.com | (any 6+ chars) |
| Patient | jane@documed.com | (any 6+ chars) |
| Lab | lab@documed.com | (any 6+ chars) |
| Pharmacy | pharmacy@documed.com | (any 6+ chars) |

## Features Implemented

### Database Integration
✅ User authentication via database
✅ Patient search by name/email
✅ Doctor dashboard with database integration
✅ Immutable diagnosis records
✅ Immutable prescription records
✅ Lab report management
✅ Pharmacy dispensing tracking

### Still Using Mock Data
- Patient dashboard (read-only view)
- Laboratory dashboard
- Pharmacy dashboard

*Note: The patient, laboratory, and pharmacy dashboards will be migrated to use database in future updates.*

## File Structure

```
/app/api/
  ├── users/route.ts
  ├── patients/route.ts
  ├── diagnoses/route.ts
  ├── prescriptions/route.ts
  ├── lab-reports/route.ts
  └── pharmacy-records/route.ts

/lib/
  ├── db.ts              # MySQL connection pool
  ├── dbUtils.ts         # Client-side fetch utilities
  └── authContext.tsx    # Updated auth system

/scripts/
  └── init-db.sql        # Database schema and demo data
```

## Security Notes

### Current Implementation (Demo)
- Passwords stored as-is (for demo purposes)
- No encryption on sensitive data

### Production Recommendations
- Use bcrypt for password hashing
- Implement SSL/TLS for database connections
- Enable Row Level Security (RLS) based on user roles
- Use prepared statements (already implemented)
- Implement rate limiting on API endpoints
- Add audit logging for sensitive operations
- Implement JWT tokens for API authentication

## Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Ensure MySQL server is running
```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
net start MySQL80
```

### Database Not Found
```
Error: Unknown database 'documed'
```
**Solution:** Run the schema initialization script
```bash
mysql -u root -p documed < scripts/init-db.sql
```

### Authentication Failed
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:** Verify DB_USER, DB_PASSWORD, and DB_HOST environment variables match your MySQL setup

## Next Steps

1. **Migrate Patient Dashboard** - Update to use database instead of mock data
2. **Add Bcrypt** - Implement password hashing for production
3. **Add Authentication** - Implement session management with JWT
4. **Implement RLS** - Role-based access control at database level
5. **Add Logging** - Audit trail for all operations
