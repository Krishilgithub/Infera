/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["images.unsplash.com", "via.placeholder.com"],
		unoptimized: false,
	},
	// Optimize for production
	compress: true,
	poweredByHeader: false,
	// Enable standalone output for Docker/Render
	output: "standalone",
	// Headers for security
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
				],
			},
		];
	},
	// Optimize for Render deployment
	experimental: {
		outputFileTracingRoot: undefined,
	},
};

module.exports = nextConfig;
