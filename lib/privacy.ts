// Role-based data visibility and privacy controls
export type UserRole = 'doctor' | 'patient' | 'laboratory' | 'pharmacy';

export interface DataVisibility {
  canViewFullProfile: boolean;
  canViewDiagnoses: boolean;
  canViewPrescriptions: boolean;
  canViewLabReports: boolean;
  canViewPharmacyRecords: boolean;
  canAddDiagnoses: boolean;
  canAddPrescriptions: boolean;
  canUploadLabReports: boolean;
  canDispenseMedicines: boolean;
}

// Doctor can add diagnoses and prescriptions, view full patient profiles
export const doctorVisibility: DataVisibility = {
  canViewFullProfile: true,
  canViewDiagnoses: true,
  canViewPrescriptions: true,
  canViewLabReports: true,
  canViewPharmacyRecords: false, // Doctors don't need to see pharmacy records
  canAddDiagnoses: true,
  canAddPrescriptions: true,
  canUploadLabReports: false,
  canDispenseMedicines: false,
};

// Patient can only view their own records (read-only)
export const patientVisibility: DataVisibility = {
  canViewFullProfile: true,
  canViewDiagnoses: true,
  canViewPrescriptions: true,
  canViewLabReports: true,
  canViewPharmacyRecords: false, // Patients don't see pharmacy workflow
  canAddDiagnoses: false,
  canAddPrescriptions: false,
  canUploadLabReports: false,
  canDispenseMedicines: false,
};

// Laboratory staff can upload lab reports, view relevant patient data
export const laboratoryVisibility: DataVisibility = {
  canViewFullProfile: false, // Labs only see patient name/ID
  canViewDiagnoses: false, // Labs don't see diagnoses
  canViewPrescriptions: false, // Labs don't see prescriptions
  canViewLabReports: true,
  canViewPharmacyRecords: false,
  canAddDiagnoses: false,
  canAddPrescriptions: false,
  canUploadLabReports: true,
  canDispenseMedicines: false,
};

// Pharmacy staff can dispense medicines, view prescriptions
export const pharmacyVisibility: DataVisibility = {
  canViewFullProfile: false, // Pharmacists only see patient name/ID
  canViewDiagnoses: false, // Pharmacists don't see diagnoses
  canViewPrescriptions: true, // Only the medication part
  canViewLabReports: false, // Pharmacists don't see lab reports
  canViewPharmacyRecords: true,
  canAddDiagnoses: false,
  canAddPrescriptions: false,
  canUploadLabReports: false,
  canDispenseMedicines: true,
};

// Get visibility rules for a role
export function getVisibilityForRole(role: UserRole): DataVisibility {
  switch (role) {
    case 'doctor':
      return doctorVisibility;
    case 'patient':
      return patientVisibility;
    case 'laboratory':
      return laboratoryVisibility;
    case 'pharmacy':
      return pharmacyVisibility;
  }
}

// Check if role can perform action
export function canPerformAction(
  role: UserRole,
  action: keyof DataVisibility
): boolean {
  const visibility = getVisibilityForRole(role);
  return visibility[action] === true;
}

// Filter data based on visibility
export interface PatientDataVisibleTo {
  name: boolean;
  dateOfBirth: boolean;
  gender: boolean;
  email: boolean;
  phone: boolean;
  diagnoses: boolean;
  prescriptions: boolean;
  labReports: boolean;
}

export function getPatientDataVisibility(
  role: UserRole
): PatientDataVisibleTo {
  switch (role) {
    case 'doctor':
      return {
        name: true,
        dateOfBirth: true,
        gender: true,
        email: true,
        phone: true,
        diagnoses: true,
        prescriptions: true,
        labReports: true,
      };
    case 'patient':
      return {
        name: true,
        dateOfBirth: true,
        gender: true,
        email: true,
        phone: true,
        diagnoses: true,
        prescriptions: true,
        labReports: true,
      };
    case 'laboratory':
      return {
        name: true, // Only for linking reports
        dateOfBirth: false,
        gender: false,
        email: false,
        phone: false,
        diagnoses: false,
        prescriptions: false,
        labReports: true,
      };
    case 'pharmacy':
      return {
        name: true, // Only for dispensing
        dateOfBirth: false,
        gender: false,
        email: false,
        phone: false,
        diagnoses: false,
        prescriptions: true, // Only medication part
        labReports: false,
      };
  }
}

// Get privacy disclaimer for a role
export function getPrivacyDisclaimer(role: UserRole): string {
  switch (role) {
    case 'doctor':
      return 'You have access to complete patient records. All changes are logged and permanent.';
    case 'patient':
      return 'You can view your complete medical history. All data is managed securely.';
    case 'laboratory':
      return 'You can only upload lab reports and see patient IDs. Patient details are hidden for privacy.';
    case 'pharmacy':
      return 'You can only see prescriptions needed for dispensing. Detailed medical information is not visible.';
  }
}
