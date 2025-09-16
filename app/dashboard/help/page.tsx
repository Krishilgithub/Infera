"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	HelpCircle,
	ArrowLeft,
	Search,
	MessageCircle,
	Mail,
	Phone,
	BookOpen,
	Video,
	Calendar,
	Users,
	Settings,
	Shield,
	Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const faqData = [
	{
		category: "Getting Started",
		icon: Zap,
		questions: [
			{
				question: "How do I start my first meeting?",
				answer:
					"Click the 'Start Meeting' button on the dashboard or use the 'Join Meeting' option to enter a meeting code.",
			},
			{
				question: "How do I schedule a meeting?",
				answer:
					"Use the 'Schedule Meeting' button to set up future meetings with participants and meeting details.",
			},
			{
				question: "What is a meeting code?",
				answer:
					"A meeting code is a unique 6-character identifier that allows others to join your meeting.",
			},
		],
	},
	{
		category: "Meeting Features",
		icon: Video,
		questions: [
			{
				question: "How do I share my screen?",
				answer:
					"Click the screen share button in the meeting controls to share your screen with other participants.",
			},
			{
				question: "Can I use chat during meetings?",
				answer:
					"Yes, click the chat button to open the meeting chat and send messages to other participants.",
			},
			{
				question: "How do I raise my hand?",
				answer:
					"Click the hand raise button in the meeting controls to signal that you want to speak.",
			},
		],
	},
	{
		category: "Account & Settings",
		icon: Settings,
		questions: [
			{
				question: "How do I update my profile?",
				answer:
					"Go to your Profile page from the sidebar to update your personal information and preferences.",
			},
			{
				question: "How do I change notification settings?",
				answer:
					"Visit the Settings page to customize your notification preferences for emails, push notifications, and SMS.",
			},
			{
				question: "How do I change my password?",
				answer:
					"Go to Settings > Security to update your password and security settings.",
			},
		],
	},
];

const contactMethods = [
	{
		title: "Live Chat",
		description: "Get instant help from our support team",
		icon: MessageCircle,
		action: "Start Chat",
	},
	{
		title: "Email Support",
		description: "Send us an email and we'll respond within 24 hours",
		icon: Mail,
		action: "Send Email",
	},
	{
		title: "Phone Support",
		description: "Call us for immediate assistance",
		icon: Phone,
		action: "Call Now",
	},
];

export default function HelpPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
	const router = useRouter();

	const filteredFAQs = faqData
		.map((category) => ({
			...category,
			questions: category.questions.filter(
				(q) =>
					q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
					q.answer.toLowerCase().includes(searchQuery.toLowerCase())
			),
		}))
		.filter((category) => category.questions.length > 0);

	const toggleQuestion = (index: number) => {
		setExpandedQuestion(expandedQuestion === index ? null : index);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							onClick={() => router.push("/dashboard")}
							className="text-gray-500 hover:text-gray-700"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Dashboard
						</Button>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Help & Support
							</h1>
							<p className="text-gray-600 mt-1">
								Find answers to common questions and get support
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Search and Quick Actions */}
					<div className="lg:col-span-1 space-y-6">
						{/* Search */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<Search className="mr-2 h-5 w-5" />
									Search Help
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<Input
										type="text"
										placeholder="Search for help topics..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
									<div className="text-sm text-gray-500">
										Popular searches: "meeting", "schedule", "audio", "video"
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900">
									Quick Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={() => router.push("/dashboard/meeting")}
								>
									<Video className="mr-2 h-4 w-4" />
									Start a Meeting
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={() => router.push("/dashboard/schedule")}
								>
									<Calendar className="mr-2 h-4 w-4" />
									Schedule Meeting
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={() => router.push("/dashboard/profile")}
								>
									<Users className="mr-2 h-4 w-4" />
									Update Profile
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={() => router.push("/dashboard/settings")}
								>
									<Settings className="mr-2 h-4 w-4" />
									Settings
								</Button>
							</CardContent>
						</Card>

						{/* Contact Support */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900">
									Contact Support
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{contactMethods.map((method, index) => {
									const Icon = method.icon;
									return (
										<div
											key={index}
											className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
										>
											<div className="flex items-center space-x-3">
												<Icon className="h-5 w-5 text-blue-600" />
												<div>
													<p className="font-medium text-gray-900">
														{method.title}
													</p>
													<p className="text-sm text-gray-500">
														{method.description}
													</p>
												</div>
											</div>
											<Button size="sm" variant="outline">
												{method.action}
											</Button>
										</div>
									);
								})}
							</CardContent>
						</Card>
					</div>

					{/* FAQ Section */}
					<div className="lg:col-span-2">
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<BookOpen className="mr-2 h-5 w-5" />
									Frequently Asked Questions
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{filteredFAQs.map((category, categoryIndex) => {
										const Icon = category.icon;
										return (
											<div key={categoryIndex}>
												<div className="flex items-center space-x-2 mb-4">
													<Icon className="h-5 w-5 text-blue-600" />
													<h3 className="text-lg font-semibold text-gray-900">
														{category.category}
													</h3>
												</div>
												<div className="space-y-3">
													{category.questions.map((faq, questionIndex) => {
														const globalIndex =
															categoryIndex * 100 + questionIndex;
														const isExpanded = expandedQuestion === globalIndex;

														return (
															<motion.div
																key={questionIndex}
																className="border border-gray-200 rounded-lg"
															>
																<button
																	onClick={() => toggleQuestion(globalIndex)}
																	className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
																>
																	<span className="font-medium text-gray-900">
																		{faq.question}
																	</span>
																	<HelpCircle
																		className={`h-4 w-4 text-gray-400 transition-transform ${
																			isExpanded ? "rotate-180" : ""
																		}`}
																	/>
																</button>
																<motion.div
																	initial={false}
																	animate={{
																		height: isExpanded ? "auto" : 0,
																		opacity: isExpanded ? 1 : 0,
																	}}
																	transition={{ duration: 0.2 }}
																	className="overflow-hidden"
																>
																	<div className="px-4 pb-3 text-gray-600">
																		{faq.answer}
																	</div>
																</motion.div>
															</motion.div>
														);
													})}
												</div>
											</div>
										);
									})}

									{searchQuery && filteredFAQs.length === 0 && (
										<div className="text-center py-8">
											<HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
											<p className="text-gray-500">
												No results found for "{searchQuery}"
											</p>
											<p className="text-sm text-gray-400 mt-2">
												Try different keywords or contact support for help
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
