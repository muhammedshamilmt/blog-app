import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }
    // TODO: Add logic to save email to database or send to newsletter provider
    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
  }
} 