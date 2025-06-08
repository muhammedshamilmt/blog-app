"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, CheckCircle, Sparkles, Users, TrendingUp, LogIn } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"

export function NewsletterSignup() {
  const { user } = useUser()
  const router = useRouter()
  const [email, setEmail] = useState(user?.email || "")
  const [isSubscribed, setIsSubscribed] = useState(user?.isSubscribed || false)
  const [isLoading, setIsLoading] = useState(false)

  // Check subscription status when user changes
  useEffect(() => {
    if (user?.isSubscribed) {
      setIsSubscribed(true)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    // Check if user is logged in
    if (!user) {
      toast.error(
        <div className="flex flex-col gap-2">
          <p>Please log in to subscribe to our newsletter</p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="bg-coral-500 hover:bg-coral-600 text-white"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Log in
          </Button>
        </div>,
        {
          duration: 5000,
          position: "top-center",
        }
      )
      return
    }

    // If already subscribed, show message
    if (isSubscribed) {
      toast.info("You're already subscribed to our newsletter!")
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed')
      }

      setIsSubscribed(true)
      
      // Show different messages based on whether it's an existing user
      if (data.data.isExistingUser) {
        toast.success(`Welcome back ${data.data.user.firstName}! You're now subscribed to our newsletter.`)
      } else {
        toast.success("Welcome to our community! Check your email for confirmation.")
      }
      
      console.log("Newsletter subscription successful:", data)
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe to newsletter')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: Sparkles, text: "Weekly curated content" },
    { icon: TrendingUp, text: "Early access to new articles" },
    { icon: Users, text: "Exclusive community insights" },
  ]

  // Show subscribed state if user is already subscribed
  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-br from-navy-900 to-navy-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              {user ? `Welcome back, ${user.firstName}! 🎉` : "Welcome aboard! 🎉"}
            </h2>
            <p className="text-xl text-navy-100 mb-8">
              You're now part of our growing community of {Math.floor(Math.random() * 5000) + 10000}+ readers.
              {user?.subscribedAt && (
                <span className="block text-sm text-navy-200 mt-2">
                  Subscribed on {new Date(user.subscribedAt).toLocaleDateString()}
                </span>
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  className="flex items-center justify-center space-x-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <benefit.icon className="h-5 w-5 text-coral-400" />
                  <span className="text-sm">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="newsletter" className="py-20 bg-gradient-to-br from-navy-900 to-navy-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-coral-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-6 bg-coral-500/20 text-coral-300 border-coral-500/30">
            <Mail className="h-3 w-3 mr-1" />
            Join 15,000+ Subscribers
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Get the best stories
            <br />
            <span className="text-coral-400">delivered weekly</span>
          </h2>
          
          <p className="text-xl text-navy-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stay updated with our carefully curated newsletter featuring the latest insights, 
            trends, and stories from our community of writers and thinkers.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.text}
              className="flex items-center justify-center space-x-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <benefit.icon className="h-5 w-5 text-coral-400" />
              <span className="font-medium">{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Signup Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder={user ? "Your email is pre-filled" : "Enter your email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-navy-200 focus:border-coral-400 focus:ring-coral-400"
              required
              disabled={!!user?.email} // Disable if user is logged in
            />
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || (!!user?.email && email !== user.email)}
              className="bg-coral-500 hover:bg-coral-600 text-white border-none min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Joining...</span>
                </div>
              ) : !user ? (
                <div className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Log in to Subscribe</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Subscribe</span>
                </div>
              )}
            </Button>
          </div>
          
          <p className="text-sm text-navy-200 mt-4">
            {!user ? (
              <>
                Please <button 
                  onClick={() => router.push('/auth/login')} 
                  className="text-coral-400 hover:text-coral-300 underline"
                >
                  log in
                </button> to subscribe to our newsletter
              </>
            ) : (
              "No spam, unsubscribe at any time. We respect your privacy."
            )}
          </p>
        </motion.form>

        {/* Social Proof */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-navy-200 text-sm mb-4">Trusted by readers from</p>
          <div className="flex flex-wrap justify-center gap-6 text-navy-300">
            {["Google", "Microsoft", "Apple", "Meta", "Netflix", "Spotify"].map((company) => (
              <span key={company} className="text-sm font-medium">{company}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}