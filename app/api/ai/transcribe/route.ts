import { NextRequest, NextResponse } from "next/server";
import { getOpenRouterClient } from "@/lib/ai/openrouter-client";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const audioFile = formData.get("audio") as File;
		const language = formData.get("language") as string;

		if (!audioFile) {
			return NextResponse.json(
				{ error: "No audio file provided" },
				{ status: 400 }
			);
		}

		const client = getOpenRouterClient();
		const result = await client.transcribeAudio(audioFile, language);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Transcription error:", error);
		return NextResponse.json(
			{ error: "Failed to transcribe audio" },
			{ status: 500 }
		);
	}
}
