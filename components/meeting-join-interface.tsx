"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Video,
	Users,
	Copy,
	Check,
	ArrowLeft,
	User,
	Calendar,
	Clock,
} from "lucide-react";
import { useMeeting } from "@/contexts/meeting-context";
import { useRouter } from "next/navigation";

export default function MeetingJoinInterface() {
	const [meetingCode, setMeetingCode] = useState("");
	const [participantName, setParticipantName] = useState("");
	const [isJoining, setIsJoining] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);

	const {
		joinMeeting,
		createMeeting,
		meetingCode: currentMeetingCode,
	} = useMeeting();
	const router = useRouter();

	const handleJoinMeeting = async () => {
		if (!meetingCode.trim() || !participantName.trim()) {
			setError("Please enter both meeting code and your name");
			return;
		}

		setIsJoining(true);
		setError("");

		try {
			const success = await joinMeeting(
				meetingCode.trim().toUpperCase(),
				participantName.trim()
			);
			if (success) {
				router.push("/dashboard/live");
			} else {
				setError("Invalid meeting code or unable to join meeting");
			}
		} catch (error) {
			setError("Failed to join meeting. Please try again.");
		} finally {
			setIsJoining(false);
		}
	};

	const handleCreateMeeting = async () => {
		setIsJoining(true);
		setError("");

		try {
			const code = await createMeeting("New Meeting");
			router.push("/dashboard/live");
		} catch (error) {
			setError("Failed to create meeting. Please try again.");
		} finally {
			setIsJoining(false);
		}
	};

	const copyMeetingCode = () => {
		if (currentMeetingCode) {
			navigator.clipboard.writeText(currentMeetingCode);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleJoinMeeting();
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-md"
			>
				<Card className="bg-white border border-gray-200 shadow-lg">
					<CardHeader className="text-center pb-4">
						<div className="flex items-center justify-center mb-4">
							<div className="p-3 rounded-full bg-blue-100">
								<Video className="h-8 w-8 text-blue-600" />
							</div>
						</div>
						<CardTitle className="text-2xl font-bold text-gray-900">
							Join Meeting
						</CardTitle>
						<p className="text-gray-600 mt-2">
							Enter the meeting code to join an existing meeting
						</p>
					</CardHeader>

					<CardContent className="space-y-6">
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="p-3 bg-red-50 border border-red-200 rounded-lg"
							>
								<p className="text-sm text-red-600">{error}</p>
							</motion.div>
						)}

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Meeting Code
								</label>
								<Input
									type="text"
									placeholder="Enter 6-digit code"
									value={meetingCode}
									onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
									onKeyPress={handleKeyPress}
									className="text-center text-lg font-mono tracking-wider"
									maxLength={6}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Your Name
								</label>
								<Input
									type="text"
									placeholder="Enter your name"
									value={participantName}
									onChange={(e) => setParticipantName(e.target.value)}
									onKeyPress={handleKeyPress}
								/>
							</div>
						</div>

						<div className="space-y-3">
							<Button
								onClick={handleJoinMeeting}
								disabled={
									isJoining || !meetingCode.trim() || !participantName.trim()
								}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white"
							>
								{isJoining ? (
									<div className="flex items-center">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Joining...
									</div>
								) : (
									<div className="flex items-center">
										<Users className="mr-2 h-4 w-4" />
										Join Meeting
									</div>
								)}
							</Button>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300" />
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-white text-gray-500">or</span>
								</div>
							</div>

							<Button
								onClick={handleCreateMeeting}
								disabled={isJoining}
								variant="outline"
								className="w-full"
							>
								{isJoining ? (
									<div className="flex items-center">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
										Creating...
									</div>
								) : (
									<div className="flex items-center">
										<Video className="mr-2 h-4 w-4" />
										Start New Meeting
									</div>
								)}
							</Button>
						</div>

						{currentMeetingCode && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-blue-900">
											Your Meeting Code
										</p>
										<p className="text-lg font-mono font-bold text-blue-600">
											{currentMeetingCode}
										</p>
									</div>
									<Button
										onClick={copyMeetingCode}
										size="sm"
										variant="outline"
										className="border-blue-300 text-blue-600 hover:bg-blue-100"
									>
										{copied ? (
											<Check className="h-4 w-4" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
								<p className="text-xs text-blue-700 mt-2">
									Share this code with others to let them join your meeting
								</p>
							</motion.div>
						)}

						<div className="text-center">
							<Button
								variant="ghost"
								onClick={() => router.push("/dashboard")}
								className="text-gray-500 hover:text-gray-700"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Dashboard
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Meeting Tips */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mt-6"
				>
					<Card className="bg-white border border-gray-200">
						<CardContent className="p-4">
							<h3 className="font-medium text-gray-900 mb-3">Meeting Tips</h3>
							<div className="space-y-2 text-sm text-gray-600">
								<div className="flex items-center">
									<User className="mr-2 h-4 w-4 text-blue-500" />
									<span>Make sure your camera and microphone are working</span>
								</div>
								<div className="flex items-center">
									<Calendar className="mr-2 h-4 w-4 text-blue-500" />
									<span>Meeting codes are case-insensitive</span>
								</div>
								<div className="flex items-center">
									<Clock className="mr-2 h-4 w-4 text-blue-500" />
									<span>Meetings automatically end after 24 hours</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>
		</div>
	);
}
