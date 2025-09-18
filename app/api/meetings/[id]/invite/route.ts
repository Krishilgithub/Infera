import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { emailService } from '@/lib/services/email-service';
import { MeetingInvitation } from '@/lib/types/meeting';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { emails } = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Email addresses are required' },
        { status: 400 }
      );
    }

    // Get meeting details
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', params.id)
      .eq('created_by', user.id)
      .single();

    if (meetingError || !meeting) {
      return NextResponse.json(
        { error: 'Meeting not found or unauthorized' },
        { status: 404 }
      );
    }

    // Use authenticated user's email as inviter name (adjust if you have a profiles table)
    const inviterName = user.email || 'Someone';

    // Create invitations
    const invitations = emails.map((email: string) => ({
      meeting_id: params.id,
      email: email.toLowerCase().trim(),
      invited_by: user.id,
      status: 'pending',
      token: generateInvitationToken(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }));

    const { data: createdInvitations, error: invitationError } = await supabase
      .from('meeting_invitations')
      .insert(invitations)
      .select();

    if (invitationError) {
      throw invitationError;
    }

    // Send email invitations
    const emailPromises = (createdInvitations as MeetingInvitation[]).map(async (invitation: MeetingInvitation) => {
      try {
        await emailService.sendMeetingInvitation(meeting, invitation, inviterName);
      } catch (error) {
        console.error(`Failed to send email to ${invitation.email}:`, error);
      }
    });

    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      success: true,
      invitations: createdInvitations,
      message: `Invitations sent to ${emails.length} recipients`
    });

  } catch (error) {
    console.error('Send invitations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateInvitationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
}
