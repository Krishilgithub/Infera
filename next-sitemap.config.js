/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || "https://infera.vercel.app",
	generateRobotsTxt: true,
	generateIndexSitemap: false,
	exclude: ["/dashboard/*", "/api/*"],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/dashboard/", "/api/"],
			},
		],
		additionalSitemaps: ["https://infera.vercel.app/sitemap.xml"],
	},
	transform: async (config, path) => {
		// Custom transform for specific pages
		if (path === "/") {
			return {
				loc: path,
				changefreq: "daily",
				priority: 1.0,
				lastmod: new Date().toISOString(),
			};
		}

		if (path.startsWith("/features") || path.startsWith("/pricing")) {
			return {
				loc: path,
				changefreq: "weekly",
				priority: 0.8,
				lastmod: new Date().toISOString(),
			};
		}

		return {
			loc: path,
			changefreq: "monthly",
			priority: 0.5,
			lastmod: new Date().toISOString(),
		};
	},
};
