import { NextRequest, NextResponse } from "next/server";
import { getOpenRouterClient } from "@/lib/ai/openrouter-client";

export async function POST(request: NextRequest) {
	try {
		const { text } = await request.json();

		if (!text) {
			return NextResponse.json(
				{ error: "No text provided for sentiment analysis" },
				{ status: 400 }
			);
		}

		const client = getOpenRouterClient();
		const result = await client.analyzeSentiment(text);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Sentiment analysis error:", error);
		return NextResponse.json(
			{ error: "Failed to analyze sentiment" },
			{ status: 500 }
		);
	}
}
