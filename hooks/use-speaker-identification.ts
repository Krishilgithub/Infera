import { useState, useEffect } from "react";

export interface SpeakerProfile {
	id: string;
	name: string;
	voiceprint: string; // Base64 encoded voiceprint
	confidence: number;
	lastSeen: Date;
}

export interface SpeakerIdentificationResult {
	speakerId?: string;
	speakerName?: string;
	confidence: number;
	isNewSpeaker: boolean;
}

class SpeakerIdentification {
	private profiles: Map<string, SpeakerProfile> = new Map();
	private audioContext: AudioContext | null = null;
	private analyzer: AnalyserNode | null = null;

	async initialize() {
		try {
			this.audioContext = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
			this.analyzer = this.audioContext.createAnalyser();
			this.analyzer.fftSize = 2048;
			return true;
		} catch (error) {
			console.error("Failed to initialize speaker identification:", error);
			return false;
		}
	}

	async registerSpeaker(
		audioBuffer: ArrayBuffer,
		name: string
	): Promise<string> {
		const speakerId = `speaker_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;
		const voiceprint = await this.extractVoiceprint(audioBuffer);

		const profile: SpeakerProfile = {
			id: speakerId,
			name,
			voiceprint,
			confidence: 1.0,
			lastSeen: new Date(),
		};

		this.profiles.set(speakerId, profile);
		return speakerId;
	}

	async identifySpeaker(
		audioBuffer: ArrayBuffer
	): Promise<SpeakerIdentificationResult> {
		const currentVoiceprint = await this.extractVoiceprint(audioBuffer);
		let bestMatch: { id: string; confidence: number } | null = null;

		// Compare with existing profiles
		const profileIds = Array.from(this.profiles.keys());
		for (const id of profileIds) {
			const profile = this.profiles.get(id)!;
			const similarity = this.compareVoiceprints(
				currentVoiceprint,
				profile.voiceprint
			);

			if (
				similarity > 0.7 &&
				(!bestMatch || similarity > bestMatch.confidence)
			) {
				bestMatch = { id, confidence: similarity };
			}
		}

		if (bestMatch) {
			const profile = this.profiles.get(bestMatch.id)!;
			profile.lastSeen = new Date();

			return {
				speakerId: bestMatch.id,
				speakerName: profile.name,
				confidence: bestMatch.confidence,
				isNewSpeaker: false,
			};
		}

		return {
			confidence: 0,
			isNewSpeaker: true,
		};
	}

	private async extractVoiceprint(audioBuffer: ArrayBuffer): Promise<string> {
		// Simplified voice feature extraction
		// In a real implementation, you'd use more sophisticated audio analysis
		const audioData = new Float32Array(audioBuffer);

		// Extract basic features: pitch, formants, spectral characteristics
		const features = {
			// Fundamental frequency (pitch)
			pitch: this.extractPitch(audioData),
			// Spectral centroid
			spectralCentroid: this.extractSpectralCentroid(audioData),
			// MFCC-like features (simplified)
			mfcc: this.extractMFCC(audioData),
			// Energy distribution
			energy: this.extractEnergyDistribution(audioData),
		};

		// Convert features to a comparable string representation
		return btoa(JSON.stringify(features));
	}

	private extractPitch(audioData: Float32Array): number {
		// Simplified pitch detection using autocorrelation
		const length = audioData.length;
		const autocorrelation = new Array(length).fill(0);

		for (let lag = 0; lag < length; lag++) {
			for (let i = 0; i < length - lag; i++) {
				autocorrelation[lag] += audioData[i] * audioData[i + lag];
			}
		}

		// Find the first peak after the initial peak
		let maxCorr = 0;
		let bestLag = 0;

		for (let lag = 20; lag < length / 2; lag++) {
			if (autocorrelation[lag] > maxCorr) {
				maxCorr = autocorrelation[lag];
				bestLag = lag;
			}
		}

		return bestLag > 0 ? 44100 / bestLag : 0; // Assuming 44.1kHz sample rate
	}

	private extractSpectralCentroid(audioData: Float32Array): number {
		const fftSize = 1024;
		const fft = this.performFFT(audioData.slice(0, fftSize));

		let weightedSum = 0;
		let magnitudeSum = 0;

		for (let i = 0; i < fft.length / 2; i++) {
			const magnitude = Math.sqrt(fft[i * 2] ** 2 + fft[i * 2 + 1] ** 2);
			weightedSum += i * magnitude;
			magnitudeSum += magnitude;
		}

		return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
	}

	private extractMFCC(audioData: Float32Array): number[] {
		// Simplified MFCC extraction (normally requires mel filterbank)
		const fftSize = 1024;
		const fft = this.performFFT(audioData.slice(0, fftSize));
		const mfcc: number[] = [];

		// Extract 13 MFCC coefficients (simplified)
		for (let i = 0; i < 13; i++) {
			let sum = 0;
			const start = Math.floor((i * fft.length) / 26);
			const end = Math.floor(((i + 1) * fft.length) / 26);

			for (let j = start; j < end; j += 2) {
				sum += Math.sqrt(fft[j] ** 2 + fft[j + 1] ** 2);
			}

			mfcc.push(Math.log(sum + 1e-10));
		}

		return mfcc;
	}

	private extractEnergyDistribution(audioData: Float32Array): number[] {
		const bands = 8;
		const energy: number[] = new Array(bands).fill(0);
		const samplesPerBand = Math.floor(audioData.length / bands);

		for (let band = 0; band < bands; band++) {
			const start = band * samplesPerBand;
			const end = Math.min(start + samplesPerBand, audioData.length);

			for (let i = start; i < end; i++) {
				energy[band] += audioData[i] ** 2;
			}

			energy[band] /= end - start;
		}

		return energy;
	}

	private performFFT(audioData: Float32Array): Float32Array {
		// Simplified FFT implementation
		// In production, use a proper FFT library like fft.js
		const N = audioData.length;
		const result = new Float32Array(N * 2);

		for (let k = 0; k < N; k++) {
			let real = 0;
			let imag = 0;

			for (let n = 0; n < N; n++) {
				const angle = (-2 * Math.PI * k * n) / N;
				real += audioData[n] * Math.cos(angle);
				imag += audioData[n] * Math.sin(angle);
			}

			result[k * 2] = real;
			result[k * 2 + 1] = imag;
		}

		return result;
	}

	private compareVoiceprints(voiceprint1: string, voiceprint2: string): number {
		try {
			const features1 = JSON.parse(atob(voiceprint1));
			const features2 = JSON.parse(atob(voiceprint2));

			// Calculate similarity between feature vectors
			let similarity = 0;
			let totalFeatures = 0;

			// Compare pitch
			const pitchSimilarity =
				1 -
				Math.abs(features1.pitch - features2.pitch) /
					Math.max(features1.pitch, features2.pitch, 1);
			similarity += pitchSimilarity;
			totalFeatures += 1;

			// Compare spectral centroid
			const centroidSimilarity =
				1 -
				Math.abs(features1.spectralCentroid - features2.spectralCentroid) /
					Math.max(features1.spectralCentroid, features2.spectralCentroid, 1);
			similarity += centroidSimilarity;
			totalFeatures += 1;

			// Compare MFCC
			const mfccSimilarity = this.calculateVectorSimilarity(
				features1.mfcc,
				features2.mfcc
			);
			similarity += mfccSimilarity;
			totalFeatures += 1;

			// Compare energy distribution
			const energySimilarity = this.calculateVectorSimilarity(
				features1.energy,
				features2.energy
			);
			similarity += energySimilarity;
			totalFeatures += 1;

			return similarity / totalFeatures;
		} catch (error) {
			console.error("Error comparing voiceprints:", error);
			return 0;
		}
	}

	private calculateVectorSimilarity(
		vector1: number[],
		vector2: number[]
	): number {
		if (vector1.length !== vector2.length) return 0;

		let dotProduct = 0;
		let norm1 = 0;
		let norm2 = 0;

		for (let i = 0; i < vector1.length; i++) {
			dotProduct += vector1[i] * vector2[i];
			norm1 += vector1[i] ** 2;
			norm2 += vector2[i] ** 2;
		}

		const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
		return magnitude > 0 ? dotProduct / magnitude : 0;
	}

	getSpeakerProfiles(): SpeakerProfile[] {
		return Array.from(this.profiles.values());
	}

	updateSpeakerName(speakerId: string, newName: string): boolean {
		const profile = this.profiles.get(speakerId);
		if (profile) {
			profile.name = newName;
			return true;
		}
		return false;
	}

	removeSpeaker(speakerId: string): boolean {
		return this.profiles.delete(speakerId);
	}
}

export const speakerIdentification = new SpeakerIdentification();

export function useSpeakerIdentification() {
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const initialize = async () => {
			try {
				const success = await speakerIdentification.initialize();
				if (success) {
					setIsInitialized(true);
				} else {
					setError("Failed to initialize speaker identification");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			}
		};

		initialize();
	}, []);

	const registerSpeaker = async (audioBuffer: ArrayBuffer, name: string) => {
		try {
			setError(null);
			const speakerId = await speakerIdentification.registerSpeaker(
				audioBuffer,
				name
			);
			return speakerId;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to register speaker"
			);
			throw err;
		}
	};

	const identifySpeaker = async (audioBuffer: ArrayBuffer) => {
		try {
			setError(null);
			const result = await speakerIdentification.identifySpeaker(audioBuffer);
			return result;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to identify speaker"
			);
			throw err;
		}
	};

	const getSpeakerProfiles = () => {
		return speakerIdentification.getSpeakerProfiles();
	};

	return {
		isInitialized,
		error,
		registerSpeaker,
		identifySpeaker,
		getSpeakerProfiles,
		updateSpeakerName: speakerIdentification.updateSpeakerName.bind(
			speakerIdentification
		),
		removeSpeaker: speakerIdentification.removeSpeaker.bind(
			speakerIdentification
		),
	};
}
