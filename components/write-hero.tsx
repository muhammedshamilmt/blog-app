"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PenTool, Users, BookOpen, ArrowRight, Star, Award } from "lucide-react"

export function WriteHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log("Write hero mounted")
    setIsVisible(true)
  }, [])

  const benefits = [
    { icon: Users, value: "50K+", label: "Active Readers" },
    { icon: BookOpen, value: "1M+", label: "Monthly Views" },
    { icon: Award, value: "Top 1%", label: "Writer Earnings" },
  ]

  return (
    <section className="relative min-h-[70vh] pt-16 overflow-hidden bg-gradient-to-br from-editorial-bg via-background to-muted/20">
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
                <PenTool className="h-3 w-3 mr-1" />
                Join Our Writers
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">Share your story</span>
                <br />
                <span className="text-foreground">with the world</span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Editorial provides a platform for thoughtful writers to reach engaged readers. 
              Whether you're sharing expertise, telling stories, or starting conversations, 
              we're here to amplify your voice.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button size="lg" className="bg-navy-900 hover:bg-navy-600 text-white group">
                Start Writing Today
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-coral-500 text-coral-600 hover:bg-coral-50">
                View Writer Guidelines
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {benefits.map((benefit, index) => (
                <div key={benefit.label} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <benefit.icon className="h-6 w-6 text-coral-500 mr-2" />
                    <div className="text-3xl font-bold text-foreground">{benefit.value}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{benefit.label}</div>
                </div>
              ))}
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
                  <PenTool className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Ready to Write?</h3>
                  <p className="text-lg opacity-90">Join 500+ published authors</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}