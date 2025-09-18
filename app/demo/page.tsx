import Header from "@/components/header";
import Footer from "@/components/footer";
import DemoInterface from "@/components/demo-interface";
import AILiveMeetingInterface from "@/components/ai-live-meeting-interface";

export default function DemoPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				<div className="container mx-auto py-8">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Infera AI Demo
						</h1>
						<p className="text-xl text-gray-600 mb-8">
							Experience the future of AI-powered meetings
						</p>
					</div>

					{/* AI Meeting Demo */}
					<div className="mb-12">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
							AI-Powered Meeting Interface
						</h2>
						<AILiveMeetingInterface />
					</div>

					{/* Original Demo Interface for comparison */}
					<div className="mt-12 pt-8 border-t border-gray-200">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
							Standard Meeting Interface
						</h2>
						<DemoInterface />
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
