"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Globe, Smartphone, AlertCircle } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface DashboardData {
  statistics: {
    total_logins: number
    successful_logins: number
    failed_logins: number
    success_rate: string
    unique_locations: number
    unique_ips: number
    unique_devices: number
    recent_activity_7days: number
  }
  locations: any[]
  devices: any[]
  recent_timeline: any[]
}

export default function LoginDashboard() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/login-dashboard/${userEmail}`)
        const data = await res.json()

        if (res.ok) {
          setDashboardData(data)
        } else {
          setError("Failed to load dashboard data")
        }
      } catch (err) {
        console.log("[v0] Error fetching dashboard:", err)
        setError("Failed to connect to server")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout email={email}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !dashboardData) {
    return (
      <DashboardLayout email={email}>
        <Alert className="border-red-900 bg-red-950 bg-opacity-30 mb-6">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-400">{error || "No data available"}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const stats = dashboardData.statistics

  return (
    <DashboardLayout email={email}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Login Activity Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive view of all your login activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-cyan-400">{stats.total_logins}</div>
              <p className="text-sm text-muted-foreground mt-1">Total Logins</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-400">{stats.successful_logins}</div>
              <p className="text-sm text-muted-foreground mt-1">Successful</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-400">{stats.failed_logins}</div>
              <p className="text-sm text-muted-foreground mt-1">Failed</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-yellow-400">{stats.success_rate}</div>
              <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Success/Failed Pie Chart */}
          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardHeader>
              <CardTitle>Login Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Successful", value: stats.successful_logins, fill: "#22c55e" },
                      { name: "Failed", value: stats.failed_logins, fill: "#ef4444" },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Distribution */}
          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                Device Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.devices.map((device, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-700 bg-opacity-50 rounded">
                    <div>
                      <p className="font-medium">{device.device.type}</p>
                      <p className="text-sm text-muted-foreground">{device.browser.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-cyan-400">{device.total_logins}</p>
                      <p className="text-xs text-muted-foreground">logins</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Stats */}
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Locations Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-slate-700 bg-opacity-50 rounded">
                <p className="text-sm text-muted-foreground">Unique Countries</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.unique_locations}</p>
              </div>
              <div className="p-3 bg-slate-700 bg-opacity-50 rounded">
                <p className="text-sm text-muted-foreground">Unique IPs</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.unique_ips}</p>
              </div>
              <div className="p-3 bg-slate-700 bg-opacity-50 rounded">
                <p className="text-sm text-muted-foreground">Unique Devices</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.unique_devices}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Top Locations</p>
              {dashboardData.locations.slice(0, 5).map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-700 bg-opacity-50 rounded">
                  <div>
                    <p className="font-medium">
                      {loc.city}, {loc.country}
                    </p>
                    <p className="text-xs text-muted-foreground">{loc.ip}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-400">{loc.total_logins}</p>
                    <p className="text-xs text-green-400">{loc.successful_logins} successful</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
