"use client";

import { useState, useEffect } from "react";
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
	Clock,
	Briefcase,
	UserCheck,
	Activity,
	Award,
	Link as LinkIcon,
	Github,
	Linkedin,
	Twitter,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

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
	website: string;
	company: string;
	workLocation: string;
	emergencyContact: {
		name: string;
		phone: string;
		relationship: string;
	};
	socialLinks: {
		linkedin: string;
		twitter: string;
		github: string;
	};
	stats: {
		totalMeetings: number;
		totalHours: number;
		avgMeetingDuration: number;
		lastActive: string;
	};
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

export default function ProfileInterface() {
	const [isEditing, setIsEditing] = useState(false);
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
		website: "https://johndoe.com",
		company: "Tech Corp",
		workLocation: "Remote",
		emergencyContact: {
			name: "Jane Doe",
			phone: "+1 (555) 987-6543",
			relationship: "Spouse",
		},
		socialLinks: {
			linkedin: "https://linkedin.com/in/johndoe",
			twitter: "https://twitter.com/johndoe",
			github: "https://github.com/johndoe",
		},
		stats: {
			totalMeetings: 147,
			totalHours: 352,
			avgMeetingDuration: 45,
			lastActive: "2 hours ago",
		},
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

	// Load user data from auth context
	useEffect(() => {
		if (user) {
			setProfileData(prev => ({
				...prev,
				name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
				email: user.email || '',
				joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
					month: 'long', 
					year: 'numeric' 
				}) : 'Recently',
			}));
		}
	}, [user]);

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
					{/* Left Column - Profile Picture & Stats */}
					<div className="lg:col-span-1 space-y-6">
						{/* Profile Picture & Basic Info */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader className="text-center pb-4">
								<div className="relative inline-block">
									<div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
										<span className="text-3xl font-bold text-white">
											{profileData.name.charAt(0).toUpperCase()}
										</span>
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
								<div className="flex items-center justify-center text-sm text-gray-500 mt-2">
									<Activity className="h-4 w-4 mr-1" />
									Last active: {profileData.stats.lastActive}
								</div>
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
								<div className="text-center">
									<p className="text-sm text-gray-500">Company</p>
									<p className="font-medium text-gray-900">
										{profileData.company}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Meeting Statistics */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<Award className="h-5 w-5 mr-2" />
									Meeting Statistics
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">Total Meetings</span>
									<span className="font-bold text-blue-600">{profileData.stats.totalMeetings}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">Total Hours</span>
									<span className="font-bold text-green-600">{profileData.stats.totalHours}h</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">Avg Duration</span>
									<span className="font-bold text-purple-600">{profileData.stats.avgMeetingDuration}min</span>
								</div>
							</CardContent>
						</Card>

						{/* Social Links */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<LinkIcon className="h-5 w-5 mr-2" />
									Social Links
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center space-x-3">
									<Linkedin className="h-5 w-5 text-blue-600" />
									{isEditing ? (
										<Input
											type="url"
											value={profileData.socialLinks.linkedin}
											onChange={(e) =>
												handleInputChange("socialLinks.linkedin", e.target.value)
											}
											placeholder="LinkedIn profile URL"
											className="flex-1"
										/>
									) : (
										<a 
											href={profileData.socialLinks.linkedin} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline flex-1 text-sm"
										>
											{profileData.socialLinks.linkedin || 'Not set'}
										</a>
									)}
								</div>
								<div className="flex items-center space-x-3">
									<Twitter className="h-5 w-5 text-sky-500" />
									{isEditing ? (
										<Input
											type="url"
											value={profileData.socialLinks.twitter}
											onChange={(e) =>
												handleInputChange("socialLinks.twitter", e.target.value)
											}
											placeholder="Twitter profile URL"
											className="flex-1"
										/>
									) : (
										<a 
											href={profileData.socialLinks.twitter} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-sky-500 hover:underline flex-1 text-sm"
										>
											{profileData.socialLinks.twitter || 'Not set'}
										</a>
									)}
								</div>
								<div className="flex items-center space-x-3">
									<Github className="h-5 w-5 text-gray-800" />
									{isEditing ? (
										<Input
											type="url"
											value={profileData.socialLinks.github}
											onChange={(e) =>
												handleInputChange("socialLinks.github", e.target.value)
											}
											placeholder="GitHub profile URL"
											className="flex-1"
										/>
									) : (
										<a 
											href={profileData.socialLinks.github} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-gray-800 hover:underline flex-1 text-sm"
										>
											{profileData.socialLinks.github || 'Not set'}
										</a>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Detailed Information */}
					<div className="lg:col-span-2 space-y-6">
						{/* Personal Information */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<User className="h-5 w-5 mr-2" />
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
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Website
										</label>
										<Input
											type="url"
											value={profileData.website}
											onChange={(e) =>
												handleInputChange("website", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Timezone
										</label>
										<Input
											type="text"
											value={profileData.timezone}
											onChange={(e) =>
												handleInputChange("timezone", e.target.value)
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
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										rows={3}
										value={profileData.bio}
										onChange={(e) =>
											handleInputChange("bio", e.target.value)
										}
										disabled={!isEditing}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Professional Information */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<Briefcase className="h-5 w-5 mr-2" />
									Professional Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Job Title
										</label>
										<Input
											type="text"
											value={profileData.role}
											onChange={(e) =>
												handleInputChange("role", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Department
										</label>
										<Input
											type="text"
											value={profileData.department}
											onChange={(e) =>
												handleInputChange("department", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Company
										</label>
										<Input
											type="text"
											value={profileData.company}
											onChange={(e) =>
												handleInputChange("company", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Work Location
										</label>
										<Input
											type="text"
											value={profileData.workLocation}
											onChange={(e) =>
												handleInputChange("workLocation", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Emergency Contact */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<UserCheck className="h-5 w-5 mr-2" />
									Emergency Contact
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Contact Name
										</label>
										<Input
											type="text"
											value={profileData.emergencyContact.name}
											onChange={(e) =>
												handleInputChange("emergencyContact.name", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Contact Phone
										</label>
										<Input
											type="tel"
											value={profileData.emergencyContact.phone}
											onChange={(e) =>
												handleInputChange("emergencyContact.phone", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Relationship
										</label>
										<Input
											type="text"
											value={profileData.emergencyContact.relationship}
											onChange={(e) =>
												handleInputChange("emergencyContact.relationship", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Preferences */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<Globe className="h-5 w-5 mr-2" />
									Preferences
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Theme
										</label>
										<select
											value={profileData.preferences.theme}
											onChange={(e) =>
												handleInputChange("preferences.theme", e.target.value)
											}
											disabled={!isEditing}
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										>
											<option value="light">Light</option>
											<option value="dark">Dark</option>
											<option value="system">System</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Language
										</label>
										<select
											value={profileData.preferences.language}
											onChange={(e) =>
												handleInputChange("preferences.language", e.target.value)
											}
											disabled={!isEditing}
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

						{/* Notification Settings */}
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
									<Bell className="h-5 w-5 mr-2" />
									Notification Settings
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
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
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}