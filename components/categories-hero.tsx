"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Layers, Grid3X3 } from "lucide-react"

export function CategoriesHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log("Categories hero mounted")
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[50vh] pt-16 overflow-hidden bg-gradient-to-br from-editorial-bg via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-navy-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="mb-4 bg-coral-500/10 text-coral-600 border-coral-500/20">
              <Layers className="h-3 w-3 mr-1" />
              Explore Topics
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient">Browse by</span>
              <br />
              <span className="text-foreground">category</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Discover articles organized by topic. From technology and design to business and lifestyle, 
              find exactly what you're looking for.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}