import { config } from "@/config"

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

export async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${config.API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
    console.log("[v0] API call:", options.method || "GET", url)

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    const data = await response.json().catch(() => ({}))
    console.log("[v0] API response:", response.status, data)

    if (!response.ok) {
      return {
        error: data.detail || data.message || `API Error: ${response.status}`,
        status: response.status,
      }
    }

    return {
      data,
      status: response.status,
    }
  } catch (err: any) {
    const errorMessage = err.message || "Network connection failed"
    console.error("[v0] API error:", errorMessage)
    return {
      error: `Connection failed: ${errorMessage}. Check backend URL: ${config.API_URL}`,
      status: 0,
    }
  }
}
