import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Ensure params.id is properly awaited
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Blog ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching blog with ID:', id)
    
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('blog-app')
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID format' },
        { status: 400 }
      )
    }

    // Find the blog post
    const blog = await db.collection('uploads').findOne({ 
      _id: new ObjectId(id) 
    })

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Check if the author is a writer in the users DB
    let isWriter = false;
    let writerProfile = null;
    let authorEmail = '';
    if (typeof blog.author === 'object' && blog.author !== null) {
      authorEmail = blog.author.email || '';
    } else if (typeof blog.author === 'string') {
      // If old format, cannot check
      authorEmail = '';
    }
    if (authorEmail) {
      const user = await db.collection('users').findOne({ email: authorEmail });
      if (user) {
        isWriter = !!user.isWriter;
        writerProfile = {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          isWriter: !!user.isWriter,
          // Add more fields as needed
        };
      }
    }

    // Format the blog data
    const content = blog.content || ''
    const wordCount = content.split(/\s+/).filter(Boolean).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    // Parse content into structured format
    const parseContent = () => {
      const structuredContent = []
      const sections = []
      
      // Get the maximum length of our arrays
      const maxLength = Math.max(
        blog.titles?.length || 0,
        blog.excerpts?.length || 0,
        blog.contents?.length || 0
      )

      // Create sections with matching title, excerpt, and content
      for (let i = 0; i < maxLength; i++) {
        const section = {
          title: blog.titles?.[i]?.value || '',
          excerpt: blog.excerpts?.[i]?.value || '',
          content: blog.contents?.[i]?.value || '',
          type: 'section'
        }
        sections.push(section)

        // Add to structured content for rendering
        if (section.title) {
          structuredContent.push({
            type: 'heading',
            text: section.title,
            level: i === 0 ? 1 : 2 // First title is h1, rest are h2
          })
        }

        if (section.excerpt) {
          structuredContent.push({
            type: 'paragraph',
            text: section.excerpt,
            isExcerpt: true
          })
        }

        if (section.content) {
          // Split content into paragraphs
          const paragraphs = section.content.split('\n\n')
          paragraphs.forEach((paragraph: string) => {
            if (paragraph.trim()) {
              if (paragraph.startsWith('#')) {
                const headingLevel = paragraph.match(/^#+/)?.[0].length || 1
                const headingText = paragraph.replace(/^#+\s*/, '')
                structuredContent.push({
                  type: 'heading',
                  text: headingText,
                  level: headingLevel + 2 // Add 2 to make subheadings h3 and below
                })
              } else {
                structuredContent.push({
                  type: 'paragraph',
                  text: paragraph
                })
              }
            }
          })
        }

        // Add a separator between sections (except after the last one)
        if (i < maxLength - 1) {
          structuredContent.push({
            type: 'separator'
          })
        }
      }

      return {
        structuredContent,
        sections
      }
    }

    // Generate table of contents from headings
    const generateTableOfContents = (content: any[]) => {
      return content
        .filter(block => block.type === 'heading')
        .map(block => block.text)
    }

    const { structuredContent, sections } = parseContent()
    const tableOfContents = generateTableOfContents(structuredContent)

    // Format the blog data
    const formattedBlog = {
      id: blog._id.toString(),
      seoTitle: blog.seoTitle || blog.title || 'Untitled',
      seoDescription: blog.seoDescription || blog.excerpt || content.substring(0, 160),
      title: blog.title || 'Untitled',
      subtitle: blog.excerpt || content.substring(0, 150) + '...',
      content: blog.contents?.map((c: any) => c.value) || [],
      category: blog.category || 'Uncategorized',
      sections, // Include the sections array
      structuredContent,
      tableOfContents,
      author: {
        name: typeof blog.author === 'object' && blog.author !== null
          ? blog.author.name || 'Anonymous'
          : typeof blog.author === 'string'
            ? blog.author
            : 'Anonymous',
        avatar: blog.authorAvatar || '',
        initials: (typeof blog.author === 'object' && blog.author !== null
            ? (blog.author.name || 'A')
            : typeof blog.author === 'string'
              ? blog.author
              : 'A')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase(),
        email: typeof blog.author === 'object' && blog.author !== null ? blog.author.email || '' : ''
      },
      isWriter,
      writerProfile,
      publishDate: blog.createdAt 
        ? new Date(blog.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        : 'Unknown date',
      readTime: `${readTime} min read`,
      views: blog.views || 0,
      likes: Number(blog.likes) || 0,
      image: blog.featuredImage || blog.image || '',
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      metaKeywords: Array.isArray(blog.metaKeywords) ? blog.metaKeywords : [],
      metaRobots: blog.metaRobots || 'index, follow',
      canonicalUrl: blog.canonicalUrl || '',
      ogImage: blog.ogImage || blog.image || '',
      ogTitle: blog.ogTitle || blog.title || 'Untitled',
      ogDescription: blog.ogDescription || blog.seoDescription || blog.excerpt || content.substring(0, 160),
      titles: blog.titles?.map((t: any) => t.value) || [],
      excerpts: blog.excerpts?.map((e: any) => e.value) || [],
      wordCount,
      createdAt: blog.createdAt || new Date(),
      updatedAt: blog.updatedAt || new Date()
    }

    return NextResponse.json({
      success: true,
      data: formattedBlog
    })

  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch blog',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
} 