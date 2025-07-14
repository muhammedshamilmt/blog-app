import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email, profile, firstName, lastName, isWriter } = await request.json()
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 })
    }

    // Defensive: Ensure profile is always an object
    const safeProfile = typeof profile === 'object' && profile !== null ? profile : {}

    // Validate phone number format if provided and not empty
    if (safeProfile.phone && typeof safeProfile.phone === 'string' && safeProfile.phone.trim() !== '' && !/^\+?[\d\s-]{10,}$/.test(safeProfile.phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('blog-app')

    // Prepare the profile update object with safe defaults
    const profileUpdate = {
      phone: typeof safeProfile.phone === 'string' ? safeProfile.phone : '',
      bio: typeof safeProfile.bio === 'string' ? safeProfile.bio : '',
      location: typeof safeProfile.location === 'string' ? safeProfile.location : '',
      website: typeof safeProfile.website === 'string' ? safeProfile.website : '',
      socialLinks: {
        twitter: safeProfile.socialLinks?.twitter || '',
        linkedin: safeProfile.socialLinks?.linkedin || '',
        github: safeProfile.socialLinks?.github || '',
        instagram: safeProfile.socialLinks?.instagram || '',
      },
      preferences: safeProfile.preferences || {},
      profileImageUrl: safeProfile.profileImageUrl || '',
      interests: Array.isArray(safeProfile.interests) ? safeProfile.interests : [],
      readingPreferences: safeProfile.readingPreferences || {},
      updatedAt: new Date()
    }

    // Build the update object
    const updateObj: any = { profile: profileUpdate }
    if (firstName) updateObj.firstName = firstName
    if (lastName) updateObj.lastName = lastName
    if (typeof isWriter === 'boolean') updateObj.isWriter = isWriter

    // Update user by email, set the profile object and root fields
    const result = await db.collection('users').updateOne(
      { email },
      { $set: updateObj },
      { upsert: true }
    )

    if (result.matchedCount === 0 && !result.upsertedId) {
      return NextResponse.json(
        { success: false, message: 'User not found and could not be created' },
        { status: 404 }
      )
    }

    // Return the updated user (excluding password)
    const updatedUser = await db.collection('users').findOne({ email }, { projection: { password: 0 } })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
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