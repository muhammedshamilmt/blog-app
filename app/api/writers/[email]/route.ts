import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    // Get writer data from writers collection
    const writer = await db.collection('writers').findOne(
      { email },
      {
        projection: {
          _id: 1,
          name: 1,
          email: 1,
          title: 1,
          category: 1,
          pitch: 1,
          experience: 1,
          portfolio: 1,
          updatedAt: 1,
          profile: 1,
          socialLinks: 1,
          preferences: 1,
          profileImageUrl: 1
        }
      }
    )

    if (!writer) {
      return NextResponse.json(
        { success: false, message: 'Writer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: writer
    })

  } catch (error) {
    console.error('Error fetching writer profile:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch writer profile' },
      { status: 500 }
    )
  }
} 