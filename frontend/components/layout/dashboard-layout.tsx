"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Menu,
  X,
  Shield,
  LogOut,
  Settings,
  Activity,
  Map,
  Smartphone,
  BarChart3,
  Lock,
  AlertCircle,
  FileText,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: React.ReactNode
  email: string
}

export default function DashboardLayout({ children, email }: DashboardLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      // Check system preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const initialTheme = isDark ? "dark" : "light"
      setTheme(initialTheme)
      document.documentElement.classList.toggle("dark", isDark)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userToken")
    router.push("/")
  }

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: LayoutDashboard, label: "Login Dashboard", href: "/login-dashboard" },
    { icon: Activity, label: "Login History", href: "/login-history" },
    { icon: Map, label: "Login Locations", href: "/login-locations" },
    { icon: Map, label: "Map Viewer", href: "/login-map-view" },
    { icon: Smartphone, label: "Devices", href: "/login-devices" },
    { icon: AlertCircle, label: "Recommendations", href: "/security-recommendations" },
    { icon: FileText, label: "Compliance", href: "/compliance-reports" },
    { icon: Lock, label: "Security Tools", href: "/security-tools" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'url("/dashboard-bg-dark.jpg")',
        }}
      ></div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col overflow-hidden relative z-10`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-500" />
              <span className="font-bold gradient-text text-lg">ShieldSphere</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-700 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon size={20} className="text-cyan-500 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors text-sm"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-yellow-400" />
                {sidebarOpen && <span className="text-xs">Light</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                {sidebarOpen && <span className="text-xs">Dark</span>}
              </>
            )}
          </button>

          {sidebarOpen && <div className="px-3 py-2 text-xs text-muted-foreground truncate">{email}</div>}
          <Button onClick={handleLogout} variant="destructive" className="w-full justify-center text-xs">
            {sidebarOpen ? (
              <>
                <LogOut size={16} className="mr-2" />
                Logout
              </>
            ) : (
              <LogOut size={16} />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-20">
        <div className="p-8 space-y-8">{children}</div>
      </main>
    </div>
  )
}
