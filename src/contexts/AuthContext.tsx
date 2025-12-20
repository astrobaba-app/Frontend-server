"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "@/store/api/auth/profile";
import { logoutUser } from "@/store/api/auth/login";
import { UserProfile } from "@/store/api/auth/login";
import { deleteCookie, setCookie, getCookie } from "@/utils/cookies";

interface AuthContextType {
  user: UserProfile | null;
  login: (
    userData: UserProfile,
    token: string,
    middlewareToken: string
  ) => void;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if middlewareToken exists in cookies
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const token = getCookie("token_middleware");
          if (token) {
            const profileData = await getProfile();
            setUser(profileData.user);
          }
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setUser(null);
        if (typeof window !== "undefined") {
          deleteCookie("token_middleware");
          deleteCookie("token");
          deleteCookie("user_id");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (
    userData: UserProfile,
    _token: string,
    middlewareToken: string
  ) => {
    setUser(userData);
    setCookie("token_middleware", middlewareToken, 30);
    setCookie("user_id", userData.id.toString(), 30);
    window.dispatchEvent(new Event("auth_change"));
  };

  const logout = async () => {
    setUser(null);
    deleteCookie("token_middleware");
    deleteCookie("user_id");
     deleteCookie("token");
    window.dispatchEvent(new Event("auth_change"));

    // Call logout API in background
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API error:", error);
    }
  };

  const refreshUser = async () => {
    try {
      const profileData = await getProfile();
      setUser(profileData.user);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      await logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoggedIn: !!user, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
