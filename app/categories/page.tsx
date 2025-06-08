import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { CategoriesHero } from "@/components/categories-hero"
import { CategoryGrid } from "@/components/category-grid"

export default function CategoriesPage() {
  console.log("Categories page rendered")
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <CategoriesHero />
      <CategoryGrid />
      <Footer />
      <FloatingActions />
    </main>
  )
}