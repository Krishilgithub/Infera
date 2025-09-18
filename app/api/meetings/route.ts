import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MeetingService } from '@/lib/services/meeting-service';
import { CreateMeetingRequest } from '@/lib/types/meeting';

export async function POST(request: NextRequest) {
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

    const body: CreateMeetingRequest = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Meeting title is required' },
        { status: 400 }
      );
    }

    // Create the meeting
    const meetingService = new MeetingService(supabase);
    const meeting = await meetingService.createMeeting(user.id, body);

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error('Create meeting API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      // Get meeting by code
      const meetingService = new MeetingService(supabase);
      const meeting = await meetingService.getMeetingByCode(code);
      
      if (!meeting) {
        return NextResponse.json(
          { error: 'Meeting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(meeting);
    }

    // Get user's meetings
    const meetingService = new MeetingService(supabase);
    const dashboardData = await meetingService.getDashboardData(user.id);
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Get meetings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
