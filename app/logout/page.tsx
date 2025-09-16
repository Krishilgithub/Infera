"use client"

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

export default function LogoutPage() {
  const { signOut } = useAuth()

  useEffect(() => {
    signOut()
  }, [signOut])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
    </div>
  )
}
