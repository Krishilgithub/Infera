import { Meeting, MeetingSettings, CreateMeetingRequest, MeetingDashboard, MeetingInvitation } from '@/lib/types/meeting';
import { NotificationService } from '@/lib/services/notification-service';

export class MeetingService {
  // Injected Supabase client (server-side)
  constructor(private supabase: any) {}

  async getDashboardData(userId: string): Promise<MeetingDashboard> {
    try {
      // Helper to dedupe by id
      const dedupeById = (arr: any[]) => {
        const map = new Map<string, any>();
        for (const item of arr || []) map.set(item.id, item);
        return Array.from(map.values());
      };

      const nowIso = new Date().toISOString();

      // Pre-fetch meeting IDs where the user is a participant to avoid cross-table joins
      const { data: participantRows, error: participantRowsErr } = await this.supabase
        .from('participants')
        .select('meeting_id')
        .eq('user_id', userId);
      if (participantRowsErr) throw participantRowsErr;
      const joinedMeetingIds: string[] = Array.from(
        new Set(
          (participantRows || [])
            .map((r: any) => r.meeting_id)
            .filter(Boolean)
        )
      );

      // Upcoming: meetings created by user
      const { data: upCreated, error: upCreatedErr } = await this.supabase
        .from('meetings')
        .select(`*, meeting_settings(*)`)
        .eq('status', 'scheduled')
        .gte('scheduled_at', nowIso)
        .eq('created_by', userId)
        .order('scheduled_at', { ascending: true });
      if (upCreatedErr) throw upCreatedErr;

      // Upcoming: meetings where user is a participant (filter by IDs to avoid join)
      const { data: upJoined, error: upJoinedErr } = await this.supabase
        .from('meetings')
        .select('*, meeting_settings(*)')
        .eq('status', 'scheduled')
        .gte('scheduled_at', nowIso)
        .in('id', joinedMeetingIds.length ? joinedMeetingIds : ['00000000-0000-0000-0000-000000000000'])
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

      // Ongoing: participant (filter by IDs to avoid join)
      const { data: onJoined, error: onJoinedErr } = await this.supabase
        .from('meetings')
        .select('*, meeting_settings(*)')
        .eq('status', 'ongoing')
        .in('id', joinedMeetingIds.length ? joinedMeetingIds : ['00000000-0000-0000-0000-000000000000'])
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
        .select('*, meeting_settings(*)')
        .eq('status', 'completed')
        .gte('ended_at', thirtyIso)
        .in('id', joinedMeetingIds.length ? joinedMeetingIds : ['00000000-0000-0000-0000-000000000000'])
        .order('ended_at', { ascending: false });
      if (coJoinedErr) throw coJoinedErr;
      const completed = dedupeById([...(coCreated || []), ...(coJoined || [])]);

      // Calculate statistics
      const totalMeetings = (upcoming?.length || 0) + (ongoing?.length || 0) + (completed?.length || 0);
      const totalParticipants = 0; // optional: compute via a separate aggregate if needed
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
      const notificationService = new NotificationService(this.supabase);
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
          // Ensure creator is marked present
          const { data: existingParticipant } = await this.supabase
            .from('participants')
            .select('id')
            .eq('meeting_id', existingOngoing.id)
            .eq('user_id', userId)
            .single();

          if (existingParticipant) {
            await this.supabase
              .from('participants')
              .update({ is_present: true, joined_at: new Date().toISOString() })
              .eq('meeting_id', existingOngoing.id)
              .eq('user_id', userId);
          } else {
            await this.supabase
              .from('participants')
              .insert({ meeting_id: existingOngoing.id, user_id: userId, role: 'host', is_present: true, joined_at: new Date().toISOString() });
          }

          return existingOngoing as unknown as Meeting;
        }
      }

      // Create the meeting
      const { data: meeting, error: meetingError } = await this.supabase
        .from('meetings')
        .insert({
          title: meetingData.title,
          description: meetingData.description,
          created_by: userId,
          scheduled_at: meetingData.scheduled_at,
          status: meetingData.scheduled_at ? 'scheduled' : 'ongoing',
          max_participants: meetingData.max_participants || 100,
          is_recurring: meetingData.is_recurring || false,
          recurrence_pattern: meetingData.recurrence_pattern,
          timezone: meetingData.timezone || 'UTC',
          started_at: !meetingData.scheduled_at ? new Date().toISOString() : null
        })
        .select()
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

