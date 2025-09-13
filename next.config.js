/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["images.unsplash.com", "via.placeholder.com"],
		unoptimized: false,
	},
	// Optimize for production
	compress: true,
	poweredByHeader: false,
	// Enable static exports if needed
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
				],
			},
		];
	},
};

module.exports = nextConfig;
