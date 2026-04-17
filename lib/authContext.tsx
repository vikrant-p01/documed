'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'doctor' | 'patient' | 'laboratory' | 'pharmacy';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  patientId?: string; // For patients to know which patient record is theirs
  doctorId?: string; // For doctors to identify themselves
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User>;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndStoreUser = async (email: string) => {
    const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      
    if (response.status === 503) {
      throw new Error('Database not configured. Please set environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    }
      
    if (!response.ok) throw new Error('User not found');
      
    const userData = await response.json();
    if (!userData) throw new Error('Invalid credentials');

    const nextUser: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      patientId: userData.patient_id,
      doctorId: userData.doctor_id,
    };

    setUser(nextUser);
    return nextUser;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      return await fetchAndStoreUser(email);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password_hash: password, // In production, use bcrypt
          name,
          role,
        }),
      });

      if (response.status === 503) {
        throw new Error('Database not configured. Please set environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
      }

      if (!response.ok) throw new Error('Signup failed');

      // After signup, log in the user
      return await login(email, password);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user?.email) return null;
    setIsLoading(true);
    try {
      return await fetchAndStoreUser(user.email);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to refresh user');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
