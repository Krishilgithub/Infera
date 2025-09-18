-- Create tasks table
CREATE TABLE IF NOT EXISTS meeting_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for tasks
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_meeting ON meeting_tasks(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_assignee ON meeting_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_status ON meeting_tasks(status);

-- Add trigger for updated_at
CREATE TRIGGER update_meeting_tasks_updated_at
    BEFORE UPDATE ON meeting_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();