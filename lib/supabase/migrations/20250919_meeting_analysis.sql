-- Create meeting_analysis table
CREATE TABLE IF NOT EXISTS meeting_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    overall_sentiment FLOAT CHECK (overall_sentiment >= -1 AND overall_sentiment <= 1),
    key_points TEXT[],
    action_items TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create participant_sentiment table
CREATE TABLE IF NOT EXISTS participant_sentiment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    sentiment_score FLOAT CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    sentiment_timestamps JSONB[], -- Array of {timestamp, score} objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_meeting_analysis_meeting_id ON meeting_analysis(meeting_id);
CREATE INDEX IF NOT EXISTS idx_participant_sentiment_meeting_id ON participant_sentiment(meeting_id);
CREATE INDEX IF NOT EXISTS idx_participant_sentiment_participant ON participant_sentiment(participant_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meeting_analysis_updated_at
    BEFORE UPDATE ON meeting_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();