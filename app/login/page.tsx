import Header from '@/components/header'
import Footer from '@/components/footer'
import AuthForm from '@/components/auth-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <AuthForm mode="login" />
      </main>
      <Footer />
    </div>
  )
}
