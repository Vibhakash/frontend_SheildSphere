"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface RecentActivityProps {
  email: string
}

export default function RecentActivity({ email }: RecentActivityProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/login-history/${email}?limit=30`)
        const data = await res.json()

        // Group by country for chart
        const countryStats: { [key: string]: number } = {}
        data.events?.forEach((event: any) => {
          countryStats[event.country] = (countryStats[event.country] || 0) + 1
        })

        const chartData = Object.entries(countryStats).map(([country, count]) => ({
          name: country,
          logins: count,
        }))

        setChartData(chartData)
      } catch (err) {
        console.error("Failed to fetch activity data")
      } finally {
        setLoading(false)
      }
    }

    fetchLoginHistory()
  }, [email])

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
      <CardHeader>
        <CardTitle>Login Activity by Location</CardTitle>
        <CardDescription>Your login distribution across countries</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.3)" />
              <XAxis dataKey="name" stroke="rgb(148,163,184)" />
              <YAxis stroke="rgb(148,163,184)" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                cursor={{ fill: "rgba(6,182,212,0.1)" }}
              />
              <Bar dataKey="logins" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No login data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
