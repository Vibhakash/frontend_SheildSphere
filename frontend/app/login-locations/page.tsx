"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface Location {
  ip: string
  city: string
  region: string
  country: string
  latitude: number
  longitude: number
  total_logins: number
  successful_logins: number
  last_login: string
}

export default function LoginLocationsPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)

    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_URL}/login-locations/${userEmail}`)
        const data = await res.json()
        setLocations(data.locations || [])
      } catch (err) {
        console.error("Failed to fetch locations")
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
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
          <h1 className="text-3xl font-bold mb-2">Login Locations</h1>
          <p className="text-muted-foreground">Geographic distribution of your logins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, idx) => (
            <Card
              key={idx}
              className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-500" />
                  <span className="text-lg">{location.city}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold">
                    {location.city}, {location.region}
                  </p>
                  <p className="text-sm text-cyan-400">{location.country}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Coordinates</p>
                  <p className="font-mono text-sm">
                    {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Logins</p>
                    <p className="text-2xl font-bold text-cyan-400">{location.total_logins}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Successful</p>
                    <p className="text-2xl font-bold text-green-400">{location.successful_logins}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Login</p>
                  <p className="text-sm">{location.last_login}</p>
                </div>
                <Badge className="w-full justify-center bg-cyan-600 hover:bg-cyan-700">
                  <Globe className="w-3 h-3 mr-1" />
                  IP: {location.ip}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {locations.length === 0 && (
          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardContent className="py-12 text-center">
              <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No login locations found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
