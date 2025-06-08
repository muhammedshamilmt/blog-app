"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Camera, 
  Save, 
  Shield, 
  Bell, 
  Eye, 
  Heart, 
  BookOpen, 
  Award,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Instagram
} from "lucide-react"
import { toast } from "sonner"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate writer and content creator with over 5 years of experience in digital storytelling. I love exploring topics around technology, lifestyle, and personal development.",
    website: "https://alexjohnson.dev",
    twitter: "@alexjohnson",
    linkedin: "alex-johnson-writer",
    github: "alexjohnson",
    instagram: "@alexjohnsonwrites",
    joinDate: "March 2023",
    articlesPublished: 24,
    totalViews: "12.5K",
    followers: 486
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    commentNotifications: true,
    followerNotifications: false,
    newsletterUpdates: true,
    profileVisibility: true,
    showEmail: false,
    showPhone: false
  })

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile)
    setIsEditing(false)
    toast.success("Profile updated successfully!")
  }

  const handleSavePreferences = () => {
    console.log("Saving preferences:", preferences)
    toast.success("Preferences saved!")
  }

  const stats = [
    { label: "Articles Published", value: profile.articlesPublished, icon: BookOpen },
    { label: "Total Views", value: profile.totalViews, icon: Eye },
    { label: "Followers", value: profile.followers, icon: Heart },
    { label: "Member Since", value: profile.joinDate, icon: Calendar }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-navy-900 via-blue-600 to-coral-500"></div>
            <CardContent className="relative pt-0 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt={profile.name} />
                    <AvatarFallback className="text-2xl font-bold bg-navy-900 text-white">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 rounded-full w-8 h-8 bg-coral-500 hover:bg-coral-600"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-navy-900">{profile.name}</h1>
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profile.location}
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                      className="bg-navy-900 hover:bg-navy-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge className="bg-coral-500">Writer</Badge>
                    <Badge variant="outline">Verified</Badge>
                    <Badge variant="outline">Pro Member</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-coral-500" />
                    <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={4}
                      />
                    </div>
                    
                    <Button onClick={handleSaveProfile} className="w-full bg-coral-500 hover:bg-coral-600">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <p className="text-sm leading-relaxed">{profile.bio}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links & Preferences */}
            <div className="space-y-6">
              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Website URL"
                          value={profile.website}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Twitter username"
                          value={profile.twitter}
                          onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="LinkedIn username"
                          value={profile.linkedin}
                          onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="GitHub username"
                          value={profile.github}
                          onChange={(e) => setProfile({...profile, github: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <a href={profile.website} className="flex items-center space-x-3 text-blue-600 hover:text-blue-800">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">{profile.website}</span>
                      </a>
                      <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} className="flex items-center space-x-3 text-blue-600 hover:text-blue-800">
                        <Twitter className="h-4 w-4" />
                        <span className="text-sm">{profile.twitter}</span>
                      </a>
                      <a href={`https://linkedin.com/in/${profile.linkedin}`} className="flex items-center space-x-3 text-blue-600 hover:text-blue-800">
                        <Linkedin className="h-4 w-4" />
                        <span className="text-sm">{profile.linkedin}</span>
                      </a>
                      <a href={`https://github.com/${profile.github}`} className="flex items-center space-x-3 text-blue-600 hover:text-blue-800">
                        <Github className="h-4 w-4" />
                        <span className="text-sm">{profile.github}</span>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Privacy & Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email updates about your content</p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Comment Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified when someone comments</p>
                      </div>
                      <Switch
                        checked={preferences.commentNotifications}
                        onCheckedChange={(checked) => setPreferences({...preferences, commentNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">Make your profile public</p>
                      </div>
                      <Switch
                        checked={preferences.profileVisibility}
                        onCheckedChange={(checked) => setPreferences({...preferences, profileVisibility: checked})}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSavePreferences} 
                    className="w-full bg-navy-900 hover:bg-navy-600"
                  >
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}