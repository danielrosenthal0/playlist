import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.next();
  }

  const host = request.headers.get('host') ?? '';
  if (!host.startsWith('localhost:')) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.hostname = '127.0.0.1';
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
