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

  async sendMeetingInvitation(
    meeting: Meeting,
    invitation: MeetingInvitation,
    inviterName: string
  ): Promise<void> {
    try {
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Meeting Invitation</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .meeting-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              margin: 10px 5px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              text-align: center;
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
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              color: #6c757d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎥 Meeting Invitation</h1>
            <p>You're invited to join a meeting</p>
          </div>
          
          <div class="content">
            <p>Hello!</p>
            
            <p><strong>${inviterName}</strong> has invited you to join a meeting on Infera.</p>
            
            <div class="meeting-details">
              <h3>📋 Meeting Details</h3>
              <p><strong>Title:</strong> ${meeting.title}</p>
              ${meeting.description ? `<p><strong>Description:</strong> ${meeting.description}</p>` : ''}
              <p><strong>Scheduled:</strong> ${scheduledDate}</p>
              <p><strong>Meeting Code:</strong> <code>${meeting.meeting_code}</code></p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${acceptUrl}" class="button btn-accept">✅ Accept Invitation</a>
              <a href="${declineUrl}" class="button btn-decline">❌ Decline</a>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetingUrl}" class="button btn-join">🚀 Join Meeting Directly</a>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4>📱 How to Join:</h4>
              <ol>
                <li>Click "Join Meeting Directly" above, or</li>
                <li>Go to <a href="${process.env.NEXT_PUBLIC_BASE_URL}">${process.env.NEXT_PUBLIC_BASE_URL}</a></li>
                <li>Enter meeting code: <strong>${meeting.meeting_code}</strong></li>
                <li>Click "Join Meeting"</li>
              </ol>
            </div>
            
            <p>If you have any issues joining the meeting, please contact ${inviterName} directly.</p>
          </div>
          
          <div class="footer">
            <p>This invitation was sent by Infera Meeting Platform</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </body>
        </html>
      `;

      const textContent = `
        Meeting Invitation
        
        ${inviterName} has invited you to join a meeting on Infera.
        
        Meeting Details:
        - Title: ${meeting.title}
        ${meeting.description ? `- Description: ${meeting.description}` : ''}
        - Scheduled: ${scheduledDate}
        - Meeting Code: ${meeting.meeting_code}
        
        To join the meeting:
        1. Go to ${process.env.NEXT_PUBLIC_BASE_URL}
        2. Enter meeting code: ${meeting.meeting_code}
        3. Click "Join Meeting"
        
        Or click this link to join directly: ${meetingUrl}
        
        Accept invitation: ${acceptUrl}
        Decline invitation: ${declineUrl}
      `;

      await this.transporter.sendMail({
        from: `"Infera Meetings" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: invitation.email,
        subject: `Meeting Invitation: ${meeting.title}`,
        text: textContent,
        html: htmlContent,
      });

      console.log(`Meeting invitation sent to ${invitation.email}`);
    } catch (error) {
      console.error('Error sending meeting invitation:', error);
      throw error;
    }
  }

  async sendMeetingReminder(
    meeting: Meeting,
    recipientEmail: string,
    recipientName: string
  ): Promise<void> {
    try {
      const meetingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.meeting_code}`;
      const scheduledTime = new Date(meeting.scheduled_at!);
      const timeUntilMeeting = Math.round((scheduledTime.getTime() - Date.now()) / (1000 * 60));

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Meeting Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Meeting Reminder</h1>
            </div>
            <div class="content">
              <p>Hello ${recipientName},</p>
              <p>This is a reminder that your meeting "<strong>${meeting.title}</strong>" is starting in ${timeUntilMeeting} minutes.</p>
              <p><strong>Scheduled Time:</strong> ${scheduledTime.toLocaleString()}</p>
              <p><strong>Meeting Code:</strong> ${meeting.meeting_code}</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${meetingUrl}" class="button">Join Meeting Now</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"Infera Meetings" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `Meeting Reminder: ${meeting.title} starts in ${timeUntilMeeting} minutes`,
        html: htmlContent,
      });

      console.log(`Meeting reminder sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending meeting reminder:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
