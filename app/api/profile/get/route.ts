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
    
    // Find user by email
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Return user profile data
    return NextResponse.json({ 
      success: true, 
      data: {
        profile: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.profile?.phone || '',
          location: user.profile?.location || '',
          bio: user.profile?.bio || '',
          website: user.profile?.website || '',
          twitter: user.profile?.socialLinks?.twitter || '',
          linkedin: user.profile?.socialLinks?.linkedin || '',
          github: user.profile?.socialLinks?.github || '',
          instagram: user.profile?.socialLinks?.instagram || '',
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
          articlesPublished: user.profile?.articlesPublished || 0,
          totalViews: user.profile?.totalViews || '0',
          followers: user.profile?.followers || 0,
          image: user.profile?.profileImageUrl || `https://avatar.vercel.sh/${user.email}.png`,
          preferences: user.profile?.preferences || {
            emailNotifications: true,
            commentNotifications: true,
            followerNotifications: false,
            newsletterUpdates: true,
            profileVisibility: true,
            showEmail: false,
            showPhone: false
          },
          isWriter: user.isWriter || false,
          isSubscribed: user.isSubscribed || false
        }
      }
    })
    
  } catch (error) {
    console.error('Error in profile get API:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 