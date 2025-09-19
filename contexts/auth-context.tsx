"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthUser, AuthContextType } from '@/lib/types/auth'
import type { AuthError } from '@supabase/supabase-js'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Handle different auth events
        if (event === 'SIGNED_OUT') {
          // Preserve current path as next target on sign out
          try {
            const current = window.location.pathname + window.location.search
            const url = new URL('/login', window.location.origin)
            url.searchParams.set('next', current)
            router.push(url.toString())
          } catch {
            router.push('/login')
          }
        } else if (event === 'SIGNED_IN' && session?.user) {
          // After sign in, if a `next` is specified in URL or localStorage, go there
          try {
            const url = new URL(window.location.href)
            const next = url.searchParams.get('next') || localStorage.getItem('next') || ''
            const safeNext = next && next.startsWith('/') ? next : ''
            if (safeNext) {
              // Clear the stored next to avoid loops
              localStorage.removeItem('next')
              setTimeout(() => {
                router.replace(safeNext)
              }, 100)
              return
            }
          } catch {}

          // Fallback: Only redirect to dashboard from public pages
          const currentPath = window.location.pathname
          if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/') {
            setTimeout(() => {
              router.push('/dashboard')
            }, 100)
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }, [supabase.auth])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }, [supabase.auth])

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }, [supabase.auth])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  }, [supabase.auth])

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }, [supabase.auth])

  const updateProfile = useCallback(async (updates: { full_name?: string; avatar_url?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }, [supabase.auth])

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
