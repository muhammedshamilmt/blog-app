"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { List, Quote, Share2, Twitter, Linkedin, Facebook, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface BlogContentProps {
  id: string
}

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'separator'
  text: string
  author?: string
  level?: number
  isExcerpt?: boolean
}

interface Section {
  title: string
  excerpt: string
  content: string
  type: 'section'
}

interface BlogContentData {
  structuredContent: ContentBlock[]
  tableOfContents: string[]
  sections: Section[]
  category: string
  wordCount: number
  readTime: number
  createdAt: string
  updatedAt: string
}

export default function BlogContent({ id }: BlogContentProps) {
  const [activeSection, setActiveSection] = useState(0)
  const [showTableOfContents, setShowTableOfContents] = useState(false)
  const [contentData, setContentData] = useState<BlogContentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Fetching blog content for ID:", id)
        
        const response = await fetch(`/api/blogs/${id}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch blog content')
        }

        console.log("Blog content received:", data.data)
        setContentData(data.data)
      } catch (error) {
        console.error("Error fetching blog content:", error)
        setError(error instanceof Error ? error.message : 'Failed to load blog content')
        toast.error(error instanceof Error ? error.message : 'Failed to load blog content')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchContent()
    }
  }, [id])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = contentData?.sections[0]?.title || document.title

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
    }
  }

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-navy-600 mx-auto mb-4" />
              <p className="text-muted-foreground">Loading blog content...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !contentData) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Blog content not found'}</p>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Back to Articles
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="hidden lg:block">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <List className="h-5 w-5 mr-2 text-coral-500" />
                    <h3 className="font-semibold">Table of Contents</h3>
                  </div>
                  <nav className="space-y-2">
                    {contentData.tableOfContents.map((item, index) => (
                      <button
                        key={item}
                        className={`block w-full text-left text-sm py-2 px-3 rounded transition-colors ${
                          activeSection === index
                            ? 'bg-coral-50 text-coral-600 font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        onClick={() => setActiveSection(index)}
                      >
                        {item}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Mobile TOC Toggle */}
              <Button
                variant="outline"
                className="lg:hidden w-full mb-6"
                onClick={() => setShowTableOfContents(!showTableOfContents)}
              >
                <List className="h-4 w-4 mr-2" />
                Table of Contents
              </Button>

              {showTableOfContents && (
                <Card className="lg:hidden mb-6">
                  <CardContent className="p-4">
                    <nav className="space-y-2">
                      {contentData.tableOfContents.map((item, index) => (
                        <button
                          key={item}
                          className="block w-full text-left text-sm py-2 px-3 rounded transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => {
                            setActiveSection(index)
                            setShowTableOfContents(false)
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              )}
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
              {contentData.structuredContent.map((block, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {block.type === 'paragraph' && (
                    <p className={`text-lg leading-relaxed mb-6 ${
                      block.isExcerpt 
                        ? 'text-xl text-muted-foreground italic border-l-4 border-coral-500 pl-4 my-8'
                        : 'text-muted-foreground'
                    }`}>
                      {block.text}
                    </p>
                  )}
                  
                  {block.type === 'heading' && (
                    <h2 
                      className={`font-bold text-foreground mt-12 mb-6 ${
                        block.level === 1 ? 'text-4xl' :
                        block.level === 2 ? 'text-3xl' :
                        block.level === 3 ? 'text-2xl' :
                        'text-xl'
                      }`}
                    >
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
                        {block.author && (
                          <cite className="text-sm font-medium text-muted-foreground">
                            — {block.author}
                          </cite>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {block.type === 'separator' && (
                    <Separator className="my-12" />
                  )}
                </motion.div>
              ))}
            </motion.article>

            {/* Article Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 pt-8"
            >
              <Separator className="mb-8" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-muted-foreground">Share this article:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare('twitter')}
                      className="hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare('linkedin')}
                      className="hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare('facebook')}
                      className="hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="text-xs">
                    {contentData.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {contentData.readTime} min read
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}