"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Compass, Lightbulb, Users, Globe } from "lucide-react"

export function MissionSection() {
  const values = [
    {
      icon: Target,
      title: "Quality First",
      description: "We believe in showcasing only the highest quality content that adds real value to our readers' lives.",
      gradient: "from-navy-500 to-navy-600"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Our platform thrives on the diverse voices and perspectives of our writer and reader community.",
      gradient: "from-coral-500 to-coral-600"
    },
    {
      icon: Globe,
      title: "Globally Accessible",
      description: "Making knowledge and stories accessible to everyone, everywhere, breaking down barriers to information.",
      gradient: "from-navy-600 to-coral-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation Focus",
      description: "Constantly evolving our platform with new features and technologies to enhance the reading experience.",
      gradient: "from-coral-600 to-navy-500"
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-navy-500/10 text-navy-600 border-navy-500/20">
            <Eye className="h-3 w-3 mr-1" />
            Our Mission
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            <span className="text-gradient">Empowering voices,</span>
            <br />
            connecting minds
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We're on a mission to democratize publishing and create a space where thoughtful content 
            can flourish. Our platform connects writers with engaged readers, fostering meaningful 
            conversations and building communities around shared interests and values.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group card-hover border-2 border-transparent hover:border-coral-500/20 h-full">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-coral-600 transition-colors">
                    {value.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          className="text-center mt-20 p-12 bg-gradient-to-br from-navy-900 to-navy-600 rounded-2xl text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Compass className="h-12 w-12 mx-auto mb-6 text-coral-400" />
          <h3 className="text-3xl font-bold mb-6">Our Vision for 2030</h3>
          <p className="text-xl text-navy-100 leading-relaxed max-w-4xl mx-auto">
            To become the world's most trusted platform for thoughtful discourse, where every story 
            has the potential to inspire, educate, and create positive change in our interconnected world.
          </p>
        </motion.div>
      </div>
    </section>
  )
}