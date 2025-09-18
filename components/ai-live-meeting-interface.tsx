"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Mic,
	MicOff,
	Video,
	VideoOff,
	Phone,
	PhoneOff,
	Settings,
	Users,
	MessageSquare,
	Share,
	MoreVertical,
	Volume2,
	VolumeX,
	Monitor,
	Hand,
	Sparkles,
	Download,
	Copy,
	Check,
	ArrowLeft,
	Brain,
	Heart,
	Zap,
	BookOpen,
	BarChart3,
	Eye,
	Smile,
	AlertTriangle,
	CheckCircle,
	Clock,
} from "lucide-react";
import { useTranscription } from "@/hooks/use-transcription";
import {
	useSentimentAnalysis,
	useInsightExtraction,
	useJargonExplanation,
} from "@/hooks/use-ai-analysis";
import {
	TranscriptionResponse,
	SentimentAnalysisResponse,
	InsightExtractionResponse,
} from "@/lib/ai/openrouter-client";

interface MeetingParticipant {
	id: string;
	name: string;
	role: "host" | "member";
	video: boolean;
	audio: boolean;
	avatar: string;
	isCurrentUser: boolean;
	sentiment?: SentimentAnalysisResponse;
	lastSpoke?: Date;
}

interface TranscriptEntry {
	id: string;
	speaker: string;
	text: string;
	timestamp: Date;
	sentiment?: SentimentAnalysisResponse;
	confidence: number;
}

interface JargonTerm {
	term: string;
	explanation: string;
	context: string;
	timestamp: Date;
}

