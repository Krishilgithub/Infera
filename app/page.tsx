import Header from '@/components/header'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import ProductHighlights from '@/components/product-highlights'
import HowItWorks from '@/components/how-it-works'
import TrustSection from '@/components/trust-section'
import CTASection from '@/components/cta-section'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductHighlights />
        <HowItWorks />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
