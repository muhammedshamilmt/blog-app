import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { MongoError } from 'mongodb'

export async function GET(request: Request) {
  try {
    console.log('Starting blog fetch request...')
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '6')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    console.log('Fetch parameters:', { category, limit, page, skip })

    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    const client = await clientPromise
    console.log('MongoDB client connected successfully')

    const db = client.db('blog-app')
    console.log('Using database: blog-app')
    
    // Build query
    const query: any = {}
    if (category && category !== 'All') {
      query.category = category
    }
    console.log('Query:', query)

    try {
      // Get total count for pagination
      console.log('Counting total documents...')
      const total = await db.collection('uploads').countDocuments(query)
      console.log('Total documents found:', total)

      // Get blogs with pagination
      console.log('Fetching blogs...')
      const blogs = await db.collection('uploads')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray()
      console.log('Blogs fetched successfully:', blogs.length)

      // Transform the data to match the frontend format
      const formattedBlogs = blogs.map(blog => {
        // Ensure we have valid data
        const content = blog.content || ''
        const wordCount = content.split(/\s+/).filter(Boolean).length
        const readTime = Math.max(1, Math.ceil(wordCount / 200))

        // Generate SEO-friendly slug if not provided
        const generateSlug = (title: string) => {
          return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        return {
          id: blog._id?.toString() || String(Math.random()),
          title: blog.title || 'Untitled',
          seoTitle: blog.seoTitle || blog.title || 'Untitled',
          seoDescription: blog.seoDescription || blog.excerpt || content.substring(0, 160),
          excerpt: blog.excerpt || content.substring(0, 150) + '...',
          content: blog.content || '',
          author: {
            name: blog.author || 'Anonymous',
            avatar: blog.authorAvatar || '',
            initials: (blog.author || 'A').split(' ').map((n: string) => n[0]).join('').toUpperCase()
          },
          publishDate: blog.createdAt 
            ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            : 'Unknown date',
          readTime: `${readTime} min read`,
          category: blog.category || 'Uncategorized',
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          image: blog.image || 'default',
          featured: Boolean(blog.featured),
          likes: Number(blog.likes) || 0,
          comments: Array.isArray(blog.comments) ? blog.comments.length : 0,
          slug: blog.slug || generateSlug(blog.title || 'untitled'),
          metaKeywords: Array.isArray(blog.metaKeywords) ? blog.metaKeywords : [],
          metaRobots: blog.metaRobots || 'index, follow',
          canonicalUrl: blog.canonicalUrl || '',
          ogImage: blog.ogImage || blog.image || 'default',
          ogTitle: blog.ogTitle || blog.title || 'Untitled',
          ogDescription: blog.ogDescription || blog.seoDescription || blog.excerpt || content.substring(0, 160)
        }
      })

      console.log('Blogs formatted successfully')

      return NextResponse.json({
        success: true,
        data: formattedBlogs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      })

    } catch (error) {
      if (error instanceof MongoError) {
        console.error('MongoDB operation error:', error)
        throw new Error(`Database operation failed: ${error.message}`)
      }
      throw error
    }

  } catch (error) {
    console.error('Error in blog fetch:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch blogs',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
} 