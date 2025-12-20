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

  // On mount, check if middlewareToken exists in localStorage or cookies
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          let token = localStorage.getItem('token_middleware');
          
          // If no token in localStorage, check cookies (for Google OAuth flow)
          if (!token) {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
              const [name, value] = cookie.trim().split('=');
              if (name === 'token_middleware') {
                token = value;
                localStorage.setItem('token_middleware', token);
                break;
              }
            }
          }
          
          if (token) {
            const profileData = await getProfile();
            setUser(profileData.user);
            localStorage.setItem('user_id', profileData.user.id.toString());
            
            // Dispatch auth change event for RouteProtection
            window.dispatchEvent(new Event('auth_change'));
            
            // Check if this is from Google OAuth success
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('auth') === 'success') {
              sessionStorage.setItem('loginSuccess', 'true');
              // Remove auth parameter from URL
              window.history.replaceState({}, '', window.location.pathname);
            }
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token_middleware');
          localStorage.removeItem('user_id');
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: UserProfile, _token: string, middlewareToken: string) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token_middleware', middlewareToken);
      localStorage.setItem('user_id', userData.id.toString());
      window.dispatchEvent(new Event('auth_change'));
    }
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('token_middleware');
      localStorage.removeItem('user_id');
      
      // Clear cookies on client side
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'token_middleware=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      window.dispatchEvent(new Event('auth_change'));
    }
    
    // Call logout API to clear cookies on server side
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const profileData = await getProfile();
      setUser(profileData.user);
      
      // Save user_id to localStorage when refreshing user data
      if (typeof window !== 'undefined' && profileData.user?.id) {
        localStorage.setItem('user_id', profileData.user.id.toString());
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
