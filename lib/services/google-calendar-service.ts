import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarService {
  private calendar;

  constructor() {
    const auth = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI
    });

    // Set credentials from environment or user session
    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async createEvent(event: {
    summary: string;
    description: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
    attendees: { email: string }[];
    reminders: {
      useDefault: boolean;
      overrides: {
        method: 'email' | 'popup';
        minutes: number;
      }[];
    };
  }) {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
          ...event,
          conferenceData: {
            createRequest: {
              requestId: String(Date.now()),
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId
      });
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw error;
    }
  }

  async updateEvent(
    eventId: string,
    event: {
      summary?: string;
      description?: string;
      start?: {
        dateTime: string;
        timeZone: string;
      };
      end?: {
        dateTime: string;
        timeZone: string;
      };
      attendees?: { email: string }[];
    }
  ) {
    try {
      const response = await this.calendar.events.patch({
        calendarId: 'primary',
        eventId,
        requestBody: event
      });

      return response.data;
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw error;
    }
  }
}