import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  console.log("Login page rendered")
  
  return (
    <main className="min-h-screen">
      <Navigation />
      <LoginForm />
      <Footer />
    </main>
  )
}