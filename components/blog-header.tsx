"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Calendar, Eye, Heart, Share2, Bookmark, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface BlogHeaderProps {
  id: string
}

interface BlogData {
  id: string
  seoTitle: string
  seoDescription: string
  title: string
  subtitle: string
  content: string
  category: string
  author: {
    name: string
    avatar: string
    initials: string
  }
  publishDate: string
  readTime: string
  views: number
  likes: number
  image: string
  tags: string[]
}

export function BlogHeader({ id }: BlogHeaderProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [blog, setBlog] = useState<BlogData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Fetching blog with ID:", id)
        
        const response = await fetch(`/api/blogs/${id}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch blog')
        }

        console.log("Blog data received:", data.data)
        setBlog(data.data)
        setIsVisible(true)
      } catch (error) {
        console.error("Error fetching blog:", error)
        setError(error instanceof Error ? error.message : 'Failed to load blog')
        toast.error(error instanceof Error ? error.message : 'Failed to load blog')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast.success(isLiked ? "Removed from likes" : "Added to likes")
    console.log("Like toggled:", !isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? "Removed bookmark" : "Article bookmarked")
    console.log("Bookmark toggled:", !isBookmarked)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard")
    console.log("Article shared")
  }

  if (isLoading) {
    return (
      <section className="relative min-h-[70vh] pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-navy-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </section>
    )
  }

  if (error || !blog) {
    return (
      <section className="relative min-h-[70vh] pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Blog post not found'}</p>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[70vh] pt-16 overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-coral-500">
        {blog.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${blog.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-8 text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>

          {/* Category & Meta */}
          <div className="flex items-center gap-4 mb-6">
            <Badge className="bg-coral-500 text-white">
              {blog.category}
            </Badge>
            <div className="flex items-center text-white/80 text-sm space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {blog.publishDate}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {blog.readTime}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {blog.views.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {blog.seoTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl">
            {blog.seoDescription}
          </p>

          {/* Author & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                <AvatarFallback className="bg-navy-500 text-white">
                  {blog.author.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">{blog.author.name}</p>
                <p className="text-sm text-white/70">Author</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className={`text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {blog.likes + (isLiked ? 1 : 0)}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`text-white hover:bg-white/10 ${isBookmarked ? 'text-coral-400' : ''}`}
                onClick={handleBookmark}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}