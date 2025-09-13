import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({
		status: "healthy",
		timestamp: new Date().toISOString(),
		version: process.env.npm_package_version || "1.0.0",
		environment: process.env.NODE_ENV || "development",
		uptime: process.uptime(),
		platform: "render",
		port: process.env.PORT || 3000,
		site_url: process.env.SITE_URL || "localhost:3000",
		health_check: "ok",
	});
}
