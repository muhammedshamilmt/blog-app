import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { BlogUploadForm } from "@/components/blog-upload-form"

export default function UploadPage() {
  console.log("Upload page rendered")
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <BlogUploadForm />
      <Footer />
      <FloatingActions />
    </main>
  )
}