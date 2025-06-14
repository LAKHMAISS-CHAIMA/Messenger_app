import io from 'socket.io-client';
import { API_URL } from './api';

let socket;

export const initializeSocket = async (token) => {
  console.log('Initializing socket connection to:', API_URL);
  
  if (socket?.connected) {
    console.log('Socket already connected, reusing connection');
    return socket;
  }

  // Close existing socket if any
  if (socket) {
    socket.close();
  }

  socket = io(API_URL, {
    auth: { token },
    transports: ['polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    forceNew: true,
    autoConnect: true,
    path: '/socket.io/',
    upgrade: true
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully');
    console.log('Transport:', socket.io.engine.transport.name);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, try to reconnect
      socket.connect();
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('Reconnection attempt:', attemptNumber);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', (error) => {
    console.error('Reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('Failed to reconnect');
  });

  return socket;
};

export const joinRoom = (roomCode) => {
  if (socket) {
    socket.emit('join-room', roomCode);
  }
};

export const sendMessage = (messageData) => {
  if (socket) {
    console.log('Émission Socket.IO:', messageData); 
    socket.emit('send-message', messageData); 
  } else {
    console.error('Socket non initialisé');
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const onMessageReceived = (callback) => {
  if (socket) {
    socket.on('receive-message', callback);
  }
};

export const onUserListUpdated = (callback) => {
  if (socket) {
    socket.on('update-users', callback);
  }
};