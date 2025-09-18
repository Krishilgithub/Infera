"use client";

import React, { useEffect, useRef, useState } from 'react';
import { webrtcService } from '@/lib/services/webrtc-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, Monitor, Send, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeetingRoomProps {
  meetingCode: string;
}

export default function MeetingRoom({ meetingCode }: MeetingRoomProps) {
  const { toast } = useToast();
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
  const [participants, setParticipants] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  // UI participants from signaling layer (for live audio/video status)
  const [uiParticipants, setUiParticipants] = useState<Array<{ id: string; name?: string; audio?: boolean; video?: boolean; isHost?: boolean }>>([]);
  const [isDark, setIsDark] = useState(false);
  const [rightTab, setRightTab] = useState<'chat' | 'participants'>('chat');
  const [liveReactions, setLiveReactions] = useState<Array<{ id: string; emoji: string }>>([]);
  const [audioLevel, setAudioLevel] = useState(0);

  // Load meeting by code
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/meetings?code=${encodeURIComponent(meetingCode)}`);
      if (res.ok) {
        const data = await res.json();
        setMeeting(data);
        setParticipants(data?.participants || []);
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

    // Normalize incoming chat message shape
    webrtcService.onChatMessage = (msg: any) => {
      const normalized = {
        from: 'remote',
        message: msg?.message || '',
        timestamp: msg?.timestamp || new Date().toISOString(),
        userId: msg?.userId,
      };
      setChatMessages(prev => [...prev, normalized]);
    };

    // Participants updates for sidebar
    webrtcService.onParticipantJoined = (p) => {
      setUiParticipants(prev => {
        const exists = prev.some(x => x.id === p.id);
        const next = exists ? prev.map(x => x.id === p.id ? { ...x, name: p.name, audio: p.audio, video: p.video, isHost: p.isHost } : x) : [...prev, { id: p.id, name: p.name, audio: p.audio, video: p.video, isHost: p.isHost }];
        return next;
      });
    };
    webrtcService.onParticipantUpdated = (p) => {
      setUiParticipants(prev => prev.map(x => x.id === p.id ? { ...x, name: p.name, audio: p.audio, video: p.video, isHost: p.isHost } : x));
    };
    webrtcService.onParticipantLeft = (id) => {
      setUiParticipants(prev => prev.filter(x => x.id !== id));
    };

    // Reactions overlay
    webrtcService.onReaction = (reaction) => {
      const emoji = reaction?.type === 'thumbs_up' ? '👍' : reaction?.type === 'heart' ? '❤️' : reaction?.type === 'clap' ? '👏' : '✨';
      const id = `${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      setLiveReactions(prev => [...prev, { id, emoji }]);
      setTimeout(() => {
        setLiveReactions(prev => prev.filter(r => r.id !== id));
      }, 2000);
    };

    return () => {
      // Cleanup listeners when component unmounts
      webrtcService.disconnect();
    };
  }, []);

  async function handleJoin() {
    if (!meeting) return;
    try {
      // Ask for display name
      let name = displayName;
      if (!name) {
        name = prompt('Enter your name to join the meeting', '') || '';
        setDisplayName(name);
      }

      // Start local media (default on)
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Media devices not available. Use HTTPS or localhost.');
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      await webrtcService.startLocalStream({ audio: true, video: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        // Initialize audio meter
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioCtx();
          const source = audioCtx.createMediaStreamSource(localStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.fftSize);
          const tick = () => {
            analyser.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              const v = (dataArray[i] - 128) / 128;
              sum += v * v;
            }
            const rms = Math.sqrt(sum / dataArray.length);
            setAudioLevel(isAudioOn ? rms : 0);
            requestAnimationFrame(tick);
          };
          tick();
        } catch {}
      }

      // Join signaling room (use meeting.id and a temporary userId; integrate with auth for real app)
      const tempUserId = `user-${Math.random().toString(36).slice(2, 8)}`;
      await webrtcService.joinMeeting(meeting.id, tempUserId, false);

      // Tell backend we've joined (updates participants presence)
      await fetch(`/api/meetings/${encodeURIComponent(meeting.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', display_name: name }),
      }).catch(() => {});

      setJoined(true);
      setIsAudioOn(true);
      setIsVideoOn(true);
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Failed to join meeting', description: e?.message || 'Unknown error', variant: 'destructive' });
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

  // Periodically refresh participants to reflect presence changes
  useEffect(() => {
    if (!meeting) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/meetings?code=${encodeURIComponent(meetingCode)}`);
        if (res.ok) {
          const data = await res.json();
          setParticipants(data?.participants || []);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [meeting, meetingCode]);

  function copyInviteLink() {
    const base = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const link = `${base}/meeting/${encodeURIComponent(meeting?.meeting_code || meetingCode)}`;
    navigator.clipboard.writeText(link)
      .then(() => toast({ title: 'Invite link copied', description: link }))
      .catch(() => toast({ title: 'Failed to copy invite link', variant: 'destructive' }));
  }

  async function handleLeave() {
    try {
      if (meeting) {
        await fetch(`/api/meetings/${encodeURIComponent(meeting.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'leave' })
        });
      }
    } finally {
      try { webrtcService.leaveMeeting(); } catch {}
      window.location.href = '/dashboard';
    }
  }

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
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Screen share failed', description: e?.message || 'Unknown error', variant: 'destructive' });
    }
  }

  function sendReaction(type: string) {
    try {
      webrtcService.sendReaction(type);
      // Also show locally
      const emoji = type === 'thumbs_up' ? '👍' : type === 'heart' ? '❤️' : type === 'clap' ? '👏' : '✨';
      const id = `${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      setLiveReactions(prev => [...prev, { id, emoji }]);
      setTimeout(() => {
        setLiveReactions(prev => prev.filter(r => r.id !== id));
      }, 2000);
    } catch (e: any) {
      toast({ title: 'Failed to send reaction', description: e?.message || 'Unknown error', variant: 'destructive' });
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

  // Auto-scroll chat to bottom on new messages
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

return (
  <div className={`h-screen w-screen ${isDark ? 'bg-neutral-900' : 'bg-gray-50'}`}>
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-0">
      <div className={`lg:col-span-9 ${isDark ? 'border-neutral-800' : 'border-gray-200'} border-r flex flex-col min-h-0 relative`}>
        {/* Reaction overlays */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center z-10">
          <div className="mt-24 flex gap-2">
            {liveReactions.map(r => (
              <div key={r.id} className="text-4xl transition-opacity duration-500" style={{ opacity: 0.9 }}>{r.emoji}</div>
            ))}
          </div>
        </div>
        <Card className="rounded-none border-0 border-b border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Meeting: {meeting?.title || meetingCode}</CardTitle>
                <div className="text-sm text-gray-600">Code: {meeting?.meeting_code || meetingCode}</div>
                <div className="flex items-center text-sm text-gray-700 mt-1">
                  <Users className="h-4 w-4 mr-1" />
                  {participants.length} participant{participants.length === 1 ? '' : 's'}
                  {participants.length > 0 && (
                    <span className="ml-2 text-gray-500 truncate max-w-[300px]">
                      {participants
                        .map((p: any) => p.display_name || (p.user_id ? p.user_id.slice(0, 6) : ''))
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  )}
                </div>
              </div>
              </CardHeader>
              <CardContent className="pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[calc(100vh-180px)]">
                    {/* Local video */}
                    <div className={`${isDark ? 'bg-neutral-800' : 'bg-black'} rounded-md overflow-hidden h-full`}>
                      {/* Self tile */}
                      {isVideoOn ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-3xl">
                            {(displayName || 'You').slice(0,1).toUpperCase()}
                          </div>
                          <div className="absolute bottom-3 left-3 text-white text-sm bg-black/50 px-2 py-1 rounded">
                            {displayName || 'You'}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Remote videos */}
                    <div className="grid grid-cols-2 gap-2 h-full">
                      {remoteParticipants.map((pid) => (
                        <div key={pid} className={`${isDark ? 'bg-neutral-800' : 'bg-black'} rounded-md overflow-hidden h-full`} ref={(el) => {
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
  
                  <div className="flex items-center gap-3 mt-4 justify-center">
                    {joined ? (
                      <>
                        <Button onClick={handleToggleAudio} className={`${isAudioOn ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-white'} px-4 py-5 rounded-full` }>
                          {isAudioOn ? <><Mic className="mr-2 h-4 w-4" /> Mute</> : <><MicOff className="mr-2 h-4 w-4" /> Unmute</>}
                        </Button>
                        <Button onClick={handleToggleVideo} className={`${isVideoOn ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-white'} px-4 py-5 rounded-full` }>
                          {isVideoOn ? <><Video className="mr-2 h-4 w-4" /> Stop Video</> : <><VideoOff className="mr-2 h-4 w-4" /> Start Video</>}
                        </Button>
                        <Button onClick={handleShareScreen} variant="outline" className="px-4 py-5 rounded-full">
                          <Monitor className="mr-2 h-4 w-4" /> Share Screen
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" onClick={() => sendReaction('thumbs_up')}>👍</Button>
                          <Button variant="outline" onClick={() => sendReaction('heart')}>❤️</Button>
                          <Button variant="outline" onClick={() => sendReaction('clap')}>👏</Button>
                        </div>
                        <Button onClick={handleLeave} variant="destructive" className="px-4 py-5 rounded-full">Leave</Button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Connecting…</span>
                    )}
                  </div>
                </CardContent>
          </Card>
        </div>

        {/* Right panel: tabs for Participants / Chat */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card className="rounded-none border-0 h-full">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant={rightTab === 'participants' ? 'default' : 'outline'} size="sm" onClick={() => setRightTab('participants')}>Participants</Button>
                <Button variant={rightTab === 'chat' ? 'default' : 'outline'} size="sm" onClick={() => setRightTab('chat')}>Chat</Button>
              </div>
            </CardHeader>
            <CardContent className="h-full flex flex-col gap-2 pt-3">
              {rightTab === 'participants' ? (
                <div className="flex-1 overflow-auto border rounded p-3 bg-white">
                  {uiParticipants.length === 0 && <div className="text-sm text-gray-500">No participants yet.</div>}
                  {uiParticipants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {(p.name || 'Guest').slice(0,1).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{p.name || 'Guest'}</div>
                          <div className="text-xs text-gray-500">{p.isHost ? 'Host' : 'Attendee'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.audio ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{p.audio ? 'Audio on' : 'Muted'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto border rounded p-3 bg-white">
                    {chatMessages.map((m, idx) => {
                      const name = m.from === 'me'
                        ? (displayName || 'You')
                        : (participants.find((p: any) => p.user_id === (m as any).userId)?.display_name || 'Guest');
                      return (
                        <div key={idx} className="text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{name}</span>
                            <span className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <div className="text-gray-700">{m.message}</div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      placeholder="Type a message"
                    />
                    <Button type="submit" variant="default"><Send className="h-4 w-4" /></Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
