import { Navigation } from "@/components/navigation"
import { ReadingProgress } from "@/components/reading-progress"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { AboutHero } from "@/components/about-hero"
import { TeamSection } from "@/components/team-section"
import { MissionSection } from "@/components/mission-section"
import { StatsSection } from "@/components/stats-section"

export default function AboutPage() {
  console.log("About page rendered")
  
  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      <AboutHero />
      <MissionSection />
      <StatsSection />
      <TeamSection />
      <Footer />
      <FloatingActions />
    </main>
  )
}