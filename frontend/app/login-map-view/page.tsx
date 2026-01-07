"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface MapInfo {
  message: string
  map_url: string
  total_locations: number
  email: string
}

interface LocationData {
  ip: string
  city: string
  region: string
  country: string
  country_code: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
  total_logins: number
  successful_logins: number
  failed_logins: number
  last_login: string
  location_string: string
}

export default function LoginMapView() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [mapInfo, setMapInfo] = useState<MapInfo | null>(null)
  const [locations, setLocations] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)

    const fetchMapData = async () => {
      try {
        // Fetch map info
        const mapRes = await fetch(`${API_URL}/login-map/${userEmail}`)
        const mapData = await mapRes.json()
        setMapInfo(mapData)

        // Fetch location details
        const locRes = await fetch(`${API_URL}/login-locations/${userEmail}`)
        const locData = await locRes.json()
        setLocations(locData.locations)
      } catch (err) {
        console.log("[v0] Error fetching map data:", err)
        setError("Failed to load map data")
      } finally {
        setLoading(false)
      }
    }

    fetchMapData()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout email={email}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !mapInfo) {
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
          <h1 className="text-3xl font-bold mb-2">Login Locations Map</h1>
          <p className="text-muted-foreground">Interactive map showing all your login locations</p>
        </div>

        {/* Map Viewer */}
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
          <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
            <CardDescription>Click below to view the full interactive map in a new window</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => window.open(mapInfo.map_url, "_blank")}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Interactive Map
            </Button>
            <p className="text-sm text-muted-foreground">
              The map shows all {mapInfo.total_locations} unique login locations with detailed statistics for each
            </p>
          </CardContent>
        </Card>

        {/* Locations List */}
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
          <CardHeader>
            <CardTitle>All Login Locations</CardTitle>
            <CardDescription>{locations.length} unique locations found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locations.map((location, idx) => (
                <div key={idx} className="p-4 bg-slate-700 bg-opacity-50 rounded-lg border border-slate-600">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-cyan-400">
                        {location.city}, {location.country}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">IP:</span> {location.ip}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">ISP:</span> {location.isp}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Timezone:</span> {location.timezone}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-slate-600 rounded text-center">
                          <p className="text-lg font-bold text-cyan-400">{location.total_logins}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="p-2 bg-green-950 rounded text-center">
                          <p className="text-lg font-bold text-green-400">{location.successful_logins}</p>
                          <p className="text-xs text-muted-foreground">Success</p>
                        </div>
                        <div className="p-2 bg-red-950 rounded text-center">
                          <p className="text-lg font-bold text-red-400">{location.failed_logins}</p>
                          <p className="text-xs text-muted-foreground">Failed</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Last Login:</span> {location.last_login}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
