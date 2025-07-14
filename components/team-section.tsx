"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, Instagram, Youtube, Facebook } from "lucide-react"

export function TeamSection() {
  const team = [
    {
      name: "SA'ADA",
      role: "Founder & CEO",
      bio: "Students assosiation for akkode DAWA ACADEMY run by akkode islamic center.",
      imageUrl: "/saada.png",
      initials: "SC",
      social: {
        instagram: "https://instagram.com/saada_dawa",
        youtube: "https://youtube.com/saadaacademy",
        facebook: "https://facebook.com/saadaacademy"
      }
    },
    {
      name: "USBA",
      role: "Head of Product",
      bio: "Students assosiation of third bacth of islamic DAWA ACADEMY run by SA'ADA.",
      imageUrl: "/usba.png",
      initials: "MR",
      social: {
        instagram: "https://instagram.com/usba_dawa",
        youtube: "https://youtube.com/usbaacademy",
        facebook: "https://facebook.com/usbaacademy"
      }
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-navy-500/10 text-navy-600 border-navy-500/20">
            <Users className="h-3 w-3 mr-1" />
            Meet the Team
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            The people behind <span className="text-gradient">Editorial</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're a diverse team of creators, engineers, and community builders united by our 
            passion for great storytelling and meaningful connections.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group card-hover border-2 border-transparent hover:border-coral-500/20">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={member.imageUrl} alt={member.name} />
                      <AvatarFallback className="bg-navy-500 text-white text-lg">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1 group-hover:text-coral-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-coral-600 font-medium mb-3">{member.role}</p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {member.bio}
                      </p>
                      
                      <div className="flex items-center space-x-3">
                        {member.social.instagram && (
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <a href={member.social.instagram} target="_blank" rel="noopener noreferrer">
                              <Instagram className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {member.social.youtube && (
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <a href={member.social.youtube} target="_blank" rel="noopener noreferrer">
                              <Youtube className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {member.social.facebook && (
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <a href={member.social.facebook} target="_blank" rel="noopener noreferrer">
                              <Facebook className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          className="text-center mt-16 p-12 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold mb-6">Want to join our team?</h3>
          <p className="text-xl text-coral-100 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to help shape the future of digital publishing.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-coral-600 hover:bg-gray-100">
            View Open Positions
          </Button>
        </motion.div>
      </div>
    </section>
  )
}