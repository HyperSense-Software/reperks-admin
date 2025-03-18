import { NextRequest, NextResponse } from 'next/server';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { routing } from '@/i18n/routing';
import createIntlMiddleware from 'next-intl/middleware';

const intlMiddleware = createIntlMiddleware(routing);

// Authentication middleware
export async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authenticated = await AuthGetCurrentUserServer();

  if (authenticated) {
    return intlMiddleware(request);
  } else {
    const pathnameParts = pathname.split('/');
    const locale = routing.locales.includes(pathnameParts[1] as 'en' | 'de')
      ? (pathnameParts[1] as 'en' | 'de')
      : routing.defaultLocale;

    // Redirect to login page with the current locale
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
}

// Main middleware function that combines both
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Apply i18n middleware first

  // Skip auth check for public routes
  const isPublicRoute = [
    '/login',
    '/change-password',
    '/forgot-password',
    '/activate-account',
    '/reset-password',
    '/',
  ].some((route) => {
    const langPrefix = routing.locales.map((lang) => `/${lang}${route}`);
    return langPrefix.some((path) => pathname.startsWith(path));
  });

  if (isPublicRoute) {
    return intlMiddleware(request);
  }

  // Apply auth middleware for protected routes
  return authMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
