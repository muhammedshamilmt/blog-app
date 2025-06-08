import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { HeroSection } from "@/components/hero-section"
import { BlogGrid } from "@/components/blog-grid"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"

export default function Home() {
  console.log("Home page rendered")
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <HeroSection />
      <BlogGrid />
      <NewsletterSignup />
      <Footer />
      <FloatingActions />
    </main>
  )
}
