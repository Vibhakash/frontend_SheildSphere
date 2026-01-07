"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import SecurityOverview from "@/components/dashboard/security-overview"
import RecentActivity from "@/components/dashboard/recent-activity"
import SecurityAlerts from "@/components/dashboard/security-alerts"

export default function Dashboard() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout email={email}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecurityOverview email={email} />
          </div>
          <SecurityAlerts email={email} />
        </div>
        <RecentActivity email={email} />
      </div>
    </DashboardLayout>
  )
}
