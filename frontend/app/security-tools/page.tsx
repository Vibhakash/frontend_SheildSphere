"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PasswordChecker from "@/components/security/password-checker"
import URLScanner from "@/components/security/url-scanner"
import IPChecker from "@/components/security/ip-checker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SecurityToolsPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    setEmail(userEmail)
    setLoading(false)
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
          <h1 className="text-3xl font-bold mb-2">Security Tools</h1>
          <p className="text-muted-foreground">Check passwords, URLs, and IP addresses for threats</p>
        </div>

        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="url">URL Scanner</TabsTrigger>
            <TabsTrigger value="ip">IP Checker</TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="space-y-4">
            <PasswordChecker />
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <URLScanner />
          </TabsContent>

          <TabsContent value="ip" className="space-y-4">
            <IPChecker />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
