"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Heart, MessageCircle } from "lucide-react"

export function FeaturedWriters() {
  const writers = [
    {
      name: "Sarah Chen",
      bio: "Tech journalist and startup advisor with 10+ years covering the intersection of technology and society.",
      avatar: "",
      initials: "SC",
      specialty: "Technology",
      articles: 45,
      followers: "12.5K",
      likes: "89.2K",
      featured: true
    },
    {
      name: "Marcus Rodriguez",
      bio: "Design leader at top tech companies, sharing insights on product design and user experience.",
      avatar: "",
      initials: "MR",
      specialty: "Design",
      articles: 32,
      followers: "8.7K",
      likes: "56.3K",
      featured: true
    },
    {
      name: "Elena Volkov",
      bio: "Business strategist and former McKinsey consultant writing about leadership and growth.",
      avatar: "",
      initials: "EV",
      specialty: "Business",
      articles: 28,
      followers: "15.2K",
      likes: "72.8K",
      featured: true
    },
    {
      name: "David Kim",
      bio: "Full-stack developer and open source contributor sharing coding tips and industry insights.",
      avatar: "",
      initials: "DK",
      specialty: "Development",
      articles: 51,
      followers: "9.8K",
      likes: "64.1K",
      featured: false
    },
    {
      name: "Maya Patel",
      bio: "UX researcher and psychology PhD exploring the human side of digital experiences.",
      avatar: "",
      initials: "MP",
      specialty: "Psychology",
      articles: 23,
      followers: "7.3K",
      likes: "48.5K",
      featured: false
    },
    {
      name: "Ahmed Hassan",
      bio: "DevOps engineer and cloud architect writing about scalable systems and best practices.",
      avatar: "",
      initials: "AH",
      specialty: "Infrastructure",
      articles: 19,
      followers: "6.1K",
      likes: "34.7K",
      featured: false
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {writers.map((writer, index) => (
            <motion.div
              key={writer.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer card-hover border-2 border-transparent hover:border-coral-500/20 h-full">
                <CardContent className="p-6">
                  {writer.featured && (
                    <Badge className="mb-4 bg-coral-500 text-white">
                      Featured Writer
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={writer.avatar} alt={writer.name} />
                      <AvatarFallback className="bg-navy-500 text-white text-lg">
                        {writer.initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-coral-600 transition-colors">
                      {writer.name}
                    </h3>
                    
                    <Badge variant="secondary" className="mb-3">
                      {writer.specialty}
                    </Badge>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {writer.bio}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-foreground">{writer.articles}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Articles
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">{writer.followers}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <Users className="h-3 w-3 mr-1" />
                        Followers
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">{writer.likes}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <Heart className="h-3 w-3 mr-1" />
                        Likes
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-navy-900 hover:bg-navy-600">
                      <Users className="h-4 w-4 mr-1" />
                      Follow
                    </Button>
                    <Button size="sm" variant="outline" className="border-coral-500 text-coral-600 hover:bg-coral-50">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
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