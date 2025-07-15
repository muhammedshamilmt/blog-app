import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from '@/contexts/user-context'
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Editorial - Modern Blog Platform",
  description: "A beautiful, accessible editorial platform for high-quality content",
  keywords: ["blog", "editorial", "writing", "content", "modern"],
  authors: [{ name: "Editorial Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  verification: {
    google: "Ze2aFW-vR3x1r3GPnpbNKpvC_6GDSnO4l3MzolqzzWs",
  },
  openGraph: {
    images: [
      "https://res.cloudinary.com/dfadqkxbo/image/upload/v1752579983/favicon_pq0ern.png"
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>
        <AuthProvider>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange={false}
            >
              {children}
              <Analytics />
              <Toaster />
            </ThemeProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}