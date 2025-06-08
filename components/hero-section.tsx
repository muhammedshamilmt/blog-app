"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Users, BookOpen, Star } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    console.log("Hero section mounted")
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const stats = [
    { icon: Users, value: "50K+", label: "Readers" },
    { icon: BookOpen, value: "1.2K", label: "Articles" },
    { icon: Star, value: "4.9", label: "Rating" },
  ]

  const floatingCards = [
    {
      title: "The Future of Web Design",
      author: "Sarah Chen",
      readTime: "5 min read",
      category: "Design",
      gradient: "from-navy-500 to-navy-600",
    },
    {
      title: "Building Scalable React Apps",
      author: "Alex Rodriguez",
      readTime: "8 min read", 
      category: "Development",
      gradient: "from-coral-500 to-coral-600",
    },
    {
      title: "UX Psychology Principles",
      author: "Maya Patel",
      readTime: "6 min read",
      category: "Psychology",
      gradient: "from-navy-600 to-coral-500",
    },
  ]

  return (
    <section className="relative min-h-screen pt-16 overflow-hidden bg-gradient-to-br from-editorial-bg via-background to-muted/20">
      {/* Geometric Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,41,59,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(249,115,22,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(30,41,59,0.1)_0%,transparent_50%)]" />
      </div>

      {/* Dynamic Gradient Orbs */}
      <div className="absolute inset-0 opacity-40">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-navy-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            type: "spring", 
            stiffness: 50, 
            damping: 30,
            scale: { duration: 4, repeat: Infinity }
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
            scale: [1.2, 1, 1.2],
          }}
          transition={{ 
            type: "spring", 
            stiffness: 50, 
            damping: 30,
            scale: { duration: 5, repeat: Infinity }
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-navy-500/5 to-coral-500/5 rounded-full blur-2xl"
          animate={{
            x: mousePosition.x * 0.08,
            y: -mousePosition.y * 0.08,
            rotate: mousePosition.x * 0.1,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 25,
            scale: { duration: 3, repeat: Infinity }
          }}
        />
        
        {/* Additional Floating Elements */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-coral-500/20 to-navy-500/20 rounded-xl blur-xl"
          animate={{
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-tl from-navy-500/15 to-coral-500/15 rounded-full blur-lg"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-coral-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Content Sections with Dividers */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Featured Badge Section */}
        <motion.div 
          className="absolute top-10 right-10 hidden lg:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-coral-500 to-navy-500 p-[1px] rounded-full">
            <div className="bg-background rounded-full px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-foreground">Live Updates</span>
            </div>
          </div>
        </motion.div>

        {/* Decorative Side Elements */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:block">
          <motion.div 
            className="flex flex-col space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-b from-coral-500 to-navy-500 rounded-full"
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 40}px` }}
                transition={{ 
                  delay: 2 + i * 0.1, 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
              />
            ))}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge variant="secondary" className="mb-4 bg-coral-500/10 text-coral-600 border-coral-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                New Stories Weekly
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <motion.span 
                  className="text-gradient inline-block"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                >
                  Stories that
                </motion.span>
                <br />
                <motion.span 
                  className="text-foreground inline-block"
                  whileHover={{ 
                    color: "rgb(249, 115, 22)",
                    transition: { duration: 0.3 }
                  }}
                >
                  inspire and
                </motion.span>
                <br />
                <motion.span 
                  className="text-foreground inline-block relative"
                  whileHover={{ 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                >
                  enlighten
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-coral-500 to-navy-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isVisible ? "100%" : 0 }}
                    transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                  />
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover thoughtful articles, in-depth analysis, and compelling narratives 
              from writers who are passionate about sharing knowledge and sparking meaningful conversations.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-navy-900 hover:bg-navy-600 text-white group relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-coral-500 to-navy-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Start Reading</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="border-coral-500 text-coral-600 hover:bg-coral-50 relative group">
                  <motion.div
                    className="absolute inset-0 bg-coral-500/10"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Browse Categories</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Stats with Animated Divider */}
            <motion.div
              className="relative pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Animated Border */}
              <motion.div
                className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-coral-500 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: isVisible ? "100%" : 0 }}
                transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
              />
              
              <div className="flex gap-8 pt-6">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={stat.label} 
                    className="flex items-center space-x-3 relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-coral-500/10 to-navy-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <motion.div
                      className="relative bg-coral-500/10 p-2 rounded-lg"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="h-5 w-5 text-coral-500" />
                    </motion.div>
                    <div className="relative">
                      <motion.div 
                        className="text-2xl font-bold text-foreground"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 200 }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional Content Divs */}
            {/* <motion.div
              className="mt-12 grid grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div 
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 group hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-coral-500 to-coral-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">Quality Content</h3>
                </div>
                <p className="text-sm text-muted-foreground">Curated articles from expert writers</p>
              </motion.div>

              <motion.div 
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 group hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-navy-500 to-navy-600 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">Community</h3>
                </div>
                <p className="text-sm text-muted-foreground">Join our growing community of readers</p>
              </motion.div>
            </motion.div> */}
          </div>

          {/* Enhanced Floating Cards Section */}
          <div className="relative lg:h-[600px] hidden lg:block">
            {/* Background Decorative Elements */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 border-2 border-coral-500/20 rounded-full"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-24 h-24 border-2 border-navy-500/20 rounded-lg"
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Content Dividers */}
            <motion.div
              className="absolute top-1/3 left-1/2 w-px h-20 bg-gradient-to-b from-transparent via-coral-500/50 to-transparent"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            />
            
            {floatingCards.map((card, index) => (
              <motion.div
                key={index}
                className={`absolute w-80 bg-card/80 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-6 card-hover cursor-pointer overflow-hidden ${
                  index === 0 ? 'top-10 left-0' :
                  index === 1 ? 'top-40 right-0' :
                  'bottom-10 left-16'
                }`}
                initial={{ 
                  opacity: 0, 
                  y: 50,
                  rotate: index % 2 === 0 ? -5 : 5
                }}
                animate={{ 
                  opacity: isVisible ? 1 : 0, 
                  y: isVisible ? 0 : 50,
                  rotate: isVisible ? (index % 2 === 0 ? -2 : 2) : (index % 2 === 0 ? -5 : 5),
                  x: mousePosition.x * (index % 2 === 0 ? 0.02 : -0.02),
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.8 + index * 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.08,
                  rotate: 0,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Enhanced Card Content */}
                <motion.div 
                  className={`h-2 w-full bg-gradient-to-r ${card.gradient} rounded-full mb-4 relative overflow-hidden`}
                  whileHover={{ 
                    height: "6px",
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      repeatDelay: 3
                    }}
                  />
                </motion.div>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs bg-white/10 text-foreground border-white/20">
                    {card.category}
                  </Badge>
                  <motion.div
                    className="w-2 h-2 bg-coral-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                
                <h3 className="font-bold text-lg mb-3 leading-tight">{card.title}</h3>
                
                {/* Enhanced Info Section */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-coral-500 to-navy-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{card.author.charAt(0)}</span>
                    </div>
                    <span>{card.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>{card.readTime}</span>
                  </div>
                </div>
                
                {/* Enhanced Hover Effects */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-navy-500/10 to-coral-500/10 rounded-xl opacity-0 pointer-events-none"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Corner Accent */}
                <motion.div
                  className="absolute top-2 right-2 w-8 h-8 border-l-2 border-b-2 border-coral-500/30"
                  whileHover={{ 
                    borderColor: "rgba(249, 115, 22, 0.8)",
                    scale: 1.2
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            ))}
            
            {/* Additional Floating Info Boxes */}
            <motion.div
              className="absolute top-1/2 right-10 bg-navy-500/10 backdrop-blur-sm border border-navy-500/20 rounded-lg p-3 hidden xl:block"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-navy-500">25+</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Decorative Wave Divider */}
        <motion.div
          className="relative h-24 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.svg
            className="absolute bottom-0 w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            animate={{ x: [0, -50, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <motion.path
              d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
              fill="rgba(30, 41, 59, 0.1)"
              animate={{ 
                d: [
                  "M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z",
                  "M0,80 C150,140 350,20 600,80 C850,140 1050,20 1200,80 L1200,120 L0,120 Z",
                  "M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.svg>
          
          <motion.svg
            className="absolute bottom-0 w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <motion.path
              d="M0,80 C200,140 400,20 600,80 C800,140 1000,20 1200,80 L1200,120 L0,120 Z"
              fill="rgba(249, 115, 22, 0.05)"
              animate={{ 
                d: [
                  "M0,80 C200,140 400,20 600,80 C800,140 1000,20 1200,80 L1200,120 L0,120 Z",
                  "M0,100 C200,160 400,40 600,100 C800,160 1000,40 1200,100 L1200,120 L0,120 Z",
                  "M0,80 C200,140 400,20 600,80 C800,140 1000,20 1200,80 L1200,120 L0,120 Z"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {/* <motion.div
            className="text-xs text-muted-foreground font-medium tracking-wider uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.div> */}
          
          <div className="relative">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center relative overflow-hidden">
              <motion.div
                className="w-1 h-3 bg-gradient-to-b from-coral-500 to-navy-500 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 border-2 border-coral-500/50 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}