import Header from '@/components/header'
import Footer from '@/components/footer'
import IntegrationsGrid from '@/components/integrations-grid'

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <IntegrationsGrid />
      </main>
      <Footer />
    </div>
  )
}
