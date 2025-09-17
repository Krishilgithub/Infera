import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HowItWorks from "@/components/how-it-works";
import TestimonialsSection from "@/components/testimonials-section";
import PricingTable from "@/components/pricing-table";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import CTASection from "@/components/cta-section";

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				{/* 1. Hero Section - First impression with powerful headline and CTA */}
				<HeroSection />

				{/* 2. Features Section - What we offer with benefits */}
				<FeaturesSection />

				{/* 3. How It Works - Simple 3-step process */}
				<HowItWorks />

				{/* 4. Testimonials - Social proof and trust building */}
				<TestimonialsSection />

				{/* 5. Pricing Section - Clear pricing plans */}
				<section className="section-padding bg-muted/50">
					<div className="container">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								Simple, Transparent
								<span className="gradient-text block">Pricing</span>
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
								Choose the plan that fits your team's needs. Start free, upgrade
								anytime.
							</p>
						</div>
						<PricingTable />
					</div>
				</section>

				{/* 6. FAQ Section - Answer common questions */}
				<FAQSection />

				{/* 7. Contact Section - Get in touch */}
				<ContactSection />

				{/* 8. Final CTA - Last chance to convert */}
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
