import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming data
    const formData = await request.json()
    
    // Validate required fields
    if (!formData.titles || !Array.isArray(formData.titles) || formData.titles.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one title is required' },
        { status: 400 }
      )
    }

    if (!formData.contents || !Array.isArray(formData.contents) || formData.contents.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one content block is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    let client
    try {
      client = await clientPromise
      console.log('MongoDB client connected successfully')
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError)
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      )
    }

    const db = client.db('blog-app')
    
    // Prepare the document for insertion
    const uploadData = {
      titles: formData.titles,
      excerpts: formData.excerpts || [],
      contents: formData.contents,
      category: formData.category || '',
      tags: formData.tags || [],
      featuredImage: null, // We'll handle file upload separately
      publishDate: formData.publishDate ? new Date(formData.publishDate) : null,
      seoTitle: formData.seoTitle || '',
      seoDescription: formData.seoDescription || '',
      isDraft: formData.isDraft ?? true,
      allowComments: formData.allowComments ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: formData.isDraft ? 'draft' : 'published',
      _id: new ObjectId()
    }
    
    // Insert into uploads collection
    try {
      const result = await db.collection('uploads').insertOne(uploadData)
      console.log('Document inserted successfully:', result.insertedId)
      
      return NextResponse.json({ 
        success: true, 
        message: formData.isDraft ? 'Draft saved successfully!' : 'Article published successfully!',
        data: { id: result.insertedId }
      })
    } catch (insertError) {
      console.error('Error inserting document:', insertError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to save document to database',
          error: insertError instanceof Error ? insertError.message : 'Unknown database error'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Error in blog upload API:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process blog upload',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 