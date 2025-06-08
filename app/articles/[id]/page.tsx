import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { BlogHeader } from "@/components/blog-header"
import BlogContent from "@/components/blog-content"
import { AuthorBio } from "@/components/author-bio"
import { RelatedArticles } from "@/components/related-articles"
import { BlogComments } from "@/components/blog-comments"

interface BlogPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const resolvedParams = await params
  console.log("Blog page rendered for ID:", resolvedParams.id)
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <BlogHeader id={resolvedParams.id} />
      <BlogContent id={resolvedParams.id} />
      <AuthorBio id={resolvedParams.id} />
      <RelatedArticles id={resolvedParams.id} />
      <BlogComments id={resolvedParams.id} />
      <Footer />
      <FloatingActions />
    </main>
  )
}