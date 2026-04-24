# DocuMed Database Setup Guide

## Prerequisites
- MySQL Server installed and running
- MySQL command line client or MySQL Workbench
- Node.js and npm installed

## Environment Variables
Set the following environment variables in your local `.env` or `.env.local` file:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=documed
```

On Railway, add either:

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
```

or a single connection string:

```env
DATABASE_URL=${{MySQL.MYSQL_URL}}
```

## Database Setup Steps

### 1. Create the Database
```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE documed;
USE documed;
```

### 2. Run the Schema Script
```bash
mysql -u root -p documed < scripts/init-db.sql
```

This will create all tables and insert demo data.

### 3. Verify Installation
```bash
mysql -u root -p -e "USE documed; SHOW TABLES;"
```

You should see:
- users
- patients
- diagnoses
- prescriptions
- lab_reports
- pharmacy_records
- audit_logs

## Demo Credentials

After setup, you can login with:

**Doctors:**
- Email: sam@documed.com
- Email: sarah@documed.com
- Password: (any 6+ characters)

**Patients:**
- Email: john@documed.com
- Email: jane@documed.com
- Password: (any 6+ characters)

**Laboratory:**
- Email: lab@documed.com
- Password: (any 6+ characters)

**Pharmacy:**
- Email: pharmacy@documed.com
- Password: (any 6+ characters)

## Database Schema

### Users Table
Stores user accounts with role-based access control.

### Patients Table
Patient demographic information linked to user accounts.

### Diagnoses Table
Medical diagnoses recorded by doctors (immutable).

### Prescriptions Table
Medications prescribed by doctors (immutable).

### Lab Reports Table
Test results uploaded by laboratory staff.

### Pharmacy Records Table
Prescription fulfillment tracking for pharmacy staff.

### Audit Logs Table
Tracks all significant actions in the system for compliance.

## Install Required Dependencies

```bash
npm install mysql2
```

## Running the Application

```bash
npm run dev
```

The application will connect to MySQL on startup and use the database for all operations.
