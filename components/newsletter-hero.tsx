"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Send, Users, Calendar } from "lucide-react"
import { toast } from "sonner"

export function NewsletterHero() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log("Newsletter hero mounted")
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup from hero:", email)
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      setIsSubscribed(true)
      toast.success("Welcome to our newsletter! Check your email for confirmation.")
    }, 1500)
  }

  const stats = [
    { icon: Users, value: "15,000+", label: "Subscribers" },
    { icon: Calendar, value: "Weekly", label: "Delivery" },
    { icon: Mail, value: "98%", label: "Open Rate" },
  ]

  if (isSubscribed) {
    return (
      <section className="relative min-h-[60vh] pt-16 overflow-hidden bg-gradient-to-br from-navy-900 to-navy-600 text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">You're all set! 🎉</h2>
            <p className="text-xl text-navy-100 mb-8">
              Welcome to our community of newsletter readers. Your first edition is on its way!
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[70vh] pt-16 overflow-hidden bg-gradient-to-br from-navy-900 to-navy-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-coral-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="mb-6 bg-coral-500/20 text-coral-300 border-coral-500/30">
              <Mail className="h-3 w-3 mr-1" />
              Weekly Newsletter
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Stay in the know with
              <br />
              <span className="text-coral-400">Editorial Weekly</span>
            </h1>
            
            <p className="text-xl text-navy-100 leading-relaxed max-w-2xl mx-auto mb-8">
              Get the best articles, trending topics, and community highlights delivered 
              straight to your inbox every Tuesday morning.
            </p>
          </motion.div>

          {/* Signup Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-navy-200 focus:border-coral-400 focus:ring-coral-400"
                required
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-coral-500 hover:bg-coral-600 text-white border-none min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Joining...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Subscribe</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.form>

          {/* Stats */}
          <motion.div
            className="flex justify-center gap-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-coral-400 mr-2" />
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </div>
                <div className="text-sm text-navy-200">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}