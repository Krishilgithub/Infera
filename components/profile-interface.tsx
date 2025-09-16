"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	ArrowLeft,
	Save,
	Edit,
	Camera,
	Shield,
	Bell,
	Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function ProfileInterface() {
	const [isEditing, setIsEditing] = useState(false);
	
	type ProfileData = {
		name: string;
		email: string;
		phone: string;
		location: string;
		bio: string;
		role: string;
		department: string;
		joinDate: string;
		timezone: string;
		language: string;
		preferences: {
			theme: string;
			language: string;
			timezone: string;
		};
		privacy: {
			profileVisible: boolean;
			emailVisible: boolean;
			phoneVisible: boolean;
		};
		notifications: {
			email: boolean;
			push: boolean;
			sms: boolean;
		};
	};
	
	const [profileData, setProfileData] = useState<ProfileData>({
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "+1 (555) 123-4567",
		location: "San Francisco, CA",
		joinDate: "January 2024",
		role: "Product Manager",
		department: "Engineering",
		bio: "Experienced product manager with a passion for building great user experiences and leading cross-functional teams.",
		timezone: "Pacific Standard Time",
		language: "English",
		preferences: {
			theme: "light",
			language: "English",
			timezone: "Pacific Standard Time",
		},
		privacy: {
			profileVisible: true,
			emailVisible: false,
			phoneVisible: false,
		},
		notifications: {
			email: true,
			push: true,
			sms: false,
		},
	});

	const { user, signOut } = useAuth();
	const router = useRouter();

	const handleSave = () => {
		setIsEditing(false);
		// In a real app, this would save to the backend
		console.log("Profile saved:", profileData);
	};

	const handleInputChange = (field: string, value: string | boolean) => {
		if (field.includes(".")) {
			const [parent, child] = field.split(".");
			setProfileData((prev) => ({
				...prev,
				[parent]: {
					...(prev[parent as keyof typeof prev] as object),
					[child]: value,
				},
			}));
		} else {
			setProfileData((prev) => ({
				...prev,
				[field]: value,
			}));
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
							<h1 className="text-3xl font-bold text-gray-900">Profile</h1>
							<p className="text-gray-600 mt-1">
								Manage your account settings and preferences
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						{isEditing ? (
							<>
								<Button variant="outline" onClick={() => setIsEditing(false)}>
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									className="bg-blue-600 hover:bg-blue-700 text-white"
								>
									<Save className="mr-2 h-4 w-4" />
									Save Changes
								</Button>
							</>
						) : (
							<Button
								onClick={() => setIsEditing(true)}
								className="bg-blue-600 hover:bg-blue-700 text-white"
							>
								<Edit className="mr-2 h-4 w-4" />
								Edit Profile
							</Button>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Profile Picture & Basic Info */}
					<div className="lg:col-span-1">
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader className="text-center pb-4">
								<div className="relative inline-block">
									<div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
										<User className="h-16 w-16 text-white" />
									</div>
									{isEditing && (
										<Button
											size="sm"
											className="absolute bottom-0 right-0 rounded-full"
										>
											<Camera className="h-4 w-4" />
										</Button>
									)}
								</div>
								<CardTitle className="text-xl font-semibold text-gray-900">
									{profileData.name}
								</CardTitle>
								<p className="text-gray-600">{profileData.role}</p>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center">
									<p className="text-sm text-gray-500">Member since</p>
									<p className="font-medium text-gray-900">
										{profileData.joinDate}
									</p>
								</div>
								<div className="text-center">
									<p className="text-sm text-gray-500">Department</p>
									<p className="font-medium text-gray-900">
										{profileData.department}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Profile Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Personal Information */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900">
									Personal Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Full Name
										</label>
										<Input
											type="text"
											value={profileData.name}
											onChange={(e) =>
												handleInputChange("name", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Email
										</label>
										<Input
											type="email"
											value={profileData.email}
											onChange={(e) =>
												handleInputChange("email", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Phone
										</label>
										<Input
											type="tel"
											value={profileData.phone}
											onChange={(e) =>
												handleInputChange("phone", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Location
										</label>
										<Input
											type="text"
											value={profileData.location}
											onChange={(e) =>
												handleInputChange("location", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Bio
									</label>
									<textarea
										value={profileData.bio}
										onChange={(e) => handleInputChange("bio", e.target.value)}
										disabled={!isEditing}
										rows={3}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Preferences */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900">
									Preferences
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Timezone
										</label>
										<select
											value={profileData.timezone}
											onChange={(e) =>
												handleInputChange("timezone", e.target.value)
											}
											disabled={!isEditing}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
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
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Language
										</label>
										<select
											value={profileData.language}
											onChange={(e) =>
												handleInputChange("language", e.target.value)
											}
											disabled={!isEditing}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
										>
											<option value="English">English</option>
											<option value="Spanish">Spanish</option>
											<option value="French">French</option>
											<option value="German">German</option>
										</select>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Notifications */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900">
									Notification Settings
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<Mail className="h-5 w-5 text-gray-400" />
											<div>
												<p className="font-medium text-gray-900">
													Email Notifications
												</p>
												<p className="text-sm text-gray-500">
													Receive updates via email
												</p>
											</div>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={profileData.notifications.email}
												onChange={(e) =>
													handleInputChange(
														"notifications.email",
														e.target.checked
													)
												}
												disabled={!isEditing}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
										</label>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<Bell className="h-5 w-5 text-gray-400" />
											<div>
												<p className="font-medium text-gray-900">
													Push Notifications
												</p>
												<p className="text-sm text-gray-500">
													Receive browser notifications
												</p>
											</div>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={profileData.notifications.push}
												onChange={(e) =>
													handleInputChange(
														"notifications.push",
														e.target.checked
													)
												}
												disabled={!isEditing}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
										</label>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<Phone className="h-5 w-5 text-gray-400" />
											<div>
												<p className="font-medium text-gray-900">
													SMS Notifications
												</p>
												<p className="text-sm text-gray-500">
													Receive text messages
												</p>
											</div>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={profileData.notifications.sms}
												onChange={(e) =>
													handleInputChange(
														"notifications.sms",
														e.target.checked
													)
												}
												disabled={!isEditing}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
										</label>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
