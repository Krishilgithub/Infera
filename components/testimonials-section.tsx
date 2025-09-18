"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
	{
		name: "Sarah Johnson",
		role: "Product Manager",
		company: "TechCorp Inc.",
		avatar: "👩‍💼",
		rating: 5,
		testimonial:
			"Infera has completely transformed how our team conducts meetings. The AI insights help us stay focused and the automatic summaries save us hours every week.",
		metrics: "40% faster meetings",
	},
	{
		name: "Michael Chen",
		role: "Engineering Lead",
		company: "StartupXYZ",
		avatar: "👨‍💻",
		rating: 5,
		testimonial:
			"The sentiment analysis feature is game-changing. We can now identify when team members are disengaged and address issues before they become problems.",
		metrics: "85% team satisfaction increase",
	},
	{
		name: "Emily Rodriguez",
		role: "Sales Director",
		company: "GrowthCo",
		avatar: "👩‍🎨",
		rating: 5,
		testimonial:
			"Our client meetings are now more productive than ever. The action item tracking ensures nothing falls through the cracks, and our clients love the professional summaries.",
		metrics: "60% better follow-through",
	},
	{
		name: "David Kim",
		role: "CEO",
		company: "InnovateLab",
		avatar: "👨‍🔬",
		rating: 5,
		testimonial:
			"Infera gives us insights into our communication patterns that we never had before. It's like having a meeting coach that helps us continuously improve.",
		metrics: "3x faster decision making",
	},
	{
		name: "Lisa Wang",
		role: "HR Director",
		company: "PeopleFirst",
		avatar: "👩‍💼",
		rating: 5,
		testimonial:
			"The analytics dashboard helps us understand team dynamics better. We can see participation patterns and ensure everyone's voice is heard in our meetings.",
		metrics: "95% participation rate",
	},
	{
		name: "Alex Thompson",
		role: "Project Manager",
		company: "BuildTech",
		avatar: "👨‍💼",
		rating: 5,
		testimonial:
			"Setting up Infera took less than 5 minutes, and the ROI was immediate. Our project meetings are now focused, productive, and everyone knows their next steps.",
		metrics: "50% project acceleration",
	},
];

const companies = [
	{ name: "TechCorp", logo: "🏢" },
	{ name: "StartupXYZ", logo: "🚀" },
	{ name: "GrowthCo", logo: "📈" },
	{ name: "InnovateLab", logo: "🔬" },
	{ name: "PeopleFirst", logo: "👥" },
	{ name: "BuildTech", logo: "🏗️" },
	{ name: "DataDriven", logo: "📊" },
	{ name: "CloudNine", logo: "☁️" },
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

export default function TestimonialsSection() {
	return (
		<section className="section-padding bg-background">
			<div className="container">
				{/* Section Header */}
				   <motion.div
					   initial={{ opacity: 0, y: 20 }}
					   whileInView={{ opacity: 1, y: 0 }}
					   viewport={{ once: true }}
					   transition={{ duration: 0.6 }}
					   className="text-center mb-16"
				   >
					   <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
						   Trusted by Teams
						   <span className="gradient-text block">Around the World</span>
					   </h2>
					   <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" aria-live='polite'>
						   Join thousands of professionals who have transformed their meetings
						   with Infera
					   </p>

					{/* Overall Stats */}
					   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
						   <div className="text-center">
							   <div className="text-3xl md:text-4xl font-bold gradient-text mb-2" aria-label="50,000+">50,000+</div>
							   <div className="text-sm text-muted-foreground" aria-label="Active Users">Active Users</div>
						   </div>
						   <div className="text-center">
							   <div className="text-3xl md:text-4xl font-bold gradient-text mb-2" aria-label="1M+">1M+</div>
							   <div className="text-sm text-muted-foreground" aria-label="Meetings Analyzed">Meetings Analyzed</div>
						   </div>
						   <div className="text-center">
							   <div className="text-3xl md:text-4xl font-bold gradient-text mb-2" aria-label="98%">98%</div>
							   <div className="text-sm text-muted-foreground" aria-label="Satisfaction Rate">Satisfaction Rate</div>
						   </div>
						   <div className="text-center">
							   <div className="text-3xl md:text-4xl font-bold gradient-text mb-2" aria-label="4.9/5">4.9/5</div>
							   <div className="text-sm text-muted-foreground" aria-label="Average Rating">Average Rating</div>
						   </div>
					   </div>
				</motion.div>

				{/* Testimonials Grid */}
				   <motion.div
					   variants={containerVariants}
					   initial="hidden"
					   whileInView="visible"
					   viewport={{ once: true }}
					   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
				   >
					   {testimonials.map((testimonial, index) => (
						   <motion.div key={index} variants={itemVariants}>
							   <Card className="card-elevated h-full group hover:shadow-lg transition-all duration-300" tabIndex={0}>
								   <CardContent className="p-6">
									   {/* Rating */}
									   <div className="flex items-center mb-4" aria-label={`Rated ${testimonial.rating} out of 5`}>
										   {[...Array(testimonial.rating)].map((_, i) => (
											   <Star
												   key={i}
												   className="h-4 w-4 fill-yellow-400 text-yellow-400"
											   />
										   ))}
									   </div>

									   {/* Quote */}
									   <div className="relative mb-6">
										   <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
										   <p className="text-muted-foreground leading-relaxed pl-4" aria-live='polite'>
											   "{testimonial.testimonial}"
										   </p>
									   </div>

									   {/* Metric */}
									   <div className="bg-primary/10 rounded-lg p-3 mb-6 text-center">
										   <div className="font-semibold text-primary">
											   {testimonial.metrics}
										   </div>
									   </div>

									   {/* Author */}
									   <div className="flex items-center">
										   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl mr-4">
											   {testimonial.avatar}
										   </div>
										   <div>
											   <div className="font-semibold text-foreground">
												   {testimonial.name}
											   </div>
											   <div className="text-sm text-muted-foreground">
												   {testimonial.role}
											   </div>
											   <div className="text-sm text-primary font-medium">
												   {testimonial.company}
											   </div>
										   </div>
									   </div>
								   </CardContent>
							   </Card>
						   </motion.div>
					   ))}
				   </motion.div>

				{/* Company Logos */}
				   <motion.div
					   initial={{ opacity: 0, y: 20 }}
					   whileInView={{ opacity: 1, y: 0 }}
					   viewport={{ once: true }}
					   transition={{ duration: 0.6, delay: 0.3 }}
					   className="text-center"
				   >
					   <p className="text-sm font-medium text-muted-foreground mb-8" aria-live='polite'>
						   Trusted by teams at these companies and many more
					   </p>
					   <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
						   {companies.map((company, index) => (
							   <div
								   key={index}
								   className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
								   tabIndex={0}
								   aria-label={company.name}
							   >
								   <span className="text-2xl">{company.logo}</span>
								   <span className="font-medium">{company.name}</span>
							   </div>
						   ))}
					   </div>
				   </motion.div>
			</div>
		</section>
	);
}
