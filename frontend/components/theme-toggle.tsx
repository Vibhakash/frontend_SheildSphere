"use client"

import { useTheme } from "@/lib/theme-context"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 dark:from-cyan-500/10 dark:to-blue-500/10"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400 transition-transform hover:rotate-90 duration-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 transition-transform hover:rotate-90 duration-500" />
      )}
    </button>
  )
}
