import Link from "next/link";
import { Brain, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerSections = [
		{
			title: "Product",
			links: [
				{ name: "Features", href: "/features" },
				// Pricing link removed
				{ name: "Integrations", href: "/integrations" },
				{ name: "Demo", href: "/demo" },
			],
		},
		{
			title: "Company",
			links: [
				{ name: "About", href: "/about" },
				{ name: "Blog", href: "/blog" },
				{ name: "Careers", href: "/careers" },
				{ name: "Contact", href: "/contact" },
				{ name: "Email Support", href: "mailto:hello@infera.ai" },
			],
		},
		{
			title: "Resources",
			links: [
				{ name: "Documentation", href: "/docs" },
				{ name: "API Reference", href: "/api" },
				{ name: "Help Center", href: "/help" },
				{ name: "Community", href: "/community" },
			],
		},
		{
			title: "Legal",
			links: [
				{ name: "Privacy Policy", href: "/privacy" },
				{ name: "Terms of Service", href: "/terms" },
				{ name: "Cookie Policy", href: "/cookies" },
				{ name: "Security", href: "/security" },
			],
		},
	];

	const socialLinks = [
		{ name: "GitHub", icon: Github, href: "https://github.com/infera" },
		{ name: "Twitter", icon: Twitter, href: "https://twitter.com/infera" },
		{
			name: "LinkedIn",
			icon: Linkedin,
			href: "https://linkedin.com/company/infera",
		},
		{ name: "Email", icon: Mail, href: "mailto:hello@infera.ai" },
	];

	return (
		<footer
			className="border-t bg-surface-elevated text-foreground"
			style={{ backgroundColor: "var(--surface-muted)" }}
		>
			<div className="container section-padding">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
					{/* Brand Section */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center space-x-2 mb-4">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-infera-600 to-rose-600">
								<Brain className="h-5 w-5 text-white" />
							</div>
							<span className="text-xl font-bold gradient-text">Infera</span>
						</Link>

						<p className="text-muted-foreground mb-6 max-w-sm">
							Transform your meetings with AI-powered transcription, emotion
							tracking, and automated summaries. Make every meeting count.
						</p>

						{/* Social Links */}
						<div className="flex space-x-4">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<Link
										key={social.name}
										href={social.href}
										className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
										aria-label={social.name}
									>
										<Icon className="h-5 w-5" />
									</Link>
								);
							})}
						</div>
					</div>

					{/* Footer Links */}
					{footerSections.map((section) => (
						<div key={section.title}>
							<h3 className="font-semibold mb-4 text-foreground">
								{section.title}
							</h3>
							<ul className="space-y-3">
								{section.links.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-primary transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom Section */}
				<div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
					<p className="text-sm text-muted-foreground">
						© {currentYear} Infera. All rights reserved.
					</p>

					<div className="flex items-center space-x-6 mt-4 md:mt-0">
						<span className="text-sm text-muted-foreground">
							Made with ❤️ for better meetings
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
