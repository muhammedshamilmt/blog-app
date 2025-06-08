import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { WriteHero } from "@/components/write-hero"
import { WriterGuidelines } from "@/components/writer-guidelines"
import { SubmissionForm } from "@/components/submission-form"

export default function WritePage() {
  console.log("Write page rendered")
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <WriteHero />
      <WriterGuidelines />
      <SubmissionForm />
      <Footer />
      <FloatingActions />
    </main>
  )
}