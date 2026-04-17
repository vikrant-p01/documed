'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompleteProfile() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Patient profile
  const [patientForm, setPatientForm] = useState({
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    address: '',
  });

  // Doctor profile
  const [doctorForm, setDoctorForm] = useState({
    licenseNumber: '',
    specialization: '',
    phone: '',
    clinicName: '',
    address: '',
    yearsOfExperience: '',
  });

  // Lab staff profile
  const [labForm, setLabForm] = useState({
    labName: '',
    licenseNumber: '',
    phone: '',
    address: '',
    specialization: '',
  });

  // Pharmacy staff profile
  const [pharmacyForm, setPharmacyForm] = useState({
    pharmacyName: '',
    licenseNumber: '',
    phone: '',
    address: '',
    registrationNumber: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        user_id: user?.id,
        date_of_birth: patientForm.dateOfBirth,
        gender: patientForm.gender,
        phone: patientForm.phone,
        address: patientForm.address,
      };

      const response = await fetch('/api/patients/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to save profile');
      }

      await refreshUser();

      // Redirect to patient dashboard
      router.push('/patient');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          license_number: doctorForm.licenseNumber,
          specialization: doctorForm.specialization,
          phone: doctorForm.phone,
          years_of_experience: parseInt(doctorForm.yearsOfExperience),
          clinic_name: doctorForm.clinicName,
          address: doctorForm.address,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to save profile');
      }

      await refreshUser();

      // Redirect to doctor dashboard
      router.push('/doctor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/laboratory-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          lab_name: labForm.labName,
          license_number: labForm.licenseNumber,
          phone: labForm.phone,
          address: labForm.address,
          specialization: labForm.specialization,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to save profile');
      }

      // Redirect to laboratory dashboard
      router.push('/laboratory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePharmacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/pharmacy-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          pharmacy_name: pharmacyForm.pharmacyName,
          license_number: pharmacyForm.licenseNumber,
          phone: pharmacyForm.phone,
          address: pharmacyForm.address,
          registration_number: pharmacyForm.registrationNumber,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to save profile');
      }

      // Redirect to pharmacy dashboard
      router.push('/pharmacy');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/documed-logo.jpg" alt="DocuMed" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Please provide additional information</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            {user.role === 'patient' && (
              <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    required
                    value={patientForm.dateOfBirth}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, dateOfBirth: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Gender
                  </label>
                  <select
                    required
                    value={patientForm.gender}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={patientForm.phone}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address
                  </label>
                  <Input
                    placeholder="123 Main St, City, State"
                    value={patientForm.address}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, address: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </Button>
              </form>
            )}

            {user.role === 'doctor' && (
              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Medical License Number
                  </label>
                  <Input
                    required
                    placeholder="LIC123456"
                    value={doctorForm.licenseNumber}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Specialization
                  </label>
                  <Input
                    required
                    placeholder="e.g., Cardiology, Pediatrics"
                    value={doctorForm.specialization}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, specialization: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Years of Experience
                  </label>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={doctorForm.yearsOfExperience}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, yearsOfExperience: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Clinic Name
                  </label>
                  <Input
                    placeholder="Health Clinic Name"
                    value={doctorForm.clinicName}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, clinicName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={doctorForm.phone}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address
                  </label>
                  <Input
                    placeholder="Clinic Address"
                    value={doctorForm.address}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, address: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </Button>
              </form>
            )}

            {user.role === 'laboratory' && (
              <form onSubmit={handleLabSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Laboratory Name
                  </label>
                  <Input
                    required
                    placeholder="Lab Name"
                    value={labForm.labName}
                    onChange={(e) =>
                      setLabForm({ ...labForm, labName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    License Number
                  </label>
                  <Input
                    required
                    placeholder="LAB123456"
                    value={labForm.licenseNumber}
                    onChange={(e) =>
                      setLabForm({ ...labForm, licenseNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Specialization
                  </label>
                  <Input
                    placeholder="e.g., Blood Tests, Imaging"
                    value={labForm.specialization}
                    onChange={(e) =>
                      setLabForm({ ...labForm, specialization: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={labForm.phone}
                    onChange={(e) =>
                      setLabForm({ ...labForm, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address
                  </label>
                  <Input
                    placeholder="Lab Address"
                    value={labForm.address}
                    onChange={(e) =>
                      setLabForm({ ...labForm, address: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </Button>
              </form>
            )}

            {user.role === 'pharmacy' && (
              <form onSubmit={handlePharmacySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Pharmacy Name
                  </label>
                  <Input
                    required
                    placeholder="Pharmacy Name"
                    value={pharmacyForm.pharmacyName}
                    onChange={(e) =>
                      setPharmacyForm({ ...pharmacyForm, pharmacyName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    License Number
                  </label>
                  <Input
                    required
                    placeholder="PHARM123456"
                    value={pharmacyForm.licenseNumber}
                    onChange={(e) =>
                      setPharmacyForm({ ...pharmacyForm, licenseNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Registration Number
                  </label>
                  <Input
                    placeholder="REG123456"
                    value={pharmacyForm.registrationNumber}
                    onChange={(e) =>
                      setPharmacyForm({ ...pharmacyForm, registrationNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={pharmacyForm.phone}
                    onChange={(e) =>
                      setPharmacyForm({ ...pharmacyForm, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address
                  </label>
                  <Input
                    placeholder="Pharmacy Address"
                    value={pharmacyForm.address}
                    onChange={(e) =>
                      setPharmacyForm({ ...pharmacyForm, address: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
