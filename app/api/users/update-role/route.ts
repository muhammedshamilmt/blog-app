import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email, isWriter } = await request.json()
    
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
    
    // Update user's writer status
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          isWriter,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: isWriter ? 'User role updated to writer' : 'Writer role removed'
    })
    
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update user role',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 