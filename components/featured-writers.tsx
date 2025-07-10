"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Heart, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { WriterProfileOverlay } from "./writer-profile-overlay"

interface Follower {
  email: string;
  name: string;
}

interface Writer {
  name: string;
  bio: string;
  avatar: string;
  initials: string;
  specialty: string;
  articles: number;
  profile?: {
    followers?: { email: string; name: string }[];
    // ...other profile fields
  };
  likes: number;
  featured: boolean;
  email: string;
}

export function FeaturedWriters() {
  const [writers, setWriters] = useState<Writer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWriter, setSelectedWriter] = useState<string | null>(null)
  const [uploads, setUploads] = useState<any[]>([])

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const response = await fetch('/api/writers?fullProfile=true')
        const data = await response.json()
        if (data.success) {
          setWriters(data.data.writers)
        } else {
          toast.error('Failed to fetch writers')
        }
      } catch (error) {
        console.error('Error fetching writers:', error)
        toast.error('Failed to fetch writers')
      }
    }

    fetchWriters()
  }, [])

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const response = await fetch('/api/uploads?limit=1000')
        const data = await response.json()
        if (data.success) {
          setUploads(data.data)
        } else {
          toast.error('Failed to fetch uploads')
        }
      } catch (error) {
        console.error('Error fetching uploads:', error)
        toast.error('Failed to fetch uploads')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUploads()
  }, [])

  const handleWriterClick = (email: string) => {
    setSelectedWriter(email)
  }

  const handleFollow = async (writerEmail: string) => {
    // Get logged-in user info (check for userEmail or userName in localStorage)
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '';
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
    const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '';
    if (!userEmail && !userName) {
      toast.error('You must be logged in to follow a writer.');
      return;
    }
    try {
      const res = await fetch('/api/writers/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writerEmail, followerEmail: userEmail, followerId: userId, followerName: userName })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('You are now following this writer!');
        // Optionally update UI to reflect follow
      } else {
        toast.error(data.message || 'Failed to follow writer.');
      }
    } catch (error) {
      toast.error('Failed to follow writer.');
    }
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-6 w-3/4 bg-muted rounded mx-auto mb-2" />
                  <div className="h-4 w-1/4 bg-muted rounded mx-auto mb-4" />
                  <div className="h-20 bg-muted rounded mb-4" />
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 bg-muted rounded" />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="h-9 flex-1 bg-muted rounded" />
                    <div className="h-9 w-9 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (writers.length === 0) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Writers Found</h2>
          <p className="text-muted-foreground">
            Our writers are currently preparing their content. Check back soon!
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {writers.map((writer, index) => {
              const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '';
              const isFollowed = Array.isArray(writer.profile?.followers)
                ? writer.profile.followers.some(f => f.email === userEmail)
                : false;
              return (
                <motion.div
                  key={writer.email}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className="group cursor-pointer card-hover border-2 border-transparent hover:border-coral-500/20 h-full"
                    // onClick={() => handleWriterClick(writer.email)}
                  >
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
                          {writer.bio || 'No bio available'}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                        <div>
                          <div className="text-lg font-bold text-foreground">
                            {Array.isArray(uploads)
                              ? uploads.filter(u => u.author && u.author.email === writer.email).length
                              : 0}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Uploads
                          </div>
                        </div>
                        <div>
                          {/* Defensive: Never render followers array directly in JSX */}
                          {/* If you want to show follower names, use: */}
                          {/* {Array.isArray(writer.profile?.followers) && writer.profile.followers.map(f => <span key={f.email}>{f.name}</span>)} */}
                          {/* If you want to show the count, use: */}
                          {/* {Array.isArray(writer.profile?.followers) ? writer.profile.followers.length : 0} */}
                          <div className="text-lg font-bold text-foreground">
                            {Array.isArray(writer.profile?.followers) ? writer.profile?.followers.length : 0}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center">
                            <Users className="h-3 w-3 mr-1" />
                            Followers
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">
                            {Array.isArray(uploads)
                              ? uploads.filter(u => u.author && u.author.email === writer.email && typeof u.likes === 'number')
                                  .reduce((sum, u) => sum + u.likes, 0)
                              : 0}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center">
                            <Heart className="h-3 w-3 mr-1" />
                            Likes
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-navy-900 hover:bg-navy-600"
                          onClick={() => {
                            if (isFollowed) {
                              window.location.href = `mailto:${writer.email}`;
                            } else {
                              handleFollow(writer.email);
                            }
                          }}
                          disabled={false}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          {isFollowed ? 'Followed' : 'Follow'}
                        </Button>
                        <Button size="sm" variant="outline" className="border-coral-500 text-coral-600 hover:bg-coral-50">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <WriterProfileOverlay
        email={selectedWriter || ''}
        isOpen={!!selectedWriter}
        onClose={() => setSelectedWriter(null)}
      />
    </>
  )
}