import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { summary, description, start, end, attendees } = body;

        // Get user's calendar tokens
        const { data: tokenData, error: tokenError } = await supabase
            .from('user_calendar_tokens')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
        if (tokenError || !tokenData) {
            return NextResponse.json({ error: 'No calendar tokens found' }, { status: 400 });
        }

        // Set up Google OAuth client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH_REDIRECT_URI
        );
        oauth2Client.setCredentials({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            scope: tokenData.scope,
            token_type: tokenData.token_type,
            expiry_date: tokenData.expiry_date
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const event = {
            summary,
            description,
            start: { dateTime: start },
            end: { dateTime: end },
            attendees: attendees?.map(email => ({ email })) || []
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event
        });

        return NextResponse.json({ success: true, event: response.data });
    } catch (error) {
        console.error('Error creating calendar event:', error);
        return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
    }
}