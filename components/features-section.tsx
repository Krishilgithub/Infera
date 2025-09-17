"use client";

import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Brain,
	MessageSquare,
	FileText,
	Users,
	TrendingUp,
	Clock,
	Shield,
	Zap,
	BarChart3,
	Calendar,
	Download,
	Globe,
} from "lucide-react";

const features = [
	{
		icon: Brain,
		title: "AI-Powered Analysis",
		description:
			"Advanced machine learning algorithms analyze conversations in real-time to extract meaningful insights and patterns.",
		benefits: ["Real-time processing", "Advanced NLP", "Context awareness"],
	},
	{
		icon: MessageSquare,
		title: "Live Transcription",
		description:
			"Get accurate, real-time transcription of all conversations with speaker identification and timestamps.",
		benefits: [
			"99.5% accuracy",
			"Multi-language support",
			"Speaker recognition",
		],
	},
	{
		icon: TrendingUp,
		title: "Sentiment Tracking",
		description:
			"Monitor emotional tone and engagement levels throughout meetings to understand team dynamics.",
		benefits: ["Emotion detection", "Engagement scoring", "Mood analytics"],
	},
	{
		icon: FileText,
		title: "Smart Summaries",
		description:
			"Automatically generate comprehensive meeting summaries with key decisions, action items, and next steps.",
		benefits: ["Auto-generated", "Customizable format", "Instant delivery"],
	},
	{
		icon: BarChart3,
		title: "Meeting Analytics",
		description:
			"Comprehensive dashboards showing speaking time, participation rates, and conversation patterns.",
		benefits: ["Visual insights", "Participation metrics", "Trend analysis"],
	},
	{
		icon: Clock,
		title: "Action Item Tracking",
		description:
			"Automatically identify and track action items, deadlines, and follow-ups from your conversations.",
		benefits: ["Auto-detection", "Deadline tracking", "Follow-up reminders"],
	},
	{
		icon: Users,
		title: "Team Collaboration",
		description:
			"Share insights, summaries, and action items with your team for better collaboration and accountability.",
		benefits: ["Team sharing", "Role-based access", "Collaboration tools"],
	},
	{
		icon: Globe,
		title: "Universal Integration",
		description:
			"Works seamlessly with Zoom, Teams, Google Meet, Slack, and 50+ other platforms you already use.",
		benefits: ["50+ integrations", "Easy setup", "No disruption"],
	},
	{
		icon: Shield,
		title: "Enterprise Security",
		description:
			"Bank-level encryption and compliance with GDPR, SOC 2, and other security standards.",
		benefits: ["End-to-end encryption", "GDPR compliant", "SOC 2 certified"],
	},
	{
		icon: Download,
		title: "Easy Export",
		description:
			"Export summaries, transcripts, and insights to PDF, Word, or integrate directly with your workflow tools.",
		benefits: ["Multiple formats", "API access", "Workflow integration"],
	},
	{
		icon: Zap,
		title: "Instant Setup",
		description:
			"Get started in under 5 minutes with our simple onboarding process and intuitive interface.",
		benefits: ["5-minute setup", "No training needed", "Intuitive design"],
	},
	{
		icon: Calendar,
		title: "Meeting Scheduling",
		description:
			"Integrated calendar management with automatic meeting preparation and post-meeting follow-ups.",
		benefits: ["Calendar sync", "Auto-preparation", "Follow-up automation"],
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
};

export default function FeaturesSection() {
	return (
		<section className="section-padding bg-muted/50">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Powerful Features for
						<span className="gradient-text block">Smarter Meetings</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Transform every conversation into actionable insights with our
						comprehensive suite of AI-powered tools
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<motion.div key={index} variants={itemVariants}>
								<Card className="card-elevated h-full group hover:shadow-lg transition-all duration-300">
									<CardHeader className="text-center pb-4">
										<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4 group-hover:scale-110 transition-transform duration-300">
											<Icon className="h-8 w-8 text-primary" />
										</div>
										<CardTitle className="text-xl font-semibold text-foreground">
											{feature.title}
										</CardTitle>
									</CardHeader>
									<CardContent className="text-center">
										<CardDescription className="text-muted-foreground mb-4 leading-relaxed">
											{feature.description}
										</CardDescription>
										<div className="space-y-2">
											{feature.benefits.map((benefit, benefitIndex) => (
												<div
													key={benefitIndex}
													className="flex items-center text-sm text-muted-foreground"
												>
													<div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
													{benefit}
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="text-center mt-16"
				>
					<p className="text-muted-foreground mb-6">
						Ready to revolutionize your meetings?
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="btn-primary">Start Free Trial</button>
						<button className="btn-secondary">Schedule Demo</button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
