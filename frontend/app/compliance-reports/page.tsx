export const dynamic = 'force-dynamic'

"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Download } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface ComplianceReport {
  standard: string
  compliant: boolean
  data_stored: any
  user_rights: string[]
}

export default function ComplianceReports() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [report, setReport] = useState<ComplianceReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)
  }, [router])

  const fetchReport = async (standard: string) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/compliance-report/${email}?standard=${standard}`)
      const data = await res.json()

      if (res.ok) {
        setReport(data)
      } else {
        setError("Failed to generate report")
      }
    } catch (err) {
      console.error("[v0] Error fetching compliance report:", err)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    if (!report) return

    const content = `
Compliance Report - ${report.standard}
Generated for: ${email}
Date: ${new Date().toLocaleDateString()}

Status: ${report.compliant ? "COMPLIANT" : "NOT COMPLIANT"}

Data Stored:
${Object.entries(report.data_stored)
  .map(([key, value]) => `  - ${key}: ${value}`)
  .join("\n")}

User Rights:
${report.user_rights.map((right) => `  ✓ ${right}`).join("\n")}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.standard}-compliance-report.txt`
    a.click()
  }

  return (
    <DashboardLayout email={email}>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Reports</h1>
          <p className="text-muted-foreground">GDPR compliance documentation for your account</p>
        </div>

        {error && (
          <Alert className="border-red-900 bg-red-950 bg-opacity-30">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
          <CardHeader className="relative z-10">
            <CardTitle>GDPR Compliance Report</CardTitle>
            <CardDescription>Generate your GDPR compliance documentation</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button
              onClick={() => fetchReport("GDPR")}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>

        {/* Report Display */}
        {report && (
          <Card
            className={`border-l-4 overflow-hidden relative ${report.compliant ? "border-l-green-500" : "border-l-red-500"}`}
          >
            <div
              className={`absolute inset-0 ${report.compliant ? "bg-green-500/5" : "bg-red-500/5"} pointer-events-none`}
            ></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                {report.compliant ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                {report.standard} Compliance Report
              </CardTitle>
              <CardDescription>Status: {report.compliant ? "COMPLIANT" : "NOT COMPLIANT"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {/* Data Stored */}
              <div>
                <h3 className="font-bold mb-3">Data Stored</h3>
                <div className="space-y-2 pl-4 border-l border-slate-600">
                  {Object.entries(report.data_stored).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-cyan-400 font-medium">{key}:</span>
                      <span className="text-muted-foreground ml-2">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Rights */}
              <div>
                <h3 className="font-bold mb-3">User Rights</h3>
                <ul className="space-y-2">
                  {report.user_rights.map((right, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{right}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Download Button */}
              <Button onClick={handleDownloadReport} className="w-full bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}