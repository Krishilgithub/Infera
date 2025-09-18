import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendMeetingReminder } from '@/lib/services/email';

interface ReminderRequestBody {
    recipientEmail: string;
    meetingTitle: string;
    meetingTime: string;
    meetingLink: string;
}

export async function POST(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json() as ReminderRequestBody;

        // Validate required fields
        if (!body.recipientEmail || !body.meetingTitle || !body.meetingTime || !body.meetingLink) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.recipientEmail)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        await sendMeetingReminder(body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending reminder:', error);
        return NextResponse.json(
            { error: 'Failed to send reminder' },
            { status: 500 }
        );
    }
}