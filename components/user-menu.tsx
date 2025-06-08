import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/contexts/user-context'
import { Button } from '@/components/ui/button'
import { 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  ChevronDown
} from 'lucide-react'

export function UserMenu() {
  const { user, logout } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`

  const menuItems = [
    {
      label: 'Profile',
      icon: User,
      onClick: () => router.push('/profile'),
      showFor: ['user', 'admin']
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => router.push('/settings'),
      showFor: ['user', 'admin']
    },
    {
      label: 'Admin Panel',
      icon: LayoutDashboard,
      onClick: () => router.push('/admin'),
      showFor: ['admin']
    },
    {
      label: 'Logout',
      icon: LogOut,
      onClick: logout,
      showFor: ['user', 'admin']
    }
  ]

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="relative h-10 w-10 rounded-full bg-gradient-to-br from-navy-900 to-coral-500 text-white hover:bg-gradient-to-br hover:from-navy-800 hover:to-coral-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium">{initials}</span>
        <ChevronDown className="absolute -bottom-1 -right-1 h-3 w-3 bg-background rounded-full" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg border bg-background shadow-lg"
          >
            <div className="p-2">
              <div className="mb-2 px-3 py-2">
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="h-px bg-border mb-2" />
              {menuItems
                .filter(item => item.showFor.includes(user.role))
                .map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-sm"
                    onClick={() => {
                      item.onClick()
                      setIsOpen(false)
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 