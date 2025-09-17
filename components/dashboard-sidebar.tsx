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

	const handleSignOut = async () => {
		await signOut();
		router.push("/login");
	};

	return (
		<>
			{/* Mobile sidebar overlay */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.1 }}
						className="fixed inset-0 z-40 bg-black/50"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<motion.div
				initial={{ x: -300 }}
				animate={{ x: isOpen ? 0 : -300 }}
				transition={{
					type: "spring",
					damping: 30,
					stiffness: 800,
					duration: 0.15,
				}}
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-white/20 shadow-xl transform transition-transform duration-150 ease-out",
					isOpen ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<div className="flex h-full flex-col">
					{/* Logo */}
					<div className="flex h-16 items-center justify-between px-6 border-b border-white/20">
						<Link href="/dashboard" className="flex items-center space-x-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-infera-600 to-rose-600">
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
											? "bg-gradient-to-r from-infera-100 to-rose-100 text-infera-700 border border-infera-200"
											: "text-gray-700 hover:text-infera-700 hover:bg-gradient-to-r hover:from-infera-50 hover:to-rose-50"
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
					<div className="border-t border-gray-200 p-4">
						<div className="flex items-center space-x-3 mb-3">
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
						<Button
							variant="outline"
							size="sm"
							className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
							onClick={handleSignOut}
						>
							<Users className="mr-2 h-4 w-4" />
							Sign Out
						</Button>
					</div>
				</div>
			</motion.div>
		</>
	);
}
