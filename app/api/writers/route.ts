import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Parse status filter from query params
    let statusFilter = null;
    if (request && request.url) {
      const url = new URL(request.url, 'http://localhost');
      const statusParam = url.searchParams.get('status');
      if (statusParam) {
        statusFilter = statusParam.split(',').map(s => s.trim().toLowerCase());
      }
    }

    // Fetch all users with isWriter: true (approved writers)
    let usersQuery: any = { isWriter: true };
    if (statusFilter && statusFilter.length > 0) {
      usersQuery = {
        ...usersQuery,
        writerStatus: { $in: statusFilter.map(s => s.charAt(0).toUpperCase() + s.slice(1)) }
      };
    }
    const writers = await db
      .collection('users')
      .find(usersQuery)
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch writer requests from writers collection
    let writersQuery = {};
    if (statusFilter && statusFilter.length > 0) {
      writersQuery = { status: { $in: statusFilter } };
    }
    const requests = await db
      .collection('writers')
      .find(writersQuery)
      .sort({ submittedAt: -1 })
      .toArray();

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
        profile: writer.profile || {},
      };
    });

    // Serialize requests
    const serializedRequests = requests.map(req => ({
      id: req._id?.toString() || '',
      name: req.name || '',
      email: req.email || '',
      title: req.title || '',
      category: req.category || '',
      pitch: req.pitch || '',
      experience: req.experience || '',
      portfolio: req.portfolio || '',
      status: req.status || 'pending',
      submittedAt: req.submittedAt ? req.submittedAt.toISOString() : '',
      updatedAt: req.updatedAt ? req.updatedAt.toISOString() : '',
      profileImageUrl: req.profileImageUrl || '',
    }));

    return NextResponse.json({ success: true, data: { writers: serializedWriters, requests: serializedRequests } });
  } catch (error) {
    console.error('Error fetching writers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch writers' },
      { status: 500 }
    );
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

    // Only update the single writer in the writers collection
    const result = await db.collection('writers').updateOne(
      filter,
      { $set: { status, updatedAt: new Date() } }
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