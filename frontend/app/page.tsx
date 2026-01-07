"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import AuthForm from "@/components/auth/auth-form"
import { Shield, Lock, CheckCircle, Zap, Globe, TrendingUp } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const email = localStorage.getItem("userEmail")
    if (email) {
      setIsLoggedIn(true)
      router.push("/dashboard")
    }

    const saved = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = saved || (prefersDark ? "dark" : "light")
    setTheme(initialTheme)
    const html = document.documentElement
    if (initialTheme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }, [router])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    const html = document.documentElement
    if (newTheme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
    localStorage.setItem("theme", newTheme)
  }

  if (isLoggedIn || !mounted) {
    return null
  }

  return (
    <div className={`min-h-screen overflow-hidden relative ${theme === "dark" ? "dark" : ""}`}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: theme === "dark" ? 'url("/hero-dark-bg.jpg")' : 'url("/hero-light-bg.jpg")',
        }}
      >
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/50" : "bg-white/40"}`}></div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 animate-pulse"></div>

      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-sm border transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-800/80 border-cyan-400/50 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/30"
            : "bg-white/80 border-cyan-500/50 hover:border-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20"
        }`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-400 transition-transform hover:rotate-90 duration-500" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700 transition-transform hover:rotate-90 duration-500" />
        )}
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Brand & Features */}
          <div className="hidden lg:flex flex-col justify-center space-y-10">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30"
                      : "bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-300"
                  }`}
                >
                  <Shield className={`w-10 h-10 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                </div>
                <h1
                  className={`text-6xl font-extrabold tracking-tight ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"
                  }`}
                >
                  ShieldSphere
                </h1>
              </div>
              <p
                className={`text-2xl leading-relaxed font-medium ${
                  theme === "dark" ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Enterprise-grade account security monitoring and threat detection
              </p>
              <p className={`text-base ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Protect your digital assets with military-grade encryption and AI-powered threat intelligence.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: Lock,
                  title: "End-to-end Encryption",
                  description: "Bank-level security for all your login activities",
                },
                {
                  icon: Zap,
                  title: "Real-time Detection",
                  description: "Instant alerts for suspicious activities",
                },
                {
                  icon: Globe,
                  title: "Global Tracking",
                  description: "Monitor access from anywhere in the world",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "bg-slate-800/60 border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
                      : "bg-white/60 border-cyan-200 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-lg ${
                        theme === "dark" ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600"
                      }`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold mb-1 ${
                          theme === "dark" ? "text-slate-100" : "text-slate-900"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div
              className={`p-6 rounded-xl backdrop-blur-sm border ${
                theme === "dark"
                  ? "bg-gradient-to-br from-slate-800/70 to-slate-900/70 border-cyan-500/20"
                  : "bg-gradient-to-br from-white/70 to-slate-50/70 border-cyan-200"
              }`}
            >
              <p
                className={`text-sm font-semibold mb-4 uppercase tracking-wide ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Trusted by security-conscious users worldwide
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: CheckCircle, value: "10M+", label: "Logins Protected" },
                  { icon: TrendingUp, value: "99.9%", label: "Uptime" },
                  { icon: Globe, value: "195+", label: "Countries" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon
                        className={`w-5 h-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}
                      />
                    </div>
                    <p
                      className={`text-3xl font-bold mb-1 ${
                        theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className={`text-xs font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent ${
          theme === "dark" ? "opacity-60" : "opacity-40"
        }`}
      ></div>

      {/* Corner decorations */}
      <div
        className={`absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl ${
          theme === "dark" ? "opacity-50" : "opacity-30"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl ${
          theme === "dark" ? "opacity-50" : "opacity-30"
        }`}
      ></div>
    </div>
  )
}