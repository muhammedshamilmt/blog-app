import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { BlogGrid } from "@/components/blog-grid"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { ArticlesHero } from "@/components/articles-hero"
import { FeaturedArticles } from "@/components/featured-articles"

export default function ArticlesPage() {
  console.log("Articles page rendered")
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <ArticlesHero />
      {/* <FeaturedArticles /> */}
      <BlogGrid />
      <Footer />
      <FloatingActions />
    </main>
  )
}