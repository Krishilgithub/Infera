import { Suspense } from 'react'
import AuthForm from '@/components/auth-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

function LoginContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md mx-auto px-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
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
