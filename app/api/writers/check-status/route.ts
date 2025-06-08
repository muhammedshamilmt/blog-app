import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    let client
    try {
      client = await clientPromise
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError)
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      )
    }

    const db = client.db('blog-app')
    
    // Check if user is already a writer
    const user = await db.collection('users').findOne(
      { email },
      { projection: { isWriter: 1, firstName: 1, lastName: 1 } }
    )

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      isWriter: user.isWriter || false,
      name: `${user.firstName} ${user.lastName}`
    })
    
  } catch (error) {
    console.error('Error checking writer status:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check writer status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 