import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HowItWorks from "@/components/how-it-works";
import TestimonialsSection from "@/components/testimonials-section";

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





				{/* 8. Final CTA - Last chance to convert */}
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
