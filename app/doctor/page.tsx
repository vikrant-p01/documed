'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchPatients,
  fetchDiagnoses,
  fetchPrescriptions,
  fetchLabAppointments,
  fetchLabReports,
  createDiagnosis,
  createPrescription,
  createLabAppointment,
} from '@/lib/dbUtils';

function formatDateOnly(value?: string) {
  if (!value) return 'Not provided';
  return value.includes('T') ? value.split('T')[0] : value;
}

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [patients, setPatients] = useState<any[]>([]);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [labAppointments, setLabAppointments] = useState<any[]>([]);
  const [labReports, setLabReports] = useState<any[]>([]);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showLabAppointmentForm, setShowLabAppointmentForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [diagnosisForm, setDiagnosisForm] = useState({
    diagnosis: '',
    description: '',
    severity: 'moderate' as const,
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
  });

  const [labAppointmentForm, setLabAppointmentForm] = useState({
    testName: '',
    appointmentDate: '',
    instructions: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const patientsData = await fetchPatients();
        setPatients(patientsData);
        setSelectedPatient('');
        setDiagnoses([]);
        setPrescriptions([]);
        setLabAppointments([]);
        setLabReports([]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadPatientData = async () => {
      if (selectedPatient) {
        try {
          const diagnosesData = await fetchDiagnoses(selectedPatient);
          const prescriptionsData = await fetchPrescriptions(selectedPatient);
          const appointmentsData = await fetchLabAppointments(selectedPatient, 'all');
          const reportsData = await fetchLabReports(selectedPatient);
          setDiagnoses(diagnosesData);
          setPrescriptions(prescriptionsData);
          setLabAppointments(appointmentsData);
          setLabReports(reportsData);
        } catch (error) {
          console.error('Failed to load patient data:', error);
        }
      } else {
        setDiagnoses([]);
        setPrescriptions([]);
        setLabAppointments([]);
        setLabReports([]);
      }
    };

    loadPatientData();
  }, [selectedPatient]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patient = patients.find((p) => p.id === selectedPatient);
  const patientDiagnoses = diagnoses.filter((d) => d.patient_id === selectedPatient);
  const patientPrescriptions = prescriptions.filter((p) => p.patient_id === selectedPatient);
  const patientLabAppointments = labAppointments.filter((a) => a.patient_id === selectedPatient);
  const patientLabReports = labReports.filter((r) => r.patient_id === selectedPatient);

  const handleAddDiagnosis = async () => {
    if (diagnosisForm.diagnosis && diagnosisForm.description && selectedPatient && user?.doctorId) {
      try {
        await createDiagnosis({
          patient_id: selectedPatient,
          doctor_id: user.doctorId,
          diagnosis: diagnosisForm.diagnosis,
          description: diagnosisForm.description,
          severity: diagnosisForm.severity,
          date: new Date().toISOString().split('T')[0],
        });
        
        // Reload diagnoses
        const updatedDiagnoses = await fetchDiagnoses(selectedPatient);
        setDiagnoses(updatedDiagnoses);
        setDiagnosisForm({ diagnosis: '', description: '', severity: 'moderate' });
        setShowDiagnosisForm(false);
      } catch (error) {
        console.error('Failed to add diagnosis:', error);
      }
    }
  };

  const handleAddPrescription = async () => {
    if (prescriptionForm.medication && prescriptionForm.dosage && selectedPatient && user?.doctorId) {
      try {
        await createPrescription({
          patient_id: selectedPatient,
          doctor_id: user.doctorId,
          medication: prescriptionForm.medication,
          dosage: prescriptionForm.dosage,
          frequency: prescriptionForm.frequency,
          duration: prescriptionForm.duration,
          date: new Date().toISOString().split('T')[0],
        });
        
        // Reload prescriptions
        const updatedPrescriptions = await fetchPrescriptions(selectedPatient);
        setPrescriptions(updatedPrescriptions);
        setPrescriptionForm({ medication: '', dosage: '', frequency: '', duration: '' });
        setShowPrescriptionForm(false);
      } catch (error) {
        console.error('Failed to add prescription:', error);
      }
    }
  };

  const handleAddLabAppointment = async () => {
    if (!labAppointmentForm.testName || !labAppointmentForm.appointmentDate || !selectedPatient || !user?.doctorId) {
      return;
    }

    try {
      await createLabAppointment({
        patient_id: selectedPatient,
        doctor_id: user.doctorId,
        test_name: labAppointmentForm.testName,
        instructions: labAppointmentForm.instructions,
        appointment_date: labAppointmentForm.appointmentDate,
      });

      const updatedAppointments = await fetchLabAppointments(selectedPatient, 'all');
      setLabAppointments(updatedAppointments);
      setLabAppointmentForm({ testName: '', appointmentDate: '', instructions: '' });
      setShowLabAppointmentForm(false);
    } catch (error) {
      console.error('Failed to create lab appointment:', error);
    }
  };

  if (!user || user.role !== 'doctor') {
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/documed-logo.jpg" alt="DocuMed" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">DocuMed</h1>
              <p className="text-xs text-muted-foreground">Healthcare Provider</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground">Doctor</div>
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
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Doctor Dashboard</h1>

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
            {searchQuery && filteredPatients.length === 0 && (
              <div className="mt-3 p-4 text-center text-muted-foreground text-sm">
                No patients found matching "{searchQuery}"
              </div>
            )}
          </div>

          {patient && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium text-foreground">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p className="font-medium text-foreground">{formatDateOnly(patient.date_of_birth)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium text-foreground">{patient.gender || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{patient.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!selectedPatient && !loading && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Search and select a patient to view records.
                </p>
              </CardContent>
            </Card>
          )}

          {selectedPatient && (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Diagnoses Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Diagnoses</h2>
                <Button
                  onClick={() => setShowDiagnosisForm(!showDiagnosisForm)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {showDiagnosisForm ? 'Cancel' : 'Add Diagnosis'}
                </Button>
              </div>

              {showDiagnosisForm && (
                <Card className="mb-6 border-primary">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Diagnosis
                        </label>
                        <Input
                          placeholder="e.g., Hypertension"
                          value={diagnosisForm.diagnosis}
                          onChange={(e) =>
                            setDiagnosisForm({
                              ...diagnosisForm,
                              diagnosis: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                          placeholder="Clinical details..."
                          rows={3}
                          value={diagnosisForm.description}
                          onChange={(e) =>
                            setDiagnosisForm({
                              ...diagnosisForm,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Severity
                        </label>
                        <Select
                          value={diagnosisForm.severity}
                          onValueChange={(value: any) =>
                            setDiagnosisForm({
                              ...diagnosisForm,
                              severity: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleAddDiagnosis}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Save Diagnosis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {patientDiagnoses.length > 0 ? (
                  patientDiagnoses.map((diagnosis) => (
                    <Card key={diagnosis.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground">
                            {diagnosis.diagnosis}
                          </h3>
                          <div className="flex gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              diagnosis.severity === 'mild'
                                ? 'bg-success-bg text-success'
                                : diagnosis.severity === 'moderate'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-immutable-bg text-immutable font-medium">
                              Locked
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {diagnosis.description}
                        </p>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Date: {diagnosis.date}</span>
                            <span>By: {diagnosis.doctor_name}</span>
                          </div>
                          <p className="text-muted-foreground italic">
                            This record is permanent and cannot be edited or deleted.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No diagnoses recorded
                  </p>
                )}
              </div>
            </div>

            {/* Prescriptions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Prescriptions</h2>
                <Button
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {showPrescriptionForm ? 'Cancel' : 'Add Prescription'}
                </Button>
              </div>

              {showPrescriptionForm && (
                <Card className="mb-6 border-primary">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Medication
                        </label>
                        <Input
                          placeholder="e.g., Lisinopril"
                          value={prescriptionForm.medication}
                          onChange={(e) =>
                            setPrescriptionForm({
                              ...prescriptionForm,
                              medication: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Dosage
                        </label>
                        <Input
                          placeholder="e.g., 10mg"
                          value={prescriptionForm.dosage}
                          onChange={(e) =>
                            setPrescriptionForm({
                              ...prescriptionForm,
                              dosage: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Frequency
                        </label>
                        <Input
                          placeholder="e.g., Once daily"
                          value={prescriptionForm.frequency}
                          onChange={(e) =>
                            setPrescriptionForm({
                              ...prescriptionForm,
                              frequency: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Duration
                        </label>
                        <Input
                          placeholder="e.g., 30 days"
                          value={prescriptionForm.duration}
                          onChange={(e) =>
                            setPrescriptionForm({
                              ...prescriptionForm,
                              duration: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleAddPrescription}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Save Prescription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {patientPrescriptions.length > 0 ? (
                  patientPrescriptions.map((rx) => (
                    <Card key={rx.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-foreground">
                            {rx.medication} - {rx.dosage}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded bg-immutable-bg text-immutable font-medium">
                            Locked
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Frequency</p>
                            <p className="text-foreground">{rx.frequency}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="text-foreground">{rx.duration}</p>
                          </div>
                        </div>
                        <div className="text-xs space-y-1 pt-3 border-t border-border">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Date: {rx.date}</span>
                            <span>By: {rx.doctor_name}</span>
                          </div>
                          <p className="text-muted-foreground italic">
                            This prescription is permanent and cannot be modified.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No prescriptions recorded
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Lab Appointments</h2>
              <Button
                onClick={() => setShowLabAppointmentForm(!showLabAppointmentForm)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {showLabAppointmentForm ? 'Cancel' : 'Add Lab Appointment'}
              </Button>
            </div>

            {showLabAppointmentForm && (
              <Card className="mb-6 border-primary">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Test Name
                      </label>
                      <Input
                        placeholder="e.g., Complete Blood Count"
                        value={labAppointmentForm.testName}
                        onChange={(e) =>
                          setLabAppointmentForm({
                            ...labAppointmentForm,
                            testName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Appointment Date
                      </label>
                      <Input
                        type="date"
                        value={labAppointmentForm.appointmentDate}
                        onChange={(e) =>
                          setLabAppointmentForm({
                            ...labAppointmentForm,
                            appointmentDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Instructions
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                        rows={3}
                        value={labAppointmentForm.instructions}
                        onChange={(e) =>
                          setLabAppointmentForm({
                            ...labAppointmentForm,
                            instructions: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleAddLabAppointment} className="w-full">
                      Save Lab Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {patientLabAppointments.length > 0 ? (
              <div className="space-y-3">
                {patientLabAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">{appointment.test_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Appointment: {formatDateOnly(appointment.appointment_date)}
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
              <p className="text-muted-foreground text-center py-8">
                No lab appointments scheduled
              </p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Lab Reports</h2>

            {patientLabReports.length > 0 ? (
              <div className="space-y-3">
                {patientLabReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">{report.test_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Date: {formatDateOnly(report.date)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Lab: {report.lab_name || 'Laboratory'}
                          </p>
                          <p className="text-sm text-foreground mt-2">{report.result}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            File: {report.file_path || 'No file attached'}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-immutable-bg text-immutable font-medium">
                          Locked
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No lab reports available
              </p>
            )}
          </div>
          </>
          )}
        </div>
      </main>
    </>
  );
}
