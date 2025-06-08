"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, Upload, User, Mail, PenTool, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useUser } from '@/contexts/user-context'

export function SubmissionForm() {
  const { user } = useUser()
  const [isWriter, setIsWriter] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    title: "",
    category: "",
    pitch: "",
    experience: "",
    portfolio: ""
  })
  const [agreeToGuidelines, setAgreeToGuidelines] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check writer status when component mounts
  useEffect(() => {
    const checkWriterStatus = async () => {
      if (!user?.email) return
      
      try {
        const response = await fetch(`/api/writers/check-status?email=${encodeURIComponent(user.email)}`)
        const data = await response.json()
        
        if (data.success) {
          setIsWriter(data.isWriter)
        } else {
          toast.error('Failed to check writer status')
        }
      } catch (error) {
        console.error('Error checking writer status:', error)
        toast.error('Failed to check writer status')
      } finally {
        setIsLoading(false)
      }
    }

    checkWriterStatus()
  }, [user?.email])

  // Update form data when user context changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }))
    }
  }, [user])

  const handleChange = (field: string, value: string) => {
    // Don't allow changes to name and email
    if (field === 'name' || field === 'email') return
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.title || !formData.pitch) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!agreeToGuidelines) {
      toast.error("Please agree to the writing guidelines")
      return
    }

    setIsSubmitting(true)
    
    try {
      // First, update the user's role to writer
      const updateRoleResponse = await fetch('/api/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user?.email, isWriter: true }),
      })

      if (!updateRoleResponse.ok) {
        throw new Error('Failed to update user role')
      }

      // Then submit the article pitch
      const response = await fetch('/api/writers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit pitch')
      }

      toast.success(data.message)
      setIsWriter(true) // Update local state to show writer card
      
      // Reset form except for name and email
      setFormData(prev => ({
        ...prev,
        title: "",
        category: "",
        pitch: "",
        experience: "",
        portfolio: ""
      }))
      setAgreeToGuidelines(false)
      
    } catch (error) {
      console.error('Error submitting pitch:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit pitch')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
      </div>
    )
  }

  if (isWriter) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 border-border/50 shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-3xl font-bold mb-4">
                  You're Already a Writer!
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Thank you for being part of our writing community. You can submit new article pitches at any time.
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      title: "",
                      category: "",
                      pitch: "",
                      experience: "",
                      portfolio: ""
                    }))
                    setIsWriter(false)
                  }}
                  className="bg-navy-900 hover:bg-navy-600"
                >
                  Submit New Article Pitch
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  const categories = [
    "Technology",
    "Design", 
    "Business",
    "Development",
    "Marketing",
    "Lifestyle",
    "Innovation",
    "Leadership"
  ]

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-border/50 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold mb-4">
                Submit Your <span className="text-gradient">Article Pitch</span>
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Tell us about your article idea and let's create something amazing together.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        className="pl-10 bg-muted"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        className="pl-10 bg-muted"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Article Information */}
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <div className="relative">
                    <PenTool className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="title"
                      type="text"
                      placeholder="Your compelling article title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category for your article" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pitch">Article Pitch *</Label>
                  <Textarea
                    id="pitch"
                    placeholder="Describe your article idea, key points you'll cover, and why it would be valuable to our readers... (minimum 200 characters)"
                    value={formData.pitch}
                    onChange={(e) => handleChange("pitch", e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Writing Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about your writing background, expertise in this topic, and any relevant credentials..."
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio/Website</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://yourwebsite.com or link to your writing samples"
                    value={formData.portfolio}
                    onChange={(e) => handleChange("portfolio", e.target.value)}
                  />
                </div>

                {/* Agreement */}
                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="guidelines"
                    checked={agreeToGuidelines}
                    onCheckedChange={(checked) => setAgreeToGuidelines(checked as boolean)}
                  />
                  <Label htmlFor="guidelines" className="text-sm leading-relaxed">
                    I agree to follow Editorial's writing guidelines and understand that 
                    submitted articles will be reviewed by our editorial team. I confirm 
                    that my content will be original and properly attributed.
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-navy-900 hover:bg-navy-600 text-white py-3 text-lg" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting Pitch...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="h-5 w-5 mr-2" />
                      Submit Article Pitch
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Our editorial team reviews all submissions within 3-5 business days. 
                  We'll contact you with feedback and next steps.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}