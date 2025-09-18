import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import HelpWidget from "@/components/help-widget";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Infera - AI-Powered Meeting Intelligence",
	description:
		"Transform your meetings with AI-powered transcription, emotion tracking, and automated summaries.",
	keywords:
		"AI meetings, transcription, emotion tracking, meeting summaries, automation",
	authors: [{ name: "Infera Team" }],
	creator: "Infera",
	publisher: "Infera",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL(process.env.SITE_URL || "https://infera.vercel.app"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Infera - AI-Powered Meeting Intelligence",
		description:
			"Transform your meetings with AI-powered transcription, emotion tracking, and automated summaries.",
		url: process.env.SITE_URL || "https://infera.vercel.app",
		siteName: "Infera",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Infera - AI-Powered Meeting Intelligence",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Infera - AI-Powered Meeting Intelligence",
		description:
			"Transform your meetings with AI-powered transcription, emotion tracking, and automated summaries.",
		images: ["/og-image.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: process.env.GOOGLE_SITE_VERIFICATION,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
		return (
			<html lang="en" suppressHydrationWarning>
				<body className={inter.className}>
					<AuthProvider>
						{children}
						<HelpWidget />
						<Toaster />
						<Analytics />
						<SpeedInsights />
					</AuthProvider>
				</body>
			</html>
		);
}
