import { NextRequest, NextResponse } from 'next/server';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const authenticated = await AuthGetCurrentUserServer();

  if (authenticated) {
    console.log('User authenticated');
    return response;
  } else {
    console.log('User not authenticated');
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|change-password|forgot-password|activate-account|reset-password|).*)',
  ],
};
