import { io, Socket } from 'socket.io-client';

export interface MediaDevices {
  audio: boolean;
  video: boolean;
  screen: boolean;
}

export interface Participant {
  id: string;
  name: string;
  audio: boolean;
  video: boolean;
  screen: boolean;
  isHost: boolean;
  raisedHand: boolean;
}

export class WebRTCService {
  private socket: Socket | null = null;
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private meetingId: string | null = null;
  private userId: string | null = null;
  private isHost: boolean = false;

  // Event callbacks
  public onParticipantJoined?: (participant: Participant) => void;
  public onParticipantLeft?: (participantId: string) => void;
  public onParticipantUpdated?: (participant: Participant) => void;
  public onRemoteStream?: (participantId: string, stream: MediaStream) => void;
  public onChatMessage?: (message: any) => void;
  public onReaction?: (reaction: any) => void;
  public onHandRaised?: (participantId: string, raised: boolean) => void;

  constructor() {
    // Initialize socket connection only in browser
    if (typeof window !== 'undefined') {
      this.initializeSocket();
    }
  }

  private initializeSocket(): void {
    if (this.socket) return;
    const base = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin) : (process.env.NEXT_PUBLIC_SOCKET_URL || '');
    if (!base) return; // avoid server-side init
    this.socket = io(base, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('participant-joined', (participant: Participant) => {
      this.onParticipantJoined?.(participant);
      this.createPeerConnection(participant.id);
    });

    this.socket.on('participant-left', (participantId: string) => {
      this.onParticipantLeft?.(participantId);
      this.closePeerConnection(participantId);
    });

    this.socket.on('participant-updated', (participant: Participant) => {
      this.onParticipantUpdated?.(participant);
    });

    this.socket.on('offer', async ({ from, offer }) => {
      await this.handleOffer(from, offer);
    });

    this.socket.on('answer', async ({ from, answer }) => {
      await this.handleAnswer(from, answer);
    });

    this.socket.on('ice-candidate', async ({ from, candidate }) => {
      await this.handleIceCandidate(from, candidate);
    });

    this.socket.on('chat-message', (message) => {
      this.onChatMessage?.(message);
    });

    this.socket.on('reaction', (reaction) => {
      this.onReaction?.(reaction);
    });

    this.socket.on('hand-raised', ({ participantId, raised }) => {
      this.onHandRaised?.(participantId, raised);
    });
  }

  async joinMeeting(meetingId: string, userId: string, isHost: boolean = false): Promise<void> {
    if (!this.socket) this.initializeSocket();
    this.meetingId = meetingId;
    this.userId = userId;
    this.isHost = isHost;

    // Join the meeting room
    this.socket?.emit('join-meeting', { meetingId, userId, isHost });
  }

  async leaveMeeting(): Promise<void> {
    // Stop all streams
    this.stopLocalStream();
    this.stopScreenShare();

    // Close all peer connections
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();

    // Leave the meeting room
    if (this.socket && this.meetingId) {
      this.socket.emit('leave-meeting', { meetingId: this.meetingId, userId: this.userId });
    }

    this.meetingId = null;
    this.userId = null;
    this.isHost = false;
  }

  async startLocalStream(constraints: MediaStreamConstraints = { audio: true, video: true }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Add tracks to all existing peer connections
      this.peerConnections.forEach((pc) => {
        this.localStream?.getTracks().forEach((track) => {
          pc.addTrack(track, this.localStream!);
        });
      });

      return this.localStream;
    } catch (error) {
      console.error('Error starting local stream:', error);
      throw error;
    }
  }

  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track in all peer connections
      this.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender && this.screenStream) {
          const videoTrack = this.screenStream.getVideoTracks()[0];
          sender.replaceTrack(videoTrack);
        }
      });

      // Notify other participants
      this.socket?.emit('screen-share-started', { 
        meetingId: this.meetingId, 
        userId: this.userId 
      });

      return this.screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  stopScreenShare(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = null;

      // Restore camera video if available
      if (this.localStream) {
        this.peerConnections.forEach((pc) => {
          const sender = pc.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            const videoTrack = this.localStream!.getVideoTracks()[0];
            if (videoTrack) {
              sender.replaceTrack(videoTrack);
            }
          }
        });
      }

      // Notify other participants
      this.socket?.emit('screen-share-stopped', { 
        meetingId: this.meetingId, 
        userId: this.userId 
      });
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
      
      this.socket?.emit('audio-toggle', { 
        meetingId: this.meetingId, 
        userId: this.userId, 
        enabled 
      });
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
      
      this.socket?.emit('video-toggle', { 
        meetingId: this.meetingId, 
        userId: this.userId, 
        enabled 
      });
    }
  }

  sendChatMessage(message: string): void {
    this.socket?.emit('chat-message', {
      meetingId: this.meetingId,
      userId: this.userId,
      message,
      timestamp: new Date().toISOString()
    });
  }

  sendReaction(type: string): void {
    this.socket?.emit('reaction', {
      meetingId: this.meetingId,
      userId: this.userId,
      type,
      timestamp: new Date().toISOString()
    });
  }

  raiseHand(raised: boolean): void {
    this.socket?.emit('raise-hand', {
      meetingId: this.meetingId,
      userId: this.userId,
      raised
    });
  }

  private async createPeerConnection(participantId: string): Promise<void> {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      this.onRemoteStream?.(participantId, remoteStream);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('ice-candidate', {
          to: participantId,
          candidate: event.candidate,
          meetingId: this.meetingId
        });
      }
    };

    this.peerConnections.set(participantId, pc);

    // Create offer if we're the initiator
    if (this.userId && this.userId < participantId) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      this.socket?.emit('offer', {
        to: participantId,
        offer,
        meetingId: this.meetingId
      });
    }
  }

  private async handleOffer(from: string, offer: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.peerConnections.get(from);
    if (!pc) return;

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    this.socket?.emit('answer', {
      to: from,
      answer,
      meetingId: this.meetingId
    });
  }

  private async handleAnswer(from: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.peerConnections.get(from);
    if (!pc) return;

    await pc.setRemoteDescription(answer);
  }

  private async handleIceCandidate(from: string, candidate: RTCIceCandidateInit): Promise<void> {
    const pc = this.peerConnections.get(from);
    if (!pc) return;

    await pc.addIceCandidate(candidate);
  }

  private closePeerConnection(participantId: string): void {
    const pc = this.peerConnections.get(participantId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(participantId);
    }
  }

  disconnect(): void {
    this.leaveMeeting();
    this.socket?.disconnect();
  }
}

export const webrtcService = new WebRTCService();
