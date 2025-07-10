"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Heart, Twitter, Linkedin, Github, Mail } from "lucide-react"

interface AuthorBioProps {
  id: string // blog post id
}

export function AuthorBio({ id }: AuthorBioProps) {
  const [author, setAuthor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalUploads, setTotalUploads] = useState<number | null>(null)
  const [totalLikes, setTotalLikes] = useState<number | null>(null)

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch blog post to get author email
        const blogRes = await fetch(`/api/blogs/${id}`)
        const blogData = await blogRes.json()
        const authorEmail = blogData?.data?.author?.email
        if (!authorEmail) {
          setError('Author email not found.');
          setAuthor(null)
          setLoading(false)
          return
        }
        // Fetch author profile by email
        const res = await fetch(`/api/profile/get?email=${encodeURIComponent(authorEmail)}`)
        const data = await res.json()
        if (res.ok && data.success) {
          setAuthor(data.data)
          // Fetch total uploads by this user
          const uploadsRes = await fetch(`/api/uploads?authorEmail=${encodeURIComponent(authorEmail)}`)
          const uploadsData = await uploadsRes.json()
          if (uploadsRes.ok && uploadsData.success) {
            setTotalUploads(uploadsData.pagination?.total || 0)
            // Sum likes across all uploads
            const uploads = uploadsData.data || [];
            const likesSum = uploads.reduce((sum: number, upload: any) => sum + (upload.likes || 0), 0);
            setTotalLikes(likesSum);
          } else {
            setTotalUploads(null)
            setTotalLikes(null)
          }
        } else {
          setAuthor(null)
          setError('Author profile not found.')
        }
      } catch (e) {
        setAuthor(null)
        setError('Failed to load author info.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchAuthor()
  }, [id])

  if (loading) {
    return <div className="py-20 text-center">Loading author info...</div>
  }
  if (!author) {
    return <div className="py-20 text-center text-muted-foreground">{error || 'Author info not found.'}</div>
  }

  const fullName = `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.email
  const avatar = author.profile?.profileImageUrl || `https://avatar.vercel.sh/${author.email}.png`
  const initials = (author.firstName?.[0] || '') + (author.lastName?.[0] || '') || author.email?.[0] || 'A'
  const title = author.profile?.bio || ''
  const bio = author.profile?.bio || ''
  const stats = {
    articles: totalUploads !== null ? totalUploads : (author.articles || 0),
    followers: Array.isArray(author.profile?.followers) ? author.profile.followers.length : (author.profile?.followers || 0),
    likes: totalLikes !== null ? totalLikes : (author.profile?.likes || 0)
  }
  const social = author.socialLinks || {}
  const specialties = author.profile?.interests || []

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
                    <AvatarImage src={avatar} alt={fullName} />
                    <AvatarFallback className="bg-navy-500 text-white text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-bold mb-2">{fullName}</h3>
                  <p className="text-coral-600 font-medium mb-4">{title}</p>
                  {/* Author Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{stats.articles}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Articles
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{stats.followers}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <Users className="h-3 w-3 mr-1" />
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{stats.likes}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center">
                        <Heart className="h-3 w-3 mr-1" />
                        Likes
                      </div>
                    </div>
                  </div>
                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start items-center space-x-3">
                    {social.twitter && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-blue-500">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                    {social.linkedin && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-blue-600">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    )}
                    {social.github && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-gray-700">
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                    {author.email && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-coral-600">
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {/* Author Bio & Specialties */}
                <div className="">
                  <h4 className="text-lg font-semibold mb-4">About the Author</h4>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {bio}
                  </p>
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Specialties</h5>
                    <div className="flex flex-wrap gap-2">
                      {specialties.length > 0 ? specialties.map((specialty: string) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      )) : <span className="text-xs text-muted-foreground">No specialties listed.</span>}
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