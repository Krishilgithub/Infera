"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Mail,
	Phone,
	MapPin,
	MessageSquare,
	Clock,
	CheckCircle,
	AlertCircle,
} from "lucide-react";

const contactMethods = [
	{
		icon: MessageSquare,
		title: "Live Chat",
		description: "Get instant help from our support team",
		contact: "Available 24/7",
		action: "Start Chat",
	},
	{
		icon: Mail,
		title: "Email Support",
		description: "Send us a detailed message",
		contact: "support@infera.ai",
		action: "Send Email",
	},
	{
		icon: Phone,
		title: "Phone Support",
		description: "Speak directly with our team",
		contact: "+1 (555) 123-4567",
		action: "Call Now",
	},
	{
		icon: MapPin,
		title: "Office",
		description: "Visit us at our headquarters",
		contact: "123 AI Street, Tech Valley, CA 94000",
		action: "Get Directions",
	},
];

const officeHours = [
	{ day: "Monday - Friday", hours: "9:00 AM - 6:00 PM PST" },
	{ day: "Saturday", hours: "10:00 AM - 4:00 PM PST" },
	{ day: "Sunday", hours: "Closed" },
];

export default function ContactSection() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// For demo purposes, randomly succeed or fail
		const success = Math.random() > 0.3;
		setSubmitStatus(success ? "success" : "error");
		setIsSubmitting(false);

		if (success) {
			setFormData({
				name: "",
				email: "",
				company: "",
				subject: "",
				message: "",
			});
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<section className="section-padding bg-background" id="contact">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Get in Touch
						<span className="gradient-text block">We're Here to Help</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Have questions about Infera? Want to see a demo? Our team is ready
						to help you transform your meetings.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<Card className="card-elevated">
							<CardHeader>
								<CardTitle className="text-2xl font-bold text-foreground">
									Send us a message
								</CardTitle>
								<p className="text-muted-foreground">
									Fill out the form below and we'll get back to you within 24
									hours.
								</p>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium text-foreground mb-2"
											>
												Full Name *
											</label>
											<Input
												id="name"
												name="name"
												type="text"
												required
												value={formData.name}
												onChange={handleInputChange}
												placeholder="John Doe"
												className="w-full"
											/>
										</div>
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-foreground mb-2"
											>
												Email Address *
											</label>
											<Input
												id="email"
												name="email"
												type="email"
												required
												value={formData.email}
												onChange={handleInputChange}
												placeholder="john@company.com"
												className="w-full"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="company"
											className="block text-sm font-medium text-foreground mb-2"
										>
											Company
										</label>
										<Input
											id="company"
											name="company"
											type="text"
											value={formData.company}
											onChange={handleInputChange}
											placeholder="Your Company"
											className="w-full"
										/>
									</div>

									<div>
										<label
											htmlFor="subject"
											className="block text-sm font-medium text-foreground mb-2"
										>
											Subject *
										</label>
										<Input
											id="subject"
											name="subject"
											type="text"
											required
											value={formData.subject}
											onChange={handleInputChange}
											placeholder="How can we help you?"
											className="w-full"
										/>
									</div>

									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium text-foreground mb-2"
										>
											Message *
										</label>
										<textarea
											id="message"
											name="message"
											required
											value={formData.message}
											onChange={handleInputChange}
											placeholder="Tell us more about your needs..."
											rows={6}
											className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
										/>
									</div>

									{/* Submit Status */}
									{submitStatus === "success" && (
										<div className="flex items-center text-green-600 bg-green-50 p-3 rounded-md">
											<CheckCircle className="h-5 w-5 mr-2" />
											<span>
												Message sent successfully! We'll get back to you soon.
											</span>
										</div>
									)}

									{submitStatus === "error" && (
										<div className="flex items-center text-red-600 bg-red-50 p-3 rounded-md">
											<AlertCircle className="h-5 w-5 mr-2" />
											<span>
												Something went wrong. Please try again or contact us
												directly.
											</span>
										</div>
									)}

									<Button
										type="submit"
										disabled={isSubmitting}
										className="w-full btn-primary"
									>
										{isSubmitting ? "Sending..." : "Send Message"}
									</Button>
								</form>
							</CardContent>
						</Card>
					</motion.div>

					{/* Contact Information */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="space-y-8"
					>
						{/* Contact Methods */}
						<div className="space-y-6">
							{contactMethods.map((method, index) => {
								const Icon = method.icon;
								return (
									<Card
										key={index}
										className="card-elevated group hover:shadow-lg transition-all duration-300"
									>
										<CardContent className="p-6">
											<div className="flex items-start space-x-4">
												<div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300">
													<Icon className="h-6 w-6 text-primary" />
												</div>
												<div className="flex-1">
													<h3 className="font-semibold text-foreground mb-1">
														{method.title}
													</h3>
													<p className="text-sm text-muted-foreground mb-2">
														{method.description}
													</p>
													<p className="text-sm font-medium text-primary mb-3">
														{method.contact}
													</p>
													<button className="text-sm text-primary hover:underline">
														{method.action}
													</button>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>

						{/* Office Hours */}
						<Card className="card-elevated">
							<CardHeader>
								<CardTitle className="flex items-center text-lg font-semibold text-foreground">
									<Clock className="h-5 w-5 mr-2 text-primary" />
									Office Hours
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{officeHours.map((schedule, index) => (
										<div
											key={index}
											className="flex justify-between items-center"
										>
											<span className="text-muted-foreground">
												{schedule.day}
											</span>
											<span className="font-medium text-foreground">
												{schedule.hours}
											</span>
										</div>
									))}
								</div>
								<div className="mt-4 p-3 bg-primary/5 rounded-lg">
									<p className="text-sm text-primary">
										💡 <strong>24/7 Live Chat:</strong> Our AI assistant is
										available round the clock for immediate help.
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
