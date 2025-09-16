import { User } from '@supabase/supabase-js'

export type AuthUser = User & {
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error: any }>
}

export interface SignUpFormData {
  email: string
  password: string
  fullName: string
}

export interface SignInFormData {
  email: string
  password: string
}
