"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Menu, X, Sun, Moon, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigation = [
		{ name: "Features", href: "/features" },
		{ name: "Integrations", href: "/integrations" },
		{ name: "Demo", href: "/demo" },
		{ name: "Contact", href: "mailto:hello@infera.ai" },
	];

		return (
			<header className="fixed top-4 left-1/2 z-50 w-[95vw] max-w-4xl -translate-x-1/2 rounded-3xl bg-gradient-to-br from-white/80 via-primary/10 to-teal-100/80 dark:from-navy-900/90 dark:via-navy-800/80 dark:to-teal-900/80 shadow-2xl border border-primary/20 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 transition-all">
				<div className="flex h-16 items-center justify-between px-6">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2 group">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-500 shadow-md group-hover:scale-105 transition-transform">
							<Brain className="h-5 w-5 text-white drop-shadow" />
						</div>
						<span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">Infera</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="text-base font-semibold px-3 py-1 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:bg-primary/10 hover:text-primary/90 active:bg-primary/20"
							>
								{item.name}
							</Link>
						))}
					</nav>

					{/* Desktop Actions */}
					<div className="hidden md:flex items-center space-x-4">
						<Link href="/login">
							<Button variant="ghost" className="font-semibold">Sign In</Button>
						</Link>
						<Link href="/signup">
							<Button variant="gradient" className="font-semibold shadow-md">Start Free Trial</Button>
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className="flex md:hidden items-center space-x-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label="Toggle menu"
							className="rounded-xl border border-primary/20 bg-white/70 dark:bg-navy-900/80 shadow-md hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/60"
						>
							{isMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden bg-gradient-to-br from-white/90 via-primary/10 to-teal-100/90 dark:from-navy-900/95 dark:via-navy-800/90 dark:to-teal-900/90 rounded-2xl shadow-xl border border-primary/20 mt-2 mx-2"
					>
						<div className="container py-4 space-y-4">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="block text-base font-semibold px-3 py-2 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:bg-primary/10 hover:text-primary/90 active:bg-primary/20"
									onClick={() => setIsMenuOpen(false)}
								>
									{item.name}
								</Link>
							))}
							<div className="flex flex-col space-y-2 pt-4">
								<Link href="/login" onClick={() => setIsMenuOpen(false)}>
									<Button variant="ghost" className="w-full justify-start font-semibold">Sign In</Button>
								</Link>
								<Link href="/signup" onClick={() => setIsMenuOpen(false)}>
									<Button variant="gradient" className="w-full font-semibold shadow">Start Free Trial</Button>
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</header>
		);
}
