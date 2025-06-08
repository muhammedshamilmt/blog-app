import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is the newsletter page
  if (path === '/newsletter') {
    // Get the user data from the request cookies
    const userData = request.cookies.get('userData')?.value

    if (!userData) {
      // If no user data, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      // Parse the user data
      const user = JSON.parse(userData)

      // Check if user is subscribed
      if (!user.isSubscribed) {
        // If not subscribed, redirect to home
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      // If there's an error parsing the user data, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run only on the newsletter page
export const config = {
  matcher: '/newsletter',
} 