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
    const serializedWriters = writers.map(writer => {
      const firstName = (writer.firstName || '').trim();
      const lastName = (writer.lastName || '').trim();
      const name = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim() || 'Anonymous';
      const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase() || 'A';
      return {
        name,
        bio: writer.profile?.bio || '',
        avatar: writer.profile?.profileImageUrl || '',
        initials,
        specialty: writer.profile?.specialty || 'Writer',
        articles: writer.profile?.articlesPublished || 0,
        likes: writer.profile?.likes || 0,
        featured: !!writer.featured,
        email: writer.email,
        profile: writer.profile || {}, // <-- Always include full profile object
      };
    });

    return NextResponse.json({ success: true, data: { writers: serializedWriters } })
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
    const { id, email, status } = await request.json();

    if ((!id && !email) || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    if (!db) {
      throw new Error('Database connection failed');
    }

    // Build the filter based on id or email
    let filter: any = {};
    if (id) {
      filter._id = new ObjectId(id);
    } else if (email) {
      filter.email = email;
    }

    // Update user's writer status
    const result = await db.collection('users').updateOne(
      filter,
      { 
        $set: { 
          writerStatus: status,
          isWriter: status === 'approved',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Writer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating writer status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update writer status' },
      { status: 500 }
    );
  }
} 