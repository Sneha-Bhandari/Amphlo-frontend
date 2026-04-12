import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check for auth cookie (adjust cookie name based on your backend)
  const authCookie = request.cookies.get('connect.sid') || request.cookies.get('token');
  
  // Check localStorage auth (for client-side stored auth)
  // Note: middleware can't access localStorage, so we rely on cookies
  
  // Define protected routes (all admin routes)
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/cms-login';
  
  // If trying to access admin route without auth cookie
  if (isAdminRoute && !authCookie) {
    // Redirect to login page
    const loginUrl = new URL('/cms-login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If already logged in and trying to access login page, redirect to admin
  if (isLoginRoute && authCookie) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cms-login'],
};