      // Add creator as host participant
      const { error: participantError } = await this.supabase
        .from('participants')
        .insert({
          meeting_id: meeting.id,
          user_id: userId,
          role: 'host',
          is_present: !meetingData.scheduled_at // Present if starting immediately
        });

      if (participantError) throw participantError;

      // Send invitations if provided
      if (meetingData.invitations && meetingData.invitations.length > 0) {
        await this.sendInvitations(meeting.id, meetingData.invitations, userId);
      }

      // Schedule reminder notifications if scheduled meeting
      if (meeting.status === 'scheduled') {
        await notificationService.createMeetingReminder(meeting);
      }

      return meeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }

  async startMeeting(meetingId: string, userId: string): Promise<Meeting> {
    try {
      const notificationService = new NotificationService(this.supabase);
      const { data: meeting, error } = await this.supabase
        .from('meetings')
        .update({
          status: 'ongoing',
          started_at: new Date().toISOString()
        })
        .eq('id', meetingId)
        .eq('created_by', userId)
        .select()
        .single();

      if (error) throw error;
      if (!meeting) {
        const notFound: any = new Error('Meeting not found or not owned by user');
        notFound.code = 'PGRST116';
        throw notFound;
      }

      // Update participant status
      await this.supabase
        .from('participants')
        .update({ is_present: true, joined_at: new Date().toISOString() })
        .eq('meeting_id', meetingId)
        .eq('user_id', userId);

      // Notify non-present participants the meeting started
      await notificationService.sendMeetingStartedNotifications(meeting);

      return meeting;
    } catch (error) {
      console.error('Error starting meeting:', error);
      throw error;
    }
  }

  async endMeeting(meetingId: string, userId: string): Promise<Meeting> {
    try {
      const notificationService = new NotificationService(this.supabase);
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
      if (!meeting) {
        const notFound: any = new Error('Meeting not found or not owned by user');
        notFound.code = 'PGRST116';
        throw notFound;
      }

      // Update all participants as left
      await this.supabase
        .from('participants')
        .update({ is_present: false, left_at: now })
        .eq('meeting_id', meetingId);

      // Notify participants that meeting ended
      await notificationService.sendMeetingEndedNotifications(meeting);

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
      const { data: existingParticipant, error: existingErr } = await this.supabase
        .from('participants')
        .select('id')
        .eq('meeting_id', meetingId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingErr && existingErr.code && existingErr.code !== 'PGRST116') {
        // Real error other than "no rows"; bubble up
        throw existingErr;
      }

      if (existingParticipant) {
        // Update existing participant
        await this.supabase
          .from('participants')
          .update({
            is_present: true,
            joined_at: new Date().toISOString()
          })
          .eq('meeting_id', meetingId)
          .eq('user_id', userId);
      } else {
        // Add new participant
        await this.supabase
          .from('participants')
          .insert({
            meeting_id: meetingId,
            user_id: userId,
            role: 'attendee',
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
        .from('participants')
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
          participants(*)
        `)
        .eq('meeting_code', code)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return meeting;
    } catch (error) {
      console.error('Error getting meeting by code:', error);
      throw error;
    }
  }

  private async sendInvitations(meetingId: string, emails: string[], invitedBy: string): Promise<void> {
    try {
      const invitations = emails.map(email => ({
        meeting_id: meetingId,
        email,
        invited_by: invitedBy,
        status: 'pending' as const,
        token: this.generateInvitationToken(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }));

      const { error } = await this.supabase
        .from('meeting_invitations')
        .insert(invitations);

      if (error) throw error;

      // TODO: Send actual emails using your email service
      // For now, we'll just log the invitations
      console.log('Invitations created:', invitations);
    } catch (error) {
      console.error('Error sending invitations:', error);
      throw error;
    }
  }

  private generateInvitationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// Intentionally no default instance export; construct with a Supabase client where needed
