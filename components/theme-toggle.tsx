"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);

		// Check for saved theme preference or default to 'light'
		const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;

		const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
		setTheme(initialTheme);
		applyTheme(initialTheme);
	}, []);

	const applyTheme = (newTheme: "light" | "dark") => {
		const root = document.documentElement;

		// Remove existing theme classes
		root.classList.remove("light", "dark");
		root.removeAttribute("data-theme");

		// Apply new theme
		root.classList.add(newTheme);
		root.setAttribute("data-theme", newTheme);

		// Save preference
		localStorage.setItem("theme", newTheme);
	};

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		applyTheme(newTheme);
	};

	// Don't render anything until mounted to prevent hydration mismatch
	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" className="w-9 h-9" disabled>
				<Sun className="h-4 w-4" />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className="w-9 h-9 transition-colors hover:bg-muted"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
		>
			{theme === "light" ? (
				<Moon className="h-4 w-4 text-text-secondary" />
			) : (
				<Sun className="h-4 w-4 text-text-secondary" />
			)}
		</Button>
	);
}
