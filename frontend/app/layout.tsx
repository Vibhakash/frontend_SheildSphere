import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/lib/theme-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShieldSphere - Enterprise Account Security",
  description: "Advanced account security monitoring, threat detection, and device management - Production Grade",
  generator: "v0.app",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider>
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Dark mode gradient background */}
            <div className="dark:block hidden absolute inset-0">
              <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob opacity-50"></div>
              <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000 opacity-50"></div>
              <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-30"></div>
            </div>

            {/* Light mode gradient background */}
            <div className="light block dark:hidden absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
              <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-blob opacity-40"></div>
              <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob animation-delay-2000 opacity-40"></div>
              <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-30"></div>
            </div>

            <div className="absolute inset-0 bg-grid-pattern dark:opacity-50 opacity-30"></div>
          </div>

          <div className="relative z-10">{children}</div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
