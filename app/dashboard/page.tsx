"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import HunterDashboard from "./hunter-dashboard"
import CreatorDashboard from "./creator-dashboard"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Show loading state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>
  }

  // Show appropriate dashboard based on user role
  if (user?.role === "creator") {
    return <CreatorDashboard />
  } else if (user?.role === "hunter") {
    return <HunterDashboard />
  }

  // Default fallback (shouldn't happen in normal cases)
  return <div className="min-h-screen flex items-center justify-center">Unknown user role</div>
}
