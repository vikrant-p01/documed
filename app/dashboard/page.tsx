'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const roleLinks: Record<string, { href: string; label: string }> = {
    doctor: { href: '/doctor', label: 'Doctor Dashboard' },
    patient: { href: '/patient', label: 'Patient Dashboard' },
    laboratory: { href: '/laboratory', label: 'Laboratory Dashboard' },
    pharmacy: { href: '/pharmacy', label: 'Pharmacy Dashboard' },
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">DocuMed</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user.name}
          </h2>
          <p className="text-muted-foreground">
            Access your {user.role} account below
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {roleLinks[user.role] && (
            <Link href={roleLinks[user.role].href} className="block">
              <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {roleLinks[user.role].label}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Access your role-specific tools and information
                </p>
                <Button className="w-full">
                  Go to Dashboard →
                </Button>
              </div>
            </Link>
          )}
        </div>

        <div className="mt-12 bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• View your profile and account settings</li>
            <li>• Access patient records and medical history</li>
            <li>• Manage prescriptions and lab reports</li>
            <li>• Track and update health information</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
