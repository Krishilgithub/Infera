"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

	// Show loading spinner while checking auth
	if (loading) {
		return (
			<div className="min-h-screen gradient-bg flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-600"></div>
			</div>
		);
	}

  // Don't render dashboard if not authenticated
  if (!user) {
    return null
  }

	return (
		<div className="min-h-screen gradient-bg">
			<DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
			<div className="ml-16 min-h-screen transition-all duration-300">
				<main className="pt-8 pb-8 px-6 lg:px-12">{children}</main>
			</div>
		</div>
	);
}
