'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'user' | 'admin'
  isVerified: boolean
  isSubscribed?: boolean
  isWriter?: boolean
  subscribedAt?: Date
}

interface UserContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user state from localStorage if available
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('userData')
      return storedUser ? JSON.parse(storedUser) : null
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Only check auth if we don't have user data in state
    if (!user) {
      const checkAuth = async () => {
        try {
          const storedUser = localStorage.getItem('userData')
          if (storedUser) {
            // If we have stored user data, verify with the server
            const response = await fetch('/api/auth/me')
            if (response.ok) {
              const data = await response.json()
              // Update stored user data with fresh data from server
              const updatedUser = data.user
              setUser(updatedUser)
              localStorage.setItem('userData', JSON.stringify(updatedUser))
            } else {
              // If server verification fails, clear storage
              localStorage.removeItem('userData')
              setUser(null)
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('userData')
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      }

      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [user]) // Only run when user state changes

  const login = (userData: User) => {
    setUser(userData)
    // Store full user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      // Remove user data from localStorage
      localStorage.removeItem('userData')
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 