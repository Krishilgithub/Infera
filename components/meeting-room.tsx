"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getWebRTCService } from '@/lib/services/webrtc-service';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Monitor, Send, PhoneOff, Link as LinkIcon } from 'lucide-react';

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
  const rtc = useMemo(() => getWebRTCService(), []);
  const [reactions, setReactions] = useState<Array<{ id: string; emoji: string; left: number }>>([]);
  const [displayName, setDisplayName] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'participants' | 'chat'>('participants');
  const [participants, setParticipants] = useState<Array<{ user_id: string; role?: string; name?: string }>>([]);

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

  function sendReaction(emoji: string) {
    // Show locally
    const id = Math.random().toString(36).slice(2);
    setReactions(prev => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 1800);
    // Broadcast
    rtc.sendReaction(emoji);
  }

  // End meeting (move to completed), then leave and redirect
  async function handleEndMeeting() {
    try {
      if (!meeting) return;
      await fetch(`/api/meetings/${encodeURIComponent(meeting.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end' }),
      });
    } catch {}
    try { await rtc.leaveMeeting(); } catch {}
    window.location.href = '/dashboard';
  }

  // Wire webrtc callbacks
  useEffect(() => {
    // Guard if running on server (stub)
    if (!(rtc as any)) return;
    rtc.onRemoteStream = (participantId, stream) => {
      // Create or reuse video element per participant
      let videoEl = remoteVideosRef.current.get(participantId);
      if (!videoEl) {
        videoEl = document.createElement('video');
        videoEl.autoplay = true;
        videoEl.playsInline = true;
        videoEl.muted = false;
        videoEl.classList.add('no-mirror');
        remoteVideosRef.current.set(participantId, videoEl);
        setRemoteParticipants(prev => [...prev.filter(id => id !== participantId), participantId]);
      }
      videoEl.srcObject = stream;
    };

    rtc.onChatMessage = (msg: any) => {
      setChatMessages(prev => [...prev, msg]);
    };

    rtc.onReaction = (reaction: any) => {
      const id = Math.random().toString(36).slice(2);
      setReactions(prev => [...prev, { id, emoji: reaction.type || '👍', left: Math.random() * 80 + 10 }]);
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== id));
      }, 1800);
    };

    return () => {
      // Cleanup listeners when component unmounts
      rtc.disconnect();
    };
  }, [rtc]);

  async function handleJoin() {
    if (!meeting) return;
    try {
      // Ask for display name once
      let name = displayName;
      if (!name) {
        name = prompt('Enter your first name', '') || '';
        setDisplayName(name);
      }
      // Start local media first
      const localStream = await rtc.startLocalStream({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } as MediaTrackConstraints,
        video: true
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.style.transform = 'none';
      }

      // Join signaling room using meeting_code to ensure every participant shares the exact same room key
      const roomId = meeting?.meeting_code || meetingCode;
      const tempUserId = `user-${Math.random().toString(36).slice(2, 8)}`;
      await rtc.joinMeeting(roomId, tempUserId, false, name || undefined);

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

  // Poll participants periodically (server-authorized list)
  useEffect(() => {
    if (!meeting) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/meetings?code=${encodeURIComponent(meetingCode)}`);
        if (res.ok) {
          const data = await res.json();
          setParticipants(Array.isArray(data?.participants) ? data.participants : []);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [meeting, meetingCode]);

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
    rtc.toggleAudio(newState);
    setIsAudioOn(newState);
  }

  function handleToggleVideo() {
    const newState = !isVideoOn;
    rtc.toggleVideo(newState);
    setIsVideoOn(newState);
  }

  async function handleShareScreen() {
    try {
      await rtc.startScreenShare();
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
    rtc.sendChatMessage(msg);
    setChatInput('');
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800">
        <div className="min-w-0">
          <div className="text-sm text-gray-300 truncate">Code: {meeting?.meeting_code || meetingCode}</div>
          <div className="text-lg font-semibold truncate">{meeting?.title || 'Meeting'}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              const base = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
              const link = `${base}/meeting/${encodeURIComponent(meeting?.meeting_code || meetingCode)}`;
              navigator.clipboard.writeText(link).catch(() => {});
            }}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            title="Copy invite link"
          >
            <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
          </Button>
          <Button onClick={() => setShowSidebar(s => !s)} variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
            {showSidebar ? 'Hide Panel' : 'Show Panel'}
          </Button>
          <Button onClick={handleEndMeeting} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
            <PhoneOff className="mr-2 h-4 w-4" /> End Meeting
          </Button>
        </div>
      </div>

      {/* Video grid */}
      <div className={`relative flex-1 pt-14 p-3 grid grid-cols-1 md:grid-cols-2 ${showSidebar ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-3`}>
        {/* Local video */}
        <div className="bg-black rounded-lg overflow-hidden relative">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
          <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">{displayName || 'You'}</div>
        </div>
        {/* Remote videos */}
        {remoteParticipants.map((pid) => (
          <div key={pid} className="bg-black rounded-lg overflow-hidden relative" ref={(el) => {
            if (el) {
              const videoEl = remoteVideosRef.current.get(pid);
              if (videoEl && !el.contains(videoEl)) {
                el.innerHTML = '';
                el.appendChild(videoEl);
                videoEl.style.transform = 'none';
                videoEl.classList.add('no-mirror');
              }
            }
          }} />
        ))}

        {/* Floating reactions overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {reactions.map(r => (
            <div
              key={r.id}
              className="absolute text-3xl animate-float-up"
              style={{ left: `${r.left}%`, bottom: '0%' }}
            >
              {r.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-gray-900/80 border-t border-gray-800 flex items-center justify-center gap-3 z-20">
        {joined ? (
          <>
            <Button onClick={handleToggleAudio} variant={isAudioOn ? 'default' : 'outline'} className={isAudioOn ? 'bg-white text-black' : ''}>
              {isAudioOn ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />} {isAudioOn ? 'Mute' : 'Unmute'}
            </Button>
            <Button onClick={handleToggleVideo} variant={isVideoOn ? 'default' : 'outline'} className={isVideoOn ? 'bg-white text-black' : ''}>
              {isVideoOn ? <Video className="mr-2 h-4 w-4" /> : <VideoOff className="mr-2 h-4 w-4" />} {isVideoOn ? 'Stop Video' : 'Start Video'}
            </Button>
            <Button onClick={handleShareScreen} variant="outline">
              <Monitor className="mr-2 h-4 w-4" /> Share Screen
            </Button>
            <div className="flex items-center gap-2">
              {['👍','❤️','😂','🎉','🙌'].map(e => (
                <button key={e} onClick={() => sendReaction(e)} className="text-2xl hover:scale-110 transition-transform" aria-label={`React ${e}`}>
                  {e}
                </button>
              ))}
            </div>
          </>
        ) : (
          <span className="text-sm text-gray-400">Connecting…</span>
        )}
      </div>

      {/* Right Sidebar: Participants / Chat */}
      {showSidebar && (
        <div className="w-80 bg-gray-950 border-l border-gray-800 pt-14 pb-16 flex flex-col">
          <div className="px-3 py-2 flex gap-2 border-b border-gray-800">
            <button onClick={() => setActiveTab('participants')} className={`px-3 py-1 rounded ${activeTab==='participants' ? 'bg-gray-800' : 'bg-gray-900'}`}>Participants</button>
            <button onClick={() => setActiveTab('chat')} className={`px-3 py-1 rounded ${activeTab==='chat' ? 'bg-gray-800' : 'bg-gray-900'}`}>Chat</button>
          </div>
          {activeTab==='participants' ? (
            <div className="flex-1 overflow-auto p-3 space-y-2">
              <div className="text-xs text-gray-400">You</div>
              <div className="text-sm">{displayName || 'You'}</div>
              <div className="h-px bg-gray-800 my-2" />
              {participants.map((p, idx) => (
                <div key={idx} className="text-sm flex items-center justify-between">
                  <span className="truncate">{p.name || p.user_id?.slice(0,8)}</span>
                  <span className="text-xs text-gray-500">{p.role || ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 p-3 flex flex-col">
              <div className="flex-1 overflow-auto space-y-2">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-medium">{m.from}:</span> {m.message}
                    <div className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} className="mt-2 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 border border-gray-700 bg-gray-900 rounded px-2 py-1 text-white"
                  placeholder="Type a message"
                />
                <Button type="submit" variant="outline"><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Local styles for floating animation */}
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-200px); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 1.6s ease-out forwards;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.4));
        }
        .no-mirror { transform: none !important; }
      `}</style>
    </div>
  );
}
