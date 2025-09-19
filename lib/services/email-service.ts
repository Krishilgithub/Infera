import nodemailer from 'nodemailer';
import { Meeting, MeetingInvitation } from '@/lib/types/meeting';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMeetingInvitation(data: {
    meeting: Meeting;
    invitation: MeetingInvitation;
    recipientEmail: string;
    hostName: string;
  }): Promise<void> {
    try {
      const { meeting, invitation, hostName, recipientEmail } = data;
      const meetingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.meeting_code}`;
      const acceptUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/accept/${invitation.token}`;
      const declineUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/decline/${invitation.token}`;

      const scheduledDate = meeting.scheduled_at 
        ? new Date(meeting.scheduled_at).toLocaleString()
        : 'Starting now';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Meeting Invitation</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 0 10px;
            }
            .btn-accept {
              background-color: #28a745;
              color: white;
            }
            .btn-decline {
              background-color: #dc3545;
              color: white;
            }
            .btn-join {
              background-color: #667eea;
              color: white;
            }
            .meeting-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎥 Meeting Invitation</h1>
            </div>
            
            <p><strong>${hostName}</strong> has invited you to join a meeting on Infera.</p>
            
            <div class="meeting-details">
              <h3>📋 Meeting Details</h3>
              <p><strong>Title:</strong> ${meeting.title}</p>
              ${meeting.description ? `<p><strong>Description:</strong> ${meeting.description}</p>` : ''}
              <p><strong>Scheduled:</strong> ${scheduledDate}</p>
              <p><strong>Duration:</strong> ${meeting.duration_minutes} minutes</p>
              <p><strong>Meeting Code:</strong> <code>${meeting.meeting_code}</code></p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${acceptUrl}" class="button btn-accept">✅ Accept</a>
              <a href="${declineUrl}" class="button btn-decline">❌ Decline</a>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetingUrl}" class="button btn-join">🚀 Join Meeting</a>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
        Meeting Invitation from ${hostName}
        
        You've been invited to join a meeting on Infera.
        
        Meeting Details:
        - Title: ${meeting.title}
        ${meeting.description ? `- Description: ${meeting.description}` : ''}
        - Scheduled: ${scheduledDate}
        - Duration: ${meeting.duration_minutes} minutes
        - Meeting Code: ${meeting.meeting_code}
        
        Join directly: ${meetingUrl}
        Accept invitation: ${acceptUrl}
        Decline invitation: ${declineUrl}
      `;

      await this.transporter.sendMail({
        from: `"Infera Meetings" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `Meeting Invitation: ${meeting.title}`,
        text: textContent,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending meeting invitation:', error);
      throw error;
    }
  }

  async sendMeetingConfirmation(data: {
    to: string;
    meeting: Meeting;
    joinUrl: string;
  }): Promise<void> {
    try {
      const { meeting, to: recipientEmail, joinUrl } = data;
      const scheduledTime = meeting.scheduled_at ? new Date(meeting.scheduled_at) : new Date();

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Meeting Confirmation</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
            }
            .info {
              background-color: #e3f2fd;
              color: #1976d2;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Meeting Confirmed</h1>
            </div>
            
            <p>Your meeting has been confirmed.</p>
            
            <div class="info">
              <h3>📋 Meeting Details</h3>
              <p><strong>Title:</strong> ${meeting.title}</p>
              ${meeting.description ? `<p><strong>Description:</strong> ${meeting.description}</p>` : ''}
              ${meeting.scheduled_at ? 
                `<p><strong>Scheduled Time:</strong> ${scheduledTime.toLocaleString()}</p>
                 <p><strong>Duration:</strong> ${meeting.duration_minutes} minutes</p>` :
                '<p><strong>Status:</strong> Ready to start</p>'}
              <p><strong>Meeting Code:</strong> <code>${meeting.meeting_code}</code></p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${joinUrl}" class="button">Join Meeting</a>
            </div>
            
            ${meeting.scheduled_at ? 
              `<p>You will receive a reminder email 1 hour before the meeting starts.</p>` :
              `<p>You can join the meeting right away!</p>`}
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"Infera Meetings" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: meeting.scheduled_at ? 
          `Meeting Confirmed: ${meeting.title} - ${scheduledTime.toLocaleString()}` :
          `Meeting Ready: ${meeting.title}`,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending meeting confirmation:', error);
      throw error;
    }
  }

  async sendMeetingStartedNotification(data: {
    to: string;
    meeting: Meeting;
    joinUrl: string;
  }): Promise<void> {
    try {
      const { meeting, to: recipientEmail, joinUrl } = data;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Meeting Started</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
              color: white;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #dc3545;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
            }
            .alert {
              background-color: #dc3545;
              color: white;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              text-align: center;
              font-size: 1.2em;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔴 Meeting Started</h1>
            </div>
            
            <div class="alert">
              The meeting "${meeting.title}" has started!
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${joinUrl}" class="button">Join Now</a>
            </div>
            
            <p style="text-align: center; color: #666;">
              Meeting Code: <code>${meeting.meeting_code}</code>
            </p>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"Infera Meetings" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `🔴 Meeting Started: ${meeting.title}`,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending meeting started notification:', error);
      throw error;
    }
  }
}