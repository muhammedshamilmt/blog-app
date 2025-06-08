"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, BookOpen, PenTool, User, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    console.log("Navigation component mounted")
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      console.log("Scroll position:", window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Articles", href: "/articles" },
    { name: "About", href: "/about" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Write", href: "/write" },
    { name: "Upload", href: "/upload" },
    // { name: "Contact", href: "/contact" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    console.log("Mobile menu toggled:", !isMobileMenuOpen)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    console.log("Theme changed to:", newTheme)
  }

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'nav-blur shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-navy-900 to-coral-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Editorial</h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  
                  <span>{item.name}</span>
                </motion.a>
              ))}
              <motion.a
                href="/categories"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Categories
              </motion.a>
              <motion.a
                href="/contact"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Contact
              </motion.a>
              <motion.a
                href="/writers"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Writers
              </motion.a>
              <motion.a
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                Login
              </motion.a>
              {/* <motion.a
                href="/profile"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                Profile
              </motion.a>
              <motion.a
                href="/admin"
                className="text-coral-600 hover:text-coral-500 transition-colors duration-200 font-medium"
              >
                Admin
              </motion.a> */}
            </div>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div
              className="fixed top-16 left-0 right-0 bg-card border-b border-border p-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}