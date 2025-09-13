import Header from '@/components/header'
import Footer from '@/components/footer'
import PricingTable from '@/components/pricing-table'
import PricingFAQ from '@/components/pricing-faq'

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PricingTable />
        <PricingFAQ />
      </main>
      <Footer />
    </div>
  )
}
