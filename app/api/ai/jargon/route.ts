import { NextRequest, NextResponse } from "next/server";
import { getOpenRouterClient } from "@/lib/ai/openrouter-client";

export async function POST(request: NextRequest) {
	try {
		const { term, context } = await request.json();

		if (!term) {
			return NextResponse.json(
				{ error: "No term provided for explanation" },
				{ status: 400 }
			);
		}

		const client = getOpenRouterClient();
		const result = await client.explainJargon(term, context || "");

		return NextResponse.json(result);
	} catch (error) {
		console.error("Jargon explanation error:", error);
		return NextResponse.json(
			{ error: "Failed to explain jargon" },
			{ status: 500 }
		);
	}
}
