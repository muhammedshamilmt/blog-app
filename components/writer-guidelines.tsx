"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, BookOpen, Users, Award, TrendingUp, Heart } from "lucide-react"

export function WriterGuidelines() {
  const guidelines = [
    {
      icon: BookOpen,
      title: "Quality Content",
      description: "Write original, well-researched articles that provide value to readers. Minimum 800 words, with clear structure and engaging narrative.",
      requirements: ["Original content only", "Proper citations", "Clear structure", "Engaging tone"]
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Create content that sparks meaningful discussions and connects with our community of readers and writers.",
      requirements: ["Relevant topics", "Clear takeaways", "Discussion starters", "Community guidelines"]
    },
    {
      icon: Award,
      title: "Editorial Standards",
      description: "Follow our editorial guidelines for formatting, style, and publication standards to maintain platform quality.",
      requirements: ["Grammar check", "Fact verification", "Style guide", "Image guidelines"]
    },
  ]

  const benefits = [
    "Get paid for quality articles",
    "Reach 50,000+ engaged readers",
    "Build your personal brand",
    "Connect with other writers",
    "Editorial support and feedback",
    "Analytics and performance insights"
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
            <BookOpen className="h-3 w-3 mr-1" />
            Writer Guidelines
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Writing</span> standards
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our guidelines help ensure all content meets our quality standards and resonates with our audience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Guidelines */}
          <div className="space-y-8">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={guideline.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-2 border-transparent hover:border-coral-500/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-navy-500 rounded-lg flex items-center justify-center">
                        <guideline.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{guideline.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {guideline.description}
                        </p>
                        <ul className="space-y-2">
                          {guideline.requirements.map((req) => (
                            <li key={req} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-navy-900 to-navy-600 text-white h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Heart className="h-8 w-8 text-coral-400 mr-3" />
                  <h3 className="text-2xl font-bold">Writer Benefits</h3>
                </div>
                
                <p className="text-navy-100 mb-8 leading-relaxed">
                  Join our community of writers and enjoy these exclusive benefits 
                  while sharing your expertise with engaged readers.
                </p>

                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={benefit} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-coral-400 mr-3" />
                      <span className="text-navy-100">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-8 border-t border-navy-500">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <TrendingUp className="h-6 w-6 text-coral-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">$500+</div>
                      <div className="text-sm text-navy-200">Avg. Monthly</div>
                    </div>
                    <div>
                      <Users className="h-6 w-6 text-coral-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-sm text-navy-200">Active Writers</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}