"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { useAuth } from "@/contexts/auth-context";
import { MeetingProvider } from "@/contexts/meeting-context";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	// Set sidebar open by default on large screens
	useEffect(() => {
		const checkScreenSize = () => {
			setSidebarOpen(window.innerWidth >= 1024); // lg breakpoint
		};
		
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, loading, router]);

	// Show loading spinner while checking auth
	if (loading) {
		return (
			<div className="min-h-screen gradient-bg flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-600"></div>
			</div>
		);
	}

	// Don't render dashboard if not authenticated
	if (!isAuthenticated) {
		return null;
	}

	return (
		<MeetingProvider>
			<div className="min-h-screen gradient-bg">
				<DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
				<div 
					className={`min-h-screen transition-all duration-300 ${
						sidebarOpen ? 'lg:ml-64' : 'ml-0'
					}`}
				>
					<DashboardHeader setSidebarOpen={setSidebarOpen} />
					<main className="pt-4 pb-8">{children}</main>
				</div>
			</div>
		</MeetingProvider>
	);
}
