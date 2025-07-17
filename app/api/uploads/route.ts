import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;
    const language = searchParams.get('language');
    const sort = searchParams.get('sort');

    const { db } = await connectToDatabase();
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (language && language !== 'All') {
      query.language = language;
    }

    // Get total count for pagination
    const total = await db.collection('uploads').countDocuments(query);

    // Fetch uploads with pagination
    let sortOption: { [key: string]: 1 | -1 } = { publishedAt: -1 };
    if (sort === 'likes') {
      sortOption = { likes: -1 };
    }
    const uploads = await db.collection('uploads')
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Serialize the data for client-side consumption
    const serializedUploads = uploads.map(upload => ({
      ...upload,
      featuredImage: typeof upload.featuredImage === 'string' ? upload.featuredImage : '',
      author: (upload.author && typeof upload.author === 'object' && typeof upload.author.name === 'string' && typeof upload.author.email === 'string')
        ? upload.author
        : { name: '', email: '' },
      _id: upload._id.toString(),
      createdAt: upload.createdAt ? upload.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: upload.updatedAt ? upload.updatedAt.toISOString() : new Date().toISOString(),
      publishedAt: upload.publishedAt ? upload.publishedAt.toISOString() : new Date().toISOString(),
      comments: Array.isArray(upload.comments) ? upload.comments.length : (typeof upload.comments === 'number' ? upload.comments : 0)
    }));

    return NextResponse.json({
      success: true,
      data: serializedUploads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch uploads' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id && !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Only handle status update logic
    if (!status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map the status to the correct value
    const mappedStatus = status === 'approved' ? 'published' : status;

    // Update upload status and add publishedAt date if being published
    const updateData: any = {
      status: mappedStatus,
      updatedAt: new Date()
    };

    if (mappedStatus === 'published') {
      updateData.publishedAt = new Date();
    }

    // Update upload status
    const result = await db.collection("uploads").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Upload not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: mappedStatus === 'published' ? 'Content published successfully' : 'Content rejected'
    });
  } catch (error) {
    console.error("Error updating upload status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update upload status" },
      { status: 500 }
    );
  }
} 

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required field: id" },
        { status: 400 }
      );
    }
    const { db } = await connectToDatabase();
    if (!db) {
      throw new Error("Database connection failed");
    }
    const result = await db.collection("uploads").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Upload not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Upload deleted successfully" });
  } catch (error) {
    console.error("Error deleting upload:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete upload" },
      { status: 500 }
    );
  }
} 