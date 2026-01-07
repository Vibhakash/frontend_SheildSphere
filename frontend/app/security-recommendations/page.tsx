"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface Recommendation {
  priority: "HIGH" | "MEDIUM" | "LOW"
  recommendation: string
  action: string
}

interface RecommendationsData {
  email: string
  priority_recommendations: Recommendation[]
  general_recommendations: Recommendation[]
  total_alerts: number
}

export default function SecurityRecommendations() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [data, setData] = useState<RecommendationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${API_URL}/security-recommendations/${userEmail}`)
        const data = await res.json()

        if (res.ok) {
          setData(data)
        } else {
          setError("Failed to load recommendations")
        }
      } catch (err) {
        console.log("[v0] Error fetching recommendations:", err)
        setError("Failed to connect to server")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [router])

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "MEDIUM":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "border-red-900 bg-red-950 bg-opacity-30"
      case "MEDIUM":
        return "border-yellow-900 bg-yellow-950 bg-opacity-30"
      default:
        return "border-blue-900 bg-blue-950 bg-opacity-30"
    }
  }

  if (loading) {
    return (
      <DashboardLayout email={email}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !data) {
    return (
      <DashboardLayout email={email}>
        <Alert className="border-red-900 bg-red-950 bg-opacity-30">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-400">{error || "No data available"}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout email={email}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Recommendations</h1>
          <p className="text-muted-foreground">Personalized security advice based on your account activity</p>
        </div>

        {data.total_alerts > 0 && (
          <Alert className="border-red-900 bg-red-950 bg-opacity-30">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">
              You have {data.total_alerts} high-priority security alert(s) that need attention
            </AlertDescription>
          </Alert>
        )}

        {/* Priority Recommendations */}
        {data.priority_recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-400">Critical Security Actions Required</h2>
            {data.priority_recommendations.map((rec, idx) => (
              <Card key={idx} className={`border ${getPriorityColor(rec.priority)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {getPriorityIcon(rec.priority)}
                    <div className="flex-1">
                      <p className="font-semibold text-red-300">{rec.recommendation}</p>
                      <p className="text-sm text-muted-foreground mt-2">Action: {rec.action}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* General Recommendations */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">General Security Recommendations</h2>
          {data.general_recommendations.map((rec, idx) => (
            <Card key={idx} className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {getPriorityIcon(rec.priority)}
                  <div className="flex-1">
                    <p className="font-semibold">{rec.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
