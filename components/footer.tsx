"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Mail, Twitter, Github, Linkedin, Instagram, ArrowUp } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    console.log("Scrolling to top")
  }

  const footerLinks = {
    Platform: [
      { name: "Browse Articles", href: "#articles" },
      { name: "Categories", href: "#categories" },
      { name: "Featured Writers", href: "#writers" },
      { name: "Newsletter", href: "#newsletter" },
    ],
    Community: [
      { name: "Join Writers", href: "#write" },
      { name: "Reader Guidelines", href: "#guidelines" },
      { name: "Community Forum", href: "#forum" },
      { name: "Events", href: "#events" },
    ],
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Press Kit", href: "#press" },
      { name: "Contact", href: "#contact" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "DMCA", href: "#dmca" },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ]

  return (
    <footer className="bg-navy-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-coral-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-coral-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Editorial</h3>
                </div>
                
                <p className="text-navy-200 text-lg leading-relaxed mb-6">
                  A modern platform for thoughtful writing and meaningful conversations. 
                  Join our community of readers and writers sharing stories that matter.
                </p>
                
                <div className="flex items-center space-x-2 text-sm text-navy-300">
                  <Mail className="h-4 w-4" />
                  <span>hello@editorial.com</span>
                </div>
              </motion.div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([category, links], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <h4 className="font-semibold text-white mb-4">{category}</h4>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="text-navy-200 hover:text-coral-400 transition-colors duration-200 text-sm"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-navy-700" />

        {/* Bottom Section */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.div
              className="text-navy-300 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p>© 2025 Editorial. All rights reserved. Made with ❤️ for the writing community.</p>
            </motion.div>

            {/* Social Links & Back to Top */}
            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="text-navy-300 hover:text-coral-400 transition-colors duration-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
              
              <Separator orientation="vertical" className="h-6 bg-navy-700" />
              
              <Button
                onClick={scrollToTop}
                variant="ghost"
                size="sm"
                className="text-navy-300 hover:text-coral-400 hover:bg-navy-800"
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Back to top
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}