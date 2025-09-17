import { Suspense } from 'react'
import AuthForm from '@/components/auth-form'

function SignupContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md mx-auto px-6">
        <AuthForm mode="signup" />
      </main>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <main className="w-full max-w-md mx-auto px-6">
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
