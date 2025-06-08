"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, ArrowUpRight, Heart, MessageCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogCardProps {
  id?: string
  seoTitle: string
  seoDescription: string
  author: {
    name: string
    avatar: string
    initials: string
  }
  publishDate: string
  readTime: string
  category: string
  tags: string[]
  image?: string
  featured?: boolean
  likes?: number
  comments?: number
  index?: number
}

export function BlogCard({
  id,
  seoTitle,
  seoDescription,
  author,
  publishDate,
  readTime,
  category,
  tags,
  image,
  featured = false,
  likes = 0,
  comments = 0,
  index = 0
}: BlogCardProps) {
  
  console.log("Blog card rendered:", seoTitle)

  return (
    <motion.article
      className={`group bg-card border rounded-xl overflow-hidden card-hover ${
        featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
    >
      {/* Image */}
      {image && (
        <div className="relative overflow-hidden">
          <div 
            className={`bg-gradient-to-br from-navy-500 to-coral-500 ${
              featured ? 'aspect-[16/9]' : 'aspect-[4/3]'
            }`}
          >
            <div className="absolute inset-0 bg-black/20" />
            <motion.div
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Bookmark className="h-4 w-4 text-white" />
              </Button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`p-6 ${featured ? 'lg:p-8' : ''}`}>
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <Badge 
            variant="secondary" 
            className="bg-coral-500/10 text-coral-600 border-coral-500/20 font-medium"
          >
            {category}
          </Badge>
          {featured && (
            <Badge variant="outline" className="border-navy-500/20 text-navy-600">
              Featured
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-3 leading-tight group-hover:text-coral-600 transition-colors ${
          featured ? 'text-2xl lg:text-3xl' : 'text-xl'
        }`}>
          <a href={id ? `/articles/${id}` : "#"} className="after:absolute after:inset-0">
            {seoTitle}
          </a>
        </h3>

        {/* Description */}
        <div className="relative">
          <p 
            className={`text-muted-foreground leading-relaxed mb-6 line-clamp-3 hover:line-clamp-none transition-all duration-200 ${
              featured ? 'text-lg' : ''
            }`}
            title={seoDescription}
          >
            {seoDescription}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, featured ? 4 : 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md hover:bg-coral-500/10 hover:text-coral-600 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <Avatar className={featured ? 'h-10 w-10' : 'h-8 w-8'}>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-navy-500 text-white text-sm">
                {author.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{author.name}</p>
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{publishDate}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{readTime}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-muted-foreground">
            <motion.button
              className="flex items-center space-x-1 text-xs hover:text-coral-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </motion.button>
            <motion.button
              className="flex items-center space-x-1 text-xs hover:text-navy-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </motion.button>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="h-4 w-4 text-coral-500" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}