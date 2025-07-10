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

    // Fetch total uploads by this user
    let totalUploads = 0
    let totalViews = 0
    try {
      const uploadsResult = await db.collection('uploads').find({ 
        'author.email': email 
      }).toArray()
      
      totalUploads = uploadsResult.length
      totalViews = uploadsResult.reduce((sum, upload) => sum + (upload.views || 0), 0)
    } catch (uploadError) {
      console.error('Error fetching uploads:', uploadError)
    }

    // Calculate total followers (from other users' followers arrays)
    let totalFollowers = 0
    try {
      const followersResult = await db.collection('users').aggregate([
        {
          $match: {
            'profile.followers': {
              $elemMatch: { email: email }
            }
          }
        },
        {
          $count: 'totalFollowers'
        }
      ]).toArray()
      
      totalFollowers = followersResult.length > 0 ? followersResult[0].totalFollowers : 0
    } catch (followersError) {
      console.error('Error fetching followers:', followersError)
      // Fallback to local followers count if aggregation fails
      totalFollowers = Array.isArray(user.profile?.followers) ? user.profile.followers.length : 0
    }

    // Return full user profile data with proper structure
    return NextResponse.json({ 
      success: true, 
      data: {
        id: user._id?.toString() || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        createdAt: user.createdAt || '',
        updatedAt: user.updatedAt || '',
        profile: {
          phone: user.profile?.phone || '',
          bio: user.profile?.bio || '',
          location: user.profile?.location || '',
          website: user.profile?.website || '',
          socialLinks: user.profile?.socialLinks || {},
          preferences: user.profile?.preferences || {},
          profileImageUrl: user.profile?.profileImageUrl || '',
          interests: Array.isArray(user.profile?.interests) ? user.profile.interests : [],
          readingPreferences: user.profile?.readingPreferences || {},
          followers: user.profile?.followers || [],
          totalViews: totalViews,
          articlesPublished: totalUploads,
          updatedAt: user.profile?.updatedAt || ''
        },
        isWriter: user.isWriter || false,
        isSubscribed: user.isSubscribed || false,
        writerStatus: user.writerStatus || '',
        subscribedAt: user.subscribedAt || '',
        articles: totalUploads,
        totalFollowers: totalFollowers,
        totalViews: totalViews
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