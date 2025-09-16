"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Live Meeting", href: "/dashboard/live", icon: Video, isLive: true },
	{ name: "Join Meeting", href: "/dashboard/meeting", icon: Video },
	{ name: "Schedule Meeting", href: "/dashboard/schedule", icon: BarChart3 },
	{ name: "Meeting History", href: "/dashboard/history", icon: History },
	{ name: "Profile", href: "/dashboard/profile", icon: Users },
	{ name: "Settings", href: "/dashboard/settings", icon: Settings },
	{ name: "Help & Support", href: "/dashboard/help", icon: Brain },
];

export default function DashboardSidebar({
	isOpen,
	setIsOpen,
}: DashboardSidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Mobile sidebar overlay */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-40 bg-black/50"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<motion.div
				initial={{ x: -300 }}
				animate={{ x: isOpen ? 0 : -300 }}
				transition={{ type: "spring", damping: 20, stiffness: 300 }}
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out",
					isOpen ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<div className="flex h-full flex-col">
					{/* Logo */}
					<div className="flex h-16 items-center justify-between px-6 border-b border-white/20">
						<Link href="/dashboard" className="flex items-center space-x-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-navy-600 to-teal-600">
								<Video className="h-5 w-5 text-white" />
							</div>
							<span className="text-xl font-bold gradient-text">Infera</span>
						</Link>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsOpen(false)}
						>
							<X className="h-5 w-5" />
						</Button>
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
										"flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
										isActive
											? "bg-gradient-to-r from-navy-100 to-teal-100 text-navy-700 border border-navy-200"
											: "text-gray-700 hover:text-navy-700 hover:bg-gradient-to-r hover:from-navy-50 hover:to-teal-50"
									)}
								>
									<Icon className="mr-3 h-5 w-5" />
									<span className="flex-1">{item.name}</span>
									{item.isLive && (
										<div className="flex items-center space-x-1">
											<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
											<span className="text-xs text-red-500">LIVE</span>
										</div>
									)}
								</Link>
							);
						})}
					</nav>

					{/* User section */}
					<div className="border-t border-white/20 p-4">
						<div className="flex items-center space-x-3">
							<div className="h-8 w-8 rounded-full bg-gradient-to-br from-navy-600 to-teal-600 flex items-center justify-center">
								<span className="text-sm font-medium text-white">JD</span>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900">John Doe</p>
								<p className="text-xs text-gray-600 truncate">
									john@company.com
								</p>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</>
	);
}
