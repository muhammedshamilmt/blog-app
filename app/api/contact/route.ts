import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db('blog-app')

    // Store the contact message in the 'contacts' collection
    const result = await db.collection('contacts').insertOne({
      name,
      email,
      subject: subject || 'No subject',
      message,
      status: 'new', // new, read, replied
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Here you could also:
    // 1. Send an email notification to the admin
    // 2. Send an auto-reply to the user
    // 3. Integrate with a CRM or ticketing system

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: result.insertedId
    })

  } catch (error) {
    console.error('Error in contact form submission:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to send message. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

// Optional: Add a GET endpoint to retrieve contact messages (for admin use)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db('blog-app')
    
    // Build query
    const query: any = {}
    if (status) {
      query.status = status
    }

    // Get total count for pagination
    const total = await db.collection('contacts').countDocuments(query)

    // Get messages with pagination
    const messages = await db.collection('contacts')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch messages' 
      },
      { status: 500 }
    )
  }
} 