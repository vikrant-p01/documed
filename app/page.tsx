import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FeatureCard from '@/components/FeatureCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/documed-logo.jpg" alt="DocuMed" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold text-foreground hidden sm:block">DocuMed</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              Learn More
            </Link>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Create Account</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="bg-gradient-to-br from-primary/5 to-secondary py-20 mb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-6xl font-bold text-foreground mb-6 leading-tight">
              Healthcare Made <span className="text-primary">Simple</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A unified digital health records platform connecting doctors, patients, laboratories, and pharmacies. Secure, transparent, and efficient.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center text-foreground mb-12">Built for Every Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                title="Healthcare Providers"
                description="Manage patient diagnoses and prescriptions with an intuitive interface"
              />
              <FeatureCard
                title="Patient Access"
                description="View your complete medical history and health records in one place"
              />
              <FeatureCard
                title="Lab Management"
                description="Upload, manage, and track laboratory reports efficiently"
              />
              <FeatureCard
                title="Pharmacy System"
                description="Dispense medications and track prescription fulfillment"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-12 mb-16">
            <h3 className="text-2xl font-bold text-foreground mb-6">Why DocuMed?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Simple & Secure</h4>
                <p className="text-muted-foreground">
                  Clean, intuitive interface with role-based access control to keep patient data secure
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Integrated Workflow</h4>
                <p className="text-muted-foreground">
                  Seamless communication between doctors, patients, labs, and pharmacies
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Real-Time Updates</h4>
                <p className="text-muted-foreground">
                  Instant access to latest patient information and test results
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Easy to Use</h4>
                <p className="text-muted-foreground">
                  Minimal design focused on efficiency for healthcare professionals
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-6">Ready to get started?</h3>
            <Link href="/signup">
              <Button size="lg">Create Your Account</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 DocuMed. Digital Health Records Platform.</p>
        </div>
      </footer>
    </div>
  );
}
