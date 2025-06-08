"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Heart, Eye, ArrowRight } from "lucide-react"

interface RelatedArticlesProps {
  id: string
}

export function RelatedArticles({ id }: RelatedArticlesProps) {
  // Mock related articles based on current article
  const getRelatedArticles = (id: string) => {
    const allArticles = [
      {
        id: "3",
        title: "The Evolution of Human-AI Collaboration",
        excerpt: "Exploring how creative professionals are adapting to work alongside artificial intelligence...",
        author: {
          name: "David Kim",
          avatar: "",
          initials: "DK"
        },
        readTime: "7 min read",
        category: "Technology",
        likes: 145,
        views: "3.2K",
        image: ""
      },
      {
        id: "4", 
        title: "Design Tokens: The Future of Scalable Design",
        excerpt: "How design tokens are revolutionizing the way teams maintain consistency across products...",
        author: {
          name: "Sarah Chen",
          avatar: "",
          initials: "SC"
        },
        readTime: "10 min read",
        category: "Design",
        likes: 203,
        views: "4.1K",
        image: ""
      },
      {
        id: "5",
        title: "Machine Learning for Creative Workflows",
        excerpt: "Practical applications of ML in design and content creation that are changing the industry...",
        author: {
          name: "Maya Patel",
          avatar: "",
          initials: "MP"
        },
        readTime: "9 min read", 
        category: "Technology",
        likes: 167,
        views: "2.8K",
        image: ""
      }
    ]
    
    // Filter out current article and return related ones
    return allArticles.filter(article => article.id !== id).slice(0, 2)
  }

  const relatedArticles = getRelatedArticles(id)

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-gradient">Related</span> Articles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Continue your learning journey with these carefully selected articles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {relatedArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer card-hover border-2 border-transparent hover:border-coral-500/20 h-full">
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-navy-500 to-coral-500 relative overflow-hidden">
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

                  {/* Article Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={article.author.avatar} alt={article.author.name} />
                        <AvatarFallback className="bg-navy-500 text-white text-xs">
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

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {article.likes}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.views}
                      </div>
                    </div>
                    <div className="text-coral-600 font-medium group-hover:text-coral-500">
                      Read More
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View More Articles CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="/articles"
            className="inline-flex items-center px-6 py-3 bg-navy-900 hover:bg-navy-600 text-white rounded-lg font-medium transition-colors group"
          >
            Explore All Articles
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}