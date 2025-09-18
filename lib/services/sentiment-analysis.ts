const ASSEMBLY_AI_API_KEY = process.env.ASSEMBLY_AI_API_KEY;
const ASSEMBLY_AI_API_URL = 'https://api.assemblyai.com/v2';

interface SentimentAnalysisResult {
  sentiment_score: number;
  emotion_labels: string[];
}

export async function analyzeSentiment(audioUrl: string): Promise<SentimentAnalysisResult> {
  try {
    // Create transcription
    const response = await fetch(`${ASSEMBLY_AI_API_URL}/transcript`, {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLY_AI_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        sentiment_analysis: true,
        emotion_detection: true,
      }),
    });

    const transcriptData = await response.json();
    const transcriptId = transcriptData.id;

    // Poll for completion
    let result;
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const pollingResponse = await fetch(`${ASSEMBLY_AI_API_URL}/transcript/${transcriptId}`, {
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY!,
        },
      });
      
      result = await pollingResponse.json();
      
      if (result.status === 'completed' || result.status === 'error') break;
    }

    if (result.status === 'error') throw new Error('Transcription failed');

    // Calculate overall sentiment score and collect emotion labels
    const sentimentScore = result.sentiment_analysis_results.reduce(
      (acc: number, curr: any) => acc + curr.sentiment_score,
      0
    ) / result.sentiment_analysis_results.length;

    const emotions = new Set<string>();
    result.emotion_detection_results.forEach((detection: any) => {
      emotions.add(detection.emotion);
    });

    return {
      sentiment_score: sentimentScore,
      emotion_labels: Array.from(emotions),
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
}

export async function analyzeSpeakerSentiment(
  audioUrl: string,
  speakerId: string
): Promise<SentimentAnalysisResult> {
  try {
    const response = await fetch(`${ASSEMBLY_AI_API_URL}/transcript`, {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLY_AI_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        sentiment_analysis: true,
        emotion_detection: true,
        speaker_labels: true,
      }),
    });

    const transcriptData = await response.json();
    const transcriptId = transcriptData.id;

    // Poll for completion
    let result;
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const pollingResponse = await fetch(`${ASSEMBLY_AI_API_URL}/transcript/${transcriptId}`, {
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY!,
        },
      });
      
      result = await pollingResponse.json();
      
      if (result.status === 'completed' || result.status === 'error') break;
    }

    if (result.status === 'error') throw new Error('Transcription failed');

    // Filter results for specific speaker
    const speakerSegments = result.sentiment_analysis_results.filter(
      (segment: any) => segment.speaker === speakerId
    );

    if (speakerSegments.length === 0) {
      throw new Error('No segments found for specified speaker');
    }

    const sentimentScore = speakerSegments.reduce(
      (acc: number, curr: any) => acc + curr.sentiment_score,
      0
    ) / speakerSegments.length;

    const speakerEmotions = new Set<string>();
    result.emotion_detection_results
      .filter((detection: any) => detection.speaker === speakerId)
      .forEach((detection: any) => {
        speakerEmotions.add(detection.emotion);
      });

    return {
      sentiment_score: sentimentScore,
      emotion_labels: Array.from(speakerEmotions),
    };
  } catch (error) {
    console.error('Error analyzing speaker sentiment:', error);
    throw error;
  }
}