import { NextRequest, NextResponse } from "next/server";
import { getOpenRouterClient } from "@/lib/ai/openrouter-client";

export async function POST(request: NextRequest) {
	try {
		const { text } = await request.json();

		if (!text) {
			return NextResponse.json(
				{ error: "No text provided for insight extraction" },
				{ status: 400 }
			);
		}

		const client = getOpenRouterClient();
		const result = await client.extractInsights(text);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Insight extraction error:", error);
		return NextResponse.json(
			{ error: "Failed to extract insights" },
			{ status: 500 }
		);
	}
}
