"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BlogCard } from "./blog-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, TrendingUp, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface BlogPost {
  id?: string
  _id?: string
  titles?: { id: string; type: string; value: string }[]
  excerpts?: { id: string; type: string; value: string }[]
  contents?: { id: string; type: string; value: string }[]
  category?: string
  tags?: string[]
  featuredImage?: string | null
  publishDate?: string
  seoTitle?: string
  seoDescription?: string
  isDraft?: boolean
  allowComments?: boolean
  createdAt?: string
  updatedAt?: string
  status?: string
  publishedAt?: string
  author?: {
    name?: string
    email?: string
  }
  likes?: number
  comments?: number
  featured?: boolean
}

export function BlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPosts, setTotalPosts] = useState(0)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    "All",
    "Islamic Essentials", 
    "Lifestyle",
    "Innovation",
    "Literature",
    "Scientific Reflections",
  ]

  const fetchBlogs = async (category: string = selectedCategory, pageNum: number = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Fetching blogs for category:', category, 'page:', pageNum)
      
      const response = await fetch(
        `/api/uploads?status=published&category=${encodeURIComponent(category)}&page=${pageNum}&limit=${visiblePosts}`
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Received blog data:', data)

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch blogs')
      }

      if (pageNum === 1) {
        setBlogPosts(data.data)
      } else {
        setBlogPosts(prev => [...prev, ...data.data])
      }
      setTotalPosts(data.pagination.total)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError(error instanceof Error ? error.message : 'Failed to load blogs')
      toast.error(error instanceof Error ? error.message : 'Failed to load blogs. Please try again later.')
      // Reset state on error
      if (pageNum === 1) {
        setBlogPosts([])
        setTotalPosts(0)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setVisiblePosts(6)
    setPage(1)
  }

  const handleLoadMore = async () => {
    const nextPage = page + 1
    await fetchBlogs(selectedCategory, nextPage)
    setVisiblePosts(prev => prev + 6)
  }

  // Helper function to safely get author initials
  const getAuthorInitials = (name: string) => {
    try {
      return name.split(' ').map(n => n[0]).join('')
    } catch {
      return 'A'
    }
  }

  // Helper function to safely get read time
  const getReadTime = (post: BlogPost) => {
    const content = post.contents?.[0]?.value || ''
    try {
      return `${Math.ceil(content.split(' ').length / 200)} min read`
    } catch {
      return '5 min read'
    }
  }

  // Helper function to get a smart excerpt from content
  const getExcerpt = (post: BlogPost) => {
    const content = post.excerpts?.[0]?.value || post.contents?.[0]?.value || ''
    if (!content) return '';
    // Try to get the first paragraph or up to 150 chars
    const firstPara = content.split(/\n\n|\r\n\r\n/)[0];
    if (firstPara.length > 150) {
      return firstPara.substring(0, 150) + '...';
    }
    if (firstPara.length > 0) {
      return firstPara;
    }
    // Fallback: just take the first 150 chars
    return content.substring(0, 150) + '...';
  };

  return (
    <section id="articles" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-navy-500/10 text-navy-600 border-navy-500/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            Latest Articles
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Discover</span> insightful content
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our curated collection of articles covering design, development, business insights, 
            and the latest trends shaping the digital world.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className={`${
                selectedCategory === category
                  ? "bg-navy-900 hover:bg-navy-600 text-white"
                  : "hover:border-coral-500 hover:text-coral-600"
              } transition-all duration-200`}
            >
              <Filter className="h-3 w-3 mr-1" />
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-600">
              {error}
            </p>
            <Button
              onClick={() => fetchBlogs()}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              layout
            >
              {blogPosts.map((post, index) => (
                <BlogCard
                  key={post.id || post._id || index}
                  id={post.id || post._id}
                  seoTitle={post.seoTitle || post.titles?.[0]?.value || 'Untitled'}
                  seoDescription={post.seoDescription || getExcerpt(post)}
                  author={{
                    name: post.author?.name || 'Anonymous',
                    avatar: '',
                    initials: getAuthorInitials(post.author?.name || 'Anonymous')
                  }}
                  publishDate={new Date(post.publishedAt || post.publishDate || post.createdAt || '').toLocaleDateString()}
                  readTime={getReadTime(post)}
                  category={post.category || 'Uncategorized'}
                  tags={post.tags || []}
                  image={post.featuredImage || '/placeholder-blog.jpg'}
                  featured={post.featured || false}
                  likes={post.likes || 0}
                  comments={Array.isArray(post.comments) ? post.comments.length : (typeof post.comments === 'number' ? post.comments : 0)}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Load More Button */}
            {blogPosts.length < totalPosts && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  variant="outline"
                  className="border-coral-500 text-coral-600 hover:bg-coral-50 px-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Articles'
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Showing {blogPosts.length} of {totalPosts} articles
                </p>
              </motion.div>
            )}

            {/* No Results */}
            {!isLoading && !error && blogPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No articles found in this category.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}