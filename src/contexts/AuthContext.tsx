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

  // Load user from localStorage and verify with backend on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('astrobaba_user');
      const token = localStorage.getItem('astrobaba_token');
      const authMethod = localStorage.getItem('astrobaba_middleware_token');
      
      // Check if user has either token-based auth (OTP) or cookie-based auth (Google)
      if (storedUser && (token || authMethod === 'cookie')) {
        try {
          // Verify authentication is still valid by fetching profile
          const profileData = await getProfile();
          setUser(profileData.user);
          localStorage.setItem('astrobaba_user', JSON.stringify(profileData.user));
        } catch (error) {
          // Auth expired or invalid, clear local storage
          console.error('Auth verification failed:', error);
          localStorage.removeItem('astrobaba_user');
          localStorage.removeItem('astrobaba_token');
          localStorage.removeItem('astrobaba_middleware_token');
          localStorage.removeItem('astrobaba_auth_method');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: UserProfile, token: string, middlewareToken: string) => {
    setUser(userData);
    localStorage.setItem('astrobaba_user', JSON.stringify(userData));
    localStorage.setItem('astrobaba_token', token);
    localStorage.setItem('astrobaba_middleware_token', middlewareToken);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('astrobaba_user');
      localStorage.removeItem('astrobaba_token');
      localStorage.removeItem('astrobaba_middleware_token');
      localStorage.removeItem('astrobaba_auth_method');
    }
  };

  const refreshUser = async () => {
    try {
      const profileData = await getProfile();
      setUser(profileData.user);
      localStorage.setItem('astrobaba_user', JSON.stringify(profileData.user));
      
      // For Google login, tokens are stored in HTTP-only cookies by backend
      // We set a flag in localStorage to indicate cookies exist
      localStorage.setItem('astrobaba_auth_method', 'cookie');
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, logout
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
