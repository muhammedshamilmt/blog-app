import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  console.log("Signup page rendered")
  
  return (
    <main className="min-h-screen">
      <Navigation />
      <SignupForm />
      <Footer />
    </main>
  )
}