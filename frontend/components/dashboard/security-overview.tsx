"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Lock, Shield } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface SecurityOverviewProps {
  email: string
}

export default function SecurityOverview({ email }: SecurityOverviewProps) {
  const [stats, setStats] = useState<any>(null)
  const [twoFAStatus, setTwoFAStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loginRes, twoFARes] = await Promise.all([
          fetch(`${API_URL}/login-dashboard/${email}`),
          fetch(`${API_URL}/2fa-status/${email}`),
        ])

        const loginData = await loginRes.json()
        const twoFAData = await twoFARes.json()

        console.log("[v0] Login dashboard data:", loginData)
        console.log("[v0] 2FA status data:", twoFAData)

        setStats(loginData)
        setTwoFAStatus(twoFAData)
      } catch (err) {
        console.error("[v0] Failed to fetch security overview:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [email])

  if (loading) {
    return (
      <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalLogins = stats?.statistics?.total_logins || 0
  const successRate = Number.parseFloat(stats?.statistics?.success_rate || "0")
  const uniqueLocations = stats?.statistics?.unique_locations || 0
  const uniqueDevices = stats?.statistics?.unique_devices || 0
  const failedAttempts = stats?.statistics?.failed_logins || 0
  const successfulAttempts = stats?.statistics?.successful_logins || 0

  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-500" />
            Security Overview
          </CardTitle>
          <CardDescription>Your account security status and activity metrics</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-slate-700/50 border border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Logins</p>
            <p className="text-3xl font-bold text-cyan-400 mt-1">{totalLogins}</p>
            <p className="text-xs text-slate-400 mt-1">accounts accessed</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-700/50 border border-green-500/20 hover:border-green-500/50 transition-colors">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Success Rate</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{successRate.toFixed(1)}%</p>
            <p className="text-xs text-slate-400 mt-1">{successfulAttempts} successful</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-700/50 border border-blue-500/20 hover:border-blue-500/50 transition-colors">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Unique Locations</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">{uniqueLocations}</p>
            <p className="text-xs text-slate-400 mt-1">countries detected</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-700/50 border border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Unique Devices</p>
            <p className="text-3xl font-bold text-purple-400 mt-1">{uniqueDevices}</p>
            <p className="text-xs text-slate-400 mt-1">{failedAttempts} failed attempts</p>
          </div>
        </CardContent>
      </Card>

      {/* 2FA Status */}
      {twoFAStatus && (
        <Card
          className={`border-l-4 overflow-hidden relative ${
            twoFAStatus.is_2fa_enabled
              ? "border-l-green-500 bg-gradient-to-br from-green-950/30 to-slate-900"
              : "border-l-yellow-500 bg-gradient-to-br from-yellow-950/30 to-slate-900"
          }`}
        >
          <div
            className={`absolute inset-0 ${
              twoFAStatus.is_2fa_enabled ? "bg-green-500/5" : "bg-yellow-500/5"
            } pointer-events-none`}
          ></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold text-lg mt-1">
                  {twoFAStatus.is_2fa_enabled ? (
                    <span className="text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Enabled
                    </span>
                  ) : (
                    <span className="text-yellow-400 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Disabled
                    </span>
                  )}
                </p>
              </div>
              {twoFAStatus.is_2fa_enabled ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
