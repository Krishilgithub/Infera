"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Settings,
	ArrowLeft,
	Save,
	Bell,
	Shield,
	Globe,
	Monitor,
	Volume2,
	Camera,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
	const [settings, setSettings] = useState({
		notifications: {
			email: true,
			push: true,
			sms: false,
			meetingReminders: true,
			transcriptReady: true,
		},
		audio: {
			microphone: true,
			speakers: true,
			autoMute: false,
			noiseCancellation: true,
		},
		video: {
			camera: true,
			autoStart: false,
			quality: "HD",
			virtualBackground: false,
		},
		privacy: {
			recordMeetings: false,
			transcriptStorage: true,
			shareAnalytics: false,
		},
		appearance: {
			theme: "light",
			language: "English",
			timezone: "Pacific Standard Time",
		},
	});

	const router = useRouter();

	const handleSave = () => {
		console.log("Settings saved:", settings);
		// In a real app, this would save to the backend
	};

	const handleInputChange = (
		section: string,
		field: string,
		value: string | boolean
	) => {
		setSettings((prev) => ({
			...prev,
			[section]: {
				...prev[section as keyof typeof prev],
				[field]: value,
			},
		}));
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Settings</h1>
						<p className="text-gray-600 mt-1">
							Customize your Infera experience
						</p>
					</div>
					<Button
						onClick={handleSave}
						className="bg-purple-500 hover:bg-purple-600 text-white border-0"
					>
						<Save className="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				</div>

				<div className="space-y-6">
					{/* Notifications */}
					<Card className="bg-white border border-gray-200 shadow-sm">
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
								<Bell className="mr-2 h-5 w-5" />
								Notifications
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								{Object.entries(settings.notifications).map(([key, value]) => (
									<div key={key} className="flex items-center justify-between">
										<div>
											<p className="font-medium text-gray-900 capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}
											</p>
											<p className="text-sm text-gray-500">
												{key === "email" && "Receive email notifications"}
												{key === "push" && "Receive browser push notifications"}
												{key === "sms" && "Receive SMS notifications"}
												{key === "meetingReminders" &&
													"Get reminded before meetings"}
												{key === "transcriptReady" &&
													"Notify when transcripts are ready"}
											</p>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={value}
												onChange={(e) =>
													handleInputChange(
														"notifications",
														key,
														e.target.checked
													)
												}
												className="sr-only peer"
											/>
											<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
										</label>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Audio Settings */}
					<Card className="bg-white border border-gray-200 shadow-sm">
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
								<Volume2 className="mr-2 h-5 w-5" />
								Audio Settings
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								{Object.entries(settings.audio).map(([key, value]) => (
									<div key={key} className="flex items-center justify-between">
										<div>
											<p className="font-medium text-gray-900 capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}
											</p>
											<p className="text-sm text-gray-500">
												{key === "microphone" && "Enable microphone access"}
												{key === "speakers" && "Enable speaker output"}
												{key === "autoMute" &&
													"Automatically mute when joining meetings"}
												{key === "noiseCancellation" &&
													"Enable noise cancellation"}
											</p>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={value}
												onChange={(e) =>
													handleInputChange("audio", key, e.target.checked)
												}
												className="sr-only peer"
											/>
											<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
										</label>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Video Settings */}
					<Card className="bg-white border border-gray-200 shadow-sm">
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
								<Camera className="mr-2 h-5 w-5" />
								Video Settings
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								{Object.entries(settings.video).map(([key, value]) => (
									<div key={key} className="flex items-center justify-between">
										<div>
											<p className="font-medium text-gray-900 capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}
											</p>
											<p className="text-sm text-gray-500">
												{key === "camera" && "Enable camera access"}
												{key === "autoStart" &&
													"Automatically start video when joining"}
												{key === "quality" && "Video quality setting"}
												{key === "virtualBackground" &&
													"Enable virtual backgrounds"}
											</p>
										</div>
										{key === "quality" ? (
											<select
												value={value as string}
												onChange={(e) =>
													handleInputChange("video", key, e.target.value)
												}
												className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											>
												<option value="SD">Standard Definition</option>
												<option value="HD">High Definition</option>
												<option value="FHD">Full HD</option>
											</select>
										) : (
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={value as boolean}
													onChange={(e) =>
														handleInputChange("video", key, e.target.checked)
													}
													className="sr-only peer"
												/>
												<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
											</label>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Privacy Settings */}
					<Card className="bg-white border border-gray-200 shadow-sm">
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
								<Shield className="mr-2 h-5 w-5" />
								Privacy & Security
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								{Object.entries(settings.privacy).map(([key, value]) => (
									<div key={key} className="flex items-center justify-between">
										<div>
											<p className="font-medium text-gray-900 capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}
											</p>
											<p className="text-sm text-gray-500">
												{key === "recordMeetings" && "Allow meeting recordings"}
												{key === "transcriptStorage" &&
													"Store meeting transcripts"}
												{key === "shareAnalytics" && "Share usage analytics"}
											</p>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={value}
												onChange={(e) =>
													handleInputChange("privacy", key, e.target.checked)
												}
												className="sr-only peer"
											/>
											<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-700"></div>
										</label>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Appearance Settings */}
					<Card className="bg-white border border-gray-200 shadow-sm">
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
								<Monitor className="mr-2 h-5 w-5" />
								Appearance
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Theme
									</label>
									<select
										value={settings.appearance.theme}
										onChange={(e) =>
											handleInputChange("appearance", "theme", e.target.value)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="light">Light</option>
										<option value="dark">Dark</option>
										<option value="auto">Auto</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Language
									</label>
									<select
										value={settings.appearance.language}
										onChange={(e) =>
											handleInputChange(
												"appearance",
												"language",
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="English">English</option>
										<option value="Spanish">Spanish</option>
										<option value="French">French</option>
										<option value="German">German</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Timezone
									</label>
									<select
										value={settings.appearance.timezone}
										onChange={(e) =>
											handleInputChange(
												"appearance",
												"timezone",
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="Pacific Standard Time">
											Pacific Standard Time
										</option>
										<option value="Eastern Standard Time">
											Eastern Standard Time
										</option>
										<option value="Central Standard Time">
											Central Standard Time
										</option>
										<option value="Mountain Standard Time">
											Mountain Standard Time
										</option>
									</select>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
