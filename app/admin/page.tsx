"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  Upload,
  UserCheck,
  TrendingUp,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Home,
  FileDown,
  FileImage
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import Dashboard from "@/components/admin/Dashboard"
import MessageManagement from "@/components/admin/MessageManagement"
import SettingsManagement from "@/components/admin/SettingsManagement"
import WritersManagement from "@/components/admin/WritersManagement"
import UploadsManagement from "@/components/admin/UploadsManagement"
import UsersManagement from "@/components/admin/UsersManagement"
import Analytics from "@/components/admin/Analytics"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminStats {
  messages: number
  writers: number
  uploads: number
}

const AdminPage = () => {
  const router = useRouter()
  const { isAuthenticated, isAdmin, logout, user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [stats, setStats] = useState<AdminStats>({
    messages: 0,
    writers: 0,
    uploads: 0
  })

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/login")
    }
  }, [isLoading, isAdmin, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      }
    }

    fetchStats()
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  const isActive = (tab: string) => activeTab === tab

  type NavItem = {
    id: string;
    label: string;
    icon: any;
    badge?: string | number;
  };

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: (typeof stats.messages === 'number' ? stats.messages : 0).toString() },
    // { id: "writers", label: "Writer Requests", icon: UserCheck, badge: (typeof stats.writers === 'number' ? stats.writers : 0).toString() },
    { id: "uploads", label: "Content Uploads", icon: Upload, badge: (typeof stats.uploads === 'number' ? stats.uploads : 0).toString() },
    { id: "users", label: "User Management", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      toast.success("Logged out successfully")
      router.replace("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center">
            <div className="w-16 h-16 animate-spin-slow rounded-full border-4 border-coral-200 border-t-coral-500 flex items-center justify-center bg-white shadow-lg">
              <img src="/favicon.ico" alt="Loading..." className="w-10 h-10" style={{ animation: 'none' }} />
            </div>
          </div>
          <span className="text-lg text-muted-foreground font-semibold">Loading Admin Dashboard...</span>
        </div>
        <style jsx>{`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 1.2s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between p-4 lg:hidden">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-fashion-primary mr-4"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-xl font-bold text-fashion-primary">
            Admin Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-fashion-primary/70 hover:text-fashion-primary"
            aria-label="Go to store"
          >
            <Home size={20} />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isLoggingOut}
              >
                <LogOut size={20} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to login again to access the admin dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-0 flex flex-col h-screen`}
      >
        <div className="p-6 border-b border-gray-200 hidden lg:flex items-center">
          <h1 className="text-xl font-bold text-fashion-primary">FashionFit Admin</h1>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                    isActive(item.id)
                      ? "bg-primary/10 text-primary"
                      : "text-fashion-primary hover:bg-gray-50"
                  }`}
                  aria-current={isActive(item.id) ? "page" : undefined}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {typeof item.badge === 'object' ? JSON.stringify(item.badge) : item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-fashion-primary/10 flex items-center justify-center">
                  <Users className="text-fashion-primary" size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-fashion-primary">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-fashion-primary/60">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="relative group">
                <button
                  className="text-fashion-primary/70 hover:text-fashion-primary"
                  aria-label="User options"
                >
                  <ChevronDown size={18} />
                </button>
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-fashion-primary hover:bg-gray-100"
                  >
                    View Store
                  </Link>
                  <Separator className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-fashion-primary hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-50 flex-1 overflow-y-auto flex flex-col w-full">
        {/* Desktop Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-6 hidden lg:flex items-center justify-between">
          <h1 className="text-xl font-bold text-fashion-primary">
            {navItems.find(item => item.id === activeTab)?.label || "Dashboard"}
          </h1>

          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Home size={16} className="mr-2" />
                View Store
              </Link>
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 pt-20 lg:pt-6 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            <TabsContent value="messages">
              <MessageManagement />
            </TabsContent>
            <TabsContent value="writers">
              <WritersManagement />
            </TabsContent>
            <TabsContent value="uploads">
              <UploadsManagement />
            </TabsContent>
            <TabsContent value="users">
              <UsersManagement />
            </TabsContent>
            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsManagement />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center flex justify-center text-sm text-fashion-primary/60">
          <p className="font-['Adelone-Serial-Extrabold-Regular'] text-fashion-primary">
            &copy; {new Date().getFullYear()} EDITORIAL.
          </p>
          <p>All rights reserved.</p>
        </footer>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default AdminPage