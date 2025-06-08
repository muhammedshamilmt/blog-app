"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, TrendingUp, BookOpen, Lightbulb, Globe } from "lucide-react"

export function NewsletterBenefits() {
  const benefits = [
    {
      icon: Clock,
      title: "Weekly Digest",
      description: "Get the top 5 articles of the week, carefully curated by our editorial team.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Trending Topics",
      description: "Stay ahead of the curve with insights into emerging trends and technologies.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Community Highlights",
      description: "Discover active discussions and connect with like-minded readers and writers.",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: BookOpen,
      title: "Exclusive Content",
      description: "Access newsletter-only articles and early previews of upcoming features.",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: Lightbulb,
      title: "Writer Spotlights",
      description: "Meet featured writers and learn about their creative processes and insights.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Global Perspectives",
      description: "Explore diverse viewpoints from our international community of contributors.",
      gradient: "from-indigo-500 to-indigo-600"
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-navy-500/10 text-navy-600 border-navy-500/20">
            What You'll Get
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">More than just</span> updates
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our newsletter is designed to provide real value, not just fill your inbox. 
            Here's what makes Editorial Weekly special.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group card-hover border-2 border-transparent hover:border-coral-500/20 h-full">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 group-hover:text-coral-600 transition-colors">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
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