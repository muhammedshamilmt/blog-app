import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming data
    const { email, password } = await request.json()
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password' },
        { status: 400 }
      )
    }

    // Check for admin credentials
    if (email === 'shaz80170@gmail.com' && password === '871459') {
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        data: { 
          user: {
            _id: 'admin',
            email: 'shaz80170@gmail.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      })
    }

    // Connect to MongoDB
    let client
    try {
      client = await clientPromise
      console.log('MongoDB client connected successfully')
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError)
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      )
    }

    const db = client.db('blog-app')
    
    // Find user by email
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      data: { 
        user: {
          ...userWithoutPassword,
          _id: user._id.toString() // Convert ObjectId to string
        }
      }
    })
    
  } catch (error) {
    console.error('Error in login API:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process login',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 