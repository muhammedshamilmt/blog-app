import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('blog-app')
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email })
    
    if (user) {
      // Update existing user's subscription status
      await db.collection('users').updateOne(
        { email },
        { 
          $set: { 
            isSubscribed: true,
            subscribedAt: new Date()
          }
        }
      )
      
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: {
          isExistingUser: true,
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      })
    } else {
      // Create a new subscriber entry
      await db.collection('subscribers').insertOne({
        email,
        isSubscribed: true,
        subscribedAt: new Date(),
        createdAt: new Date()
      })
      
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: {
          isExistingUser: false,
          email
        }
      })
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 