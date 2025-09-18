export interface MeetingAnalysis {
    id: string;
    meeting_id: string;
    summary: string;
    overall_sentiment: number;
    key_points: string[];
    action_items: string[];
    created_at: string;
    updated_at: string;
}

export interface ParticipantSentiment {
    id: string;
    meeting_id: string;
    participant_id: string;
    sentiment_score: number;
    sentiment_timestamps: SentimentTimestamp[];
    created_at: string;
}

export interface SentimentTimestamp {
    timestamp: string;
    score: number;
}