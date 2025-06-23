import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const SETTINGS_ID = 'blog-app-settings'; // singleton doc

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('blog-app');
    let settings = await db.collection('settings').findOne({ _id: SETTINGS_ID });
    if (!settings) {
      // Create default settings if not found
      settings = {
        _id: SETTINGS_ID,
        siteTitle: 'MyBlog',
        siteDescription: 'A modern blogging platform for writers and readers.',
        adminEmail: 'admin@myblog.com',
        allowRegistration: true,
        moderateComments: true,
        enableNewsletter: true,
        featuredCategories: 'Technology, Design, Business',
        defaultUserRole: 'reader',
        timezone: 'UTC',
        language: 'en',
        analyticsEnabled: true,
        backupFrequency: 'weekly',
        maintenanceMode: false,
      };
      await db.collection('settings').insertOne(settings);
    }
    // Remove _id for client
    const { _id, ...rest } = settings;
    return NextResponse.json({ success: true, settings: rest });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch settings', error: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('blog-app');
    await db.collection('settings').updateOne(
      { _id: SETTINGS_ID },
      { $set: { ...body } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save settings', error: error?.message }, { status: 500 });
  }
} 