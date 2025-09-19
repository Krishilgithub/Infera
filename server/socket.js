// Simple Socket.IO signaling server for meetings
// Run with: node server/socket.js

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.SOCKET_PORT || 4001;
const ORIGIN = process.env.SOCKET_CORS_ORIGIN || '*';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Infera Socket.IO signaling server running');
});

const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Map socket.id -> participant metadata
const participants = new Map();

io.on('connection', (socket) => {
  // Attach defaults
  participants.set(socket.id, {
    userId: null,
    meetingId: null,
    isHost: false,
  });

  socket.on('join-meeting', ({ meetingId, userId, isHost }) => {
    const meta = participants.get(socket.id) || {};
    meta.meetingId = meetingId;
    meta.userId = userId;
    meta.isHost = !!isHost;
    participants.set(socket.id, meta);

    socket.join(meetingId);

    // Send the list of existing participants in the room to the newly joined socket
    try {
      const room = io.sockets.adapter.rooms.get(meetingId);
      const existing = Array.from(room || [])
        .filter((id) => id !== socket.id)
        .map((id) => ({ id }));
      socket.emit('existing-participants', existing);
    } catch (e) {
      // no-op
    }

    // Notify others in the room about new participant
    socket.to(meetingId).emit('participant-joined', {
      id: socket.id,
      name: userId,
      audio: true,
      video: true,
      screen: false,
      isHost: !!isHost,
      raisedHand: false,
    });
  });

  socket.on('leave-meeting', ({ meetingId }) => {
    socket.leave(meetingId);
    io.to(meetingId).emit('participant-left', socket.id);
    const meta = participants.get(socket.id);
    if (meta) {
      meta.meetingId = null;
      participants.set(socket.id, meta);
    }
  });

  socket.on('disconnect', () => {
    const meta = participants.get(socket.id);
    if (meta && meta.meetingId) {
      io.to(meta.meetingId).emit('participant-left', socket.id);
    }
    participants.delete(socket.id);
  });

  // WebRTC signaling
  socket.on('offer', ({ to, offer, meetingId }) => {
    io.to(to).emit('offer', { from: socket.id, offer, meetingId });
  });

  socket.on('answer', ({ to, answer, meetingId }) => {
    io.to(to).emit('answer', { from: socket.id, answer, meetingId });
  });

  socket.on('ice-candidate', ({ to, candidate, meetingId }) => {
    io.to(to).emit('ice-candidate', { from: socket.id, candidate, meetingId });
  });

  // Media state changes
  socket.on('audio-toggle', ({ meetingId, userId, enabled }) => {
    socket.to(meetingId).emit('participant-updated', {
      id: socket.id,
      name: userId,
      audio: enabled,
    });
  });

  socket.on('video-toggle', ({ meetingId, userId, enabled }) => {
    socket.to(meetingId).emit('participant-updated', {
      id: socket.id,
      name: userId,
      video: enabled,
    });
  });

  socket.on('screen-share-started', ({ meetingId, userId }) => {
    socket.to(meetingId).emit('participant-updated', {
      id: socket.id,
      name: userId,
      screen: true,
    });
  });

  socket.on('screen-share-stopped', ({ meetingId, userId }) => {
    socket.to(meetingId).emit('participant-updated', {
      id: socket.id,
      name: userId,
      screen: false,
    });
  });

  // Chat, reactions, raise hand
  socket.on('chat-message', ({ meetingId, userId, message, timestamp }) => {
    io.to(meetingId).emit('chat-message', { from: userId, message, timestamp });
  });

  socket.on('reaction', ({ meetingId, userId, type, timestamp }) => {
    io.to(meetingId).emit('reaction', { from: userId, type, timestamp });
  });

  socket.on('raise-hand', ({ meetingId, userId, raised }) => {
    io.to(meetingId).emit('hand-raised', { participantId: userId, raised });
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Socket.IO signaling server running on http://localhost:${PORT}`);
});
