import Header from '@/components/header'
import Footer from '@/components/footer'
import DemoInterface from '@/components/demo-interface'

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <DemoInterface />
      </main>
      <Footer />
    </div>
  )
}
