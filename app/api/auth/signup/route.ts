import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming data
    const formData = await request.json()
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      )
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
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: formData.email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(formData.password, salt)
    
    // Prepare the user document
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: new ObjectId()
    }
    
    // Insert into users collection
    try {
      const result = await db.collection('users').insertOne(userData)
      console.log('User registered successfully:', result.insertedId)
      
      // Remove password from response
      const { password, ...userWithoutPassword } = userData
      
      return NextResponse.json({ 
        success: true, 
        message: 'Account created successfully! Please check your email for verification.',
        data: { 
          id: result.insertedId,
          user: userWithoutPassword
        }
      })
    } catch (insertError) {
      console.error('Error saving user:', insertError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to create account',
          error: insertError instanceof Error ? insertError.message : 'Unknown database error'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Error in signup API:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process registration',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 