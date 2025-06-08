import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { WritersHero } from "@/components/writers-hero"
import { FeaturedWriters } from "@/components/featured-writers"

export default function WritersPage() {
  console.log("Writers page rendered")
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <WritersHero />
      <FeaturedWriters />
      <Footer />
      <FloatingActions />
    </main>
  )
}