"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="gradient-bg section-padding">
			<div className="container">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-8"
					>
						<div className="space-y-4">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2, duration: 0.5 }}
								className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
							>
								<Sparkles className="h-4 w-4 mr-2 text-infera-500" />
								<span className="text-sm font-medium">
									AI-Powered Meeting Intelligence
								</span>
							</motion.div>

                            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
                                Transform Your
                                <span className="gradient-text block">Meetings Forever</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-lg">
                                Get real-time transcription, emotion tracking, task assignments, and
                                automated summaries. Never miss important insights again.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/signup">
                                <Button size="lg" variant="gradient" className="group">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/demo">
                                <Button size="lg" variant="outline" className="group">
                                    <Play className="mr-2 h-4 w-4" />
                                    Book Demo
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                            <div>
                                <span className="font-semibold text-foreground">14-day</span>{" "}
                                free trial
                            </div>
                            <div>
                                <span className="font-semibold text-foreground">No credit card</span>{" "}
                                required
                            </div>
                            <div>
                                <span className="font-semibold text-foreground">5-min</span>{" "}
                                setup
                            </div>
                        </div>
				</motion.div>
				{/* Right Content - Hero Visual */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className="relative"
				>
					<div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 shadow-2xl">
						{/* Mock Meeting Interface */}
						<div className="space-y-6">
							{/* Video Grid Placeholder */}
							<div className="grid grid-cols-2 gap-4">
								{[
									{
										name: "Sarah Kim",
										image: "/participants/sarah-kim.jpg",
										alt: "Sarah Kim, Asian woman in her 30s, smiling and working on a laptop in a modern office."
									},
									{
										name: "Mike Johnson",
										image: "/participants/mike-johnson.jpg",
										alt: "Mike Johnson, Black man in his 20s, collaborating with colleagues at a coworking space."
									},
									{
										name: "Emma Patel",
										image: "/participants/emma-patel.jpg",
										alt: "Emma Patel, South Asian woman in her 40s, presenting ideas on a whiteboard."
									},
									{
										name: "Alex Müller",
										image: "/participants/alex-muller.jpg",
										alt: "Alex Müller, White man in his 30s, focused and engaged in a video call."
									}
								].map((participant, i) => (
									<div
										key={i}
										className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden"
									>
										<img
											src={participant.image}
											alt={participant.alt}
											className="object-cover w-full h-full absolute inset-0 rounded-lg"
											width={384}
											height={216}
											loading="lazy"
										/>
										<div className="absolute bottom-2 left-2 right-2">
											<div className="bg-black/40 backdrop-blur-sm rounded px-2 py-1">
												<span className="text-white text-xs font-medium">
													{participant.name}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
							{/* Transcript Panel */}
							<div className="bg-black/10 dark:bg-white/10 rounded-lg p-4 space-y-3">
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
									<span className="text-sm font-medium text-foreground">
										Live Transcript
									</span>
								</div>
								<div className="space-y-2 text-sm">
									<div className="flex items-start space-x-2">
										<span className="text-infera-600 dark:text-infera-300 font-medium">
											Sarah:
										</span>
										<span className="text-foreground">
											Let's discuss the Q4 roadmap...
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="text-rose-600 dark:text-rose-300 font-medium">
											Mike:
										</span>
										<span className="text-foreground">
											I think we should prioritize the mobile app
										</span>
									</div>
								</div>
							</div>
							{/* Task Assignments */}
							<div className="bg-black/10 dark:bg-white/10 rounded-lg p-4">
								<h4 className="text-sm font-medium text-foreground mb-2">
									Task Assignments
								</h4>
								<div className="space-y-1 text-sm text-foreground/80">
									<div>• Finalize mobile app design by Friday</div>
									<div>• Schedule user testing sessions</div>
								</div>
							</div>
						</div>
						{/* Floating Elements */}
						<motion.div
							animate={{ y: [0, -10, 0] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="absolute -top-4 -right-4 bg-gradient-to-r from-infera-500 to-rose-600 rounded-full p-3 shadow-lg"
						>
							<Sparkles className="h-6 w-6 text-white" />
						</motion.div>
						<motion.div
							animate={{ y: [0, 10, 0] }}
							transition={{ duration: 3, repeat: Infinity }}
							className="absolute -bottom-4 -left-4 bg-gradient-to-r from-rose-500 to-crimson-600 rounded-full p-2 shadow-lg"
						>
							<div className="h-4 w-4 bg-white rounded-full"></div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	</section>
);
}
