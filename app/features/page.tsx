import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeaturesPage() {
  return (
    <>
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">DocuMed</h1>
          <nav className="flex gap-4">
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">Learn More</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Key Features
            </h2>
            <p className="text-lg text-muted-foreground">
              DocuMed is built with privacy, security, and efficiency at its core.
            </p>
          </div>

          <div className="space-y-8">
            {/* Immutable Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Immutable Records
                </h3>
                <p className="text-muted-foreground mb-4">
                  Once a medical record is created by a healthcare provider, it becomes permanently locked and cannot be modified or deleted. This ensures complete data integrity and prevents accidental changes that could compromise patient safety.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Prevents accidental modifications</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Creates audit trail for all entries</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Ensures legal compliance</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Maintains historical accuracy</span>
                  </li>
                </ul>
              </div>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-8 text-center">
                  <div className="text-6xl font-bold text-primary mb-4">🔒</div>
                  <p className="text-muted-foreground">Locked records cannot be changed</p>
                </CardContent>
              </Card>
            </div>

            {/* Role-Based Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <Card className="bg-primary/5 border-primary/20 md:order-last">
                <CardContent className="pt-8 text-center">
                  <div className="text-6xl font-bold text-primary mb-4">👥</div>
                  <p className="text-muted-foreground">Each role sees only what they need</p>
                </CardContent>
              </Card>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Role-Based Access Control
                </h3>
                <p className="text-muted-foreground mb-4">
                  Each healthcare professional has customized access to patient data. Doctors see complete profiles, while specialists like pharmacies and labs see only the information relevant to their function. This maintains privacy while ensuring necessary coordination.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Doctors access complete medical history</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Labs see only test reports</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Pharmacies view medications only</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Patients see their complete history</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Patient Transparency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Complete Patient Transparency
                </h3>
                <p className="text-muted-foreground mb-4">
                  Patients have full access to their complete medical history displayed in an easy-to-read timeline format. They can see all diagnoses, prescriptions, lab results, and understand their care journey.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>View diagnoses and severity levels</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Review all prescriptions and dosages</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Access all lab reports and results</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Understand complete medical timeline</span>
                  </li>
                </ul>
              </div>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-8 text-center">
                  <div className="text-6xl font-bold text-primary mb-4">👀</div>
                  <p className="text-muted-foreground">Full access to personal health records</p>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Efficiency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <Card className="bg-primary/5 border-primary/20 md:order-last">
                <CardContent className="pt-8 text-center">
                  <div className="text-6xl font-bold text-primary mb-4">⚡</div>
                  <p className="text-muted-foreground">Seamless coordination between providers</p>
                </CardContent>
              </Card>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Improved Workflow Efficiency
                </h3>
                <p className="text-muted-foreground mb-4">
                  All healthcare providers work from the same unified platform, eliminating manual data transfers and ensuring instant access to the latest information.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Eliminate paper-based records</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Reduce duplicate testing</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Faster prescription fulfillment</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Real-time data synchronization</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Audit & Accountability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Complete Audit Trails
                </h3>
                <p className="text-muted-foreground mb-4">
                  Every action in the system is logged with timestamps and provider information. This creates accountability and helps identify any issues or unauthorized access.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Track all record creations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Log all data access with timestamps</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Record provider actions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Enable accountability and compliance</span>
                  </li>
                </ul>
              </div>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-8 text-center">
                  <div className="text-6xl font-bold text-primary mb-4">📋</div>
                  <p className="text-muted-foreground">Complete audit trail for every action</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-card border border-border rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Experience Better Healthcare Coordination?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join healthcare providers and patients who are already benefiting from DocuMed.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Create Your Account</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 DocuMed. Digital Health Records Platform.</p>
        </div>
      </footer>
    </>
  );
}
