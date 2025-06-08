"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { toast } from "sonner"

export default function NewsletterPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("Please log in to access the newsletter")
        router.push('/auth/login')
      } else if (!user.isSubscribed) {
        toast.error("Please subscribe to access the newsletter")
        router.push('/')
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.isSubscribed) {
    return null
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Newsletter</h1>
          {/* Add your newsletter content here */}
          <div className="prose prose-lg dark:prose-invert">
            <p>Welcome to your exclusive newsletter content!</p>
            {/* Add more newsletter content */}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}