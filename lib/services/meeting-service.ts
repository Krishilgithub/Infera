import { Meeting, MeetingSettings, CreateMeetingRequest, MeetingDashboard } from '@/lib/types/meeting';
import { NotificationService } from '@/lib/services/notification-service';
import { SupabaseClient } from '@supabase/supabase-js';

export class MeetingService {
  constructor(private supabase: SupabaseClient) {}

  public async getUserEmail(userId: string): Promise<string | null> {
    try {
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      return profile?.email || null;
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  }

  private async getUserName(userId: string): Promise<string> {
    try {
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      return profile?.full_name || 'Meeting Host';
    } catch (error) {
      console.error('Error getting user name:', error);
      return 'Meeting Host';
    }
  }

  async getDashboardData(userId: string): Promise<MeetingDashboard> {
    try {
      // Helper to dedupe by id
      const dedupeById = (arr: any[]) => {
        const map = new Map<string, any>();
        for (const item of arr || []) map.set(item.id, item);
        return Array.from(map.values());
      };

      const nowIso = new Date().toISOString();

      // Upcoming: meetings created by user
      const { data: upCreated, error: upCreatedErr } = await this.supabase
        .from('meetings')
        .select(`*, meeting_settings(*)`)
        .eq('status', 'scheduled')
        .gte('scheduled_at', nowIso)
        .eq('created_by', userId)
        .order('scheduled_at', { ascending: true });
      if (upCreatedErr) throw upCreatedErr;

      // Upcoming: meetings where user is a participant
      const { data: upJoined, error: upJoinedErr } = await this.supabase
        .from('meetings')
        .select('*, meeting_settings(*), meeting_participants!inner(user_id)')
        .eq('status', 'scheduled')
        .gte('scheduled_at', nowIso)
        .eq('meeting_participants.user_id', userId)
        .order('scheduled_at', { ascending: true });
      if (upJoinedErr) throw upJoinedErr;
      const upcoming = dedupeById([...(upCreated || []), ...(upJoined || [])]);

      // Ongoing: created by user
      const { data: onCreated, error: onCreatedErr } = await this.supabase
        .from('meetings')
        .select('*, meeting_settings(*)')
        .eq('status', 'ongoing')
        .eq('created_by', userId)
        .order('started_at', { ascending: false });
      if (onCreatedErr) throw onCreatedErr;

      // Ongoing: participant
      const { data: onJoined, error: onJoinedErr } = await this.supabase
        .from('meetings')
        .select('*, meeting_settings(*), meeting_participants!inner(user_id)')
        .eq('status', 'ongoing')
        .eq('meeting_participants.user_id', userId)
        .order('started_at', { ascending: false });
      if (onJoinedErr) throw onJoinedErr;
      const ongoing = dedupeById([...(onCreated || []), ...(onJoined || [])]);

      // Completed in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyIso = thirtyDaysAgo.toISOString();

      const { data: coCreated, error: coCreatedErr } = await this.supabase
        .from('meetings')
        .select('*, meeting_settings(*)')
        .eq('status', 'completed')
        .gte('ended_at', thirtyIso)
        .eq('created_by', userId)
        .order('ended_at', { ascending: false });
      if (coCreatedErr) throw coCreatedErr;

      const { data: coJoined, error: coJoinedErr } = await this.supabase
        .from('meetings')
        .select('*, meeting_settings(*), meeting_participants!inner(user_id)')
        .eq('status', 'completed')
        .gte('ended_at', thirtyIso)
        .eq('meeting_participants.user_id', userId)
        .order('ended_at', { ascending: false });
      if (coJoinedErr) throw coJoinedErr;
      const completed = dedupeById([...(coCreated || []), ...(coJoined || [])]);

      // Calculate statistics
      const totalMeetings = (upcoming?.length || 0) + (ongoing?.length || 0) + (completed?.length || 0);
      const totalParticipants = 0; // We can add this calculation if needed
      const totalDuration = (completed as any[])?.reduce((sum: number, meeting: any) => sum + (meeting.duration_minutes || 0), 0) || 0;

      return {
        upcoming: upcoming || [],
        ongoing: ongoing || [],
        completed: completed || [],
        total_meetings: totalMeetings,
        total_participants: totalParticipants,
        total_duration: totalDuration
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async createMeeting(userId: string, meetingData: CreateMeetingRequest): Promise<Meeting> {
    try {
      // If instant meeting (no schedule), ensure only one ongoing meeting per creator
      if (!meetingData.scheduled_at) {
        const { data: existingOngoing } = await this.supabase
          .from('meetings')
          .select('*')
          .eq('created_by', userId)
          .eq('status', 'ongoing')
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        if (existingOngoing) {
          // Update host status if needed
          const { data: existingParticipant } = await this.supabase
            .from('meeting_participants')
            .select('id')
            .eq('meeting_id', existingOngoing.id)
            .eq('user_id', userId)
            .single();

          if (existingParticipant) {
            await this.supabase
              .from('meeting_participants')
              .update({ is_present: true, joined_at: new Date().toISOString() })
              .eq('meeting_id', existingOngoing.id)
              .eq('user_id', userId);
          } else {
            await this.supabase
              .from('meeting_participants')
              .insert({
                meeting_id: existingOngoing.id,
                user_id: userId,
                role: 'host',
                is_present: true,
                joined_at: new Date().toISOString()
              });
          }

          return existingOngoing as Meeting;
        }
      }

      // Generate a unique meeting code
      const meetingCode = Math.random().toString(36).substring(2, 15);

      // Create the meeting
      const { data: meeting, error: meetingError } = await this.supabase
        .from('meetings')
        .insert({
          title: meetingData.title,
          description: meetingData.description,
          created_by: userId,
          meeting_code: meetingCode,
          scheduled_at: meetingData.scheduled_at,
          status: meetingData.scheduled_at ? 'scheduled' : 'ongoing',
          max_participants: meetingData.max_participants || 100,
          started_at: !meetingData.scheduled_at ? new Date().toISOString() : null,
          duration_minutes: meetingData.duration_minutes || 60,
          timezone: meetingData.timezone || 'UTC',
          is_recurring: meetingData.is_recurring || false,
          recurrence_pattern: meetingData.recurrence_pattern
        })
        .select('*')
        .single();

      if (meetingError) throw meetingError;

      // Create meeting settings
      const defaultSettings = {
        meeting_id: meeting.id,
        allow_recording: true,
        allow_transcript: true,
        allow_screen_share: true,
        allow_chat: true,
        allow_reactions: true,
        allow_raise_hand: true,
        auto_record: false,
        allow_anonymous_join: false,
        require_approval: false,
        waiting_room: false,
        auto_mute_participants: false,
        ...meetingData.settings
      };

      const { error: settingsError } = await this.supabase
        .from('meeting_settings')
        .insert(defaultSettings);

      if (settingsError) throw settingsError;

      // Get user info for notifications
      const { data: userProfile } = await this.supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      // Add participants and send invitations
      try {
        // Add the host as a participant
        const { error: hostError } = await this.supabase
          .from('meeting_participants')
          .insert([{
            meeting_id: meeting.id,
            user_id: userId,
            email: userProfile?.email,
            role: 'host',
            status: 'accepted',
            is_present: !meetingData.scheduled_at
          }]);

        if (hostError) throw hostError;

        // Add other participants if they exist
        if (meetingData.participants?.length > 0) {
          const { error: participantsError } = await this.supabase
            .from('meeting_participants')
            .insert(
              meetingData.participants.map(email => ({
                meeting_id: meeting.id,
                email: email,
                role: 'participant',
                status: 'pending',
                is_present: false
              }))
            );

          if (participantsError) throw participantsError;

          // Initialize notification service
          const notificationService = new NotificationService(this.supabase);

          // Send invitations and set up notifications
          await Promise.all([
            // Send email invitations
            ...meetingData.participants.map(email => 
              notificationService.sendMeetingInvitation({
                meetingId: meeting.id,
                title: meeting.title,
                scheduledAt: meeting.scheduled_at,
                recipientEmail: email,
                hostName: userProfile?.full_name || 'Meeting Host'
              })
            ),
            // Set up reminder notifications if it's a scheduled meeting
            meeting.scheduled_at ? notificationService.createMeetingReminder(meeting) : null
          ].filter(Boolean));
        }

        return meeting;
      } catch (error) {
        console.error('Error in meeting setup:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }

  async startMeeting(meetingId: string, userId: string): Promise<Meeting> {
    try {
      const notificationService = new NotificationService(this.supabase);

      // Get meeting with settings
      const { data: meeting, error } = await this.supabase
        .from('meetings')
        .update({
          status: 'ongoing',
          started_at: new Date().toISOString()
        })
        .eq('id', meetingId)
        .eq('created_by', userId)
        .select('*, meeting_settings(*)')
        .single();

      if (error) throw error;

      // Mark host as present
      await this.supabase
        .from('meeting_participants')
        .update({ 
          is_present: true, 
          joined_at: new Date().toISOString(),
          status: 'accepted'
        })
        .eq('meeting_id', meetingId)
        .eq('user_id', userId);

      // Notify absent participants
      await notificationService.sendMeetingStartedNotifications(meeting);

      return meeting;
    } catch (error) {
      console.error('Error starting meeting:', error);
      throw error;
    }
  }

  async endMeeting(meetingId: string, userId: string): Promise<Meeting> {
    try {
      const now = new Date().toISOString();
      
      // Get meeting start time to calculate duration
      const { data: currentMeeting } = await this.supabase
        .from('meetings')
        .select('started_at')
        .eq('id', meetingId)
        .single();

      let durationMinutes = 0;
      if (currentMeeting?.started_at) {
        const startTime = new Date(currentMeeting.started_at);
        const endTime = new Date(now);
        durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      }

      const { data: meeting, error } = await this.supabase
        .from('meetings')
        .update({
          status: 'completed',
          ended_at: now,
          duration_minutes: durationMinutes
        })
        .eq('id', meetingId)
        .eq('created_by', userId)
        .select()
        .single();

      if (error) throw error;

      // Update all participants as left
      await this.supabase
        .from('meeting_participants')
        .update({ is_present: false, left_at: now })
        .eq('meeting_id', meetingId);

      // Send summary notifications if needed
      // You can add meeting summary notifications here

      return meeting;
    } catch (error) {
      console.error('Error ending meeting:', error);
      throw error;
    }
  }

  async deleteMeeting(meetingId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId)
        .eq('created_by', userId)
        .eq('status', 'completed');

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  }

  async joinMeeting(meetingId: string, userId: string): Promise<void> {
    try {
      // Check if user is already a participant
      const { data: existingParticipant } = await this.supabase
        .from('meeting_participants')
        .select('id')
        .eq('meeting_id', meetingId)
        .eq('user_id', userId)
        .single();

      if (existingParticipant) {
        // Update existing participant
        await this.supabase
          .from('meeting_participants')
          .update({
            is_present: true,
            joined_at: new Date().toISOString()
          })
          .eq('meeting_id', meetingId)
          .eq('user_id', userId);
      } else {
        // Add new participant
        await this.supabase
          .from('meeting_participants')
          .insert({
            meeting_id: meetingId,
            user_id: userId,
            role: 'participant',
            status: 'accepted',
            is_present: true,
            joined_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      throw error;
    }
  }

  async leaveMeeting(meetingId: string, userId: string): Promise<void> {
    try {
      await this.supabase
        .from('meeting_participants')
        .update({
          is_present: false,
          left_at: new Date().toISOString()
        })
        .eq('meeting_id', meetingId)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error leaving meeting:', error);
      throw error;
    }
  }

  async getMeetingByCode(code: string): Promise<Meeting | null> {
    try {
      const { data: meeting, error } = await this.supabase
        .from('meetings')
        .select(`
          *,
          meeting_settings(*),
          meeting_participants(*)
        `)
        .eq('meeting_code', code)
        .single();

      if (error) {
        console.error('Error fetching meeting by code:', error);
        return null;
      }

      return meeting;
    } catch (error) {
      console.error('Error fetching meeting:', error);
      return null;
    }
  }

  async getMeetingById(id: string): Promise<Meeting | null> {
    try {
      const { data: meeting, error } = await this.supabase
        .from('meetings')
        .select(`
          *,
          meeting_settings(*),
          meeting_participants(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching meeting by id:', error);
        return null;
      }

      return meeting;
    } catch (error) {
      console.error('Error fetching meeting:', error);
      return null;
    }
  }
}