"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard,
  Home as HomeIcon,
  BookOpen,
  PenSquare,
  UploadCloud,
  Layers,
  Mail as MailIcon,
  Users as UsersIcon,
  Info as InfoIcon
} from "lucide-react"

interface ProfileData {
  profileImageUrl?: string
  firstName?: string
  lastName?: string
}

export function Navigation() {
  const { user, logout, isLoading } = useUser()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  // Fetch profile data when user is available
  useEffect(() => {
    if (user?.email) {
      const fetchProfileData = async () => {
        try {
          const response = await fetch(`/api/profile/get?email=${encodeURIComponent(user.email)}`)
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              setProfileData({
                profileImageUrl: data.data.profile?.profileImageUrl,
                firstName: data.data.firstName,
                lastName: data.data.lastName
              })
            }
          }
        } catch (error) {
          console.error('Failed to fetch profile data:', error)
        }
      }
      fetchProfileData()
    }
  }, [user?.email])

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    // Optionally, return a skeleton or null while loading
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: <HomeIcon className="h-4 w-4 mr-2" /> },
    { name: "About", href: "/about", icon: <InfoIcon className="h-4 w-4 mr-2" /> },
    { name: "Articles", href: "/articles", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: "Write", href: "/write", icon: <PenSquare className="h-4 w-4 mr-2" /> },
    { name: "Uploads", href: "/upload", icon: <UploadCloud className="h-4 w-4 mr-2" /> },
    { name: "Categories", href: "/categories", icon: <Layers className="h-4 w-4 mr-2" /> },
    { name: "Contact", href: "/contact", icon: <MailIcon className="h-4 w-4 mr-2" /> },
    { name: "Writers", href: "/writers", icon: <UsersIcon className="h-4 w-4 mr-2" /> },
  ]

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="text-2xl font-bold text-navy-900 dark:text-white">
                BlogApp
              </Link>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.a
                href="/"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Home
              </motion.a>
              <motion.a
                href="/about"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                About
              </motion.a>
              <motion.a
                href="/articles"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Articles
              </motion.a>
              <motion.a
                href="/write"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Write
              </motion.a>
              {/* Only show Uploads link if user is a writer */}
              {user && user.isWriter === true && (
                <motion.a
                  href="/upload"
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Uploads
                </motion.a>
              )}
              {/* <motion.a
                href="/newletter"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Newsletter
              </motion.a> */}
              <motion.a
                href="/categories"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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
              {!user && (
                <motion.a
                  href="/auth/login"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Login
                </motion.a>
              )}
            </div>

            {/* Theme Toggle & User Menu */}
            <div className="flex items-center space-x-2">
              {/* User menu or avatar */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage 
                          src={profileData?.profileImageUrl || `https://avatar.vercel.sh/${user.email}.png`} 
                          alt={profileData?.firstName || user.firstName} 
                        />
                        <AvatarFallback>
                          {(profileData?.firstName || user.firstName)?.[0]}{(profileData?.lastName || user.lastName)?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {profileData?.firstName && profileData?.lastName 
                            ? `${profileData.firstName} ${profileData.lastName}`
                            : `${user.firstName} ${user.lastName}`
                          }
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
              {/* Mobile menu open button (always next to avatar/user menu) */}
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
              {/* Theme toggle (only on desktop) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 hidden md:inline-flex"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
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
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}
                {user && (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 text-red-600 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-muted w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Log out</span>
                    </button>
                  </>
                )}
                <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-8 w-8"
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}