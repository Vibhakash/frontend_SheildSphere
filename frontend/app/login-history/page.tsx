"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

export default function LoginHistoryPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)

    const fetchLoginHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/login-history/${userEmail}?limit=50`)
        const data = await res.json()
        setLoginHistory(data.events || [])
      } catch (err) {
        console.error("Failed to fetch login history")
      } finally {
        setLoading(false)
      }
    }

    fetchLoginHistory()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout email={email}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout email={email}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Login History</h1>
          <p className="text-muted-foreground">All your login attempts and activities</p>
        </div>

        <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
          <CardHeader>
            <CardTitle>Recent Login Attempts</CardTitle>
            <CardDescription>Total: {loginHistory.length} events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginHistory.map((event, idx) => (
                    <TableRow key={idx} className="border-slate-700 hover:bg-slate-700 bg-opacity-30">
                      <TableCell>
                        {event.success ? (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Success
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 hover:bg-red-700">
                            <XCircle className="w-3 h-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                      <TableCell>{event.country}</TableCell>
                      <TableCell className="text-sm">{event.timestamp}</TableCell>
                      <TableCell className="text-xs max-w-xs truncate">{event.user_agent || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
