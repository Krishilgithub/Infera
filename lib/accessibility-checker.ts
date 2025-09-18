/**
 * Accessibility Checker Component
 * This component validates color contrast ratios and ensures WCAG AA compliance
 */

interface ColorContrastCheck {
	name: string;
	foreground: string;
	background: string;
	expectedRatio: number;
	usage: string;
}

export const colorContrastChecks: ColorContrastCheck[] = [
	// Primary text combinations
	{
		name: "Primary text on light background",
		foreground: "#0f172a", // --text-primary
		background: "#ffffff", // --surface-light
		expectedRatio: 4.5,
		usage: "Main body text, headings",
	},
	{
		name: "Secondary text on light background",
		foreground: "#475569", // --text-secondary
		background: "#ffffff", // --surface-light
		expectedRatio: 4.5,
		usage: "Less important text, captions",
	},
	{
		name: "Primary text on dark background",
		foreground: "#f8fafc", // --text-primary (dark mode)
		background: "#0f172a", // --surface-light (dark mode)
		expectedRatio: 4.5,
		usage: "Main body text, headings (dark mode)",
	},
	{
		name: "Secondary text on dark background",
		foreground: "#cbd5e1", // --text-secondary (dark mode)
		background: "#0f172a", // --surface-light (dark mode)
		expectedRatio: 4.5,
		usage: "Less important text (dark mode)",
	},
	// Brand color combinations
	{
		name: "Brand primary button text",
		foreground: "#ffffff", // --surface-light
		background: "#d91a7a", // --brand-primary
		expectedRatio: 4.5,
		usage: "Button text on brand background",
	},
	{
		name: "Brand accent button text",
		foreground: "#ffffff", // --surface-light
		background: "#e935d1", // --brand-accent
		expectedRatio: 4.5,
		usage: "Accent button text",
	},
	// Card and elevated surfaces
	{
		name: "Text on elevated cards (light)",
		foreground: "#0f172a", // --text-primary
		background: "#ffffff", // --surface-elevated
		expectedRatio: 4.5,
		usage: "Text on cards and elevated elements",
	},
	{
		name: "Text on elevated cards (dark)",
		foreground: "#f8fafc", // --text-primary (dark)
		background: "#334155", // --surface-elevated (dark)
		expectedRatio: 4.5,
		usage: "Text on cards and elevated elements (dark mode)",
	},
];

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 guidelines
 */
export function calculateContrastRatio(
	foreground: string,
	background: string
): number {
	const getLuminance = (color: string): number => {
		// Convert hex to RGB
		const hex = color.replace("#", "");
		const r = parseInt(hex.substr(0, 2), 16) / 255;
		const g = parseInt(hex.substr(2, 2), 16) / 255;
		const b = parseInt(hex.substr(4, 2), 16) / 255;

		// Calculate relative luminance
		const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
		const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
		const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

		return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
	};

	const fgLuminance = getLuminance(foreground);
	const bgLuminance = getLuminance(background);

	const lighter = Math.max(fgLuminance, bgLuminance);
	const darker = Math.min(fgLuminance, bgLuminance);

	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate all color combinations against WCAG AA standards
 */
export function validateColorContrast(): {
	passed: number;
	failed: number;
	results: any[];
} {
	const results = colorContrastChecks.map((check) => {
		const actualRatio = calculateContrastRatio(
			check.foreground,
			check.background
		);
		const passed = actualRatio >= check.expectedRatio;

		return {
			...check,
			actualRatio: Math.round(actualRatio * 100) / 100,
			passed,
			grade: actualRatio >= 7 ? "AAA" : actualRatio >= 4.5 ? "AA" : "Fail",
		};
	});

	const passed = results.filter((r) => r.passed).length;
	const failed = results.filter((r) => !r.passed).length;

	return { passed, failed, results };
}

// Export for debugging in browser console
if (typeof window !== "undefined") {
	(window as any).validateInferaColors = validateColorContrast;
			// Removed dark mode accessibility checks
}
