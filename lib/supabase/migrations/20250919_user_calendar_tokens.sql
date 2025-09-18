-- Table for storing Google Calendar OAuth tokens
CREATE TABLE IF NOT EXISTS user_calendar_tokens (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    scope TEXT,
    token_type TEXT,
    expiry_date BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_user_calendar_tokens_user_id ON user_calendar_tokens(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_calendar_tokens_updated_at
    BEFORE UPDATE ON user_calendar_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();