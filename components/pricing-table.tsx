"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

const plans = [
	{
		name: "Free",
		price: "$0",
		period: "/month",
		description: "Perfect for individuals and small teams getting started.",
		features: [
			"Up to 5 meetings per month",
			"Real-time transcription",
			"Basic sentiment analysis",
			"Meeting summaries",
			"Email support",
			"1 user",
		],
		limitations: [
			"Limited AI insights",
			"Basic integrations",
			"Standard accuracy",
		],
		cta: "Start Free Trial",
		popular: false,
		variant: "outline" as const,
	},
	{
		name: "Pro",
		price: "$29",
		period: "/month",
		description: "Ideal for growing teams who need advanced AI features.",
		features: [
			"Unlimited meetings",
			"Advanced emotion tracking",
			"Speaker analytics",
			"Smart action items",
			"Custom workflows",
			"Jargon assistant",
			"Priority support",
			"Up to 10 users",
			"Advanced integrations",
			"Team analytics",
		],
		limitations: [],
		cta: "Start Pro Trial",
		popular: true,
		variant: "gradient" as const,
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "",
		description:
			"For large organizations with advanced security and compliance needs.",
		features: [
			"Everything in Pro",
			"Unlimited users",
			"Custom AI models",
			"Advanced security",
			"SSO & SAML",
			"Dedicated support",
			"Custom integrations",
			"On-premise deployment",
			"Compliance reporting",
			"Training & onboarding",
		],
		limitations: [],
		cta: "Contact Sales",
		popular: false,
		variant: "outline" as const,
	},
];

const comparisonFeatures = [
	{
		category: "Meeting Features",
		features: [
			{
				name: "Monthly meetings",
				free: "5",
				pro: "Unlimited",
				enterprise: "Unlimited",
			},
			{ name: "Real-time transcription", free: "✓", pro: "✓", enterprise: "✓" },
			{ name: "Speaker identification", free: "✓", pro: "✓", enterprise: "✓" },
			{
				name: "Emotion tracking",
				free: "Basic",
				pro: "Advanced",
				enterprise: "Advanced",
			},
			{ name: "Meeting summaries", free: "✓", pro: "✓", enterprise: "✓" },
			{
				name: "Action items",
				free: "Basic",
				pro: "Smart",
				enterprise: "Smart",
			},
		],
	},
	{
		category: "AI & Analytics",
		features: [
			{
				name: "Sentiment analysis",
				free: "Basic",
				pro: "Advanced",
				enterprise: "Advanced",
			},
			{ name: "Speaker analytics", free: "✗", pro: "✓", enterprise: "✓" },
			{ name: "Team insights", free: "✗", pro: "✓", enterprise: "✓" },
			{ name: "Jargon assistant", free: "✗", pro: "✓", enterprise: "✓" },
			{ name: "Custom AI models", free: "✗", pro: "✗", enterprise: "✓" },
			{ name: "ROI tracking", free: "✗", pro: "✓", enterprise: "✓" },
		],
	},
	{
		category: "Integrations & Support",
		features: [
			{ name: "Basic integrations", free: "✓", pro: "✓", enterprise: "✓" },
			{ name: "Advanced integrations", free: "✗", pro: "✓", enterprise: "✓" },
			{ name: "Custom integrations", free: "✗", pro: "✗", enterprise: "✓" },
			{ name: "Email support", free: "✓", pro: "✓", enterprise: "✓" },
			{ name: "Priority support", free: "✗", pro: "✓", enterprise: "✓" },
			{ name: "Dedicated support", free: "✗", pro: "✗", enterprise: "✓" },
		],
	},
];

export default function PricingTable() {
	return (
		<div className="section-padding">
			<div className="container">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Simple, Transparent
						<span className="gradient-text block">Pricing</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Choose the plan that fits your team. Start free, upgrade anytime.
					</p>
				</motion.div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
					{plans.map((plan, index) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className="relative"
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
									<div className="bg-gradient-to-r from-navy-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
										<Star className="h-4 w-4 mr-1" />
										Most Popular
									</div>
								</div>
							)}

							<Card
								className={`h-full ${
									plan.popular ? "ring-2 ring-navy-500 shadow-lg" : ""
								}`}
							>
								<CardHeader className="text-center">
									<CardTitle className="text-2xl">{plan.name}</CardTitle>
									<div className="mt-4">
										<span className="text-4xl font-bold">{plan.price}</span>
										<span className="text-muted-foreground">{plan.period}</span>
									</div>
									<CardDescription className="mt-2">
										{plan.description}
									</CardDescription>
								</CardHeader>

								<CardContent>
									<Button
										variant={plan.variant}
										size="lg"
										className="w-full mb-6"
									>
										{plan.cta}
									</Button>

									<ul className="space-y-3">
										{plan.features.map((feature) => (
											<li key={feature} className="flex items-center">
												<Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
												<span className="text-sm">{feature}</span>
											</li>
										))}
									</ul>

									{plan.limitations.length > 0 && (
										<div className="mt-6 pt-6 border-t">
											<h4 className="text-sm font-medium text-muted-foreground mb-2">
												Limitations:
											</h4>
											<ul className="space-y-1">
												{plan.limitations.map((limitation) => (
													<li
														key={limitation}
														className="text-xs text-muted-foreground"
													>
														• {limitation}
													</li>
												))}
											</ul>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Feature Comparison Table */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						Compare Plans
					</h2>

					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="border-b">
									<th className="text-left p-4 font-semibold">Features</th>
									<th className="text-center p-4 font-semibold">Free</th>
									<th className="text-center p-4 font-semibold">Pro</th>
									<th className="text-center p-4 font-semibold">Enterprise</th>
								</tr>
							</thead>
							<tbody>
								{comparisonFeatures.map((category, categoryIndex) => (
									<React.Fragment key={`category-group-${categoryIndex}`}>
										<tr className="bg-muted/30">
											<td colSpan={4} className="p-4 font-semibold">
												{category.category}
											</td>
										</tr>
										{category.features.map((feature, featureIndex) => (
											<tr
												key={`${categoryIndex}-${featureIndex}`}
												className="border-b"
											>
												<td className="p-4">{feature.name}</td>
												<td className="p-4 text-center">{feature.free}</td>
												<td className="p-4 text-center">{feature.pro}</td>
												<td className="p-4 text-center">
													{feature.enterprise}
												</td>
											</tr>
										))}
									</React.Fragment>
								))}
							</tbody>
						</table>
					</div>
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-24 gradient-bg rounded-2xl p-12"
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Ready to Get Started?
					</h2>
					<p className="text-xl text-muted-foreground mb-8">
						Start your free trial today. No credit card required.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" variant="gradient">
							<Zap className="mr-2 h-4 w-4" />
							Start Free Trial
						</Button>
						<Button size="lg" variant="outline">
							Contact Sales
						</Button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
