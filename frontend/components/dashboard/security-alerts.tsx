"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface SecurityAlertsProps {
  email: string
}

export default function SecurityAlerts({ email }: SecurityAlertsProps) {
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/login-history/${email}?limit=5`)
        const data = await res.json()
        setLoginHistory(data.events || [])
      } catch (err) {
        console.error("Failed to fetch login history")
      } finally {
        setLoading(false)
      }
    }

    fetchLoginHistory()
  }, [email])

  const failedLogins = loginHistory.filter((e) => !e.success).slice(0, 3)
  const recentLogins = loginHistory.slice(0, 3)

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest login attempts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : failedLogins.length > 0 ? (
          <Alert className="border-red-900 bg-red-950 bg-opacity-30">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription>
              <strong>{failedLogins.length}</strong> failed login attempt{failedLogins.length > 1 ? "s" : ""} detected
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green-900 bg-green-950 bg-opacity-30">
            <Info className="h-4 w-4 text-green-500" />
            <AlertDescription>All login attempts are successful</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <p className="text-sm font-semibold">Recent Logins</p>
          {recentLogins.map((login, idx) => (
            <div key={idx} className="text-xs p-2 rounded bg-slate-700 bg-opacity-50">
              <p className={login.success ? "text-green-400" : "text-red-400"}>
                {login.success ? "Success" : "Failed"} • {login.country}
              </p>
              <p className="text-muted-foreground text-xs">{login.timestamp}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
