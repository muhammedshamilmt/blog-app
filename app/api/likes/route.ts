import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    console.log('[LIKES API] Incoming id:', id);
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    if (!db) {
      throw new Error('Database connection failed');
    }
    let result = null;
    if (ObjectId.isValid(id)) {
      result = await db.collection('uploads').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $inc: { likes: 1 }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      console.log('[LIKES API] Result by _id:', result);
    }
    // If not found and id is a string, try by { id } field (legacy support)
    if ((!result || !result.value) && typeof id === 'string') {
      result = await db.collection('uploads').findOneAndUpdate(
        { id },
        { $inc: { likes: 1 }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      console.log('[LIKES API] Result by id field:', result);
    }
    if (!result || !result.value) {
      console.log('[LIKES API] Blog post not found for id:', id);
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, likes: result.value.likes || 0 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update likes', message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 