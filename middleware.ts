import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication for users
const userProtectedRoutes = [
  '/profile',
  '/chat',
  '/kundliReport',
];

// Define protected routes that require authentication for astrologers
const astrologerProtectedRoutes = [
  '/astrologer/dashboard',
];

// Define auth routes that should redirect if already logged in for users
const userAuthRoutes = [
  '/auth/login',
  '/auth/register',
];

// Define auth routes that should redirect if already logged in for astrologers
const astrologerAuthRoutes = [
  '/astrologer/login',
  '/astrologer/signup',
  '/astrologer/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get tokens from cookies (backend sets 'token' for both user and astrologer)
  const token = request.cookies.get('token_middleware')?.value;
  const hasToken = !!token;

  // Check if the current route is protected for users
  const isUserProtectedRoute = userProtectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current route is protected for astrologers
  const isAstrologerProtectedRoute = astrologerProtectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current route is an auth route
  const isUserAuthRoute = userAuthRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAstrologerAuthRoute = astrologerAuthRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect to login if accessing user protected route without token
  if (isUserProtectedRoute && !hasToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to login if accessing astrologer protected route without token
  if (isAstrologerProtectedRoute && !hasToken) {
    const loginUrl = new URL('/astrologer/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to profile if accessing user auth routes with valid token
  if (isUserAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Redirect to dashboard if accessing astrologer auth routes with valid token
  if (isAstrologerAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/astrologer/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes should use this middleware
export const config = {
  matcher: [
   
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*|public).*)',
  ],
};
