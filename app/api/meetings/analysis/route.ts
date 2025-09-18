import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { MeetingAnalysis, ParticipantSentiment } from '@/lib/types/meeting-analysis';

export async function POST(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { meetingAnalysis, participantSentiments } = await request.json();

        // Insert meeting analysis
        const { data: analysisData, error: analysisError } = await supabase
            .from('meeting_analysis')
            .insert(meetingAnalysis)
            .select()
            .single();

        if (analysisError) throw analysisError;

        // Insert participant sentiments
        if (participantSentiments && participantSentiments.length > 0) {
            const { error: sentimentError } = await supabase
                .from('participant_sentiment')
                .insert(participantSentiments);

            if (sentimentError) throw sentimentError;
        }

        return NextResponse.json({
            success: true,
            data: analysisData
        });

    } catch (error) {
        console.error('Error storing meeting analysis:', error);
        return NextResponse.json(
            { error: 'Failed to store meeting analysis' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const meetingId = searchParams.get('meetingId');

        if (!meetingId) {
            return NextResponse.json(
                { error: 'Meeting ID is required' },
                { status: 400 }
            );
        }

        const supabase = createRouteHandlerClient({ cookies });

        // Get meeting analysis
        const { data: analysisData, error: analysisError } = await supabase
            .from('meeting_analysis')
            .select('*')
            .eq('meeting_id', meetingId)
            .single();

        if (analysisError) throw analysisError;

        // Get participant sentiments
        const { data: sentimentData, error: sentimentError } = await supabase
            .from('participant_sentiment')
            .select('*')
            .eq('meeting_id', meetingId);

        if (sentimentError) throw sentimentError;

        return NextResponse.json({
            success: true,
            data: {
                analysis: analysisData,
                sentiments: sentimentData
            }
        });

    } catch (error) {
        console.error('Error fetching meeting analysis:', error);
        return NextResponse.json(
            { error: 'Failed to fetch meeting analysis' },
            { status: 500 }
        );
    }
}