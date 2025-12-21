'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        
        // Extract token_middleware from cookies and save to localStorage
        const cookies = document.cookie.split(';');
        let middlewareToken = '';
        
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'token_middleware') {
            middlewareToken = value;
            break;
          }
        }
        
        if (!middlewareToken) {
          console.error('No middleware token found in cookies');
          router.push('/auth/login?error=auth_failed');
          return;
        }
        
        // Save token to localStorage
        localStorage.setItem('token_middleware', middlewareToken);
        
        // Refresh user data from backend to get user details
        await refreshUser();
        
        // Store success message in sessionStorage to show toast on home page
        sessionStorage.setItem('loginSuccess', 'true');
        
        // Dispatch auth change event for RouteProtection
        window.dispatchEvent(new Event('auth_change'));
        
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center p-8 max-w-md mx-auto">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-6"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Authenticating...</h2>
            <p className="text-gray-600 text-sm sm:text-base">Please wait while we log you in</p>
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Redirecting...</h2>
            <p className="text-gray-600 text-sm sm:text-base">Taking you to the app</p>
          </>
        )}
      </div>
    </div>
  );
}
