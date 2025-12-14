'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthSkeleton } from '@/components/skeletons/AuthSkeleton';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        // Refresh user data from backend (cookies are already set by backend)
        await refreshUser();
        
        // Store success message in sessionStorage to show toast on home page
        sessionStorage.setItem('loginSuccess', 'true');
        
        // Redirect to home after successful authentication
        router.push('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/login?error=auth_failed');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [refreshUser, router]);

  if (loading) {
    return <AuthSkeleton />;
  }

  return null;
}
