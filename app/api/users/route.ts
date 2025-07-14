import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('blog-app');
    const users = await db.collection('users').find({}, {
      projection: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        role: 1,
        status: 1,
        createdAt: 1,
        lastActive: 1,
        'profile.phone': 1,
        'profile.location': 1,
        'profile.bio': 1,
        articles: 1
      }
    }).toArray();
    const mapped = users.map(u => ({
      id: u._id.toString(),
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      email: u.email,
      role: u.role || (u.isWriter ? 'writer' : 'user'),
      status: u.status || 'active',
      joinDate: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : '',
      lastActive: u.lastActive ? new Date(u.lastActive).toISOString().slice(0, 10) : '',
      articles: u.articles || 0,
      profile: {
        phone: u.profile?.phone || '',
        location: u.profile?.location || '',
        bio: u.profile?.bio || ''
      }
    }));
    return NextResponse.json({ success: true, users: mapped });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch users', error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('blog-app');
    const { id, email } = await request.json();
    if (!id && !email) {
      return NextResponse.json({ success: false, message: 'User id or email is required' }, { status: 400 });
    }
    const filter: any = id ? { _id: new ObjectId(id) } : { email };
    const result = await db.collection('users').deleteOne(filter);
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete user', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 