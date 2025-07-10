import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { writerEmail, followerEmail, followerId, followerName } = await request.json();
    if (!writerEmail || (!followerEmail && !followerName)) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db('blog-app');
    // Prepare follower object for writer's followers array
    const followerObj: any = {};
    if (followerEmail) followerObj.email = followerEmail;
    if (followerId) followerObj.id = followerId;
    if (followerName) followerObj.name = followerName;
    // Add follower to writer's followers array, prevent duplicates
    const writerResult = await db.collection('users').updateOne(
      { email: writerEmail },
      { $addToSet: { 'profile.followers': followerObj } }
    );
    if (writerResult.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Writer not found' }, { status: 404 });
    }
    // Add writer to user's following array, prevent duplicates (only if followerEmail is present)
    if (followerEmail) {
      await db.collection('users').updateOne(
        { email: followerEmail },
        { $addToSet: { 'profile.following': { email: writerEmail } } }
      );
      // Don't error if user not found, just skip
    }
    return NextResponse.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to follow writer', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 