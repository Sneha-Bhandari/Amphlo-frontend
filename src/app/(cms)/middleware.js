// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check for auth cookie OR authorization header
  const authCookie = request.cookies.get('connect.sid') || 
                     request.cookies.get('token') ||
                     request.cookies.get('access_token');
  
  // Also check for authorization header (if token is sent in header)
  const authHeader = request.headers.get('authorization');
  
  const isAuthenticated = !!(authCookie || authHeader);
  
  // Define protected routes (all admin routes)
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/cms-login';
  
  // If trying to access admin route without auth
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL('/cms-login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If already logged in and trying to access login page
  if (isLoginRoute && isAuthenticated) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cms-login'],
};