"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface TwoFASetupProps {
  email: string
  onSetupComplete?: () => void
}

export default function TwoFASetup({ email, onSetupComplete }: TwoFASetupProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerateQR = async () => {
    setLoading(true)
    setError("")
    try {
      console.log("[v0] Fetching QR code for email:", email)
      const res = await fetch(`${API_URL}/setup-2fa-image/${email}`)

      if (!res.ok) {
        throw new Error(`Failed to generate QR code: ${res.status}`)
      }

      const blob = await res.blob()
      console.log("[v0] Received blob:", blob.type, blob.size)

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        console.log("[v0] QR code data URL created, length:", dataUrl.length)
        setQrCode(dataUrl)
      }
      reader.onerror = () => {
        console.error("[v0] FileReader error")
        setError("Failed to process QR code. Please try again.")
      }
      reader.readAsDataURL(blob)
    } catch (err) {
      console.error("[v0] Failed to generate QR code:", err)
      setError("Failed to generate QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
      <CardHeader className="relative z-10">
        <CardTitle>Enable Two-Factor Authentication</CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {error && (
          <div className="p-3 rounded bg-red-950/30 border border-red-500/30 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!qrCode ? (
          <Button onClick={handleGenerateQR} disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700">
            {loading ? "Generating QR Code..." : "Generate QR Code"}
          </Button>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-6 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <img
                src={qrCode || "/placeholder.svg"}
                alt="2FA QR Code"
                className="w-72 h-72"
                onError={() => {
                  console.error("[v0] Failed to load QR code image")
                  setError("Failed to display QR code. Please try generating again.")
                }}
                onLoad={() => {
                  console.log("[v0] QR code image loaded successfully")
                }}
              />
            </div>
            <p className="text-sm text-slate-300 text-center">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
            </p>
            <Button onClick={onSetupComplete} className="w-full bg-green-600 hover:bg-green-700">
              I've Scanned the QR Code
            </Button>
            <Button
              onClick={() => {
                setQrCode(null)
                setError("")
              }}
              variant="outline"
              className="w-full border-slate-600 hover:bg-slate-700"
            >
              Generate New QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
