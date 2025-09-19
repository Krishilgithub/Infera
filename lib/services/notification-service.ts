import { EmailService } from './email-service';
import { GoogleCalendarService } from './google-calendar-service';
import { Meeting } from '@/lib/types/meeting';
import { SupabaseClient } from '@supabase/supabase-js';

export class NotificationService {
  private emailService: EmailService;
  private googleCalendarService: GoogleCalendarService;

  constructor(private supabase: SupabaseClient) {
    this.emailService = new EmailService();
    this.googleCalendarService = new GoogleCalendarService();
  }

  async scheduleNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    meetingId?: string,
    actionItemId?: string,
    scheduledFor?: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          meeting_id: meetingId,
          action_item_id: actionItemId,
          scheduled_for: scheduledFor,
          priority,
          status: 'pending'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async sendMeetingInvitation(data: {
    meetingId: string;
    title: string;
    scheduledAt?: string;
    recipientEmail: string;
    hostName: string;
  }): Promise<void> {
    try {
      // Get meeting details
      const { data: meeting, error: meetingError } = await this.supabase
        .from('meetings')
        .select('*')
        .eq('id', data.meetingId)
        .single();

      if (meetingError) throw meetingError;

      // Create invitation record
      const { data: invitation, error: inviteError } = await this.supabase
        .from('meeting_invitations')
        .insert({
          meeting_id: data.meetingId,
          email: data.recipientEmail,
          token: Math.random().toString(36).substring(2),
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days expiry
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // Send invitation email
      await this.emailService.sendMeetingInvitation({
        meeting,
        invitation,
        recipientEmail: data.recipientEmail,
        hostName: data.hostName
      });
    } catch (error) {
      console.error('Error sending meeting invitation:', error);
      throw error;
    }
  }

  async createMeetingReminder(meeting: Meeting): Promise<void> {
    if (!meeting.scheduled_at) return;

    const scheduledTime = new Date(meeting.scheduled_at);
    const reminderTime = new Date(scheduledTime.getTime() - 60 * 60 * 1000); // 1 hour before

    // Only schedule if the reminder time is in the future
    if (reminderTime > new Date()) {
      try {
        // Get all participants for this meeting
        const { data: participants, error } = await this.supabase
          .from('participants')
          .select(`
            user_id
          `)
          .eq('meeting_id', meeting.id);

      if (error) throw error;
      if (!participants || !Array.isArray(participants)) return;

      const meetingTime = new Date(meeting.scheduled_at);
      const reminderTime = new Date(meetingTime.getTime() - 60 * 60 * 1000); // 1 hour before

      // Create calendar event if enabled
      if (process.env.GOOGLE_CALENDAR_ENABLED === 'true') {
        try {
          const eventDetails = {
            summary: meeting.title,
            description: meeting.description || '',
            start: {
              dateTime: meeting.scheduled_at,
              timeZone: meeting.timezone
            },
            end: {
              dateTime: new Date(new Date(meeting.scheduled_at).getTime() + meeting.duration_minutes * 60000).toISOString(),
              timeZone: meeting.timezone
            },
            attendees: participants.map(p => ({ email: p.email })),
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 60 },
                { method: 'popup', minutes: 10 }
              ]
            }
          };

          await this.googleCalendarService.createEvent(eventDetails);
        } catch (calendarError) {
          console.error('Error creating calendar event:', calendarError);
          // Continue with other notifications even if calendar fails
        }
      }

      // Schedule reminders and send confirmations
      const reminderPromises = participants.map(async (participant) => {
        // Schedule reminder notification if meeting is in the future
        if (reminderTime > new Date()) {
          await this.scheduleNotification(
            participant.user_id,
            'meeting_reminder',
            `Reminder: ${meeting.title}`,
            `Your meeting "${meeting.title}" starts in 1 hour.`,
            meeting.id,
            undefined,
            reminderTime.toISOString(),
            'high'
          );
        }

        // Send immediate confirmation email
        await this.emailService.sendMeetingConfirmation({
          to: participant.email,
          meeting,
          joinUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.meeting_code}`
        });
      });

      await Promise.all(reminderPromises);
    } catch (error) {
      console.error('Error creating meeting reminders:', error);
      throw error;
    }
  }

  async sendMeetingStartedNotifications(meeting: Meeting): Promise<void> {
    try {
      // Get all participants for this meeting
      const { data: participants, error } = await this.supabase
        .from('participants')
        .select(`
          user_id
        `)
        .eq('meeting_id', meeting.id)
        .eq('is_present', false);

      if (error) throw error;
      if (!absentParticipants || !Array.isArray(absentParticipants)) return;

      // Notify absent participants
      const notificationPromises = absentParticipants.map(async (participant) => {
        // Send immediate notification
        await this.scheduleNotification(
          participant.user_id,
          'meeting_started',
          'Meeting Started',
          `The meeting "${meeting.title}" has started. Join now!`,
          meeting.id,
          undefined,
          new Date().toISOString(),
          'high'
        );

        // Send email notification
        await this.emailService.sendMeetingStartedNotification({
          to: participant.email,
          meeting,
          joinUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.meeting_code}`
        });
      });

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Error sending meeting started notifications:', error);
    }
  }

  async sendMeetingEndedNotifications(meeting: Meeting): Promise<void> {
    try {
      // Get all participants for this meeting
      const { data: participants, error } = await this.supabase
        .from('participants')
        .select(`
          user_id
        `)
        .eq('meeting_id', meeting.id);

      if (error) throw error;

      // Send notifications to all participants
      const notificationPromises = participants?.map(async (participant: any) => {
        await this.scheduleNotification(
          participant.user_id,
          'meeting_ended',
          `Meeting Ended: ${meeting.title}`,
          `The meeting "${meeting.title}" has ended. Duration: ${meeting.duration_minutes} minutes.`,
          meeting.id,
          undefined,
          new Date().toISOString(),
          'medium'
        );
      }) || [];

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Error sending meeting ended notifications:', error);
    }
  }

  async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // Get all notifications scheduled for now or earlier that haven't been sent
      const { data: notifications, error } = await this.supabase
        .from('notifications')
        .select(`
          *,
          meetings(*)
        `)
        .lte('scheduled_for', now)
        .eq('is_read', false)
        .is('sent_at', null);

      if (error) throw error;

      // Process each notification: mark as sent (email delivery can be handled by a separate worker if needed)
      const processingPromises = notifications?.map(async (notification: any) => {
        try {
          await this.supabase
            .from('notifications')
            .update({ sent_at: new Date().toISOString() })
            .eq('id', notification.id);
        } catch (error) {
          console.error(`Error processing notification ${notification.id}:`, error);
        }
      }) || [];

      await Promise.allSettled(processingPromises);
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }

  async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data: notifications, error } = await this.supabase
        .from('notifications')
        .select(`
          *,
          meetings(title, meeting_code),
          action_items(description)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return notifications || [];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}