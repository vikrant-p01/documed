'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            DocuMed
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                isActive('/')
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              href="/doctor"
              className={`text-sm transition-colors ${
                isActive('/doctor')
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Doctor
            </Link>
            <Link
              href="/patient"
              className={`text-sm transition-colors ${
                isActive('/patient')
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Patient
            </Link>
            <Link
              href="/laboratory"
              className={`text-sm transition-colors ${
                isActive('/laboratory')
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Laboratory
            </Link>
            <Link
              href="/pharmacy"
              className={`text-sm transition-colors ${
                isActive('/pharmacy')
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pharmacy
            </Link>
            <Link
              href="/chatbot"
              className={`text-sm transition-colors ${
                isActive('/chatbot')
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Health Assistant
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
