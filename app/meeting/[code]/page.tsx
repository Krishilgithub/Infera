import React from 'react';
import MeetingRoom from '@/components/meeting-room';

// Force dynamic rendering to avoid static paths generation and SSR-only errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MeetingCodePage({ params }: { params: { code: string } }) {
  const { code } = params;
  return <MeetingRoom meetingCode={code} />;
}
