"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Heart, Twitter, Linkedin, Github, Mail } from "lucide-react"

interface AuthorBioProps {
  id: string
}

export function AuthorBio({ id }: AuthorBioProps) {
  // Mock author data based on article ID
  const getAuthorData = (id: string) => {
    const authors = {
      "1": {
        name: "Elena Volkov",
        title: "Senior Technology Writer",
        bio: "Elena is a technology journalist and startup advisor with over 10 years of experience covering the intersection of technology and society. She has written for major tech publications and consulted for AI startups on content strategy. Her expertise spans artificial intelligence, digital transformation, and the future of work.",
        avatar: "",
        initials: "EV",
        stats: {
          articles: 45,
          followers: "12.5K",
          likes: "89.2K"
        },
        social: {
          twitter: "#",
          linkedin: "#",
          github: "#",
          email: "elena@editorial.com"
        },
        specialties: ["AI & Machine Learning", "Digital Transformation", "Future of Work", "Startup Strategy"]
      },
      "2": {
        name: "Marcus Chen",
        title: "Lead Design Systems Architect",
        bio: "Marcus is a design leader with 8+ years of experience building design systems at top tech companies. He has led design system initiatives at companies like Airbnb and Spotify, and currently consults for organizations looking to scale their design operations. His passion lies in creating systematic approaches to design that empower teams.",
        avatar: "",
        initials: "MC",
        stats: {
          articles: 32,
          followers: "8.7K",
          likes: "56.3K"
        },
        social: {
          twitter: "#",
          linkedin: "#",
          github: "#",
          email: "marcus@editorial.com"
        },
        specialties: ["Design Systems", "Product Design", "Design Operations", "Team Leadership"]
      }
    }
    return authors[id as keyof typeof authors] || authors["1"]
  }

  const author = getAuthorData(id)

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-transparent hover:border-coral-500/20 transition-colors">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Author Avatar & Basic Info */}
                <div className="text-center md:text-left">
                  <Avatar className="h-32 w-32 mx-auto md:mx-0 mb-4">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback className="bg-navy-500 text-white text-2xl">
                      {author.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-2xl font-bold mb-2">{author.name}</h3>
                  <p className="text-coral-600 font-medium mb-4">{author.title}</p>
                  
                  {/* Author Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{author.stats.articles}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Articles
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{author.stats.followers}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <Users className="h-3 w-3 mr-1" />
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{author.stats.likes}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <Heart className="h-3 w-3 mr-1" />
                        Likes
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start items-center space-x-3">
                    {author.social.twitter && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-blue-500">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                    {author.social.linkedin && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-blue-600">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    )}
                    {author.social.github && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-gray-700">
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                    {author.social.email && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-coral-600">
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Author Bio & Specialties */}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-4">About the Author</h4>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {author.bio}
                  </p>

                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Specialties</h5>
                    <div className="flex flex-wrap gap-2">
                      {author.specialties.map((specialty) => (
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
  )
}