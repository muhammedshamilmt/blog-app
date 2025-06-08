"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Eye } from "lucide-react"

export function NewsletterArchive() {
  const newsletters = [
    {
      title: "The Future of AI in Creative Industries",
      date: "March 15, 2024",
      excerpt: "This week we explored how artificial intelligence is transforming design, writing, and creative workflows...",
      topics: ["AI", "Design", "Technology"],
      views: "5.2K"
    },
    {
      title: "Building Sustainable Design Systems",
      date: "March 8, 2024", 
      excerpt: "A deep dive into creating design systems that scale with your organization and evolve with your needs...",
      topics: ["Design Systems", "Scalability", "UX"],
      views: "4.8K"
    },
    {
      title: "Remote Work Culture Revolution",
      date: "March 1, 2024",
      excerpt: "How distributed teams are reshaping company culture and what leaders need to know for success...",
      topics: ["Remote Work", "Culture", "Leadership"],
      views: "6.1K"
    },
    {
      title: "Web Performance Deep Dive",
      date: "February 23, 2024",
      excerpt: "Essential techniques for optimizing Core Web Vitals and improving user experience across devices...",
      topics: ["Performance", "Web Development", "SEO"],
      views: "3.9K"
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-coral-500/10 text-coral-600 border-coral-500/20">
            Previous Editions
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Newsletter</span> archive
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Browse our previous newsletters to see the quality of content you can expect every week.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsletters.map((newsletter, index) => (
            <motion.div
              key={newsletter.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer card-hover border-2 border-transparent hover:border-coral-500/20 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {newsletter.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="h-4 w-4 mr-1" />
                      {newsletter.views} views
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-coral-600 transition-colors">
                    {newsletter.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {newsletter.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {newsletter.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full group-hover:border-coral-500 group-hover:text-coral-600">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read This Edition
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button variant="outline" size="lg" className="border-coral-500 text-coral-600 hover:bg-coral-50">
            View All Newsletters
          </Button>
        </motion.div>
      </div>
    </section>
  )
}