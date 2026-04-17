import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <>
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">DocuMed</h1>
          <nav className="flex gap-4">
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How DocuMed Works
            </h2>
            <p className="text-lg text-muted-foreground">
              DocuMed is a unified digital health record system designed to improve healthcare delivery through better coordination, reduced errors, and enhanced patient transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Immutable Records</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Once a medical record is created by a healthcare provider, it becomes permanent and locked. This ensures data integrity and prevents accidental modifications that could compromise patient safety.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Each healthcare professional sees only the information they need for their role. Doctors see complete profiles, while labs and pharmacies see only relevant details—maintaining privacy and reducing information overload.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Patient Transparency</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Patients have complete access to their medical history, including diagnoses, prescriptions, and lab results. They can review their care timeline and understand all medical decisions affecting them.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Audit Trails</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Every action—creating records, viewing files, dispensing medicines—is logged with timestamps and provider names. This creates accountability and helps identify any issues quickly.
              </CardContent>
            </Card>
          </div>

          <section className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">System Benefits</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Reduced Paperwork</h4>
                  <p className="text-muted-foreground">All medical records are digitized and centralized, eliminating the need for physical paper documents and reducing administrative burden.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Avoided Duplicate Tests</h4>
                  <p className="text-muted-foreground">Patients' lab results are immediately visible to all authorized providers, preventing unnecessary repeat testing and saving time and cost.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Improved Coordination</h4>
                  <p className="text-muted-foreground">Doctors, laboratories, and pharmacies work seamlessly together through a shared platform, ensuring continuity of care and faster treatment.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Enhanced Patient Safety</h4>
                  <p className="text-muted-foreground">Complete medical history prevents dangerous drug interactions, allergies, or contradicting treatments that could otherwise go unnoticed.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Patient Empowerment</h4>
                  <p className="text-muted-foreground">Patients understand their medical history and can make informed decisions about their healthcare with complete transparency.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">User Roles & Workflows</h3>

            <div className="space-y-6">
              <div className="border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 text-lg">Doctors / Healthcare Providers</h4>
                <p className="text-muted-foreground mb-3">
                  Have the broadest access to patient records and can add new diagnoses and prescriptions.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• View complete patient profile and medical history</li>
                  <li>• Add diagnoses with severity levels for patient cases</li>
                  <li>• Create prescriptions specifying medication and dosage</li>
                  <li>• Access all lab reports and test results</li>
                  <li>• All entries are permanently locked and cannot be edited</li>
                </ul>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 text-lg">Patients</h4>
                <p className="text-muted-foreground mb-3">
                  Can review their complete medical journey in an easy-to-understand timeline format.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• View all diagnoses with severity information</li>
                  <li>• Review prescriptions and medication details</li>
                  <li>• Access uploaded lab reports and test results</li>
                  <li>• See complete chronological medical history</li>
                  <li>• Read-only access ensures data integrity</li>
                </ul>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 text-lg">Laboratory Staff</h4>
                <p className="text-muted-foreground mb-3">
                  Can upload test reports and manage laboratory operations independently.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• Upload lab reports for patients</li>
                  <li>• View uploaded reports and test results</li>
                  <li>• Limited patient information for privacy (name and ID only)</li>
                  <li>• Cannot see diagnoses or other medical details</li>
                  <li>• Reports are immediately available to authorized providers</li>
                </ul>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 text-lg">Pharmacy Staff</h4>
                <p className="text-muted-foreground mb-3">
                  Manage medication dispensing with a streamlined interface focused on prescriptions.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• View pending prescriptions for dispensing</li>
                  <li>• Mark medicines as dispensed with timestamps</li>
                  <li>• Track dispensing history and patient names</li>
                  <li>• Cannot see diagnoses or detailed medical information</li>
                  <li>• All transactions are permanently logged</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Privacy & Security</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>
                DocuMed implements strict privacy controls to ensure sensitive health information is protected while maintaining necessary coordination between providers.
              </p>
              <p>
                Each user role has carefully defined data access permissions. Doctors see complete records, while specialists like pharmacies and labs only see information relevant to their specific function. This "need-to-know" principle minimizes unnecessary exposure of sensitive data.
              </p>
              <p>
                All records are immutable once created, preventing accidental or intentional modifications that could compromise data integrity. Comprehensive audit trails track all access and actions for accountability and security monitoring.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 DocuMed. Digital Health Records Platform.</p>
        </div>
      </footer>
    </>
  );
}
