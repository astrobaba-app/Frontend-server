'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '@/store/api/auth/profile';
import { logoutUser } from '@/store/api/auth/login';
import { UserProfile } from '@/store/api/auth/login';

interface AuthContextType {
  user: UserProfile | null;
  login: (userData: UserProfile, token: string, middlewareToken: string) => void;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, rely on cookies to determine if a user session exists.
  useEffect(() => {
    const initAuth = async () => {
      try {
        const profileData = await getProfile();
        setUser(profileData.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_role', 'user');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setUser(null);
        if (typeof window !== 'undefined') {
          const role = localStorage.getItem('auth_role');
          if (role === 'user') {
            localStorage.removeItem('auth_role');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: UserProfile, _token: string, _middlewareToken: string) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_role', 'user');
      window.dispatchEvent(new Event('auth_role_change'));
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_role');
        window.dispatchEvent(new Event('auth_role_change'));
      }
    }
  };

  const refreshUser = async () => {
    try {
      const profileData = await getProfile();
      setUser(profileData.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_role', 'user');
        window.dispatchEvent(new Event('auth_role_change'));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, loading, refreshUser }}>
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
