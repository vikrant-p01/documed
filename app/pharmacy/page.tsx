'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPharmacyRecords, updatePharmacyRecord } from '@/lib/dbUtils';

type PharmacyRecord = {
  id: string;
  prescription_id: string;
  patient_id: string;
  pharmacy_id: string;
  medication: string;
  patient_name: string;
  quantity?: number | null;
  dispensed: boolean;
  dispensed_date?: string | null;
};

function formatDateOnly(value?: string | null) {
  if (!value) return '';
  return value.includes('T') ? value.split('T')[0] : value;
}

export default function PharmacyDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [pharmacyRecords, setPharmacyRecords] = useState<PharmacyRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'dispensed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'pharmacy') {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    async function loadRecords() {
      if (!user || user.role !== 'pharmacy') return;

      setLoading(true);
      try {
        const records = await fetchPharmacyRecords(undefined, 'all');
        setPharmacyRecords(records);
      } finally {
        setLoading(false);
      }
    }

    void loadRecords();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleMarkAsDispensed = async (id: string) => {
    await updatePharmacyRecord(id, true);
    setPharmacyRecords(
      pharmacyRecords.map((record) =>
        record.id === id
          ? {
              ...record,
              dispensed: true,
              dispensed_date: new Date().toISOString().split('T')[0],
            }
          : record
      )
    );
  };

  const recordsByPatientSearch = searchQuery
    ? pharmacyRecords.filter((r) =>
        r.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pharmacyRecords;

  const filteredRecords =
    filterStatus === 'all'
      ? recordsByPatientSearch
      : filterStatus === 'pending'
        ? recordsByPatientSearch.filter((r) => !r.dispensed)
        : recordsByPatientSearch.filter((r) => r.dispensed);

  const pendingCount = pharmacyRecords.filter((r) => !r.dispensed).length;
  const dispensedCount = pharmacyRecords.filter((r) => r.dispensed).length;

  if (!user || user.role !== 'pharmacy') {
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
              <p className="text-xs text-muted-foreground">Pharmacy Services</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground">Pharmacy</div>
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
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Pharmacy Dashboard</h1>

          <div className="mb-6 p-4 bg-privacy-bg border border-privacy rounded-lg">
            <p className="text-sm text-privacy font-medium">
              Privacy Notice: You can only see prescriptions needed for dispensing. Patient medical details, diagnoses, and lab results are not visible to maintain privacy boundaries.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-2">Total Prescriptions</p>
                <p className="text-4xl font-bold text-primary">{pharmacyRecords.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-2">Pending Dispensing</p>
                <p className="text-4xl font-bold text-yellow-600">{pendingCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-2">Already Dispensed</p>
                <p className="text-4xl font-bold text-green-600">{dispensedCount}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search Patient */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Patient by Name or Email
            </label>
            <Input
              placeholder="Search patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            {searchQuery && recordsByPatientSearch.length === 0 && (
              <div className="mt-2 p-3 text-center text-muted-foreground text-sm bg-muted rounded-lg">
                No patients found matching "{searchQuery}"
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['all', 'pending', 'dispensed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Prescriptions List */}
          <div className="space-y-3">
            {loading && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">Loading prescriptions...</p>
                </CardContent>
              </Card>
            )}

            {!loading && filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <Card
                  key={record.id}
                  className={record.dispensed ? 'bg-secondary/50' : 'bg-card'}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {record.medication}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Patient: {record.patient_name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                record.dispensed
                                  ? 'bg-success-bg text-success'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {record.dispensed ? 'Dispensed' : 'Pending'}
                            </span>
                            {record.dispensed && (
                              <span className="text-xs px-2 py-1 rounded bg-immutable-bg text-immutable font-medium whitespace-nowrap">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Prescription ID
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {record.prescription_id}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Pharmacist</p>
                            <p className="text-sm font-medium text-foreground">
                              {user.name}
                            </p>
                          </div>
                          {record.dispensed_date && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Dispensed Date
                              </p>
                              <p className="text-sm font-medium text-foreground">
                                {formatDateOnly(record.dispensed_date)}
                              </p>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Record ID: {record.id}
                        </p>
                      </div>

                      {!record.dispensed && (
                        <Button
                          onClick={() => handleMarkAsDispensed(record.id)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
                        >
                          Mark as Dispensed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : !loading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">
                    {filterStatus === 'pending' && 'No pending prescriptions'}
                    {filterStatus === 'dispensed' && 'No dispensed prescriptions'}
                    {filterStatus === 'all' && 'No prescriptions available'}
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Information Box */}
          <div className="mt-8 p-6 bg-secondary/10 border border-border rounded-lg">
            <p className="text-sm text-foreground font-medium mb-3">Pharmacy Operations</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>View all pending prescriptions for dispensing</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Mark prescriptions as dispensed when provided to patients</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Track dispensing history and patient records</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>All actions are recorded with timestamps and pharmacist names</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
