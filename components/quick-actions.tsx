'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Video,
  Calendar,
  Search,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { MeetingDialog } from '@/components/meeting-dialog';
import { InviteTeamDialog } from '@/components/invite-team-dialog';

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
  const { toast } = useToast();
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'instant' | 'schedule'>('instant');

  async function handleMeetingCreate(data: { title: string; scheduledAt?: string; description?: string }) {
    try {
      // Create the meeting
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          scheduled_at: data.scheduledAt,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || res.statusText);
      }

      const meeting = await res.json();

      if (data.scheduledAt) {
        // For scheduled meetings
        toast({
          title: "Meeting Scheduled",
          description: `Meeting code: ${meeting.meeting_code}`,
        });
      } else {
        // For instant meetings
        window.location.href = `/meeting/${encodeURIComponent(meeting.meeting_code)}`;
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setMeetingDialogOpen(false);
    }
  }

  function startNewMeeting() {
    setDialogType('instant');
    setMeetingDialogOpen(true);
  }

  function scheduleMeeting() {
    setDialogType('schedule');
    setMeetingDialogOpen(true);
  }

  async function handleInviteTeam({ code, emails }: { code: string; emails: string[] }) {
    try {
      // Resolve meeting by code
      const resMeeting = await fetch(`/api/meetings?code=${encodeURIComponent(code)}`);
      if (!resMeeting.ok) {
        throw new Error('Meeting not found');
      }
      const meeting = await resMeeting.json();
      const resInvite = await fetch(`/api/meetings/${meeting.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });
      const body = await resInvite.json().catch(() => ({}));
      if (!resInvite.ok) {
        throw new Error(body?.error || resInvite.statusText);
      }
      toast({
        title: "Success",
        description: body?.message || 'Invitations sent',
      });
      setInviteDialogOpen(false);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    }
  }

  function openInviteDialog() {
    setInviteDialogOpen(true);
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
      title: "Schedule Meeting",
      description: "Plan and invite participants",
      icon: Calendar,
      color: "outline",
      action: scheduleMeeting
    },
    {
      title: "Search Transcripts",
      description: "Find specific discussions or decisions",
      icon: Search,
      color: "outline",
      action: () => console.log('Search modal')
    },
    {
      title: "Invite Team",
      description: "Add team members to your workspace",
      icon: UserPlus,
      color: "outline",
      action: openInviteDialog
    }
  ];

  return (
    <>
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

      {/* Meeting Dialog */}
      <MeetingDialog
        open={meetingDialogOpen}
        onOpenChange={setMeetingDialogOpen}
        type={dialogType}
        onSubmit={handleMeetingCreate}
      />

      {/* Invite Team Dialog */}
      <InviteTeamDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onSubmit={handleInviteTeam}
      />
    </>
  );
};

export default QuickActions;