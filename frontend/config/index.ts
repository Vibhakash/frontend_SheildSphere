export const config = {
  // IMPORTANT: Set your backend URL here
  // Option 1 - Environment Variable (Recommended):
  //   Create .env.local file and add: NEXT_PUBLIC_API_URL=https://your-backend-url.com
  // Option 2 - Direct URL:
  //   Replace the URL below directly
  API_URL: process.env.NEXT_PUBLIC_API_URL || "https://web-production-39f0f.up.railway.app",

  // Verify your backend is working by visiting:
  // {API_URL}/docs - FastAPI Swagger documentation
  // {API_URL}/health - Health check endpoint

  // App metadata
  APP_NAME: "ShieldSphere",
  APP_DESCRIPTION: "Advanced Account Security Platform",

  // Features
  FEATURES: {
    ENABLE_2FA: true,
    ENABLE_DEVICE_TRACKING: true,
    ENABLE_GEO_LOCATION: true,
    ENABLE_PASSWORD_CHECKER: true,
    ENABLE_URL_SCANNER: true,
    ENABLE_IP_CHECKER: true,
  },
}
