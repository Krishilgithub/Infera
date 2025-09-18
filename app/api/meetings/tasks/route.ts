import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { TaskCreate, TaskUpdate, Task } from '@/lib/types/tasks';

// Create a new task
export async function POST(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json() as TaskCreate;

        // Validate required fields
        if (!body.meeting_id || !body.title) {
            return NextResponse.json(
                { error: 'Missing required fields: meeting_id and title are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('meeting_tasks')
            .insert({
                meeting_id: body.meeting_id,
                title: body.title,
                description: body.description,
                assignee_id: body.assignee_id,
                due_date: body.due_date,
                status: 'pending' as const
            })
            .select(`
                *,
                assignee:profiles(id, full_name, avatar_url)
            `)
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, task: data });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

// Get tasks for a meeting
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('meeting_tasks')
            .select(`
                *,
                assignee:profiles(id, full_name, avatar_url)
            `)
            .eq('meeting_id', meetingId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, tasks: data });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

// Update task status
export async function PATCH(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json() as TaskUpdate;

        if (!body.id || !body.status) {
            return NextResponse.json(
                { error: 'Task ID and status are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('meeting_tasks')
            .update({
                status: body.status,
                description: body.description,
                updated_at: new Date().toISOString()
            })
            .eq('id', body.id)
            .select(`
                *,
                assignee:profiles(id, full_name, avatar_url)
            `)
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, task: data });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

// Get tasks for a meeting
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('meeting_tasks')
            .select(`
                *,
                assignee:profiles(id, full_name, avatar_url)
            `)
            .eq('meeting_id', meetingId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, tasks: data });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

// Update task status
export async function PATCH(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { taskId, status, description } = body;

        const { data, error } = await supabase
            .from('meeting_tasks')
            .update({
                status,
                description: description || undefined
            })
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, task: data });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}