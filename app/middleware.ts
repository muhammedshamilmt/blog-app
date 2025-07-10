import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Newsletter page is now public; no auth or subscription check
  return NextResponse.next()
}

// Configure the middleware to run only on the newsletter page
export const config = {
  matcher: '/newsletter',
} 