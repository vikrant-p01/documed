'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await login(email, password);
      const user = response;
      
      // Auto-redirect based on role
      if (user.role === 'doctor') {
        router.push('/doctor');
      } else if (user.role === 'patient') {
        router.push('/patient');
      } else if (user.role === 'laboratory') {
        router.push('/laboratory');
      } else if (user.role === 'pharmacy') {
        router.push('/pharmacy');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mb-4 flex justify-center">
            <img src="/documed-logo.jpg" alt="DocuMed" className="h-16 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">DocuMed</h1>
          <p className="text-primary font-medium">Digital Health Records Platform</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your DocuMed account</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><strong>Doctor:</strong> sam@documed.com or sarah@documed.com</li>
              <li><strong>Patient:</strong> john@documed.com or jane@documed.com</li>
              <li><strong>Lab:</strong> lab@documed.com</li>
              <li><strong>Pharmacy:</strong> pharmacy@documed.com</li>
              <li className="pt-1"><strong>Password:</strong> (any 6+ chars)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
