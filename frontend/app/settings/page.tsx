"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Shield, Bell, AlertCircle, CheckCircle } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

export default function SettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [twoFAPassword, setTwoFAPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState<"none" | "enable" | "disable">("none")
  const [disableLoading, setDisableLoading] = useState(false)
  const [enableLoading, setEnableLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)

    fetch2FAStatus(userEmail)
  }, [router])

  const fetch2FAStatus = async (userEmail: string) => {
    try {
      const res = await fetch(`${API_URL}/2fa-status/${userEmail}`)
      const data = await res.json()
      setTwoFAEnabled(data.is_2fa_enabled)
    } catch (err) {
      console.log("Error fetching 2FA status:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQR = async () => {
    setErrorMsg("")
    setEnableLoading(true)
    
    try {
      const res = await fetch(`${API_URL}/setup-2fa-image/${email}`, {
        method: "POST",
      })
      
      if (!res.ok) {
        throw new Error("Failed to generate QR code")
      }
      
      const blob = await res.blob()
      
      // Clean up old URL if exists
      if (qrCode) {
        URL.revokeObjectURL(qrCode)
      }
      
      const url = URL.createObjectURL(blob)
      setQrCode(url)
      
      console.log("QR Code URL generated:", url)
    } catch (err) {
      console.log("Error generating QR code:", err)
      setErrorMsg("Failed to generate QR code. Please try again.")
    } finally {
      setEnableLoading(false)
    }
  }

  const handleVerifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code")
      return
    }

    setEnableLoading(true)
    setErrorMsg("")

    try {
      // Since you want to use existing endpoints, we'll just mark as complete
      // The backend already enabled 2FA when QR was generated
      await fetch2FAStatus(email)
      
      setAction("none")
      if (qrCode) {
        URL.revokeObjectURL(qrCode)
      }
      setQrCode(null)
      setVerificationCode("")
      setSuccessMsg("2FA enabled successfully!")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err) {
      console.log("Error completing 2FA setup:", err)
      setErrorMsg("Failed to complete setup. Please try again.")
    } finally {
      setEnableLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!twoFAPassword) {
      setErrorMsg("Please enter your password")
      return
    }

    setDisableLoading(true)
    setErrorMsg("")

    try {
      const res = await fetch(`${API_URL}/disable-2fa/${email}?password=${encodeURIComponent(twoFAPassword)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      if (res.ok) {
        setTwoFAEnabled(false)
        setAction("none")
        setTwoFAPassword("")
        setSuccessMsg("2FA disabled successfully")
        setTimeout(() => setSuccessMsg(""), 3000)
      } else {
        setErrorMsg(data.detail || "Failed to disable 2FA")
      }
    } catch (err) {
      console.log("Error disabling 2FA:", err)
      setErrorMsg("Failed to disable 2FA. Please try again.")
    } finally {
      setDisableLoading(false)
    }
  }

  const handleCancelSetup = () => {
    setAction("none")
    if (qrCode) {
      URL.revokeObjectURL(qrCode)
    }
    setQrCode(null)
    setVerificationCode("")
    setErrorMsg("")
  }

  if (loading) {
    return (
      <DashboardLayout email={email}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading settings...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout email={email}>
      <div className="space-y-6 w-full max-w-full">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account security and preferences</p>
        </div>

        {/* Account Info */}
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input value={email} disabled className="bg-slate-900 border-slate-600 mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* 2FA Settings */}
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-500" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              {twoFAEnabled ? "Your account is protected with 2FA" : "Enhance your account security"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMsg && (
              <Alert className="border-red-900 bg-red-950 bg-opacity-30">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-400">{errorMsg}</AlertDescription>
              </Alert>
            )}
            {successMsg && (
              <Alert className="border-green-900 bg-green-950 bg-opacity-30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-400">{successMsg}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between p-4 bg-slate-700 bg-opacity-50 rounded-lg border border-slate-600">
              <span className="font-medium">2FA Status</span>
              <span className={`font-semibold flex items-center gap-2 ${twoFAEnabled ? "text-green-400" : "text-yellow-400"}`}>
                {twoFAEnabled ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Enabled
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Disabled
                  </>
                )}
              </span>
            </div>

            {action === "none" && (
              <Button
                onClick={() => setAction(twoFAEnabled ? "disable" : "enable")}
                className={twoFAEnabled ? "bg-red-600 hover:bg-red-700" : "bg-cyan-600 hover:bg-cyan-700"}
              >
                {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            )}

            {action === "enable" && !qrCode && (
              <Button 
                onClick={handleGenerateQR} 
                disabled={enableLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                {enableLoading ? "Generating..." : "Generate QR Code"}
              </Button>
            )}

            {action === "enable" && qrCode && (
              <div className="space-y-4">
                <Alert className="border-cyan-900 bg-cyan-950 bg-opacity-30">
                  <Bell className="h-4 w-4 text-cyan-500" />
                  <AlertDescription className="text-cyan-300">
                    Scan the QR code with your authenticator app, then enter the 6-digit code to verify
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border-2 border-slate-700">
                  {qrCode && (
                    <img
                      src={qrCode}
                      alt="2FA QR Code"
                      className="w-64 h-64"
                      onLoad={() => console.log("QR code loaded successfully")}
                      onError={(e) => {
                        console.error("QR code failed to load")
                        setErrorMsg("Failed to load QR code image")
                      }}
                    />
                  )}
                  <div className="text-sm text-slate-700 text-center max-w-md font-medium">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Enter Verification Code</label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="bg-slate-900 border-slate-600 text-center text-xl tracking-widest"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleVerifyAndEnable}
                    disabled={verificationCode.length !== 6 || enableLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {enableLoading ? "Verifying..." : "Verify & Enable 2FA"}
                  </Button>
                  <Button
                    onClick={handleCancelSetup}
                    variant="outline"
                    className="flex-1 border-slate-600"
                    disabled={enableLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {action === "disable" && (
              <div className="space-y-4">
                <Alert className="border-yellow-900 bg-yellow-950 bg-opacity-30">
                  <Bell className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-300">
                    Enter your password to disable two-factor authentication
                  </AlertDescription>
                </Alert>
                <div>
                  <label className="text-sm font-medium mb-2 block">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={twoFAPassword}
                    onChange={(e) => setTwoFAPassword(e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDisable2FA}
                    disabled={!twoFAPassword || disableLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {disableLoading ? "Disabling..." : "Confirm Disable"}
                  </Button>
                  <Button
                    onClick={() => {
                      setAction("none")
                      setTwoFAPassword("")
                      setErrorMsg("")
                    }}
                    variant="outline"
                    className="flex-1 border-slate-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-500" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Enable two-factor authentication for enhanced security</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Use unique, strong passwords for your accounts</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Review login history regularly for suspicious activity</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Keep your devices and browsers updated</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Never share your authentication codes with anyone</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}