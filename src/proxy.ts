import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const userRoleCookie = request.cookies.get('userRole');
  const userRole = userRoleCookie?.value;

  // 1. Handle the "/" root route redirect
  if (path === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 2. Define route categories
  const isDashboardRoot = path === '/dashboard'; // Exactly /dashboard
  const isDashboardRoute = path.startsWith('/dashboard');
  const isAdminRoute = path.startsWith('/dashboard/a');
  const isStudentRoute = path.startsWith('/dashboard/s');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/admin-signup');

  // --- SCENARIO 1: User is NOT logged in ---
  if (isDashboardRoute && !userRole) {
    return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url));
  }

  // --- SCENARIO 2: User IS logged in ---
  if (userRole) {
    // A. Handle the exactly "/dashboard" route
    if (isDashboardRoot) {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/a', request.url));
      } else if (userRole === 'student') {
        return NextResponse.redirect(new URL('/dashboard/s', request.url));
      }
    }

    // B. Prevent logged-in users from seeing Auth pages
    if (isAuthRoute) {
       return NextResponse.redirect(
         new URL(userRole === 'admin' ? '/dashboard/a' : '/dashboard/s', request.url)
       );
    }

    // C. Role-Based Protection for sub-routes
    if (isAdminRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/s', request.url));
    }
    if (isStudentRoute && userRole !== 'student') {
      return NextResponse.redirect(new URL('/dashboard/a', request.url));
    }
  }

  return NextResponse.next();
}

// 3. Updated Matcher to include the root "/"
export const config = {
  matcher: [
      '/',              // Now matching the root
      '/dashboard/:path*', 
      '/login',
      '/admin-signup'
  ]
}