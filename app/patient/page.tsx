'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { HealthChatbotModal } from '@/components/HealthChatbotModal';
import { fetchDiagnoses, fetchLabAppointments, fetchLabReports, fetchPatient, fetchPrescriptions } from '@/lib/dbUtils';

type PatientProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  address?: string;
};

type Diagnosis = {
  id: string;
  patient_id: string;
  diagnosis: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
  doctor_name: string;
};

type Prescription = {
  id: string;
  patient_id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  doctor_name: string;
};

type LabReport = {
  id: string;
  patient_id: string;
  test_name: string;
  result: string;
  date: string;
  file_path?: string;
};

type LabAppointment = {
  id: string;
  test_name: string;
  instructions?: string;
  appointment_date: string;
  status: 'scheduled' | 'completed';
  doctor_name: string;
};

function formatDateOnly(value?: string) {
  if (!value) return 'Not provided';
  return value.includes('T') ? value.split('T')[0] : value;
}

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [patientDiagnoses, setPatientDiagnoses] = useState<Diagnosis[]>([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([]);
  const [patientLabReports, setPatientLabReports] = useState<LabReport[]>([]);
  const [patientLabAppointments, setPatientLabAppointments] = useState<LabAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    async function loadPatientData() {
      if (!user || user.role !== 'patient') return;

      setLoading(true);
      try {
        const profile = await fetchPatient(user.patientId, user.id);
        setPatient(profile);

        if (!profile?.id) {
          setPatientDiagnoses([]);
          setPatientPrescriptions([]);
          setPatientLabReports([]);
          setPatientLabAppointments([]);
          return;
        }

        const [diagnoses, prescriptions, labReports, labAppointments] = await Promise.all([
          fetchDiagnoses(profile.id),
          fetchPrescriptions(profile.id),
          fetchLabReports(profile.id),
          fetchLabAppointments(profile.id, 'all'),
        ]);

        setPatientDiagnoses(diagnoses);
        setPatientPrescriptions(prescriptions);
        setPatientLabReports(labReports);
        setPatientLabAppointments(labAppointments);
      } finally {
        setLoading(false);
      }
    }

    void loadPatientData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const personalDetails = {
    name: patient?.name || user?.name || 'Unknown User',
    email: patient?.email || user?.email || 'Not provided',
    patientId: patient?.id || user?.patientId || 'Not linked',
    dateOfBirth: formatDateOnly(patient?.date_of_birth),
    gender: patient?.gender || 'Not provided',
    phone: patient?.phone || 'Not provided',
    address: patient?.address || 'Not provided',
  };

  // Combine all records for timeline
  const timelineEvents = [
    ...patientDiagnoses.map((d) => ({
      type: 'diagnosis' as const,
      date: d.date,
      data: d,
    })),
    ...patientPrescriptions.map((p) => ({
      type: 'prescription' as const,
      date: p.date,
      data: p,
    })),
    ...patientLabReports.map((l) => ({
      type: 'lab' as const,
      date: l.date,
      data: l,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!user || user.role !== 'patient') {
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/documed-logo.jpg" alt="DocuMed" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">DocuMed</h1>
              <p className="text-xs text-muted-foreground">My Health Records</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChatbotOpen(true)}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Health Assistant
            </Button>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground">Patient</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Patient Dashboard</h1>

          {loading && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">Loading your profile...</p>
              </CardContent>
            </Card>
          )}

          {!loading && !patient && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Your patient profile is not linked yet. Complete your profile again to create your record.
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && patient && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Full Name</p>
                      <p className="font-medium text-foreground text-lg">{personalDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Patient ID</p>
                      <p className="font-medium text-foreground">{personalDetails.patientId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Date of Birth</p>
                      <p className="font-medium text-foreground">{personalDetails.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Gender</p>
                      <p className="font-medium text-foreground">{personalDetails.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-foreground">{personalDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium text-foreground">{personalDetails.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground mb-1">Address</p>
                      <p className="font-medium text-foreground">{personalDetails.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Lab Appointments</h2>

                {patientLabAppointments.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {patientLabAppointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-foreground">{appointment.test_name}</p>
                              <p className="text-sm text-muted-foreground">
                                Appointment Date: {formatDateOnly(appointment.appointment_date)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Ordered by: {appointment.doctor_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Instructions: {appointment.instructions || 'No instructions'}
                              </p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                              {appointment.status}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="mb-8">
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground py-8">
                        No lab appointments scheduled
                      </p>
                    </CardContent>
                  </Card>
                )}

                <h2 className="text-2xl font-bold text-foreground mb-6">Medical History Timeline</h2>

                {timelineEvents.length > 0 ? (
                  <div className="space-y-6">
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-primary border-4 border-background" />
                          {index < timelineEvents.length - 1 && (
                            <div className="w-0.5 h-16 bg-border mt-2" />
                          )}
                        </div>
                        <div className="pb-4 flex-1">
                          {event.type === 'diagnosis' && (
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Diagnosis</p>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {event.data.diagnosis}
                                    </h3>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                                      event.data.severity === 'mild'
                                        ? 'bg-success-bg text-success'
                                        : event.data.severity === 'moderate'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                    }`}>
                                      {event.data.severity.charAt(0).toUpperCase() + event.data.severity.slice(1)}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-immutable-bg text-immutable font-medium">
                                      Locked
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-foreground mb-3">
                                  {event.data.description}
                                </p>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{event.data.date}</span>
                                  <span>{event.data.doctor_name}</span>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {event.type === 'prescription' && (
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Prescription</p>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {event.data.medication}
                                    </h3>
                                  </div>
                                  <span className="text-xs px-2 py-1 rounded bg-immutable-bg text-immutable font-medium">
                                    Locked
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Dosage</p>
                                    <p className="font-medium text-foreground">{event.data.dosage}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Frequency</p>
                                    <p className="font-medium text-foreground">{event.data.frequency}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Duration</p>
                                    <p className="font-medium text-foreground">{event.data.duration}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Date Issued</p>
                                    <p className="font-medium text-foreground">{event.data.date}</p>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Prescribed by: {event.data.doctor_name}
                                </p>
                              </CardContent>
                            </Card>
                          )}

                          {event.type === 'lab' && (
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Lab Report</p>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {event.data.test_name}
                                    </h3>
                                  </div>
                                  <span className="text-xs px-2 py-1 rounded bg-immutable-bg text-immutable font-medium">
                                    Locked
                                  </span>
                                </div>
                                <div className="space-y-2 mb-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Result</p>
                                    <p className="font-medium text-foreground">{event.data.result}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <p className="font-medium text-foreground">{event.data.date}</p>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  File: {event.data.file_path || 'No file attached'}
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground py-8">
                        No medical records available
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-1">Total Diagnoses</p>
                    <p className="text-3xl font-bold text-primary">
                      {patientDiagnoses.length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-1">Active Prescriptions</p>
                    <p className="text-3xl font-bold text-primary">
                      {patientPrescriptions.length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-1">Lab Reports</p>
                    <p className="text-3xl font-bold text-primary">
                      {patientLabReports.length}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Health Assistant Chatbot Modal */}
      <HealthChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        patientContext={{
          diagnoses: patientDiagnoses,
          prescriptions: patientPrescriptions,
          labReports: patientLabReports,
          patientName: personalDetails.name,
        }}
      />
    </>
  );
}
