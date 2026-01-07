"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Eye, EyeOff, Shield } from "lucide-react"
import { config } from "@/config"

interface RiskAlert {
  threat_type: string
  detected: boolean
  actions_taken: string[]
  timestamp: string
}

export default function AuthForm() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [needs2FA, setNeeds2FA] = useState(false)
  const [twoFACode, setTwoFACode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState("")
  const [riskAlert, setRiskAlert] = useState<RiskAlert | null>(null)
  const [riskResponse, setRiskResponse] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      console.log("[v0] Registering with URL:", `${config.API_URL}/register`)
      const res = await fetch(`${config.API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("[v0] Register response:", res.status, data)

      if (!res.ok) {
        setError(data.detail || data.message || `Registration failed: ${res.status}`)
        return
      }

      setSuccess("Registration successful! Please log in.")
      setTimeout(() => {
        setIsLogin(true)
        setEmail("")
        setPassword("")
        setSuccess("")
      }, 2000)
    } catch (err: any) {
      console.error("[v0] Registration error:", err)
      setError(`Connection error: ${err.message || "Please check your backend URL and network connection"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoRespond = async (threatType: string) => {
    try {
      console.log("[v0] Auto-responding to threat:", threatType)
      const res = await fetch(`${config.API_URL}/auto-respond/${email}?threat_type=${threatType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      console.log("[v0] Auto-respond response:", res.status, data)

      if (res.ok) {
        setRiskAlert({
          threat_type: threatType,
          detected: true,
          actions_taken: data.actions_taken,
          timestamp: data.timestamp,
        })
        setRiskResponse("Auto-response activated. Security measures are in place.")
      }
    } catch (err) {
      console.log("[v0] Auto-respond error:", err)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    setRiskAlert(null)

    try {
      console.log("[v0] Logging in with URL:", `${config.API_URL}/login`)
      const res = await fetch(`${config.API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("[v0] Login response:", res.status, data)

      if (!res.ok) {
        setError(data.detail || data.message || `Login failed: ${res.status}`)
        return
      }

      if (data.risk_alerts && data.risk_alerts.length > 0) {
        console.log("[v0] Risk detected during login:", data.risk_alerts)

        let threatType = "impossible_travel"
        if (data.risk_alerts.some((alert: string) => alert.includes("failed"))) {
          threatType = "brute_force"
        }

        await handleAutoRespond(threatType)
      }

      if (data.next_step === "verify-login-2fa") {
        setNeeds2FA(true)
        return
      }

      localStorage.setItem("userEmail", email)
      localStorage.setItem("userToken", JSON.stringify(data))
      router.push("/dashboard")
    } catch (err: any) {
      console.error("[v0] Login error:", err)
      setError(`Connection error: ${err.message || "Please check your backend URL and network connection"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("[v0] Verifying 2FA with URL:", `${config.API_URL}/verify-login-2fa`)
      const res = await fetch(`${config.API_URL}/verify-login-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: twoFACode }),
      })

      const data = await res.json()
      console.log("[v0] 2FA response:", res.status, data)

      if (!res.ok) {
        setError(data.detail || data.message || `2FA verification failed: ${res.status}`)
        return
      }

      localStorage.setItem("userEmail", email)
      localStorage.setItem("userToken", JSON.stringify(data))
      router.push("/dashboard")
    } catch (err: any) {
      console.error("[v0] 2FA error:", err)
      setError(`Connection error: ${err.message || "Please check your backend URL"}`)
    } finally {
      setLoading(false)
    }
  }

  if (riskAlert) {
    return (
      <Card className="w-full max-w-md border-red-700/50 bg-red-900/30 backdrop-blur-xl shadow-2xl shadow-red-500/10 dark:border-red-700/50 dark:bg-red-900/30 light:border-red-200 light:bg-red-50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-red-400 dark:text-red-400 light:text-red-600">
            <Shield className="w-5 h-5" />
            Security Alert
          </CardTitle>
          <CardDescription>Threat detected and auto-response activated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-700 bg-red-950 bg-opacity-50 dark:border-red-700 dark:bg-red-950 light:border-red-200 light:bg-red-100">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-300 dark:text-red-300 light:text-red-700">
              {riskAlert.threat_type === "brute_force"
                ? "Multiple failed login attempts detected"
                : "Unusual login location detected"}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
              Actions Taken:
            </p>
            <ul className="space-y-1">
              {riskAlert.actions_taken.map((action, idx) => (
                <li
                  key={idx}
                  className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-200 rounded-lg text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
            <p className="font-medium mb-1">Next Steps:</p>
            <p>Please verify your identity with 2FA or check your security recommendations.</p>
          </div>

          <Button
            onClick={() => {
              localStorage.setItem("userEmail", email)
              router.push("/security-recommendations")
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            View Security Recommendations
          </Button>

          <button
            onClick={() => {
              setRiskAlert(null)
              setRiskResponse("")
              setEmail("")
              setPassword("")
            }}
            className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors py-2"
          >
            Back to Login
          </button>
        </CardContent>
      </Card>
    )
  }

  if (needs2FA) {
    return (
      <Card className="w-full max-w-md border-slate-700/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 dark:border-slate-700/50 dark:bg-slate-900/50 light:border-slate-300 light:bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
          <CardDescription>Enter your 6-digit authentication code</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
                Authentication Code
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.slice(0, 6))}
                maxLength="6"
                className="text-center text-3xl tracking-widest font-mono bg-slate-800/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/30 dark:bg-slate-800/50 dark:border-slate-600 light:bg-slate-100 light:border-slate-300"
              />
            </div>
            {error && (
              <Alert className="border-red-700 bg-red-950 bg-opacity-30 dark:border-red-700 light:border-red-200 light:bg-red-100">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-400 dark:text-red-400 light:text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={loading || twoFACode.length !== 6}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 h-auto"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setNeeds2FA(false)
                setTwoFACode("")
                setError("")
              }}
              className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Back to Login
            </button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-slate-700/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 dark:border-slate-700/50 dark:bg-slate-900/50 light:border-slate-300 light:bg-white">
      <CardHeader>
        <CardTitle className="text-2xl">{isLogin ? "Sign In" : "Create Account"}</CardTitle>
        <CardDescription>{isLogin ? "Access your security dashboard" : "Protect your account today"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/30 text-white placeholder:text-slate-500 dark:bg-slate-800/50 dark:border-slate-600 light:bg-slate-100 light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/30 text-white placeholder:text-slate-500 pr-10 dark:bg-slate-800/50 dark:border-slate-600 light:bg-slate-100 light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 dark:text-slate-500 light:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-700 bg-red-950 bg-opacity-30 dark:border-red-700 light:border-red-200 light:bg-red-100">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-400 dark:text-red-400 light:text-red-700">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-700 bg-green-950 bg-opacity-30 dark:border-green-700 light:border-green-200 light:bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-400 dark:text-green-400 light:text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 h-auto"
          >
            {loading ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <div className="mt-6 pt-6 border-t border-slate-700/50 dark:border-slate-700/50 light:border-slate-300">
          <p className="text-center text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
              setSuccess("")
            }}
            className="w-full text-cyan-400 hover:text-cyan-300 font-medium transition-colors py-2"
          >
            {isLogin ? "Sign up here" : "Sign in here"}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
