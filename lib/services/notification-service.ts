import { emailService } from './email-service';
import { Meeting } from '@/lib/types/meeting';

export class NotificationService {
  constructor(private supabase: any) {}

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
          priority
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error scheduling notification:', error);
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
            user_id,
            user_email
          `)
          .eq('meeting_id', meeting.id);

        if (error) throw error;

        // Schedule notifications for all participants
        const notificationPromises = participants?.map(async (participant: any) => {
          await this.scheduleNotification(
            participant.user_id,
            'meeting_reminder',
            `Meeting Reminder: ${meeting.title}`,
            `Your meeting "${meeting.title}" starts in 1 hour at ${scheduledTime.toLocaleString()}`,
            meeting.id,
            undefined,
            reminderTime.toISOString(),
            'high'
          );
        }) || [];

        await Promise.all(notificationPromises);
      } catch (error) {
        console.error('Error creating meeting reminders:', error);
      }
    }
  }

  async sendMeetingStartedNotifications(meeting: Meeting): Promise<void> {
    try {
      // Get all participants for this meeting
      const { data: participants, error } = await this.supabase
        .from('participants')
        .select(`
          user_id,
          user_email
        `)
        .eq('meeting_id', meeting.id)
        .eq('is_present', false); // Only notify those not present

      if (error) throw error;

      // Send notifications to absent participants
      const notificationPromises = participants?.map(async (participant: any) => {
        await this.scheduleNotification(
          participant.user_id,
          'meeting_started',
          `Meeting Started: ${meeting.title}`,
          `The meeting "${meeting.title}" has started. Join now with code: ${meeting.meeting_code}`,
          meeting.id,
          undefined,
          new Date().toISOString(),
          'high'
        );
      }) || [];

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
          user_id,
          user_email
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

