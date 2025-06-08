"use client"

import { motion } from "framer-motion"
import { Users, BookOpen, Globe, Heart, TrendingUp, Award } from "lucide-react"

export function StatsSection() {
  const stats = [
    { icon: Users, value: "50,000+", label: "Active Readers", change: "+15% this month" },
    { icon: BookOpen, value: "1,247", label: "Articles Published", change: "+23% this quarter" },
    { icon: Globe, value: "120+", label: "Countries Reached", change: "Global presence" },
    { icon: Heart, value: "98%", label: "Reader Satisfaction", change: "Consistently high" },
    { icon: TrendingUp, value: "2.5M", label: "Monthly Views", change: "+45% growth" },
    { icon: Award, value: "15", label: "Industry Awards", change: "Recognition earned" },
  ]

  return (
    <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-coral-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Growing <span className="text-coral-400">together</span>
          </h2>
          <p className="text-xl text-navy-100 max-w-3xl mx-auto leading-relaxed">
            These numbers represent more than just metrics – they show the vibrant community 
            we've built together and the impact we're making in the world of digital publishing.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-coral-500/20 rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-coral-400" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 text-white">{stat.value}</div>
              <div className="text-lg font-medium text-navy-100 mb-1">{stat.label}</div>
              <div className="text-sm text-coral-300">{stat.change}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}