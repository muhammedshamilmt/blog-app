import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { NewsletterHero } from "@/components/newsletter-hero"
import { NewsletterArchive } from "@/components/newsletter-archive"
import { NewsletterBenefits } from "@/components/newsletter-benefits"

export default function NewsletterPage() {
  console.log("Newsletter page rendered")
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <NewsletterHero />
      <NewsletterBenefits />
      <NewsletterArchive />
      <Footer />
      <FloatingActions />
    </main>
  )
}