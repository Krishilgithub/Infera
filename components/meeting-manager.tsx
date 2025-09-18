'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import type { Task } from '@/lib/types/tasks';

interface Participant {
    id: string;
    email: string;
    name?: string;
}

interface MeetingDetailsProps {
    meetingId: string;
    title: string;
    startTime: string;
    endTime: string;
    participants: Participant[];
}

export default function MeetingManager({ meetingId, title, startTime, endTime, participants }: MeetingDetailsProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isCalendarConnected, setIsCalendarConnected] = useState(false);

    // Fetch tasks when component mounts
    useEffect(() => {
        fetchTasks();
    }, [meetingId]);

    async function fetchTasks() {
        try {
            const response = await fetch(`/api/meetings/tasks?meetingId=${meetingId}`);
            const { tasks } = await response.json();
            setTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    async function connectCalendar() {
        try {
            const response = await fetch('/api/calendar/auth');
            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Error connecting to calendar:', error);
        }
    }

    async function createCalendarEvent() {
        try {
            const response = await fetch('/api/calendar/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    summary: title,
                    description: `Meeting: ${title}`,
                    start: startTime,
                    end: endTime,
                    attendees: participants
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('Meeting added to calendar!');
            }
        } catch (error) {
            console.error('Error creating calendar event:', error);
        }
    }

    async function sendReminders() {
        try {
            const promises = participants.map(({ email }) =>
                fetch('/api/meetings/reminder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recipientEmail: email,
                        meetingTitle: title,
                        meetingTime: new Date(startTime).toLocaleString(),
                        meetingLink: `https://infera.com/meeting/${meetingId}`
                    })
                })
            );
            await Promise.all(promises);
            alert('Reminders sent successfully!');
        } catch (error) {
            console.error('Error sending reminders:', error);
        }
    }

    async function createTask() {
        try {
            const response = await fetch('/api/meetings/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meeting_id: meetingId,
                    title: 'New Task',
                    description: 'Task description',
                    assignee_id: participants[0]?.id,
                    due_date: new Date(endTime)
                })
            });
            const { task } = await response.json();
            setTasks([...tasks, task]);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Meeting Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                        {!isCalendarConnected ? (
                            <Button onClick={connectCalendar}>
                                Connect Google Calendar
                            </Button>
                        ) : (
                            <Button onClick={createCalendarEvent}>
                                Add to Calendar
                            </Button>
                        )}
                        <Button onClick={sendReminders}>
                            Send Reminders
                        </Button>
                        <Button onClick={createTask}>
                            Create Task
                        </Button>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Tasks</h3>
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <Card key={task.id}>
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div>
                                            <h4 className="font-medium">{task.title}</h4>
                                            <p className="text-sm text-gray-500">{task.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm">{task.assignee?.full_name || 'Unassigned'}</span>
                                            <span className={`px-2 py-1 rounded text-sm ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}