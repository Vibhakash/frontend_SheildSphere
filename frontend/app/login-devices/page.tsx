"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Laptop, Monitor } from "lucide-react"

const API_URL = "https://web-production-39f0f.up.railway.app"

interface Device {
  device_id: number
  browser: { name: string; version: string }
  os: { name: string; version: string }
  device: { type: string; brand: string; model: string }
  user_agent: string
  total_logins: number
  successful_logins: number
  failed_logins: number
  last_seen: string
}

export default function LoginDevicesPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)

    const fetchDevices = async () => {
      try {
        const res = await fetch(`${API_URL}/login-devices/${userEmail}`)
        const data = await res.json()
        console.log("[v0] Devices data:", data)
        setDevices(data.devices || [])
      } catch (err) {
        console.error("[v0] Failed to fetch devices:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
  }, [router])

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return <Smartphone className="w-5 h-5" />
      case "desktop":
        return <Monitor className="w-5 h-5" />
      default:
        return <Laptop className="w-5 h-5" />
    }
  }

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
          <h1 className="text-3xl font-bold mb-2">Connected Devices</h1>
          <p className="text-muted-foreground">All devices that accessed your account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {devices.map((device, idx) => (
            <Card
              key={idx}
              className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative hover:border-cyan-500/50 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <div className="text-cyan-500">{getDeviceIcon(device.device.type)}</div>
                  {device.device.type}
                </CardTitle>
                <CardDescription>
                  {device.browser.name} • {device.os.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Browser</p>
                    <p className="font-semibold text-sm">{device.browser.name}</p>
                    <p className="text-xs text-cyan-400">{device.browser.version}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">OS</p>
                    <p className="font-semibold text-sm">{device.os.name}</p>
                    <p className="text-xs text-cyan-400">{device.os.version}</p>
                  </div>
                </div>

                

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-slate-700 bg-opacity-50 border border-slate-600">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-cyan-400 mt-1">{device.total_logins}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-700 bg-opacity-50 border border-green-600/30">
                    <p className="text-xs text-muted-foreground">Success</p>
                    <p className="font-bold text-green-400 mt-1">{device.successful_logins}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-700 bg-opacity-50 border border-red-600/30">
                    <p className="text-xs text-muted-foreground">Failed</p>
                    <p className="font-bold text-red-400 mt-1">{device.failed_logins}</p>
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-700/30 border border-slate-600">
                  <p className="text-xs text-muted-foreground">Last Seen</p>
                  <p className="text-sm text-slate-300 mt-1">{device.last_seen}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {devices.length === 0 && (
          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardContent className="py-12 text-center">
              <Laptop className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No device data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
