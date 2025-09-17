"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
	{
		question: "How does Infera work with my existing meeting platforms?",
		answer:
			"Infera integrates seamlessly with all major meeting platforms including Zoom, Microsoft Teams, Google Meet, Webex, and more. Simply connect your account and Infera will automatically join your meetings to provide real-time analysis. No downloads or plugins required for participants.",
	},
	{
		question: "Is my meeting data secure and private?",
		answer:
			"Absolutely. We use bank-level encryption (AES-256) for all data transmission and storage. Infera is SOC 2 Type II certified and GDPR compliant. We never share your data with third parties, and you maintain full control over your information. Audio is processed in real-time and can be automatically deleted according to your preferences.",
	},
	{
		question: "How accurate is the transcription and analysis?",
		answer:
			"Our AI achieves 99.5% transcription accuracy in optimal conditions and supports 40+ languages. The sentiment analysis and insight extraction improve over time as our AI learns your team's communication patterns. We continuously update our models to handle accents, technical terminology, and industry-specific language.",
	},
	{
		question: "Can I try Infera before committing to a paid plan?",
		answer:
			"Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can analyze up to 5 meetings during your trial period. After the trial, you can choose the plan that best fits your needs or continue with our free tier.",
	},
	{
		question: "How quickly can my team get started?",
		answer:
			"Setup takes less than 5 minutes. Simply sign up, connect your meeting platform, and you're ready to go. Our onboarding process guides you through the setup, and our AI starts providing insights from your very first meeting. No training or technical expertise required.",
	},
	{
		question: "What happens to my data if I cancel my subscription?",
		answer:
			"You maintain access to all your meeting data for 90 days after cancellation. During this period, you can export all transcripts, summaries, and insights. After 90 days, data is permanently deleted from our servers unless you reactivate your account. You can also request immediate data deletion at any time.",
	},
	{
		question: "Does Infera work for large enterprise teams?",
		answer:
			"Yes! Our Enterprise plan is designed for organizations of any size. We offer advanced admin controls, SSO integration, custom integrations, dedicated support, and can handle thousands of concurrent meetings. Contact our sales team for volume discounts and custom enterprise features.",
	},
	{
		question: "Can I customize the insights and reports?",
		answer:
			"Absolutely. Infera allows you to customize summary formats, choose which insights to focus on, and create custom templates for different meeting types. You can also set up automated workflows to send specific insights to different team members or integrate with your project management tools.",
	},
	{
		question: "What if participants don't want to be recorded?",
		answer:
			'Infera respects privacy preferences. Meeting hosts can enable "privacy mode" which provides analysis without storing audio or full transcripts. We also support opt-out features for individual participants and can provide real-time insights without permanent storage of sensitive discussions.',
	},
	{
		question: "How does pricing work for teams?",
		answer:
			"Our plans are priced per user per month. The Free plan supports 1 user, Professional starts at $15/month per user, and Enterprise includes volume discounts. All plans include unlimited meetings for active users. You only pay for team members who actively use Infera for meeting analysis.",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3 },
	},
};

function FAQItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<motion.div variants={itemVariants}>
			<Card className="card-elevated mb-4 overflow-hidden">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full text-left p-6 hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
					aria-expanded={isOpen}
				>
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold text-foreground pr-4">
							{faq.question}
						</h3>
						{isOpen ? (
							<ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
						)}
					</div>
				</button>

				<motion.div
					initial={false}
					animate={{
						height: isOpen ? "auto" : 0,
						opacity: isOpen ? 1 : 0,
					}}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="overflow-hidden"
				>
					<CardContent className="px-6 pb-6 pt-0">
						<p className="text-muted-foreground leading-relaxed">
							{faq.answer}
						</p>
					</CardContent>
				</motion.div>
			</Card>
		</motion.div>
	);
}

export default function FAQSection() {
	return (
		<section className="section-padding bg-muted/30">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Frequently Asked
						<span className="gradient-text block">Questions</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Everything you need to know about Infera. Can't find what you're
						looking for?
						<a href="#contact" className="text-primary hover:underline ml-1">
							Contact our team
						</a>
						.
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="max-w-4xl mx-auto"
				>
					{faqs.map((faq, index) => (
						<FAQItem key={index} faq={faq} index={index} />
					))}
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="text-center mt-16"
				>
					<Card className="card-elevated p-8 max-w-2xl mx-auto">
						<h3 className="text-2xl font-bold text-foreground mb-4">
							Still have questions?
						</h3>
						<p className="text-muted-foreground mb-6">
							Our team is here to help. Get in touch and we'll answer any
							questions you have about Infera.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className="btn-primary">Contact Support</button>
							<button className="btn-secondary">Schedule Demo</button>
						</div>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
