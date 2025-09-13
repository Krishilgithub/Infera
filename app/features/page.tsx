import Header from '@/components/header'
import Footer from '@/components/footer'
import FeatureDetail from '@/components/feature-detail'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <FeatureDetail />
      </main>
      <Footer />
    </div>
  )
}
