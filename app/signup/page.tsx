import AuthForm from '@/components/auth-form'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md mx-auto px-6">
        <AuthForm mode="signup" />
      </main>
    </div>
  )
}
