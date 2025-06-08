"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowUp, Share, Bookmark, Menu } from "lucide-react"

export function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    console.log("Floating actions component mounted")
    
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    console.log("Scrolling to top via FAB")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Editorial - Modern Blog Platform",
        text: "Check out this amazing editorial platform!",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      console.log("URL copied to clipboard")
    }
  }

  const handleBookmark = () => {
    console.log("Bookmark action triggered")
    // Add to bookmarks functionality
  }

  const actions = [
    { icon: ArrowUp, action: scrollToTop, label: "Scroll to top" },
    { icon: Share, action: handleShare, label: "Share page" },
    { icon: Bookmark, action: handleBookmark, label: "Bookmark" },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="absolute bottom-16 right-0 space-y-3"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Button
                      size="icon"
                      onClick={action.action}
                      className="w-12 h-12 bg-white shadow-lg hover:shadow-xl border border-gray-200 text-navy-600 hover:bg-coral-50 hover:text-coral-600"
                    >
                      <action.icon className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-14 h-14 rounded-full bg-coral-500 hover:bg-coral-600 text-white shadow-xl animate-pulse-subtle"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}