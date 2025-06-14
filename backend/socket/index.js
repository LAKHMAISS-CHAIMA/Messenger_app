const Message = require("../models/messageModel");

const users = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Nouveau client connecté");

    socket.on("join-room", (roomCode) => {
      if (!roomCode || typeof roomCode !== 'string') {
        socket.emit('error', { message: 'Invalid room code' });
        return;
      }

      socket.join(roomCode);
      users[socket.id] = { roomCode };

      io.to(roomCode).emit("user-list", getUsersInRoom(roomCode));
      console.log(`User joined room: ${roomCode}`);
    });

    socket.on("send-message", async (messageData) => {
      try {
        const { room, text, user } = messageData;
        if (!room || !text || !user) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        console.log('Received message:', messageData); // Debug log

        const message = new Message({
          roomCode: room,
          sender: user.name,
          text,
          userId: user.id
        });

        await message.save();

        // Emit to the room with the same message format as received
        io.to(room).emit("receive-message", {
          text,
          user,
          timestamp: message.timestamp,
        });

        console.log('Message emitted to room:', room); // Debug log
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user) {
        const { roomCode } = user;
        delete users[socket.id];
        io.to(roomCode).emit("user-list", getUsersInRoom(roomCode));
        console.log(`User disconnected from room: ${roomCode}`);
      }
    });
  });
};

function getUsersInRoom(roomCode) {
  return Object.values(users)
    .filter((u) => u.roomCode === roomCode)
    .map((u) => ({ id: u.userId, name: u.username }));
}
