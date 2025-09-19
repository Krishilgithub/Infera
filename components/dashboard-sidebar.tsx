"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
	LayoutDashboard,
	Video,
	History,
	Settings,
	Users,
	BarChart3,
	Zap,
	X,
	Brain,
	Menu,
	User,
	LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface DashboardSidebarProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{
		name: "Live Meeting",
		href: "/dashboard/meeting",
		icon: Video,
		isLive: true,
	},
	{
		name: "Meeting Details",
		href: "/dashboard/meeting-details",
		icon: History,
	},
	{ name: "Settings", href: "/dashboard/settings", icon: Settings },
	{ name: "Help", href: "/dashboard/help", icon: Brain },
];

export default function DashboardSidebar({
	isOpen,
	setIsOpen,
}: DashboardSidebarProps) {
	const pathname = usePathname();
	const { user, signOut } = useAuth();
	const router = useRouter();
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
		setShowProfileMenu(false);
	};

	const isExpanded = isOpen || isHovered;

	return (
		<>
			{/* Overlay for mobile */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsOpen(false)}
						className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<motion.div
				className={cn(
					"fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 shadow-xl",
					"transition-all duration-150 ease-out",
					isExpanded ? "w-64" : "w-16"
				)}
				animate={{ 
					width: isExpanded ? 256 : 64 
				}}
				transition={{ 
					type: "tween",
					duration: 0.15,
					ease: [0.25, 0.46, 0.45, 0.94]
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => {
					setIsHovered(false);
					setShowProfileMenu(false);
				}}
			>
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-gray-200">
						<AnimatePresence mode="wait">
							{isExpanded ? (
								<motion.div
									key="expanded"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.12 }}
									className="flex items-center justify-between w-full"
								>
									<Link href="/dashboard" className="flex items-center space-x-2 no-underline hover:no-underline">
										<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-infera-600 to-rose-600 flex items-center justify-center">
											<Zap className="h-5 w-5 text-white" />
										</div>
										<span className="text-xl font-bold bg-gradient-to-r from-infera-700 to-rose-700 bg-clip-text text-transparent">
											Infera
										</span>
									</Link>
									<Button
										variant="ghost"
										size="icon"
										className="lg:hidden"
										onClick={() => setIsOpen(false)}
									>
										<X className="h-5 w-5" />
									</Button>
								</motion.div>
							) : (
								<motion.div
									key="collapsed"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.12 }}
									className="w-full flex justify-center"
								>
									<Menu className="h-6 w-6 text-gray-600" />
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 px-3 py-4">
						{navigation.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;

							return (
								<Link
									key={item.name}
									href={item.href}
									onClick={() => setIsOpen(false)}
									className={cn(
										"flex items-center text-sm font-medium rounded-lg transition-colors relative",
										isActive
											? "bg-gradient-to-r from-infera-100 to-rose-100 text-infera-700 border border-infera-200"
											: "text-gray-700 hover:text-infera-700 hover:bg-gradient-to-r hover:from-infera-50 hover:to-rose-50",
										isExpanded ? "px-3 py-2" : "px-2 py-2 justify-center"
									)}
									title={!isExpanded ? item.name : undefined}
								>
									<div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
										<Icon className={cn(
											"h-5 w-5 transition-colors",
											isActive ? "text-red-600" : ""
										)} />
									</div>
									<AnimatePresence>
										{isExpanded && (
											<motion.div
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: -10 }}
												transition={{ duration: 0.12, ease: "easeOut" }}
												className="flex items-center justify-between flex-1 ml-3 overflow-hidden"
											>
												<span className="whitespace-nowrap">{item.name}</span>
												{item.isLive && (
													<div className="flex items-center space-x-1 ml-2 flex-shrink-0">
														<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
														<span className="text-xs text-red-500">LIVE</span>
													</div>
												)}
											</motion.div>
										)}
									</AnimatePresence>
								</Link>
							);
						})}
					</nav>

					{/* User section */}
					<div className="border-t border-gray-200 p-4">
						{isExpanded ? (
							<div className="relative">
								<div 
									className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
									onClick={() => setShowProfileMenu(!showProfileMenu)}
								>
									<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
										<span className="text-sm font-medium text-white">
											{user?.user_metadata?.full_name?.charAt(0) ||
												user?.email?.charAt(0) ||
												"U"}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900">
											{user?.user_metadata?.full_name || "User"}
										</p>
										<p className="text-xs text-gray-500 truncate">{user?.email}</p>
									</div>
								</div>

								{/* Profile dropdown */}
								{showProfileMenu && (
									<div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg">
										<div className="p-1">
											<Button
												variant="ghost"
												size="sm"
												className="w-full justify-start text-gray-700 hover:bg-gray-50"
												onClick={() => {
													router.push("/dashboard/profile");
													setShowProfileMenu(false);
													setIsOpen(false);
												}}
											>
												<User className="mr-2 h-4 w-4" />
												Profile
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
												onClick={handleSignOut}
											>
												<LogOut className="mr-2 h-4 w-4" />
												Sign out
											</Button>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="flex justify-center">
								<div 
									className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
									title="Profile"
								>
									<span className="text-sm font-medium text-white">
										{user?.user_metadata?.full_name?.charAt(0) ||
											user?.email?.charAt(0) ||
											"U"}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		</>
	);
}
