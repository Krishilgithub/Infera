"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as DateCalendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import {
	Calendar,
	Clock,
	Users,
	Video,
	ArrowLeft,
	Plus,
	X,
	Send,
	Copy,
	Check,
} from "lucide-react";
import { useMeeting } from "@/contexts/meeting-context";
import { useRouter } from "next/navigation";

interface ScheduledMeeting {
	id: string;
	title: string;
	date: string;
	time: string;
	duration: number;
	participants: string[];
	meetingCode: string;
	description?: string;
}

export default function ScheduleMeetingInterface() {
	const [meetingTitle, setMeetingTitle] = useState("");
	const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
	const [meetingTime, setMeetingTime] = useState("");
	const [duration, setDuration] = useState(60);
	const [description, setDescription] = useState("");
	const [participants, setParticipants] = useState<string[]>([]);
	const [newParticipant, setNewParticipant] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [copied, setCopied] = useState(false);
	const [scheduledMeeting, setScheduledMeeting] = useState<ScheduledMeeting | null>(null);

	const { createMeeting } = useMeeting();
	const router = useRouter();

	const addParticipant = () => {
		if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
			setParticipants([...participants, newParticipant.trim()]);
			setNewParticipant("");
		}
	};

	const removeParticipant = (email: string) => {
		setParticipants(participants.filter((p) => p !== email));
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			addParticipant();
		}
	};

	const handleScheduleMeeting = async () => {
		if (!meetingTitle.trim() || !meetingDate || !meetingTime) {
			return;
		}

		setIsCreating(true);

		try {
			// Combine date and time into ISO string
			const dateStr = meetingDate ? meetingDate.toISOString().split('T')[0] : "";
			const scheduledDateTime = new Date(`${dateStr}T${meetingTime}`);

			const response = await fetch('/api/meetings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: meetingTitle,
					description: description,
					scheduled_at: scheduledDateTime.toISOString(),
					invitations: participants.map(email => ({ email })),
					settings: {
						allow_recording: true,
						allow_transcript: true,
						allow_chat: true,
					}
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to schedule meeting');
			}

			const data = await response.json();

			const scheduledMeeting: ScheduledMeeting = {
				id: data.id,
				title: meetingTitle,
				date: meetingDate ? meetingDate.toISOString().split('T')[0] : "",
				time: meetingTime,
				duration,
				participants,
				meetingCode: data.meeting_code,
				description,
			};

			setScheduledMeeting(scheduledMeeting);
		} catch (error) {
			console.error("Failed to schedule meeting:", error);
		} finally {
			setIsCreating(false);
		}
	};

	const copyMeetingCode = () => {
		if (scheduledMeeting?.meetingCode) {
			navigator.clipboard.writeText(scheduledMeeting.meetingCode);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const startScheduledMeeting = async () => {
		if (!scheduledMeeting?.meetingCode) return;

		try {
			// Join the meeting with the generated code
			const success = await createMeeting(scheduledMeeting.title);
			if (success) {
				router.push("/dashboard/live");
			} else {
				console.error("Failed to start the meeting");
			}
		} catch (error) {
			console.error("Error starting meeting:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
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
								Schedule Meeting
							</h1>
							<p className="text-gray-600 mt-1">
								Plan and invite participants to your meeting
							</p>
						</div>
					</div>
				</div>

				{scheduledMeeting ? (
					/* Success State */
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-6"
					>
						<Card className="bg-white border border-gray-200 shadow-lg">
							<CardHeader className="text-center pb-4">
								<div className="flex items-center justify-center mb-4">
									<div className="p-3 rounded-full bg-green-100">
										<Calendar className="h-8 w-8 text-green-600" />
									</div>
								</div>
								<CardTitle className="text-2xl font-bold text-gray-900">
									Meeting Scheduled Successfully!
								</CardTitle>
								<p className="text-gray-600 mt-2">
									Your meeting has been scheduled and is ready to go
								</p>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="bg-gray-50 rounded-lg p-6">
									<h3 className="font-semibold text-gray-900 mb-4">
										Meeting Details
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-gray-600">Title</p>
											<p className="font-medium text-gray-900">
												{scheduledMeeting.title}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">Date & Time</p>
											<p className="font-medium text-gray-900">
												{scheduledMeeting.date} at {scheduledMeeting.time}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">Duration</p>
											<p className="font-medium text-gray-900">
												{scheduledMeeting.duration} minutes
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">Participants</p>
											<p className="font-medium text-gray-900">
												{scheduledMeeting.participants.length} invited
											</p>
										</div>
									</div>
									{scheduledMeeting.description && (
										<div className="mt-4">
											<p className="text-sm text-gray-600">Description</p>
											<p className="font-medium text-gray-900">
												{scheduledMeeting.description}
											</p>
										</div>
									)}
								</div>

								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-blue-900">
												Meeting Code
											</p>
											<p className="text-lg font-mono font-bold text-blue-600">
												{scheduledMeeting.meetingCode}
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
										Share this code with participants to let them join the meeting
									</p>
								</div>

								<div className="flex space-x-3">
									<Button
										onClick={startScheduledMeeting}
										className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
									>
										<Video className="mr-2 h-4 w-4" />
										Start Meeting Now
									</Button>
									<Button
										variant="outline"
										onClick={() => setScheduledMeeting(null)}
										className="flex-1"
									>
										Schedule Another
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				) : (
					/* Form State */
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2">
							<Card className="bg-white border border-gray-200 shadow-sm">
								<CardHeader>
									<CardTitle className="text-xl font-semibold text-gray-900">
										Meeting Details
									</CardTitle>
									<p className="text-gray-600">
										Fill in the details for your scheduled meeting
									</p>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Meeting Title *
										</label>
										<Input
											type="text"
											placeholder="Enter meeting title"
											value={meetingTitle}
											onChange={(e) => setMeetingTitle(e.target.value)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Date *
											</label>
											<DateCalendar
												selected={meetingDate}
												onSelect={setMeetingDate}
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Time *
											</label>
											<TimePicker
												value={meetingTime}
												onChange={setMeetingTime}
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Duration (minutes)
										</label>
										<select
											value={duration}
											onChange={(e) => setDuration(Number(e.target.value))}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value={15}>15 minutes</option>
											<option value={30}>30 minutes</option>
											<option value={60}>1 hour</option>
											<option value={90}>1.5 hours</option>
											<option value={120}>2 hours</option>
											<option value={180}>3 hours</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Description
										</label>
										<textarea
											placeholder="Add a description for your meeting"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											rows={3}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="space-y-6">
							{/* Participants */}
							<Card className="bg-white border border-gray-200 shadow-sm">
								<CardHeader>
									<CardTitle className="text-lg font-semibold text-gray-900">
										Participants
									</CardTitle>
									<p className="text-gray-600">
										Invite people to your meeting
									</p>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex space-x-2">
										<Input
											type="email"
											placeholder="Enter email address"
											value={newParticipant}
											onChange={(e) => setNewParticipant(e.target.value)}
											onKeyPress={handleKeyPress}
										/>
										<Button onClick={addParticipant} size="sm">
											<Plus className="h-4 w-4" />
										</Button>
									</div>

									<div className="space-y-2">
										{participants.map((participant, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
											>
												<span className="text-sm text-gray-700">
													{participant}
												</span>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => removeParticipant(participant)}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Schedule Button */}
							<Button
								onClick={handleScheduleMeeting}
								disabled={
									isCreating ||
									!meetingTitle.trim() ||
									!meetingDate ||
									!meetingTime
								}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white"
							>
								{isCreating ? (
									<div className="flex items-center">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Scheduling...
									</div>
								) : (
									<div className="flex items-center">
										<Calendar className="mr-2 h-4 w-4" />
										Schedule Meeting
									</div>
								)}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

