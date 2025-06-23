import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    if (!db) {
      throw new Error('Database connection failed')
    }

    // Fetch all users with isWriter: true
    const writers = await db
      .collection('users')
      .find({ isWriter: true })
      .sort({ createdAt: -1 })
      .toArray()

    // Convert ObjectId to string for JSON serialization
    const serializedWriters = writers.map(writer => ({
      ...writer,
      _id: writer._id.toString(),
      createdAt: writer.createdAt ? writer.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: writer.updatedAt ? writer.updatedAt.toISOString() : new Date().toISOString()
    }))

    return NextResponse.json({ success: true, writers: serializedWriters })
  } catch (error) {
    console.error('Error fetching writers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch writers' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    if (!db) {
      throw new Error('Database connection failed')
    }

    // Update user's writer status
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          writerStatus: status,
          isWriter: status === 'approved', // Set isWriter based on approval status
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Writer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating writer status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update writer status' },
      { status: 500 }
    )
  }
} 