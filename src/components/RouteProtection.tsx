'use client';

import { useEffect, useState, ReactNode, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie } from '@/utils/cookies';

// Routes that require astrologer authentication
const ASTROLOGER_PROTECTED_ROUTE_PREFIXES = [
  '/astrologer/dashboard',
  '/astrologer/live-chats',
  '/astrologer/livechats',
];

// Routes that require user authentication
const USER_PROTECTED_ROUTES = [
  '/cart',
  '/chat',
  '/aichat',
  '/checkout',
  '/profile',
];

// Loading component
function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-yellow-400/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RouteProtection({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const authStatus = useMemo(() => {
    if (typeof window === 'undefined') {
      return { checking: true, authorized: false, shouldRedirect: false, redirectTo: '' };
    }

    const astrologerToken = getCookie('token_astrologer');
    const middlewareToken = getCookie('token_middleware');

    // ASTROLOGER LOGGED IN
    if (astrologerToken) {
      const isAstrologerRoute = ASTROLOGER_PROTECTED_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
      const isAstrologerAuthRoute = ['/astrologer/login', '/astrologer/register', '/astrologer/signup'].includes(pathname);

      if (!isAstrologerRoute && !isAstrologerAuthRoute) {
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/astrologer/dashboard/profile' };
      }

      if (isAstrologerAuthRoute) {
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/astrologer/dashboard/profile' };
      }

      return { checking: false, authorized: true, shouldRedirect: false, redirectTo: '' };
    }

    // USER LOGGED IN
    if (middlewareToken) {
      const isAstrologerRoute = ASTROLOGER_PROTECTED_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
      const isAstrologerAuthRoute = ['/astrologer/login', '/astrologer/register', '/astrologer/signup'].includes(pathname);

      if (isAstrologerRoute || isAstrologerAuthRoute) {
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/' };
      }

      if (pathname === '/auth/login') {
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/' };
      }

      return { checking: false, authorized: true, shouldRedirect: false, redirectTo: '' };
    }

    // GUEST (NO TOKEN)
    const isUserProtectedRoute = USER_PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    
    if (isUserProtectedRoute) {
      return { checking: false, authorized: false, shouldRedirect: true, redirectTo: `/auth/login?redirect=${pathname}` };
    }

    const isAstrologerProtectedRoute = ASTROLOGER_PROTECTED_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
    
    if (isAstrologerProtectedRoute) {
      return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/astrologer/login' };
    }

    return { checking: false, authorized: true, shouldRedirect: false, redirectTo: '' };
  }, [pathname]);

  useEffect(() => {
    if (authStatus.shouldRedirect && authStatus.redirectTo) {
      setIsRedirecting(true);
      router.replace(authStatus.redirectTo);
    } else {
      setIsRedirecting(false);
    }
  }, [authStatus, router]);

  useEffect(() => {
    const handleAuthChange = () => setIsRedirecting(false);
    window.addEventListener('auth_change', handleAuthChange);
    return () => window.removeEventListener('auth_change', handleAuthChange);
  }, []);

  if (authStatus.checking || authStatus.shouldRedirect || isRedirecting) {
    return <AuthLoadingScreen />;
  }

  if (authStatus.authorized) {
    return <>{children}</>;
  }

  return <AuthLoadingScreen />;
}
