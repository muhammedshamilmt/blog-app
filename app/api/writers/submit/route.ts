import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming data
    const formData = await request.json()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.title || !formData.pitch) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields' },
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
    
    // Prepare the document for insertion
    const writerSubmission = {
      ...formData,
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date(),
      updatedAt: new Date(),
      _id: new ObjectId()
    }
    
    // Insert into writers collection
    try {
      const result = await db.collection('writers').insertOne(writerSubmission)
      console.log('Writer submission saved successfully:', result.insertedId)
      
      return NextResponse.json({ 
        success: true, 
        message: "Submission received! We'll review your pitch and get back to you within 3-5 business days.",
        data: { id: result.insertedId }
      })
    } catch (insertError) {
      console.error('Error saving writer submission:', insertError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to save submission',
          error: insertError instanceof Error ? insertError.message : 'Unknown database error'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Error in writer submission API:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process submission',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 