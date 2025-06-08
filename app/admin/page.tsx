"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  Eye,
  Heart,
  Share2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Menu,
  X,
  Save,
  Bell,
  Shield,
  Globe,
  Mail,
  Database
} from "lucide-react"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "Editorial Platform",
    siteDescription: "A modern publishing platform for quality content",
    adminEmail: "shaz80170@gmail.com",
    allowRegistration: true,
    moderateComments: true,
    emailNotifications: true,
    maintenanceMode: false,
    maxUploadSize: "10",
    defaultUserRole: "writer",
    timezone: "UTC",
    language: "en",
    analyticsEnabled: true,
    backupFrequency: "daily"
  })

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem('adminAuth')
    if (adminAuth === 'authenticated') {
      setIsAuthenticated(true)
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login?admin=true'
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: "12" },
    { id: "writers", label: "Writer Requests", icon: UserCheck, badge: "5" },
    { id: "uploads", label: "Content Uploads", icon: Upload, badge: "8" },
    { id: "users", label: "User Management", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  const dashboardStats = [
    { label: "Total Articles", value: "1,247", change: "+12%", icon: FileText, color: "text-blue-600" },
    { label: "Active Writers", value: "89", change: "+8%", icon: Users, color: "text-green-600" },
    { label: "Monthly Views", value: "145K", change: "+23%", icon: Eye, color: "text-purple-600" },
    { label: "Engagement Rate", value: "67%", change: "+5%", icon: Heart, color: "text-coral-600" }
  ]

  const recentArticles = [
    {
      id: "1",
      title: "The Future of AI in Creative Industries",
      author: "Elena Volkov",
      status: "published",
      views: "5.2K",
      date: "2 hours ago"
    },
    {
      id: "2", 
      title: "Building Sustainable Design Systems",
      author: "Marcus Chen",
      status: "review",
      views: "1.8K",
      date: "5 hours ago"
    },
    {
      id: "3",
      title: "Remote Work Best Practices",
      author: "Sarah Johnson",
      status: "draft",
      views: "0",
      date: "1 day ago"
    }
  ]

  const writerRequests = [
    {
      id: "1",
      name: "Alex Rodriguez",
      email: "alex@example.com",
      expertise: "Technology",
      status: "pending",
      date: "2 days ago"
    },
    {
      id: "2",
      name: "Lisa Wang",
      email: "lisa@example.com", 
      expertise: "Design",
      status: "approved",
      date: "3 days ago"
    }
  ]

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{article.title}</h4>
                        <p className="text-sm text-muted-foreground">by {article.author}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={article.status === 'published' ? 'default' : article.status === 'review' ? 'secondary' : 'outline'}>
                          {article.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{article.views} views</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Writer Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {writerRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{request.name}</h4>
                          <p className="text-sm text-muted-foreground">{request.expertise}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "messages":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Messages & Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Message Management</h3>
                <p className="text-muted-foreground">Manage writer communications and support requests</p>
              </div>
            </CardContent>
          </Card>
        )

      case "writers":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Writer Request Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {writerRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <p className="text-sm text-muted-foreground">{request.email}</p>
                        <Badge variant="outline" className="mt-1">{request.expertise}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="border-green-500 text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "uploads":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Content Upload Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">by {article.author} • {article.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={article.status === 'published' ? 'default' : article.status === 'review' ? 'secondary' : 'outline'}>
                        {article.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "settings":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Platform Settings</h2>
                <p className="text-muted-foreground">Configure your editorial platform</p>
              </div>
              <Button onClick={handleSaveSettings} className="bg-navy-900 hover:bg-navy-600">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* User & Content Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User & Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Allow User Registration</Label>
                      <p className="text-sm text-muted-foreground">Enable new user signups</p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Moderate Comments</Label>
                      <p className="text-sm text-muted-foreground">Require approval for comments</p>
                    </div>
                    <Switch
                      checked={settings.moderateComments}
                      onCheckedChange={(checked) => setSettings({...settings, moderateComments: checked})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Default User Role</Label>
                    <Select value={settings.defaultUserRole} onValueChange={(value) => setSettings({...settings, defaultUserRole: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reader">Reader</SelectItem>
                        <SelectItem value="writer">Writer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                    <Input
                      id="maxUploadSize"
                      type="number"
                      value={settings.maxUploadSize}
                      onChange={(e) => setSettings({...settings, maxUploadSize: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    System & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Analytics Enabled</Label>
                      <p className="text-sm text-muted-foreground">Track site performance and usage</p>
                    </div>
                    <Switch
                      checked={settings.analyticsEnabled}
                      onCheckedChange={(checked) => setSettings({...settings, analyticsEnabled: checked})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <h4 className="font-medium">Email Notification Types:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>New user registrations</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Article submissions</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Comment moderation</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>System updates</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">This section is under development</p>
            </CardContent>
          </Card>
        )
    }
  }

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings)
    toast.success("Settings saved successfully!")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    console.log("Sidebar toggled:", !sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <h1 className="text-xl font-bold">Editorial Admin</h1>
            <Badge className="bg-coral-500">Admin Panel</Badge>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem('adminAuth')
                window.location.href = '/'
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Desktop Sidebar - Always Visible */}
        <aside className="hidden lg:block w-64 border-r bg-background/95 backdrop-blur min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Mobile/Tablet Sidebar - Collapsible */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="fixed lg:hidden top-16 left-0 w-64 border-r bg-background/95 backdrop-blur min-h-[calc(100vh-4rem)] z-40"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false) // Always close on mobile/tablet
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderDashboardContent()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}