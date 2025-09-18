import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface MeetingInviteParams {
  to: string;
  meeting: {
    title: string;
    description?: string;
    meeting_url: string;
    calendarEvent: any;
  };
}

export async function sendMeetingInvite({ to, meeting }: MeetingInviteParams) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Meeting Invitation: ${meeting.title}`,
    html: `
      <h2>You've been invited to a meeting</h2>
      <h3>${meeting.title}</h3>
      ${meeting.description ? `<p>${meeting.description}</p>` : ''}
      <p>Join the meeting: <a href="${meeting.meeting_url}">${meeting.meeting_url}</a></p>
      <p>The meeting has been added to your calendar.</p>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendMeetingReminder({ to, meeting }: MeetingInviteParams) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Reminder: ${meeting.title} starts soon`,
    html: `
      <h2>Meeting Reminder</h2>
      <h3>${meeting.title}</h3>
      ${meeting.description ? `<p>${meeting.description}</p>` : ''}
      <p>Join the meeting: <a href="${meeting.meeting_url}">${meeting.meeting_url}</a></p>
      <p>The meeting will begin shortly.</p>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
}