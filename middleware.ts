import { NextRequest, NextResponse } from 'next/server';
import { getDivisionSlugForHost, normalizeHost } from '@/lib/company-network';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname !== '/') {
    return NextResponse.next();
  }

  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const normalizedHost = normalizeHost(host);
  const divisionSlug = getDivisionSlugForHost(normalizedHost);

  if (!divisionSlug) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/brands/${divisionSlug}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
