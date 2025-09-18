"use client";

import React, { useEffect, useRef, useState } from 'react';
import { webrtcService } from '@/lib/services/webrtc-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, Monitor, Send } from 'lucide-react';

interface MeetingRoomProps {
  meetingCode: string;
}

export default function MeetingRoom({ meetingCode }: MeetingRoomProps) {
  const [meeting, setMeeting] = useState<any | null>(null);
  const [joined, setJoined] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ from: string; message: string; timestamp: string }>>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [remoteParticipants, setRemoteParticipants] = useState<string[]>([]);
  const joinedOnceRef = useRef(false);

  // Load meeting by code
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/meetings?code=${encodeURIComponent(meetingCode)}`);
      if (res.ok) {
        const data = await res.json();
        setMeeting(data);
      }
    }
    load();
  }, [meetingCode]);

  // Wire webrtc callbacks
  useEffect(() => {
    webrtcService.onRemoteStream = (participantId, stream) => {
      // Create or reuse video element per participant
      let videoEl = remoteVideosRef.current.get(participantId);
      if (!videoEl) {
        videoEl = document.createElement('video');
        videoEl.autoplay = true;
        videoEl.playsInline = true;
        videoEl.muted = false;
        remoteVideosRef.current.set(participantId, videoEl);
        setRemoteParticipants(prev => [...prev.filter(id => id !== participantId), participantId]);
      }
      videoEl.srcObject = stream;
    };

    webrtcService.onChatMessage = (msg: any) => {
      setChatMessages(prev => [...prev, msg]);
    };

    return () => {
      // Cleanup listeners when component unmounts
      webrtcService.disconnect();
    };
  }, []);

  async function handleJoin() {
    if (!meeting) return;
    try {
      // Start local media first
      const localStream = await webrtcService.startLocalStream({ audio: true, video: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // Join signaling room (use meeting.id and a temporary userId; integrate with auth for real app)
      const tempUserId = `user-${Math.random().toString(36).slice(2, 8)}`;
      await webrtcService.joinMeeting(meeting.id, tempUserId, false);

      // Tell backend we've joined (updates participants presence)
      await fetch(`/api/meetings/${encodeURIComponent(meeting.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join' }),
      }).catch(() => {});

      setJoined(true);
    } catch (e) {
      console.error(e);
      alert('Failed to join meeting');
    }
  }

  // Auto-join once the meeting is loaded
  useEffect(() => {
    if (meeting && !joinedOnceRef.current) {
      joinedOnceRef.current = true;
      handleJoin();
    }
  }, [meeting]);

  // Leave on unload to update presence in DB
  useEffect(() => {
    function handleBeforeUnload() {
      if (meeting) {
        navigator.sendBeacon(
          `/api/meetings/${encodeURIComponent(meeting.id)}`,
          new Blob([JSON.stringify({ action: 'leave' })], { type: 'application/json' })
        );
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (meeting) {
        // Best-effort leave on component unmount
        fetch(`/api/meetings/${encodeURIComponent(meeting.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'leave' }),
          keepalive: true,
        }).catch(() => {});
      }
    };
  }, [meeting]);

  function handleToggleAudio() {
    const newState = !isAudioOn;
    webrtcService.toggleAudio(newState);
    setIsAudioOn(newState);
  }

  function handleToggleVideo() {
    const newState = !isVideoOn;
    webrtcService.toggleVideo(newState);
    setIsVideoOn(newState);
  }

  async function handleShareScreen() {
    try {
      await webrtcService.startScreenShare();
    } catch (e) {
      console.error(e);
      alert('Screen share failed');
    }
  }

  function handleSendChat(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const msg = chatInput.trim();
    if (!msg) return;
    const out = { from: 'me', message: msg, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, out]);
    webrtcService.sendChatMessage(msg);
    setChatInput('');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting: {meeting?.title || meetingCode}</CardTitle>
              <div className="text-sm text-gray-600">Code: {meeting?.meeting_code || meetingCode}</div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Local video */}
                <div className="bg-black rounded-md overflow-hidden aspect-video">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
                {/* Remote videos */}
                <div className="grid grid-cols-2 gap-2">
                  {remoteParticipants.map((pid) => (
                    <div key={pid} className="bg-black rounded-md overflow-hidden aspect-video" ref={(el) => {
                      if (el) {
                        const videoEl = remoteVideosRef.current.get(pid);
                        if (videoEl && !el.contains(videoEl)) {
                          el.innerHTML = '';
                          el.appendChild(videoEl);
                        }
                      }
                    }} />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                {joined ? (
                  <>
                    <Button onClick={handleToggleAudio} variant={isAudioOn ? 'default' : 'outline'}>
                      {isAudioOn ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />} {isAudioOn ? 'Mute' : 'Unmute'}
                    </Button>
                    <Button onClick={handleToggleVideo} variant={isVideoOn ? 'default' : 'outline'}>
                      {isVideoOn ? <Video className="mr-2 h-4 w-4" /> : <VideoOff className="mr-2 h-4 w-4" />} {isVideoOn ? 'Stop Video' : 'Start Video'}
                    </Button>
                    <Button onClick={handleShareScreen} variant="outline">
                      <Monitor className="mr-2 h-4 w-4" /> Share Screen
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Connecting…</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-auto border rounded p-2 bg-white">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className="text-sm mb-2">
                    <span className="font-medium">{m.from}:</span> {m.message}
                    <div className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} className="flex gap-2 mt-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="Type a message"
                />
                <Button type="submit" variant="outline"><Send className="h-4 w-4" /></Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
