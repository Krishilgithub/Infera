import React from 'react';
import MeetingRoom from '@/components/meeting-room';

export default function MeetingCodePage({ params }: { params: { code: string } }) {
  const { code } = params;
  return <MeetingRoom meetingCode={code} />;
}
