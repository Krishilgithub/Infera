import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MeetingService } from '@/lib/services/meeting-service';

export async function GET(
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

    // Try meeting owned by user first
    let meetingResp = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_settings(*),
        participants(*),
        meeting_invitations(*)
      `)
      .eq('id', params.id)
      .eq('created_by', user.id)
      .single();

    // If not found as owner, try as participant via inner join
    if (meetingResp.error && meetingResp.error.code === 'PGRST116') {
      meetingResp = await supabase
        .from('meetings')
        .select('*, meeting_settings(*), participants!inner(*), meeting_invitations(*)')
        .eq('id', params.id)
        .eq('participants.user_id', user.id)
        .single();
    }

    if (meetingResp.error) {
      if (meetingResp.error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Meeting not found' },
          { status: 404 }
        );
      }
      throw meetingResp.error;
    }

    return NextResponse.json(meetingResp.data);
  } catch (error) {
    console.error('Get meeting API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const body = await request.json();
    const { action } = body;
    const meetingService = new MeetingService(supabase);

    switch (action) {
      case 'start':
        const startedMeeting = await meetingService.startMeeting(params.id, user.id);
        return NextResponse.json(startedMeeting);

      case 'end':
        const endedMeeting = await meetingService.endMeeting(params.id, user.id);
        return NextResponse.json(endedMeeting);

      case 'join':
        await meetingService.joinMeeting(params.id, user.id);
        return NextResponse.json({ success: true });

      case 'leave':
        await meetingService.leaveMeeting(params.id, user.id);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Update meeting API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const meetingService = new MeetingService(supabase);
    await meetingService.deleteMeeting(params.id, user.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete meeting API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
