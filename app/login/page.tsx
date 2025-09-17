import { Suspense } from 'react'
import AuthForm from '@/components/auth-form'

function LoginContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md mx-auto px-6">
        <AuthForm mode="login" />
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <main className="w-full max-w-md mx-auto px-6">
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
