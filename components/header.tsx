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
	];

	return (
		<header className="fixed top-4 left-1/2 z-50 w-[95vw] max-w-4xl -translate-x-1/2 rounded-2xl bg-background/80 shadow-xl border border-gray-200 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 transition-all">
			<div className="flex h-16 items-center justify-between px-6">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-infera-600 to-rose-600">
						<Brain className="h-5 w-5 text-white" />
					</div>
					<span className="text-xl font-bold gradient-text">Infera</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-8">
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{item.name}
						</Link>
					))}
				</nav>

				{/* Desktop Actions */}
				<div className="hidden md:flex items-center space-x-4">
					<Link href="/login">
						<Button variant="ghost">Sign In</Button>
					</Link>
					<Link href="/signup">
						<Button variant="gradient">Start Free Trial</Button>
					</Link>
				</div>

				{/* Mobile menu button */}
				<div className="flex md:hidden items-center space-x-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle menu"
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
					className="md:hidden bg-background"
				>
					<div className="container py-4 space-y-4">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
								onClick={() => setIsMenuOpen(false)}
							>
								{item.name}
							</Link>
						))}
						<div className="flex flex-col space-y-2 pt-4">
							<Link href="/login" onClick={() => setIsMenuOpen(false)}>
								<Button variant="ghost" className="w-full justify-start">
									Sign In
								</Button>
							</Link>
							<Link href="/signup" onClick={() => setIsMenuOpen(false)}>
								<Button variant="gradient" className="w-full">
									Start Free Trial
								</Button>
							</Link>
						</div>
					</div>
				</motion.div>
			)}
		</header>
	);
}
