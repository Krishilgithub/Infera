/**
 * OpenRouter API Client for AI-powered meeting features
 * Supports Whisper transcription, sentiment analysis, and more
 */

export interface TranscriptionResponse {
	text: string;
	confidence: number;
	language: string;
	segments?: {
		start: number;
		end: number;
		text: string;
	}[];
}

export interface SentimentAnalysisResponse {
	sentiment: "positive" | "negative" | "neutral";
	confidence: number;
	emotions: {
		joy: number;
		anger: number;
		fear: number;
		sadness: number;
		surprise: number;
	};
	engagement_level: number;
}

export interface SpeakerIdentificationResponse {
	speaker_id: string;
	confidence: number;
	speaker_name?: string;
	role?: string;
}

export interface JargonExplanationResponse {
	term: string;
	explanation: string;
	context: string;
}

export interface InsightExtractionResponse {
	action_items: string[];
	decisions: string[];
	risks: string[];
	key_points: string[];
}

class OpenRouterClient {
	private apiKey: string;
	private baseUrl = "https://openrouter.ai/api/v1";

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private async makeRequest(endpoint: string, options: RequestInit = {}) {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"Content-Type": "application/json",
				"HTTP-Referer":
					process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
				"X-Title": "Infera AI Meeting Assistant",
				...options.headers,
			},
		});

		if (!response.ok) {
			throw new Error(
				`OpenRouter API error: ${response.status} ${response.statusText}`
			);
		}

		return response.json();
	}

	/**
	 * Transcribe audio using Whisper AI
	 */
	async transcribeAudio(
		audioBlob: Blob,
		language?: string
	): Promise<TranscriptionResponse> {
		const formData = new FormData();
		formData.append("file", audioBlob, "audio.webm");
		formData.append("model", "openai/whisper-large-v3");
		if (language) {
			formData.append("language", language);
		}

		const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"HTTP-Referer":
					process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Transcription error: ${response.status}`);
		}

		const result = await response.json();
		return {
			text: result.text,
			confidence: result.confidence || 0.9,
			language: result.language || language || "en",
			segments: result.segments,
		};
	}

	/**
	 * Analyze sentiment and emotions from text
	 */
	async analyzeSentiment(text: string): Promise<SentimentAnalysisResponse> {
		const response = await this.makeRequest("/chat/completions", {
			method: "POST",
			body: JSON.stringify({
				model: "anthropic/claude-3.5-sonnet",
				messages: [
					{
						role: "system",
						content: `You are an expert sentiment and emotion analyzer. Analyze the given text and return a JSON response with:
            - sentiment: "positive", "negative", or "neutral"
            - confidence: number between 0-1
            - emotions: object with joy, anger, fear, sadness, surprise (each 0-1)
            - engagement_level: number between 0-1 indicating speaker engagement
            
            Return only valid JSON, no other text.`,
					},
					{
						role: "user",
						content: `Analyze this meeting text: "${text}"`,
					},
				],
				temperature: 0.3,
				max_tokens: 200,
			}),
		});

		const content = response.choices[0].message.content;
		return JSON.parse(content);
	}

	/**
	 * Extract key insights from meeting text
	 */
	async extractInsights(text: string): Promise<InsightExtractionResponse> {
		const response = await this.makeRequest("/chat/completions", {
			method: "POST",
			body: JSON.stringify({
				model: "anthropic/claude-3.5-sonnet",
				messages: [
					{
						role: "system",
						content: `You are an expert meeting analyst. Extract key insights from meeting transcripts and return JSON with:
            - action_items: array of specific action items mentioned
            - decisions: array of decisions made
            - risks: array of risks or concerns raised
            - key_points: array of important discussion points
            
            Return only valid JSON, no other text.`,
					},
					{
						role: "user",
						content: `Extract insights from this meeting text: "${text}"`,
					},
				],
				temperature: 0.2,
				max_tokens: 500,
			}),
		});

		const content = response.choices[0].message.content;
		return JSON.parse(content);
	}

	/**
	 * Explain jargon and technical terms
	 */
	async explainJargon(
		term: string,
		context: string
	): Promise<JargonExplanationResponse> {
		const response = await this.makeRequest("/chat/completions", {
			method: "POST",
			body: JSON.stringify({
				model: "anthropic/claude-3.5-sonnet",
				messages: [
					{
						role: "system",
						content: `You are a helpful assistant that explains industry jargon and technical terms in simple language. 
            Return JSON with:
            - term: the original term
            - explanation: simple, clear explanation
            - context: how it relates to the current discussion
            
            Return only valid JSON.`,
					},
					{
						role: "user",
						content: `Explain the term "${term}" in the context: "${context}"`,
					},
				],
				temperature: 0.3,
				max_tokens: 150,
			}),
		});

		const content = response.choices[0].message.content;
		return JSON.parse(content);
	}

	/**
	 * Identify speaker characteristics (simplified version)
	 */
	async identifySpeaker(
		audioFeatures: any,
		knownSpeakers?: any[]
	): Promise<SpeakerIdentificationResponse> {
		// This is a placeholder for speaker identification
		// In a real implementation, you'd use voice biometrics
		return {
			speaker_id: `speaker_${Date.now()}`,
			confidence: 0.8,
			speaker_name: "Unknown Speaker",
			role: "Participant",
		};
	}
}

// Singleton instance
let openRouterClient: OpenRouterClient | null = null;

export function getOpenRouterClient(): OpenRouterClient {
	if (!openRouterClient) {
		const apiKey = process.env.OPENROUTER_API_KEY;
		if (!apiKey) {
			throw new Error("OPENROUTER_API_KEY environment variable is not set");
		}
		openRouterClient = new OpenRouterClient(apiKey);
	}
	return openRouterClient;
}

export default OpenRouterClient;
