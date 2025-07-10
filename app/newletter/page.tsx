"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { NewsletterHero } from "@/components/newsletter-hero"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { NewsletterBenefits } from "@/components/newsletter-benefits"
import { NewsletterArchive } from "@/components/newsletter-archive"

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <NewsletterHero />
      <NewsletterSignup />
      <NewsletterBenefits />
      <NewsletterArchive />
      <Footer />
    </main>
  )
}
