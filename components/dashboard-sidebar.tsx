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
							className="fixed inset-0 z-40 bg-black/60 lg:hidden"
						/>
					)}
				</AnimatePresence>

				{/* Sidebar */}
				<motion.div
					className={cn(
						"fixed left-0 top-0 z-50 h-full bg-gradient-to-br from-white/90 via-primary/10 to-teal-100/90 dark:from-navy-900/95 dark:via-navy-800/90 dark:to-teal-900/90 border-r border-primary/20 shadow-2xl backdrop-blur-2xl transition-all duration-200",
						isExpanded ? "w-64 rounded-tr-3xl rounded-br-3xl" : "w-16 rounded-tr-2xl rounded-br-2xl"
					)}
					animate={{ width: isExpanded ? 256 : 64 }}
					transition={{ type: "tween", duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => {
						setIsHovered(false);
						setShowProfileMenu(false);
					}}
				>
					<div className="flex h-full flex-col">
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b border-primary/20">
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
											<div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-md">
												<Zap className="h-5 w-5 text-white drop-shadow" />
											</div>
											<span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
												Infera
											</span>
										</Link>
										<Button
											variant="ghost"
											size="icon"
											className="lg:hidden rounded-xl border border-primary/20 bg-white/70 dark:bg-navy-900/80 shadow-md hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/60"
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
										<Menu className="h-6 w-6 text-primary" />
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
											"flex items-center text-base font-semibold rounded-xl transition-all duration-150 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
											isActive
												? "bg-gradient-to-r from-primary/10 to-teal-100/60 text-primary border border-primary/30 shadow-md"
												: "text-navy-700 dark:text-navy-200 hover:text-primary hover:bg-primary/10 active:bg-primary/20",
											isExpanded ? "px-4 py-2" : "px-2 py-2 justify-center"
										)}
										title={!isExpanded ? item.name : undefined}
									>
										<div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
											<Icon className={cn(
												"h-6 w-6 transition-colors",
												isActive ? "text-primary" : ""
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
						<div className="border-t border-primary/20 p-4">
							{isExpanded ? (
								<div className="relative">
									<div 
										className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-primary/10 rounded-xl p-2 transition-all"
										onClick={() => setShowProfileMenu(!showProfileMenu)}
									>
										<div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-md">
											<span className="text-base font-bold text-white">
												{user?.user_metadata?.full_name?.charAt(0) ||
													user?.email?.charAt(0) ||
													"U"}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-base font-semibold text-navy-900 dark:text-white">
												{user?.user_metadata?.full_name || "User"}
											</p>
											<p className="text-xs text-navy-500 dark:text-navy-300 truncate">{user?.email}</p>
										</div>
									</div>

									{/* Profile dropdown */}
									{showProfileMenu && (
										<div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-navy-900 border border-primary/20 rounded-xl shadow-lg">
											<div className="p-1">
												<Button
													variant="ghost"
													size="sm"
													className="w-full justify-start text-navy-700 dark:text-navy-200 hover:bg-primary/10"
													onClick={() => {
														router.push("/dashboard/settings");
														setShowProfileMenu(false);
														setIsOpen(false);
													}}
												>
													<Settings className="mr-2 h-4 w-4" />
													Settings
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
										className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all shadow-md"
										title="Profile"
									>
										<span className="text-base font-bold text-white">
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
