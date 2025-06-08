"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, MapPin, Calendar, Mail, Phone, Globe, Github, Linkedin, Twitter, Star } from "lucide-react"
import { toast } from "sonner"

interface WriterProfile {
  _id: string
  name: string
  email: string
  title?: string
  category?: string
  pitch?: string
  experience?: string
  portfolio?: string
  updatedAt?: string
  profile?: {
    phone?: string
    bio?: string
    location?: string
    website?: string
  }
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
  preferences?: Record<string, any>
  profileImageUrl?: string
}

interface WriterProfileOverlayProps {
  email: string
  isOpen: boolean
  onClose: () => void
}

export function WriterProfileOverlay({ email, isOpen, onClose }: WriterProfileOverlayProps) {
  const [profile, setProfile] = useState<WriterProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen && email) {
      fetchWriterProfile()
    }
    // eslint-disable-next-line
  }, [isOpen, email])

  const fetchWriterProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/writers/${email}`)
      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
      } else {
        toast.error('Failed to fetch writer profile')
      }
    } catch (error) {
      console.error('Error fetching writer profile:', error)
      toast.error('Failed to fetch writer profile')
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                {profile.profileImageUrl ? (
                  <AvatarImage src={profile.profileImageUrl} alt={profile.name} />
                ) : (
                  <AvatarFallback className="bg-navy-500 text-white text-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {profile.name}
                </h2>
                {profile.category && (
                  <Badge className="bg-coral-500 text-white mt-1">{profile.category}</Badge>
                )}
                {profile.title && (
                  <span className="text-base font-medium text-muted-foreground mt-1">{profile.title}</span>
                )}
              </div>
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.profile?.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{profile.profile.phone}</span>
                    </div>
                  )}
                  {profile.profile?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.profile.location}</span>
                    </div>
                  )}
                  {profile.profile?.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a href={profile.profile.website} target="_blank" rel="noopener noreferrer" className="underline">Website</a>
                    </div>
                  )}
                  {profile.portfolio && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="underline">Portfolio</a>
                    </div>
                  )}
                </div>
                {profile.updatedAt && (
                  <div className="text-xs text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 inline-block mr-1" />
                    Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
              {profile.pitch && (
                <div className="w-full mt-2">
                  <h3 className="font-semibold mb-1">Pitch</h3>
                  <p className="text-muted-foreground text-center max-w-md mx-auto">{profile.pitch}</p>
                </div>
              )}
              {profile.experience && (
                <div className="w-full mt-2">
                  <h3 className="font-semibold mb-1">Experience</h3>
                  <p className="text-muted-foreground text-center max-w-md mx-auto">{profile.experience}</p>
                </div>
              )}
              {profile.profile?.bio && (
                <div className="w-full mt-2">
                  <h3 className="font-semibold mb-1">Bio</h3>
                  <p className="text-muted-foreground text-center max-w-md mx-auto">{profile.profile.bio}</p>
                </div>
              )}
              {profile.socialLinks && (
                <div className="flex gap-2 mt-2">
                  {profile.socialLinks.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {profile.socialLinks.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {profile.socialLinks.github && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {profile.socialLinks.website && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
              {profile.preferences && (
                <div className="w-full mt-2">
                  <h3 className="font-semibold mb-1">Preferences</h3>
                  <pre className="bg-muted rounded p-2 text-xs overflow-x-auto max-w-md mx-auto">
                    {JSON.stringify(profile.preferences, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load writer profile
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 