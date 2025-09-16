"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	Clock,
	Users,
	MessageSquare,
	CheckCircle,
	AlertTriangle,
	Lightbulb,
	Target,
	Calendar,
	Download,
	Share,
	RefreshCw,
	Brain,
	Zap,
	BookOpen,
	Eye,
	Heart,
	Activity,
} from "lucide-react";
import {
	InsightExtractionResponse,
	SentimentAnalysisResponse,
} from "@/lib/ai/openrouter-client";

interface MeetingAnalytics {
	duration: number; // in minutes
	participantCount: number;
	totalMessages: number;
	averageSentiment: number;
	engagementLevel: number;
	topicsDiscussed: string[];
	speakingTimeDistribution: { [participantId: string]: number };
}

interface TrendData {
	timestamp: Date;
	sentiment: number;
	engagement: number;
	participants: number;
}

interface AIInsightsDashboardProps {
	insights: InsightExtractionResponse | null;
	sentimentHistory: SentimentAnalysisResponse[];
	analytics: MeetingAnalytics;
	onRefresh?: () => void;
	onExport?: () => void;
	onShare?: () => void;
}

export default function AIInsightsDashboard({
	insights,
	sentimentHistory,
	analytics,
	onRefresh,
	onExport,
	onShare,
}: AIInsightsDashboardProps) {
	const [selectedTimeframe, setSelectedTimeframe] = useState<
		"5min" | "15min" | "30min" | "all"
	>("15min");
	const [trendData, setTrendData] = useState<TrendData[]>([]);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		// Generate trend data based on sentiment history
		const trends: TrendData[] = sentimentHistory.map((sentiment, index) => ({
			timestamp: new Date(
				Date.now() - (sentimentHistory.length - index) * 30000
			), // 30s intervals
			sentiment: sentiment.confidence,
			engagement:
				sentiment.emotions.joy +
				sentiment.emotions.surprise -
				sentiment.emotions.sadness -
				sentiment.emotions.anger,
			participants: analytics.participantCount,
		}));

		setTrendData(trends);
	}, [sentimentHistory, analytics.participantCount]);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await onRefresh?.();
		} finally {
			setIsRefreshing(false);
		}
	};

	const getSentimentTrend = () => {
		if (trendData.length < 2) return "stable";

		const recent = trendData.slice(-3);
		const average =
			recent.reduce((sum, data) => sum + data.sentiment, 0) / recent.length;
		const oldest = recent[0].sentiment;

		if (average > oldest + 0.1) return "improving";
		if (average < oldest - 0.1) return "declining";
		return "stable";
	};

	const getEngagementLevel = () => {
		if (analytics.engagementLevel > 0.7)
			return { level: "high", color: "text-green-600", icon: TrendingUp };
		if (analytics.engagementLevel > 0.4)
			return { level: "medium", color: "text-yellow-600", icon: Activity };
		return { level: "low", color: "text-red-600", icon: TrendingDown };
	};

	const sentimentTrend = getSentimentTrend();
	const engagement = getEngagementLevel();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<Brain className="w-6 h-6 text-blue-600" />
						AI Meeting Insights
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Real-time analysis and recommendations
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={isRefreshing}
					>
						<RefreshCw
							className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>
					<Button variant="outline" size="sm" onClick={onExport}>
						<Download className="w-4 h-4 mr-2" />
						Export
					</Button>
					<Button variant="outline" size="sm" onClick={onShare}>
						<Share className="w-4 h-4 mr-2" />
						Share
					</Button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Meeting Duration
								</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{analytics.duration}m
								</p>
							</div>
							<Clock className="w-8 h-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Participants
								</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{analytics.participantCount}
								</p>
							</div>
							<Users className="w-8 h-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Engagement
								</p>
								<p className={`text-2xl font-bold ${engagement.color}`}>
									{engagement.level.toUpperCase()}
								</p>
							</div>
							<engagement.icon className={`w-8 h-8 ${engagement.color}`} />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Sentiment
								</p>
								<p
									className={`text-2xl font-bold ${
										sentimentTrend === "improving"
											? "text-green-600"
											: sentimentTrend === "declining"
											? "text-red-600"
											: "text-blue-600"
									}`}
								>
									{sentimentTrend === "improving"
										? "↗"
										: sentimentTrend === "declining"
										? "↘"
										: "→"}
								</p>
							</div>
							<Heart className="w-8 h-8 text-pink-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Action Items & Insights */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Action Items */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-600" />
							Action Items
							{insights?.action_items.length ? (
								<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
									{insights.action_items.length}
								</span>
							) : null}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{insights?.action_items.length ? (
							<div className="space-y-3">
								{insights.action_items.map((item, index) => (
									<motion.div
										key={index}
										className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<p className="text-sm text-gray-900 dark:text-white font-medium">
												{item}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs"
												>
													Assign
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs"
												>
													Set Due Date
												</Button>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
								<p className="text-gray-500 dark:text-gray-400">
									No action items identified yet
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Decisions */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Zap className="w-5 h-5 text-yellow-600" />
							Key Decisions
							{insights?.decisions.length ? (
								<span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
									{insights.decisions.length}
								</span>
							) : null}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{insights?.decisions.length ? (
							<div className="space-y-3">
								{insights.decisions.map((decision, index) => (
									<motion.div
										key={index}
										className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<p className="text-sm text-gray-900 dark:text-white font-medium">
												{decision}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs"
												>
													Document
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs"
												>
													Follow Up
												</Button>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-2" />
								<p className="text-gray-500 dark:text-gray-400">
									No decisions recorded yet
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Risks & Topics */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Risks */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-red-600" />
							Identified Risks
							{insights?.risks.length ? (
								<span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
									{insights.risks.length}
								</span>
							) : null}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{insights?.risks.length ? (
							<div className="space-y-3">
								{insights.risks.map((risk, index) => (
									<motion.div
										key={index}
										className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<p className="text-sm text-gray-900 dark:text-white font-medium">
												{risk}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs"
												>
													Mitigate
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs"
												>
													Monitor
												</Button>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
								<p className="text-gray-500 dark:text-gray-400">
									No risks identified
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Topics */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="w-5 h-5 text-purple-600" />
							Topics Discussed
							{analytics.topicsDiscussed.length ? (
								<span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
									{analytics.topicsDiscussed.length}
								</span>
							) : null}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{analytics.topicsDiscussed.length ? (
							<div className="flex flex-wrap gap-2">
								{analytics.topicsDiscussed.map((topic, index) => (
									<motion.span
										key={index}
										className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: index * 0.1 }}
									>
										{topic}
									</motion.span>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
								<p className="text-gray-500 dark:text-gray-400">
									Topics will appear as discussion progresses
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Speaking Time Distribution */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="w-5 h-5 text-blue-600" />
						Speaking Time Distribution
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{Object.entries(analytics.speakingTimeDistribution).map(
							([participantId, time]) => {
								const percentage = (time / analytics.duration) * 100;
								return (
									<div key={participantId} className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-gray-900 dark:text-white">
												Participant {participantId}
											</span>
											<span className="text-sm text-gray-600 dark:text-gray-400">
												{Math.round(time)}m ({Math.round(percentage)}%)
											</span>
										</div>
										<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
											<motion.div
												className="bg-blue-600 h-2 rounded-full"
												initial={{ width: 0 }}
												animate={{ width: `${percentage}%` }}
												transition={{ duration: 1, ease: "easeOut" }}
											/>
										</div>
									</div>
								);
							}
						)}
					</div>
				</CardContent>
			</Card>

			{/* Sentiment Timeline */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="w-5 h-5 text-green-600" />
						Sentiment Timeline
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-48 relative">
						{trendData.length > 0 ? (
							<svg className="w-full h-full" viewBox="0 0 400 150">
								<defs>
									<linearGradient
										id="sentimentGradient"
										x1="0%"
										y1="0%"
										x2="0%"
										y2="100%"
									>
										<stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
										<stop offset="100%" stopColor="#10B981" stopOpacity="0" />
									</linearGradient>
								</defs>

								{/* Grid lines */}
								{[0, 0.25, 0.5, 0.75, 1].map((y) => (
									<line
										key={y}
										x1="0"
										y1={150 - y * 150}
										x2="400"
										y2={150 - y * 150}
										stroke="#E5E7EB"
										strokeWidth="1"
										strokeDasharray="2,2"
									/>
								))}

								{/* Sentiment line */}
								<path
									d={trendData
										.map((data, index) => {
											const x = (index / (trendData.length - 1)) * 400;
											const y = 150 - data.sentiment * 150;
											return `${index === 0 ? "M" : "L"} ${x} ${y}`;
										})
										.join(" ")}
									fill="none"
									stroke="#10B981"
									strokeWidth="2"
								/>

								{/* Area fill */}
								<path
									d={`${trendData
										.map((data, index) => {
											const x = (index / (trendData.length - 1)) * 400;
											const y = 150 - data.sentiment * 150;
											return `${index === 0 ? "M" : "L"} ${x} ${y}`;
										})
										.join(" ")} L 400 150 L 0 150 Z`}
									fill="url(#sentimentGradient)"
								/>

								{/* Data points */}
								{trendData.map((data, index) => {
									const x = (index / (trendData.length - 1)) * 400;
									const y = 150 - data.sentiment * 150;
									return (
										<circle
											key={index}
											cx={x}
											cy={y}
											r="3"
											fill="#10B981"
											stroke="white"
											strokeWidth="2"
										/>
									);
								})}
							</svg>
						) : (
							<div className="flex items-center justify-center h-full">
								<p className="text-gray-500 dark:text-gray-400">
									Sentiment data will appear as the meeting progresses
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
