import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    // For demo: get email from query param (replace with session/cookie logic as needed)
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email provided' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('blog-app')
    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Remove sensitive info
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, user: { ...userWithoutPassword, _id: user._id.toString() } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 })
  }
} 