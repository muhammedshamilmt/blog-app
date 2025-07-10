import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blogId, commentContent, authorName, authorEmail, parentCommentCreatedAt } = body;
    if (!blogId) {
      console.error('Missing blogId in comment POST:', body);
      return NextResponse.json({ success: false, message: 'Missing required field: blogId' }, { status: 400 });
    }
    if (!commentContent) {
      console.error('Missing commentContent in comment POST:', body);
      return NextResponse.json({ success: false, message: 'Missing required field: commentContent' }, { status: 400 });
    }
    if (!authorName) {
      console.error('Missing authorName in comment POST:', body);
      return NextResponse.json({ success: false, message: 'Missing required field: authorName' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db('blog-app');
    if (parentCommentCreatedAt) {
      // This is a reply to a comment
      const blog = await db.collection('uploads').findOne({ _id: new ObjectId(blogId) });
      if (!blog) {
        return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
      }
      const comments = blog.comments || [];
      const commentIndex = comments.findIndex((c: any) => new Date(c.createdAt).getTime() === new Date(parentCommentCreatedAt).getTime());
      if (commentIndex === -1) {
        return NextResponse.json({ success: false, message: 'Parent comment not found' }, { status: 404 });
      }
      const reply = {
        content: commentContent,
        authorName,
        authorEmail: authorEmail || '',
        createdAt: new Date(),
        likes: 0,
      };
      comments[commentIndex].replies = Array.isArray(comments[commentIndex].replies) ? comments[commentIndex].replies : [];
      comments[commentIndex].replies.push(reply);
      await db.collection('uploads').updateOne(
        { _id: new ObjectId(blogId) },
        { $set: { comments } }
      );
      return NextResponse.json({ success: true, message: 'Reply added' });
    } else {
      // This is a top-level comment
      const comment = {
        content: commentContent,
        authorName,
        authorEmail: authorEmail || '',
        createdAt: new Date(),
        likes: 0, // Initialize likes to 0
        replies: [], // Initialize replies as empty array
      };
      const result = await db.collection('uploads').updateOne(
        { _id: new ObjectId(blogId) },
        { $push: { comments: comment } } as any
      );
      if (result.modifiedCount === 1) {
        return NextResponse.json({ success: true, message: 'Comment added' });
      } else {
        return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
      }
    }
  } catch (error) {
    console.error('Error in comment POST:', error);
    return NextResponse.json({ success: false, message: 'Failed to add comment', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blogId');
    if (!blogId) {
      return NextResponse.json({ success: false, message: 'Missing blogId' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db('blog-app');
    const blog = await db.collection('uploads').findOne({ _id: new ObjectId(blogId) });
    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, comments: (blog.comments || []).map((c: any) => ({ ...c, likes: typeof c.likes === 'number' ? c.likes : 0, replies: Array.isArray(c.replies) ? c.replies : [] })) });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch comments', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { blogId, commentCreatedAt } = await request.json();
    if (!blogId || !commentCreatedAt) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db('blog-app');
    // Find the blog post
    const blog = await db.collection('uploads').findOne({ _id: new ObjectId(blogId) });
    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }
    // Find the comment by createdAt (since we don't have a comment id)
    const comments = blog.comments || [];
    const commentIndex = comments.findIndex((c: any) => new Date(c.createdAt).getTime() === new Date(commentCreatedAt).getTime());
    if (commentIndex === -1) {
      return NextResponse.json({ success: false, message: 'Comment not found' }, { status: 404 });
    }
    // Increment likes
    comments[commentIndex].likes = (comments[commentIndex].likes || 0) + 1;
    // Update the blog document
    await db.collection('uploads').updateOne(
      { _id: new ObjectId(blogId) },
      { $set: { comments } }
    );
    return NextResponse.json({ success: true, likes: comments[commentIndex].likes });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update likes', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 