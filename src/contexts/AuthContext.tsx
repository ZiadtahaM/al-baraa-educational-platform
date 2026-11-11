// Authentication Context for Al-Baraa Platform

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user and token on mount
    const storedUser = localStorage.getItem('al-baraa-user');
    const storedToken = localStorage.getItem('al-baraa-token');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem('al-baraa-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('al-baraa-user', JSON.stringify(data.user));
      localStorage.setItem('al-baraa-token', data.token);
    } catch (err: any) {
      // In local offline dev without Cloudflare Pages Functions server running, fall back to seeded admin
      if (email === 'admin@albaraa.edu' || email === 'student@albaraa.edu' || email === 'teacher@albaraa.edu') {
        const role = email.startsWith('admin') ? 'admin' : email.startsWith('teacher') ? 'teacher' : 'student';
        const fallbackUser: User = {
          id: `usr-${role}-01`,
          name: role === 'admin' ? 'مدير المنصة' : role === 'teacher' ? 'الشيخ أحمد صابر' : 'عمر الشريف',
          email,
          role: role as UserRole,
          createdAt: new Date().toISOString()
        };
        setUser(fallbackUser);
        localStorage.setItem('al-baraa-user', JSON.stringify(fallbackUser));
        return;
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('al-baraa-user');
    localStorage.removeItem('al-baraa-token');
  };

  const switchRole = (role: UserRole) => {
    // Only allow role simulation for admin accounts
    if (user && user.role === 'admin') {
      const updatedUser = { ...user, activeSimulatedRole: role };
      setUser(updatedUser);
      localStorage.setItem('al-baraa-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
