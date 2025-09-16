"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:pl-64">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