export default function AILiveMeetingInterface() {
	const [participants, setParticipants] = useState<MeetingParticipant[]>([
		{
			id: "1",
			name: "Sarah Johnson",
			role: "host",
			video: true,
			audio: true,
			avatar: "👩‍💼",
			isCurrentUser: false,
		},
		{
			id: "2",
			name: "Michael Chen",
			role: "member",
			video: true,
			audio: true,
			avatar: "👨‍💻",
			isCurrentUser: false,
		},
		{
			id: "3",
			name: "You",
			role: "member",
			video: true,
			audio: true,
			avatar: "👤",
			isCurrentUser: true,
		},
	]);

	const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
	const [insights, setInsights] = useState<InsightExtractionResponse | null>(
		null
	);
	const [jargonTerms, setJargonTerms] = useState<JargonTerm[]>([]);
	const [isAIEnabled, setIsAIEnabled] = useState(true);
	const [selectedJargon, setSelectedJargon] = useState<JargonTerm | null>(null);
	const [showInsights, setShowInsights] = useState(false);
	const [showTranscript, setShowTranscript] = useState(true);

	// AI Hooks
	const {
		isRecording,
		isTranscribing,
		error: transcriptionError,
		startRecording,
		stopRecording,
	} = useTranscription({
		continuous: true,
		onTranscription: handleTranscription,
	});

	const { analyzeSentiment } = useSentimentAnalysis();
	const { extractInsights } = useInsightExtraction();
	const { explainJargon } = useJargonExplanation();

	const transcriptRef = useRef<HTMLDivElement>(null);

	async function handleTranscription(result: TranscriptionResponse) {
		const currentUser = participants.find((p) => p.isCurrentUser);
		if (!currentUser || !result.text.trim()) return;

		const newEntry: TranscriptEntry = {
			id: Date.now().toString(),
			speaker: currentUser.name,
			text: result.text,
			timestamp: new Date(),
			confidence: result.confidence,
		};

		// Add sentiment analysis
		try {
			const sentiment = await analyzeSentiment(result.text);
			newEntry.sentiment = sentiment;

			// Update participant sentiment
			setParticipants((prev) =>
				prev.map((p) =>
					p.isCurrentUser ? { ...p, sentiment, lastSpoke: new Date() } : p
				)
			);
		} catch (error) {
			console.error("Sentiment analysis failed:", error);
		}

		setTranscript((prev) => {
			const updated = [...prev, newEntry];

			// Extract insights from recent conversation
			if (updated.length % 5 === 0) {
				// Every 5 entries
				extractInsightsFromTranscript(updated.slice(-10)); // Last 10 entries
			}

			// Check for potential jargon
			checkForJargon(result.text, updated);

			return updated;
		});

		// Auto-scroll transcript
		setTimeout(() => {
			transcriptRef.current?.scrollTo({
				top: transcriptRef.current.scrollHeight,
				behavior: "smooth",
			});
		}, 100);
	}

	async function extractInsightsFromTranscript(entries: TranscriptEntry[]) {
		const combinedText = entries
			.map((e) => `${e.speaker}: ${e.text}`)
			.join("\n");

		try {
			const newInsights = await extractInsights(combinedText);
			setInsights(newInsights);
		} catch (error) {
			console.error("Insight extraction failed:", error);
		}
	}

	async function checkForJargon(text: string, context: TranscriptEntry[]) {
		// Simple heuristic to detect potential jargon (words with unusual patterns)
		const words = text.split(/\s+/);
		const potentialJargon = words.filter(
			(word) =>
				(word.length > 6 && /[A-Z]{2,}/.test(word)) || // Acronyms
				/\w+\d+/.test(word) || // Technical terms with numbers
				/\w+-\w+/.test(word) // Hyphenated technical terms
		);

		for (const term of potentialJargon) {
			const contextText = context
				.slice(-3)
				.map((e) => e.text)
				.join(" ");

			try {
				const explanation = await explainJargon(term, contextText);
				setJargonTerms((prev) => [
					...prev.filter((j) => j.term !== term), // Remove duplicates
					{
						...explanation,
						timestamp: new Date(),
					},
				]);
			} catch (error) {
				console.error("Jargon explanation failed:", error);
			}
		}
	}

	const toggleRecording = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	const getSentimentColor = (sentiment?: SentimentAnalysisResponse) => {
		if (!sentiment) return "bg-gray-100";

		switch (sentiment.sentiment) {
			case "positive":
				return "bg-green-100 border-green-300";
			case "negative":
				return "bg-red-100 border-red-300";
			default:
				return "bg-blue-100 border-blue-300";
		}
	};

	const getSentimentIcon = (sentiment?: SentimentAnalysisResponse) => {
		if (!sentiment) return <Eye className="w-4 h-4" />;

		switch (sentiment.sentiment) {
			case "positive":
				return <Smile className="w-4 h-4 text-green-600" />;
			case "negative":
				return <AlertTriangle className="w-4 h-4 text-red-600" />;
			default:
				return <Eye className="w-4 h-4 text-blue-600" />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							className="text-white hover:bg-white/10"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Dashboard
						</Button>
						<div>
							<h1 className="text-2xl font-bold text-white">
								AI-Powered Meeting
							</h1>
							<p className="text-white/70">
								Enhanced with real-time intelligence
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant={isAIEnabled ? "default" : "outline"}
							size="sm"
							onClick={() => setIsAIEnabled(!isAIEnabled)}
							className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
						>
							<Brain className="w-4 h-4 mr-2" />
							AI {isAIEnabled ? "ON" : "OFF"}
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Video Area */}
					<div className="lg:col-span-2 space-y-4">
						{/* Video Grid */}
						<Card className="bg-black/50 border-white/10 backdrop-blur-sm">
							<CardContent className="p-4">
								<div className="grid grid-cols-2 gap-4 aspect-video">
									{participants.map((participant) => (
										<motion.div
											key={participant.id}
											className={`relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${
												participant.isCurrentUser
													? "border-blue-500"
													: "border-transparent"
											} ${getSentimentColor(participant.sentiment)}`}
											whileHover={{ scale: 1.02 }}
											transition={{ duration: 0.2 }}
										>
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="text-6xl">{participant.avatar}</div>
											</div>

											{/* Participant Info */}
											<div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<span className="text-white text-sm font-medium">
															{participant.name}
														</span>
														{participant.role === "host" && (
															<span className="text-xs bg-blue-600 text-white px-1 rounded">
																Host
															</span>
														)}
													</div>

													<div className="flex items-center gap-1">
														{participant.sentiment &&
															getSentimentIcon(participant.sentiment)}
														{participant.audio ? (
															<Volume2 className="w-4 h-4 text-green-400" />
														) : (
															<VolumeX className="w-4 h-4 text-red-400" />
														)}
														{participant.video ? (
															<Video className="w-4 h-4 text-green-400" />
														) : (
															<VideoOff className="w-4 h-4 text-red-400" />
														)}
													</div>
												</div>
											</div>

											{/* Speaking Indicator */}
											{participant.lastSpoke &&
												Date.now() - participant.lastSpoke.getTime() < 3000 && (
													<div className="absolute top-2 right-2">
														<motion.div
															className="w-3 h-3 bg-green-400 rounded-full"
															animate={{ scale: [1, 1.2, 1] }}
															transition={{ repeat: Infinity, duration: 1 }}
														/>
													</div>
												)}
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Meeting Controls */}
						<Card className="bg-black/50 border-white/10 backdrop-blur-sm">
							<CardContent className="p-4">
								<div className="flex items-center justify-center gap-4">
									<Button
										variant={
											participants.find((p) => p.isCurrentUser)?.audio
												? "default"
												: "destructive"
										}
										size="lg"
										className="rounded-full w-12 h-12"
									>
										{participants.find((p) => p.isCurrentUser)?.audio ? (
											<Mic className="w-5 h-5" />
										) : (
											<MicOff className="w-5 h-5" />
										)}
									</Button>

									<Button
										variant={
											participants.find((p) => p.isCurrentUser)?.video
												? "default"
												: "destructive"
										}
										size="lg"
										className="rounded-full w-12 h-12"
									>
										{participants.find((p) => p.isCurrentUser)?.video ? (
											<Video className="w-5 h-5" />
										) : (
											<VideoOff className="w-5 h-5" />
										)}
									</Button>

									<Button
										variant={isRecording ? "destructive" : "default"}
										size="lg"
										className="rounded-full w-12 h-12"
										onClick={toggleRecording}
										disabled={!isAIEnabled}
									>
										{isTranscribing ? (
											<motion.div
												className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
												animate={{ rotate: 360 }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: "linear",
												}}
											/>
										) : (
											<Sparkles className="w-5 h-5" />
										)}
									</Button>

									<Button
										variant="outline"
										size="lg"
										className="rounded-full w-12 h-12"
									>
										<Share className="w-5 h-5" />
									</Button>

									<Button
										variant="destructive"
										size="lg"
										className="rounded-full w-12 h-12"
									>
										<PhoneOff className="w-5 h-5" />
									</Button>
								</div>

								{transcriptionError && (
									<div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
										<p className="text-red-300 text-sm">{transcriptionError}</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* AI Sidebar */}
					<div className="space-y-4">
						{/* AI Insights */}
						<Card className="bg-black/50 border-white/10 backdrop-blur-sm">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-white flex items-center gap-2">
										<BarChart3 className="w-5 h-5" />
										Live Insights
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setShowInsights(!showInsights)}
									>
										{showInsights ? "Hide" : "Show"}
									</Button>
								</div>
							</CardHeader>

							{showInsights && (
								<CardContent className="p-4 pt-0">
									{insights ? (
										<div className="space-y-4">
											{insights.action_items.length > 0 && (
												<div>
													<h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
														<CheckCircle className="w-4 h-4 text-green-400" />
														Action Items
													</h4>
													<ul className="space-y-1">
														{insights.action_items.map((item, idx) => (
															<li
																key={idx}
																className="text-sm text-gray-300 pl-6 relative"
															>
																<span className="absolute left-0 top-1 w-2 h-2 bg-green-400 rounded-full" />
																{item}
															</li>
														))}
													</ul>
												</div>
											)}

											{insights.decisions.length > 0 && (
												<div>
													<h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
														<Zap className="w-4 h-4 text-yellow-400" />
														Decisions
													</h4>
													<ul className="space-y-1">
														{insights.decisions.map((decision, idx) => (
															<li
																key={idx}
																className="text-sm text-gray-300 pl-6 relative"
															>
																<span className="absolute left-0 top-1 w-2 h-2 bg-yellow-400 rounded-full" />
																{decision}
															</li>
														))}
													</ul>
												</div>
											)}

											{insights.risks.length > 0 && (
												<div>
													<h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
														<AlertTriangle className="w-4 h-4 text-red-400" />
														Risks
													</h4>
													<ul className="space-y-1">
														{insights.risks.map((risk, idx) => (
															<li
																key={idx}
																className="text-sm text-gray-300 pl-6 relative"
															>
																<span className="absolute left-0 top-1 w-2 h-2 bg-red-400 rounded-full" />
																{risk}
															</li>
														))}
													</ul>
												</div>
											)}
										</div>
									) : (
										<p className="text-gray-400 text-sm">
											Analyzing conversation...
										</p>
									)}
								</CardContent>
							)}
						</Card>

						{/* Jargon Assistant */}
						<Card className="bg-black/50 border-white/10 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<BookOpen className="w-5 h-5" />
									Jargon Assistant
								</CardTitle>
							</CardHeader>

							<CardContent className="p-4 pt-0">
								{jargonTerms.length > 0 ? (
									<div className="space-y-3 max-h-48 overflow-y-auto">
										{jargonTerms.slice(-5).map((jargon, idx) => (
											<motion.div
												key={`${jargon.term}-${idx}`}
												className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
												onClick={() => setSelectedJargon(jargon)}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: idx * 0.1 }}
											>
												<div className="flex items-center justify-between mb-1">
													<h4 className="text-sm font-medium text-white">
														{jargon.term}
													</h4>
													<span className="text-xs text-gray-400">
														{jargon.timestamp.toLocaleTimeString()}
													</span>
												</div>
												<p className="text-xs text-gray-300 line-clamp-2">
													{jargon.explanation}
												</p>
											</motion.div>
										))}
									</div>
								) : (
									<p className="text-gray-400 text-sm">
										No jargon detected yet...
									</p>
								)}
							</CardContent>
						</Card>

						{/* Live Transcript */}
						<Card className="bg-black/50 border-white/10 backdrop-blur-sm">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-white flex items-center gap-2">
										<MessageSquare className="w-5 h-5" />
										Live Transcript
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setShowTranscript(!showTranscript)}
									>
										{showTranscript ? "Hide" : "Show"}
									</Button>
								</div>
							</CardHeader>

							{showTranscript && (
								<CardContent className="p-4 pt-0">
									<div
										ref={transcriptRef}
										className="space-y-3 max-h-64 overflow-y-auto"
									>
										{transcript.length > 0 ? (
											transcript.map((entry) => (
												<motion.div
													key={entry.id}
													className={`p-3 rounded-lg border ${getSentimentColor(
														entry.sentiment
													)}`}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.3 }}
												>
													<div className="flex items-center justify-between mb-1">
														<span className="text-sm font-medium text-gray-800">
															{entry.speaker}
														</span>
														<div className="flex items-center gap-2">
															{entry.sentiment &&
																getSentimentIcon(entry.sentiment)}
															<span className="text-xs text-gray-500">
																{entry.timestamp.toLocaleTimeString()}
															</span>
														</div>
													</div>
													<p className="text-sm text-gray-700">{entry.text}</p>
													{entry.confidence && (
														<div className="mt-2 flex items-center gap-2">
															<div className="flex-1 bg-gray-200 rounded-full h-1">
																<div
																	className="bg-blue-500 h-1 rounded-full transition-all duration-500"
																	style={{
																		width: `${entry.confidence * 100}%`,
																	}}
																/>
															</div>
															<span className="text-xs text-gray-500">
																{Math.round(entry.confidence * 100)}%
															</span>
														</div>
													)}
												</motion.div>
											))
										) : (
											<p className="text-gray-400 text-sm">
												Start recording to see transcript...
											</p>
										)}
									</div>
								</CardContent>
							)}
						</Card>
					</div>
				</div>
			</div>

			{/* Jargon Explanation Modal */}
			<AnimatePresence>
				{selectedJargon && (
					<motion.div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setSelectedJargon(null)}
					>
						<motion.div
							className="bg-white rounded-lg p-6 max-w-md w-full"
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									{selectedJargon.term}
								</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedJargon(null)}
								>
									×
								</Button>
							</div>

							<div className="space-y-4">
								<div>
									<h4 className="text-sm font-medium text-gray-700 mb-1">
										Explanation
									</h4>
									<p className="text-sm text-gray-600">
										{selectedJargon.explanation}
									</p>
								</div>

								<div>
									<h4 className="text-sm font-medium text-gray-700 mb-1">
										Context
									</h4>
									<p className="text-sm text-gray-600">
										{selectedJargon.context}
									</p>
								</div>

								<div className="flex gap-2">
									<Button variant="outline" size="sm" className="flex-1">
										<Copy className="w-4 h-4 mr-2" />
										Copy
									</Button>
									<Button variant="outline" size="sm" className="flex-1">
										<Download className="w-4 h-4 mr-2" />
										Save
									</Button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
