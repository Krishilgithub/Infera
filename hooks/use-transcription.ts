import { useState, useCallback, useRef } from "react";
import { TranscriptionResponse } from "@/lib/ai/openrouter-client";

interface UseTranscriptionOptions {
	language?: string;
	continuous?: boolean;
	onTranscription?: (result: TranscriptionResponse) => void;
}

export function useTranscription(options: UseTranscriptionOptions = {}) {
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const startRecording = useCallback(async () => {
		try {
			setError(null);
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					sampleRate: 16000,
				},
			});

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "audio/webm;codecs=opus",
			});

			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(chunksRef.current, {
					type: "audio/webm;codecs=opus",
				});

				if (audioBlob.size > 0) {
					await transcribeAudio(audioBlob);
				}

				// Clean up
				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorder.start(options.continuous ? 1000 : undefined); // Collect data every second if continuous
			setIsRecording(true);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to start recording"
			);
		}
	}, [options.continuous]);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	}, [isRecording]);

	const transcribeAudio = useCallback(
		async (audioBlob: Blob) => {
			setIsTranscribing(true);
			setError(null);

			try {
				const formData = new FormData();
				formData.append("audio", audioBlob);
				if (options.language) {
					formData.append("language", options.language);
				}

				const response = await fetch("/api/ai/transcribe", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					throw new Error("Transcription failed");
				}

				const result: TranscriptionResponse = await response.json();
				options.onTranscription?.(result);
				return result;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Transcription failed";
				setError(errorMessage);
				throw err;
			} finally {
				setIsTranscribing(false);
			}
		},
		[options]
	);

	return {
		isRecording,
		isTranscribing,
		error,
		startRecording,
		stopRecording,
		transcribeAudio,
	};
}
