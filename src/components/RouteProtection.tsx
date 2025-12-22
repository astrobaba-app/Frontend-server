'use client';

import { useEffect, useState, ReactNode, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Routes that astrologers cannot access when logged in
const ASTROLOGER_BLOCKED_ROUTES = [
  '/chat',
  '/aichat',
  '/',
  '/horoscope',
  '/kundlimatching',
  '/kundlireport',
  '/blog',
  '/cart',
  '/store',
  '/checkout',
  '/compatibility',
  '/astrologer/login',
  '/astrologer/register',
  '/astrologer/signup',
];

// Routes that start with /profile
const PROFILE_ROUTES_PREFIX = '/profile';

// Routes that users cannot access when logged in (routes starting with these paths)
const USER_BLOCKED_ASTROLOGER_ROUTE_PREFIXES = [
  '/astrologer/dashboard',
  '/astrologer/live-chats',
  '/astrologer/livechats',
];

// Routes that require authentication (no guest access)
const PROTECTED_ROUTES = [
  '/cart',
  '/chat',
  '/aichat',
  '/checkout',
  '/kundli-matching',
  '/kundliReport',
];

// Routes that require astrologer authentication (routes starting with these paths)
const ASTROLOGER_PROTECTED_ROUTE_PREFIXES = [
  '/astrologer/dashboard',
  '/astrologer/live-chats',
  '/astrologer/livechats',
  '/astrologer/live/', // Add live streaming routes
];

// Loading component to show while checking auth
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

  // Check auth status
  const authStatus = useMemo(() => {
    if (typeof window === 'undefined') {
      return { checking: false, authorized: true, shouldRedirect: false, redirectTo: '' };
    }

    const astrologerToken = localStorage.getItem('token_astrologer');
    const middlewareToken = localStorage.getItem('token_middleware');

    // PUBLIC ROUTES - Always accessible (unless blocked by other rules)
    const publicRoutes = [
      '/auth/login',
      '/astrologer/login',
      '/astrologer/register',
      '/astrologer/signup',
      '/',
      '/horoscope',
      '/kundlimatching',
      '/kundlireport',
      '/blog',
      '/store',
      '/compatibility',
    ];

    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/store/');

    // ASTROLOGER LOGGED IN
    if (astrologerToken) {
      // Astrologers can ONLY access astrologer routes
      const isAstrologerRoute = ASTROLOGER_PROTECTED_ROUTE_PREFIXES.some(
        (prefix) => pathname.startsWith(prefix)
      );

      const isAstrologerAuthRoute = ['/astrologer/login', '/astrologer/register', '/astrologer/signup'].includes(pathname);

      if (!isAstrologerRoute && !isAstrologerAuthRoute) {
        // Redirect to dashboard for any non-astrologer route
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/astrologer/dashboard/profile' };
      }

      if (isAstrologerAuthRoute) {
        // Already logged in, redirect to dashboard
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/astrologer/dashboard/profile' };
      }

      return { checking: false, authorized: true, shouldRedirect: false, redirectTo: '' };
    }

    // USER LOGGED IN
    if (middlewareToken) {
      // Users cannot access astrologer routes
      const isAstrologerRoute = USER_BLOCKED_ASTROLOGER_ROUTE_PREFIXES.some(
        (prefix) => pathname.startsWith(prefix)
      );

      if (isAstrologerRoute) {
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/' };
      }

      // Users cannot access astrologer auth routes (login, register, signup)
      const isAstrologerAuthRoute = ['/astrologer/login', '/astrologer/register', '/astrologer/signup'].includes(pathname);
      if (isAstrologerAuthRoute) {
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/' };
      }

      // Users cannot access user login page (already logged in)
      if (pathname === '/auth/login') {
        return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/' };
      }

      // Users can access protected routes and public routes
      return { checking: false, authorized: true, shouldRedirect: false, redirectTo: '' };
    }

    // NO ONE LOGGED IN (Guest)
    // Check if trying to access protected routes
    const isProtectedRoute = 
      PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
      pathname.startsWith(PROFILE_ROUTES_PREFIX);

    if (isProtectedRoute) {
      return { checking: false, authorized: false, shouldRedirect: true, redirectTo: `/auth/login?redirect=${pathname}` };
    }

    // Check if trying to access astrologer protected routes
    const isAstrologerProtectedRoute = ASTROLOGER_PROTECTED_ROUTE_PREFIXES.some(
      (prefix) => pathname.startsWith(prefix)
    );

    if (isAstrologerProtectedRoute) {
      return { checking: false, authorized: false, shouldRedirect: true, redirectTo: '/astrologer/login' };
    }

    // Public route - allow access
    return { checking: false, authorized: true, shouldRedirect: false, redirectTo: '' };
  }, [pathname]);

  // Handle redirects
  useEffect(() => {
    if (authStatus.shouldRedirect && authStatus.redirectTo) {
      setIsRedirecting(true);
      router.replace(authStatus.redirectTo);
    }
  }, [authStatus, router]);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      setIsRedirecting(false);
    };

    window.addEventListener('auth_change', handleAuthChange);

    return () => {
      window.removeEventListener('auth_change', handleAuthChange);
    };
  }, []);

  // Show loading screen only while redirecting
  if (authStatus.shouldRedirect || isRedirecting) {
    return <AuthLoadingScreen />;
  }

  // Show children if authorized, otherwise show loading (redirect in progress)
  return authStatus.authorized ? <>{children}</> : <AuthLoadingScreen />;
}
