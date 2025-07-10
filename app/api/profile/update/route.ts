import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email, profile } = await request.json()
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 })
    }

    // Validate phone number format if provided
    if (profile.phone && !/^\+?[\d\s-]{10,}$/.test(profile.phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('blog-app')

    // Prepare the profile update object
    const profileUpdate = {
      phone: profile.phone || '',
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      socialLinks: {
        twitter: profile.socialLinks?.twitter || '',
        linkedin: profile.socialLinks?.linkedin || '',
        github: profile.socialLinks?.github || '',
        instagram: profile.socialLinks?.instagram || '',
      },
      preferences: profile.preferences || {},
      profileImageUrl: profile.profileImageUrl || '',
      interests: Array.isArray(profile.interests) ? profile.interests : [],
      readingPreferences: profile.readingPreferences || {},
      updatedAt: new Date()
    }

    // Update user by email, set the profile object
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          profile: profileUpdate
        } 
      },
      { upsert: true }
    )

    if (result.matchedCount === 0 && !result.upsertedId) {
      return NextResponse.json(
        { success: false, message: 'User not found and could not be created' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully',
      data: profileUpdate
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update profile', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
} 