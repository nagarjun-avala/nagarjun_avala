// middleware.ts - Add rate limiting and security
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (use Redis in production)
const rateLimitMap = new Map();

function getRateLimitKey(request: NextRequest, identifier: string): string {
  // Try to get the IP from x-forwarded-for header or fallback to 'unknown'
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return `${identifier}-${ip}`;
}

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count++;
  return false;
}

export function middleware(request: NextRequest) {
  // Rate limit contact form submissions
  if (request.nextUrl.pathname === '/api/contact' && request.method === 'POST') {
    const key = getRateLimitKey(request, 'contact');

    // 5 submissions per hour
    if (isRateLimited(key, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Rate limit visitor tracking
  if (request.nextUrl.pathname === '/api/visitors' && request.method === 'POST') {
    const key = getRateLimitKey(request, 'visitor');

    // 10 requests per minute
    if (isRateLimited(key, 10, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};