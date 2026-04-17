'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  createLabReport,
  fetchLabAppointments,
  fetchLabReports,
  fetchPatients,
  updateLabAppointment,
} from '@/lib/dbUtils';

type Patient = {
  id: string;
  name: string;
  email: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
};

type LabReport = {
  id: string;
  patient_id: string;
  test_name: string;
  test_type?: string;
  result: string;
  normal_range?: string;
  date: string;
  file_path?: string;
};

type LabAppointment = {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  test_name: string;
  instructions?: string;
  appointment_date: string;
  status: 'scheduled' | 'completed';
};

function formatDateOnly(value?: string | null) {
  if (!value) return 'Not provided';
  return value.includes('T') ? value.split('T')[0] : value;
}

export default function LaboratoryDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [labAppointments, setLabAppointments] = useState<LabAppointment[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [uploadForm, setUploadForm] = useState({
    testName: '',
    testType: '',
    result: '',
    normalRange: '',
    fileName: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'laboratory') {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    async function loadData() {
      if (!user || user.role !== 'laboratory') return;

      setLoading(true);
      try {
        const [patientsData, reportsData, appointmentsData] = await Promise.all([
          fetchPatients(),
          fetchLabReports(),
          fetchLabAppointments(undefined, 'all'),
        ]);

        setPatients(patientsData);
        setLabReports(reportsData);
        setLabAppointments(appointmentsData);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patientLabReports = labReports.filter((l) => l.patient_id === selectedPatient);
  const pendingAppointments = labAppointments.filter((a) => a.status === 'scheduled');
  const patientAppointments = labAppointments.filter((a) => a.patient_id === selectedPatient);
  const selectedPatientRecord = patients.find((p) => p.id === selectedPatient);

  const handleUploadReport = async () => {
    if (!selectedPatient || !uploadForm.testName || !uploadForm.result || !user) return;

    await createLabReport({
      patient_id: selectedPatient,
      lab_id: user.id,
      test_name: uploadForm.testName,
      test_type: uploadForm.testType || null,
      result: uploadForm.result,
      normal_range: uploadForm.normalRange || null,
      date: new Date().toISOString().split('T')[0],
      file_path: uploadForm.fileName || null,
    });

    if (selectedAppointmentId) {
      await updateLabAppointment(selectedAppointmentId, 'completed');
    }

    const [reportsData, appointmentsData] = await Promise.all([
      fetchLabReports(),
      fetchLabAppointments(undefined, 'all'),
    ]);

    setLabReports(reportsData);
    setLabAppointments(appointmentsData);
    setUploadForm({
      testName: '',
      testType: '',
      result: '',
      normalRange: '',
      fileName: '',
    });
    setSelectedAppointmentId('');
    setShowUploadForm(false);
  };

  if (!user || user.role !== 'laboratory') {
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/documed-logo.jpg" alt="DocuMed" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">DocuMed</h1>
              <p className="text-xs text-muted-foreground">Laboratory Services</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground">Laboratory</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Laboratory Dashboard</h1>

          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Patient by Name or Email
            </label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  placeholder="Search patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!selectedPatient}
              >
                {showUploadForm ? 'Cancel' : 'Upload Lab Report'}
              </Button>
            </div>

            {searchQuery && filteredPatients.length > 0 && (
              <div className="mt-3 border border-border rounded-lg bg-card">
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p.id);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted border-b last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-foreground">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Lab Appointment Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading queue...</p>
              ) : pendingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {pendingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{appointment.test_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Patient: {appointment.patient_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Doctor: {appointment.doctor_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Appointment Date: {formatDateOnly(appointment.appointment_date)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Instructions: {appointment.instructions || 'No instructions'}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedPatient(appointment.patient_id);
                            setSelectedAppointmentId(appointment.id);
                            setUploadForm((current) => ({
                              ...current,
                              testName: appointment.test_name,
                            }));
                            setShowUploadForm(true);
                          }}
                        >
                          Start Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No pending lab appointments
                </p>
              )}
            </CardContent>
          </Card>

          {showUploadForm && selectedPatient && (
            <Card className="mb-8 border-primary">
              <CardHeader>
                <CardTitle>Upload New Lab Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Test Name
                    </label>
                    <Input
                      value={uploadForm.testName}
                      onChange={(e) => setUploadForm({ ...uploadForm, testName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Test Type
                    </label>
                    <Input
                      placeholder="e.g., Blood Test"
                      value={uploadForm.testType}
                      onChange={(e) => setUploadForm({ ...uploadForm, testType: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Result
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                      rows={3}
                      value={uploadForm.result}
                      onChange={(e) => setUploadForm({ ...uploadForm, result: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Normal Range
                    </label>
                    <Input
                      placeholder="e.g., 70-100 mg/dL"
                      value={uploadForm.normalRange}
                      onChange={(e) => setUploadForm({ ...uploadForm, normalRange: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      File Name
                    </label>
                    <Input
                      placeholder="e.g., CBC_Report_2026.pdf"
                      value={uploadForm.fileName}
                      onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleUploadReport} className="w-full">
                    Save Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-6 p-4 bg-privacy-bg border border-privacy rounded-lg">
            <p className="text-sm text-privacy font-medium">
              Privacy Notice: You can only access lab reports and lab appointment requests.
            </p>
          </div>

          {selectedPatientRecord && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {selectedPatientRecord.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p className="font-medium text-foreground">{selectedPatientRecord.email}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-sm">Phone</p>
                    <p className="font-medium text-foreground">{selectedPatientRecord.phone || 'Not provided'}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Patient Lab Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {patientAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {patientAppointments.map((appointment) => (
                        <div key={appointment.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{appointment.test_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDateOnly(appointment.appointment_date)} by {appointment.doctor_name}
                              </p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No lab appointments for this patient
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lab Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {patientLabReports.length > 0 ? (
                    <div className="space-y-4">
                      {patientLabReports.map((report) => (
                        <div key={report.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-foreground">{report.test_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDateOnly(report.date)}
                              </p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-immutable-bg text-immutable font-medium">
                              Locked
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-2">{report.result}</p>
                          <p className="text-xs text-muted-foreground">
                            File: {report.file_path || 'No file attached'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No lab reports available for this patient
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
