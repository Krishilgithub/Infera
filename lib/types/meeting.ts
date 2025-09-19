export interface Meeting {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meeting_url?: string;
  meeting_code?: string;
  recording_url?: string;
  duration_minutes: number;
  max_participants: number;
  is_recurring: boolean;
  recurrence_pattern?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingSettings {
  id: string;
  meeting_id: string;
  allow_recording: boolean;
  allow_transcript: boolean;
  allow_screen_share: boolean;
  allow_chat: boolean;
  allow_reactions: boolean;
  allow_raise_hand: boolean;
  auto_record: boolean;
  allow_anonymous_join: boolean;
  require_approval: boolean;
  waiting_room: boolean;
  auto_mute_participants: boolean;
  created_at: string;
}

export interface Participant {
  id: string;
  meeting_id: string;
  user_id: string;
  role: 'host' | 'attendee';
  joined_at?: string;
  left_at?: string;
  is_present: boolean;
  created_at: string;
}

export interface MeetingInvitation {
  id: string;
  meeting_id: string;
  email: string;
  user_id?: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token?: string;
  expires_at?: string;
  created_at: string;
  responded_at?: string;
}

export interface ChatMessage {
  id: string;
  meeting_id: string;
  user_id: string;
  message: string;
  message_type: 'text' | 'file' | 'emoji';
  reply_to?: string;
  created_at: string;
}

export interface MeetingReaction {
  id: string;
  meeting_id: string;
  user_id: string;
  reaction_type: 'thumbs_up' | 'thumbs_down' | 'heart' | 'laugh' | 'surprised' | 'clap';
  created_at: string;
}

export interface RaiseHand {
  id: string;
  meeting_id: string;
  user_id: string;
  is_raised: boolean;
  raised_at: string;
  lowered_at?: string;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  description: string;
  assigned_to?: string;
  assigned_by?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  scheduled_at?: string;
  max_participants?: number;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  timezone?: string;
  participants?: string[];
  settings?: Partial<MeetingSettings>;
  invitations?: string[]; // Array of email addresses
}

export interface MeetingDashboard {
  upcoming: Meeting[];
  ongoing: Meeting[];
  completed: Meeting[];
  total_meetings: number;
  total_participants: number;
  total_duration: number;
}

export interface NotificationPreferences {
  meeting_reminders: boolean;
  meeting_started: boolean;
  meeting_ended: boolean;
  action_items: boolean;
  invitations: boolean;
}
