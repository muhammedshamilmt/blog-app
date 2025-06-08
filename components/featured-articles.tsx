"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, TrendingUp, Star, ArrowRight } from "lucide-react"

export function FeaturedArticles() {
  const featuredArticles = [
    {
      title: "The Future of AI in Creative Industries",
      excerpt: "Exploring how artificial intelligence is reshaping design, writing, and artistic expression while preserving human creativity.",
      author: {
        name: "Elena Volkov",
        avatar: "",
        initials: "EV"
      },
      readTime: "12 min read",
      category: "Technology",
      featured: true,
      trending: true,
    },
    {
      title: "Building Sustainable Design Systems",
      excerpt: "A comprehensive guide to creating design systems that scale with your organization and stand the test of time.",
      author: {
        name: "Marcus Chen",
        avatar: "",
        initials: "MC"
      },
      readTime: "8 min read",
      category: "Design",
      featured: true,
    },
    {
      title: "Remote Leadership in 2024",
      excerpt: "Essential strategies for leading distributed teams effectively in the modern workplace.",
      author: {
        name: "Sarah Johnson",
        avatar: "",
        initials: "SJ"
      },
      readTime: "6 min read",
      category: "Leadership",
      featured: true,
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-navy-500/10 text-navy-600 border-navy-500/20">
            <Star className="h-3 w-3 mr-1" />
            Editor's Picks
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Featured</span> articles
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hand-picked stories that have captured our readers' attention and sparked meaningful discussions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="group cursor-pointer card-hover border-2 border-transparent hover:border-coral-500/20 relative overflow-hidden">
                {article.trending && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-coral-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}
                
                <div className="h-48 bg-gradient-to-br from-navy-500 to-coral-500 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-3 leading-tight group-hover:text-coral-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={article.author.avatar} alt={article.author.name} />
                        <AvatarFallback className="bg-navy-500 text-white">
                          {article.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{article.author.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime}
                        </p>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 text-coral-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}