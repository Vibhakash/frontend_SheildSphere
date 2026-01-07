"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, AlertTriangle, CheckCircle } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

export default function PasswordChecker() {
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const checkPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/check-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: "Failed to check password" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-500" />
          Password Breach Checker
        </CardTitle>
        <CardDescription>Check if your password has been exposed in data breaches</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={checkPassword} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password to check"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900 border-slate-600 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <Button type="submit" disabled={!password || loading} className="w-full bg-cyan-600 hover:bg-cyan-700">
            {loading ? "Checking..." : "Check Password"}
          </Button>
        </form>

        {result && (
          <div className="space-y-3">
            {result.pwned ? (
              <Alert className="border-red-900 bg-red-950 bg-opacity-30">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  <strong>Warning!</strong> This password has been found in {result.count} data breaches.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-900 bg-green-950 bg-opacity-30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>Good news! This password hasn't been found in known data breaches.</AlertDescription>
              </Alert>
            )}

            {result.recommendations && (
              <div className="p-3 rounded bg-slate-700 bg-opacity-50">
                <p className="text-sm font-semibold mb-2">Recommendations:</p>
                <ul className="text-sm space-y-1 text-slate-300">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
