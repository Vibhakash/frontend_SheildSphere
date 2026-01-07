"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, AlertTriangle, CheckCircle } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

export default function URLScanner() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"input" | "validating" | "scanning" | "result">("input")

  const scanURL = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setStep("validating")

    try {
      // First validate the URL
      const validateRes = await fetch(`${API_URL}/validate-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const validateData = await validateRes.json()

      if (!validateData.valid) {
        setResult(validateData)
        setStep("result")
        setLoading(false)
        return
      }

      // If valid, scan it
      setStep("scanning")
      const scanRes = await fetch(`${API_URL}/scan-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const scanData = await scanRes.json()
      setResult(scanData)
      setStep("result")
    } catch (err) {
      setResult({ error: "Failed to scan URL" })
      setStep("result")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-500" />
          URL Security Scanner
        </CardTitle>
        <CardDescription>Scan URLs for phishing and malware threats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={scanURL} className="space-y-4">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-slate-900 border-slate-600"
          />
          <Button type="submit" disabled={!url || loading} className="w-full bg-cyan-600 hover:bg-cyan-700">
            {loading ? `${step === "validating" ? "Validating..." : "Scanning..."}` : "Scan URL"}
          </Button>
        </form>

        {result && (
          <div className="space-y-3">
            {result.is_safe === false || result.threats ? (
              <Alert className="border-red-900 bg-red-950 bg-opacity-30">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  <strong>Warning!</strong> This URL appears to be unsafe.{" "}
                  {result.threat_description || "Threats detected."}
                </AlertDescription>
              </Alert>
            ) : result.valid === false ? (
              <Alert className="border-yellow-900 bg-yellow-950 bg-opacity-30">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription>
                  <strong>{result.status}</strong> {result.message}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-900 bg-green-950 bg-opacity-30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  This URL appears to be safe. However, always be cautious with suspicious links.
                </AlertDescription>
              </Alert>
            )}

            {result.details && (
              <div className="p-3 rounded bg-slate-700 bg-opacity-50 text-sm space-y-2">
                {Object.entries(result.details).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <p className="font-semibold text-cyan-400 capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-slate-300">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
