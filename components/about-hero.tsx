"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Users, Globe, ArrowRight } from "lucide-react"

export function AboutHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log("About hero mounted")
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[80vh] pt-16 overflow-hidden bg-gradient-to-br from-editorial-bg via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-navy-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge variant="secondary" className="mb-4 bg-coral-500/10 text-coral-600 border-coral-500/20">
                <Heart className="h-3 w-3 mr-1" />
                Our Story
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">Building the future</span>
                <br />
                <span className="text-foreground">of digital storytelling</span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Editorial was born from a simple belief: everyone has a story worth telling. 
              We're creating a platform where writers can share their insights, readers can 
              discover new perspectives, and communities can form around shared interests.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button size="lg" className="bg-navy-900 hover:bg-navy-600 text-white group">
                Join Our Community
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-coral-500 text-coral-600 hover:bg-coral-50">
                Read Our Manifesto
              </Button>
            </motion.div>
          </div>

          {/* Visual Element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="relative w-full h-96 bg-gradient-to-br from-navy-900 to-coral-500 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">50,000+</h3>
                  <p className="text-lg opacity-90">Active Community Members</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}