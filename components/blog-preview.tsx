"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Clock, 
  Calendar, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  ArrowLeft,
  Quote,
  List,
  Twitter,
  Linkedin,
  Facebook,
  Users,
  BookOpen,
  Mail
} from "lucide-react"

interface ContentBlock {
  id: string
  type: 'title' | 'excerpt' | 'content'
  value: string
}

interface BlogPreviewProps {
  titles: ContentBlock[]
  excerpts: ContentBlock[]
  contents: ContentBlock[]
  category: string
  tags: string[]
  featuredImage?: File | null
}

export function BlogPreview({ titles, excerpts, contents, category, tags }: BlogPreviewProps) {
  // Mock author data for preview
  const previewAuthor = {
    name: "Your Name",
    title: "Editorial Contributor", 
    avatar: "",
    initials: "YN",
    stats: {
      articles: 12,
      followers: "1.2K",
      likes: "5.4K"
    },
    bio: "This is where your author bio would appear. Share your expertise, background, and what drives your passion for writing in this field.",
    specialties: ["Writing", "Content Creation", "Editorial"]
  }

  // Generate mock metadata
  const previewData = {
    publishDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    readTime: `${Math.max(1, Math.ceil((contents.reduce((acc, content) => acc + content.value.length, 0) / 200)))} min read`,
    views: "0",
    likes: 0
  }

  // Convert content blocks to structured content in sequence
  const structuredContent: Array<{
    type: 'heading' | 'paragraph' | 'quote'
    text: string
    isExcerpt?: boolean
    author?: string
  }> = []
  
  // Find the maximum length to iterate through all sections
  const maxLength = Math.max(titles.length, excerpts.length, contents.length)
  
  // Process content in sequence: title -> excerpt -> content for each index
  for (let i = 0; i < maxLength; i++) {
    // Add title if exists
    if (titles[i] && titles[i].value.trim()) {
      structuredContent.push({
        type: 'heading',
        text: titles[i].value
      })
    }
    
    // Add excerpt if exists
    if (excerpts[i] && excerpts[i].value.trim()) {
      structuredContent.push({
        type: 'paragraph',
        text: excerpts[i].value,
        isExcerpt: true
      })
    }
    
    // Add content if exists
    if (contents[i] && contents[i].value.trim()) {
      // Split content by line breaks and create paragraphs
      const paragraphs = contents[i].value.split('\n\n').filter(p => p.trim())
      paragraphs.forEach(paragraph => {
        if (paragraph.trim().startsWith('#')) {
          structuredContent.push({
            type: 'heading',
            text: paragraph.replace(/^#+\s*/, '')
          })
        } else if (paragraph.trim().startsWith('>')) {
          structuredContent.push({
            type: 'quote',
            text: paragraph.replace(/^>\s*/, ''),
            author: previewAuthor.name
          })
        } else {
          structuredContent.push({
            type: 'paragraph',
            text: paragraph
          })
        }
      })
    }
  }

  const mainTitle = titles[0]?.value || "Your Article Title"
  const mainExcerpt = excerpts[0]?.value || "Your article excerpt will appear here..."

  return (
    <div className="min-h-screen bg-background">
      {/* Blog Header */}
      <section className="relative min-h-[70vh] pt-16 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-coral-500">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            {/* Preview Badge */}
            <div className="mb-6">
              <Badge className="bg-coral-500/90 text-white border-coral-400 animate-pulse">
                📝 Live Preview
              </Badge>
            </div>

            {/* Category & Meta */}
            <div className="flex items-center gap-4 mb-6">
              {category && (
                <Badge className="bg-coral-500 text-white">
                  {category}
                </Badge>
              )}
              <div className="flex items-center text-white/80 text-sm space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {previewData.publishDate}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {previewData.readTime}
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {previewData.views}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {mainTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl">
              {mainExcerpt}
            </p>

            {/* Author & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={previewAuthor.avatar} alt={previewAuthor.name} />
                  <AvatarFallback className="bg-navy-500 text-white">
                    {previewAuthor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">{previewAuthor.name}</p>
                  <p className="text-sm text-white/70">{previewAuthor.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                  <Heart className="h-4 w-4 mr-1" />
                  {previewData.likes}
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {tags.map((tag) => (
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

      {/* Blog Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="hidden lg:block">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <List className="h-5 w-5 mr-2 text-coral-500" />
                      <h3 className="font-semibold">Content Sections</h3>
                    </div>
                    <nav className="space-y-2">
                      {structuredContent
                        .filter(item => item.type === 'heading')
                        .map((item, index) => (
                          <div
                            key={index}
                            className="text-sm py-2 px-3 rounded text-muted-foreground"
                          >
                            {item.text}
                          </div>
                        ))}
                      {structuredContent.filter(item => item.type === 'heading').length === 0 && (
                        <p className="text-sm text-muted-foreground italic">
                          Add titles to see navigation
                        </p>
                      )}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="prose prose-lg max-w-none"
              >
                {structuredContent.length > 0 ? (
                  structuredContent.map((block, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {block.type === 'paragraph' && (
                        <p className={`leading-relaxed mb-6 ${
                          (block as any).isExcerpt 
                            ? 'text-xl text-coral-600 font-medium italic border-l-4 border-coral-500 pl-4' 
                            : 'text-lg text-muted-foreground'
                        }`}>
                          {block.text}
                        </p>
                      )}
                      
                      {block.type === 'heading' && (
                        <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">
                          {block.text}
                        </h2>
                      )}
                      
                      {block.type === 'quote' && (
                        <Card className="my-8 border-l-4 border-l-coral-500 bg-coral-50/50">
                          <CardContent className="p-6">
                            <Quote className="h-8 w-8 text-coral-500 mb-4" />
                            <blockquote className="text-xl italic text-foreground leading-relaxed mb-4">
                              "{block.text}"
                            </blockquote>
                            {(block as any).author && (
                              <cite className="text-sm font-medium text-muted-foreground">
                                — {(block as any).author}
                              </cite>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold mb-2">Start Writing Your Content</h3>
                    <p className="text-muted-foreground">
                      Add titles, excerpts, and content blocks to see your article preview
                    </p>
                  </div>
                )}
              </motion.article>

              {/* Article Actions */}
              {structuredContent.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-12 pt-8"
                >
                  <Separator className="mb-8" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-muted-foreground">Share this article:</span>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-200">
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-200">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-200">
                          <Facebook className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      Preview Mode
                    </Badge>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio Preview */}
      {structuredContent.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-2 border-transparent hover:border-coral-500/20 transition-colors">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Author Avatar & Basic Info */}
                    <div className="text-center md:text-left">
                      <Avatar className="h-32 w-32 mx-auto md:mx-0 mb-4">
                        <AvatarImage src={previewAuthor.avatar} alt={previewAuthor.name} />
                        <AvatarFallback className="bg-navy-500 text-white text-2xl">
                          {previewAuthor.initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="text-2xl font-bold mb-2">{previewAuthor.name}</h3>
                      <p className="text-coral-600 font-medium mb-4">{previewAuthor.title}</p>
                      
                      {/* Author Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{previewAuthor.stats.articles}</div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Articles
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{previewAuthor.stats.followers}</div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center">
                            <Users className="h-3 w-3 mr-1" />
                            Followers
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{previewAuthor.stats.likes}</div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center">
                            <Heart className="h-3 w-3 mr-1" />
                            Likes
                          </div>
                        </div>
                      </div>

                      {/* Social Links Preview */}
                      <div className="flex justify-center md:justify-start items-center space-x-3">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-blue-500">
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-blue-600">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-coral-600">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Author Bio & Specialties */}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-4">About the Author</h4>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {previewAuthor.bio}
                      </p>

                      <div className="mb-6">
                        <h5 className="font-medium mb-3">Specialties</h5>
                        <div className="flex flex-wrap gap-2">
                          {previewAuthor.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="bg-navy-900 hover:bg-navy-600 text-white">
                          <Users className="h-4 w-4 mr-2" />
                          Follow Author
                        </Button>
                        <Button variant="outline" className="border-coral-500 text-coral-600 hover:bg-coral-50">
                          View All Articles
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}