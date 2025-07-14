"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Heart, Lightbulb, Book, FlaskConical } from "lucide-react"

export function CategoryGrid() {
  const categories = [
    {
      name: "Islamic Essentials",
      description: "Core teachings, practices, and guidance in Islam",
      icon: BookOpen,
      count: 234,
      gradient: "from-green-500 to-green-600",
      color: "text-green-600"
    },
    {
      name: "Lifestyle",
      description: "Work-life balance, productivity, and wellness",
      icon: Heart,
      count: 145,
      gradient: "from-pink-500 to-pink-600",
      color: "text-pink-600"
    },
    {
      name: "Innovation",
      description: "Emerging technologies and future trends",
      icon: Lightbulb,
      count: 87,
      gradient: "from-yellow-500 to-yellow-600",
      color: "text-yellow-600"
    },
    {
      name: "Literature",
      description: "Poetry, prose, and literary analysis",
      icon: Book,
      count: 120,
      gradient: "from-purple-500 to-purple-600",
      color: "text-purple-600"
    },
    {
      name: "Scientific Reflections",
      description: "Science, discoveries, and thoughtful insights",
      icon: FlaskConical,
      count: 98,
      gradient: "from-blue-500 to-blue-600",
      color: "text-blue-600"
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer card-hover border-2 border-transparent hover:border-coral-500/20 h-full">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-bold group-hover:${category.color} transition-colors`}>
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}