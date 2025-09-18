'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  Calendar, 
  Search, 
  UserPlus, 
  ArrowRight,
  Users
} from 'lucide-react';

interface QuickActionItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  link?: string;
  action?: () => void;
}

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className = "" }) => {
  async function startNewMeeting() {
    try {
      const title = prompt('Enter meeting title', 'Instant Meeting');
      if (title === null) return;

      // Create the meeting (instant)
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Failed to create meeting: ' + (err?.error || res.statusText));
        return;
      }
      const meeting = await res.json();
      // Navigate to the meeting room using the unique code
      if (meeting?.meeting_code) {
        window.location.href = `/meeting/${encodeURIComponent(meeting.meeting_code)}`;
      } else {
        alert('Meeting created but no code returned.');
      }
    } catch (e: any) {
      alert('Error: ' + e?.message);
    }
  }

  async function scheduleMeeting() {
    try {
      const title = prompt('Enter meeting title', 'Scheduled Meeting');
      if (title === null) return;
      const when = prompt('Enter scheduled time (ISO, e.g. 2025-09-18T19:30:00Z)');
      if (!when) return;

      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, scheduled_at: when }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Failed to schedule meeting: ' + (err?.error || res.statusText));
        return;
      }
      const meeting = await res.json();
      alert(`Meeting scheduled. Code: ${meeting.meeting_code}`);
    } catch (e: any) {
      alert('Error: ' + e?.message);
    }
  }

  async function inviteTeam() {
    try {
      const code = prompt('Enter meeting code to invite into');
      if (!code) return;

      // Resolve meeting by code
      const resMeeting = await fetch(`/api/meetings?code=${encodeURIComponent(code)}`);
      if (!resMeeting.ok) {
        alert('Meeting not found');
        return;
      }
      const meeting = await resMeeting.json();

      const emailsCsv = prompt('Enter emails separated by comma');
      if (!emailsCsv) return;
      const emails = emailsCsv
        .split(',')
        .map(e => e.trim())
        .filter(Boolean);
      if (emails.length === 0) return;

      const resInvite = await fetch(`/api/meetings/${meeting.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });
      const body = await resInvite.json().catch(() => ({}));
      if (!resInvite.ok) {
        alert('Invite failed: ' + (body?.error || resInvite.statusText));
        return;
      }
      alert(body?.message || 'Invitations sent');
    } catch (e: any) {
      alert('Error: ' + e?.message);
    }
  }

  const actions: QuickActionItem[] = [
    {
      title: "Start New Meeting",
      description: "Begin an instant meeting with transcription",
      icon: Video,
      color: "default",
      action: startNewMeeting
    },
    {
      title: "Join Meeting",
      description: "Enter a meeting code to join",
      icon: Users,
      color: "outline",
      link: "/join"
    },
    {
      title: "Schedule Meeting",
      description: "Plan and invite participants",
      icon: Calendar,
      color: "outline",
      action: scheduleMeeting
    },
    {
      title: "Invite Team",
      description: "Add team members to your workspace",
      icon: UserPlus,
      color: "outline",
      action: inviteTeam
    }
  ];

  return (
    <Card className={`bg-white border border-gray-200 shadow-md ${className}`}>
      <CardHeader>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
          <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions?.map((action, index) => (
            <div key={index} className="group">
              {action?.link ? (
                <Link href={action?.link}>
                  <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer min-h-[100px] justify-center">
                    <div className="p-3 bg-gray-50 text-gray-700 rounded-lg group-hover:bg-gray-100 transition-colors duration-200 mb-2">
                      <action.icon size={24} />
                    </div>
                    <h4 className="font-medium text-gray-900 text-center text-sm">
                      {action?.title}
                    </h4>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={action?.action}
                  className="w-full flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 min-h-[100px] justify-center"
                >
                  <div className="p-3 bg-gray-50 text-gray-700 rounded-lg group-hover:bg-gray-100 transition-colors duration-200 mb-2">
                    <action.icon size={24} />
                  </div>
                  <h4 className="font-medium text-gray-900 text-center text-sm">
                    {action?.title}
                  </h4>
                </button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;