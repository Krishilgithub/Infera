import { useState, useCallback } from "react";
import {
	SentimentAnalysisResponse,
	InsightExtractionResponse,
	JargonExplanationResponse,
} from "@/lib/ai/openrouter-client";

export function useSentimentAnalysis() {
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const analyzeSentiment = useCallback(
		async (text: string): Promise<SentimentAnalysisResponse> => {
			setIsAnalyzing(true);
			setError(null);

			try {
				const response = await fetch("/api/ai/sentiment", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text }),
				});

				if (!response.ok) {
					throw new Error("Sentiment analysis failed");
				}

				const result: SentimentAnalysisResponse = await response.json();
				return result;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Sentiment analysis failed";
				setError(errorMessage);
				throw err;
			} finally {
				setIsAnalyzing(false);
			}
		},
		[]
	);

	return {
		isAnalyzing,
		error,
		analyzeSentiment,
	};
}

export function useInsightExtraction() {
	const [isExtracting, setIsExtracting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const extractInsights = useCallback(
		async (text: string): Promise<InsightExtractionResponse> => {
			setIsExtracting(true);
			setError(null);

			try {
				const response = await fetch("/api/ai/insights", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text }),
				});

				if (!response.ok) {
					throw new Error("Insight extraction failed");
				}

				const result: InsightExtractionResponse = await response.json();
				return result;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Insight extraction failed";
				setError(errorMessage);
				throw err;
			} finally {
				setIsExtracting(false);
			}
		},
		[]
	);

	return {
		isExtracting,
		error,
		extractInsights,
	};
}

export function useJargonExplanation() {
	const [isExplaining, setIsExplaining] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const explainJargon = useCallback(
		async (
			term: string,
			context?: string
		): Promise<JargonExplanationResponse> => {
			setIsExplaining(true);
			setError(null);

			try {
				const response = await fetch("/api/ai/jargon", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ term, context }),
				});

				if (!response.ok) {
					throw new Error("Jargon explanation failed");
				}

				const result: JargonExplanationResponse = await response.json();
				return result;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Jargon explanation failed";
				setError(errorMessage);
				throw err;
			} finally {
				setIsExplaining(false);
			}
		},
		[]
	);

	return {
		isExplaining,
		error,
		explainJargon,
	};
}
