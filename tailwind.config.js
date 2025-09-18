/** @type {import('tailwindcss').Config} */
module.exports = {
	// darkMode removed
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// Infera Brand Colors - Extracted from Logo Gradient
				// Primary Palette - From Logo's Magenta to Crimson Gradient
				infera: {
					// Deep magenta (darkest point of logo)
					50: "#fef7ff", // lightest tint
					100: "#feeaff", // very light
					200: "#fcd4ff", // light
					300: "#f9b1ff", // medium light
					400: "#f579ff", // medium
					500: "#e935d1", // brand primary (mid-tone magenta)
					600: "#d91a7a", // deeper magenta
					700: "#c41e3a", // crimson red
					800: "#991b1b", // dark red
					900: "#7f1d1d", // darkest
				},
				// Accent colors derived from logo
				rose: {
					50: "#fff1f2",
					100: "#ffe4e6",
					200: "#fecdd3",
					300: "#fda4af",
					400: "#fb7185",
					500: "#f43f5e", // bright accent
					600: "#e11d48", // primary accent
					700: "#be123c",
					800: "#9f1239",
					900: "#881337",
				},
				// Supporting crimson
				crimson: {
					50: "#fef2f2",
					100: "#fee2e2",
					200: "#fecaca",
					300: "#fca5a5",
					400: "#f87171",
					500: "#ef4444", // bright crimson
					600: "#dc2626", // primary crimson
					700: "#b91c1c",
					800: "#991b1b",
					900: "#7f1d1d",
				},
				// Neutral palette for readability
				neutral: {
					50: "#fafafa", // off-white
					100: "#f5f5f5", // light gray
					200: "#e5e5e5",
					300: "#d4d4d4",
					400: "#a3a3a3",
					500: "#737373",
					600: "#525252",
					700: "#404040",
					800: "#262626", // dark charcoal
					900: "#171717", // darkest
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
