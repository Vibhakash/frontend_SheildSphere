"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Network, AlertTriangle, CheckCircle } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

export default function IPChecker() {
  const [ip, setIp] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkIP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/check-ip/${ip}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: "Failed to check IP" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-500" />
          IP Reputation Checker
        </CardTitle>
        <CardDescription>Check if an IP address has been flagged for malicious activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={checkIP} className="space-y-4">
          <Input
            type="text"
            placeholder="192.168.1.1"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="bg-slate-900 border-slate-600 font-mono"
          />
          <Button type="submit" disabled={!ip || loading} className="w-full bg-cyan-600 hover:bg-cyan-700">
            {loading ? "Checking..." : "Check IP"}
          </Button>
        </form>

        {result && (
          <div className="space-y-3">
            {result.is_malicious || result.threat_level === "high" ? (
              <Alert className="border-red-900 bg-red-950 bg-opacity-30">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  <strong>Warning!</strong> This IP has been flagged for suspicious activity.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-900 bg-green-950 bg-opacity-30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>This IP appears to be clean. No major threats detected.</AlertDescription>
              </Alert>
            )}

            <div className="p-3 rounded bg-slate-700 bg-opacity-50 text-sm space-y-2">
              {result.location && (
                <div>
                  <p className="font-semibold text-cyan-400">Location</p>
                  <p className="text-slate-300">
                    {result.location.city}, {result.location.country}
                  </p>
                </div>
              )}

              {result.isp && (
                <div>
                  <p className="font-semibold text-cyan-400">ISP</p>
                  <p className="text-slate-300">{result.isp}</p>
                </div>
              )}

              {result.threat_level && (
                <div>
                  <p className="font-semibold text-cyan-400">Threat Level</p>
                  <p className="text-slate-300 capitalize">{result.threat_level}</p>
                </div>
              )}

              {result.reports && (
                <div>
                  <p className="font-semibold text-cyan-400">Reports</p>
                  <p className="text-slate-300">{result.reports} abuse reports</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
