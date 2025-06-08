import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
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
    
    // Find all writers (users with isWriter: true)
    const writers = await db.collection('users')
      .find({ isWriter: true })
      .project({
        firstName: 1,
        lastName: 1,
        email: 1,
        profile: 1,
        articlesPublished: { $ifNull: ['$profile.articlesPublished', 0] },
        followers: { $ifNull: ['$profile.followers', 0] },
        likes: { $ifNull: ['$profile.likes', 0] },
        specialty: { $ifNull: ['$profile.specialty', 'General'] },
        bio: { $ifNull: ['$profile.bio', ''] },
        featured: { $ifNull: ['$profile.featured', false] }
      })
      .toArray()

    // Format the writers data
    const formattedWriters = writers.map(writer => ({
      name: `${writer.firstName} ${writer.lastName}`,
      bio: writer.bio,
      avatar: writer.profile?.profileImageUrl || '',
      initials: `${writer.firstName[0]}${writer.lastName[0]}`,
      specialty: writer.specialty,
      articles: writer.articlesPublished,
      followers: writer.followers >= 1000 ? `${(writer.followers / 1000).toFixed(1)}K` : writer.followers.toString(),
      likes: writer.likes >= 1000 ? `${(writer.likes / 1000).toFixed(1)}K` : writer.likes.toString(),
      featured: writer.featured,
      email: writer.email
    }))

    return NextResponse.json({ 
      success: true,
      data: {
        writers: formattedWriters
      }
    })
    
  } catch (error) {
    console.error('Error fetching writers:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch writers',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 