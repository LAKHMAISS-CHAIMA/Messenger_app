const Message = require("../models/messageModel");

const users = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Nouveau client connecté");

    socket.on("join-room", ({ username, roomCode }) => {
      socket.join(roomCode);
      users[socket.id] = { username, roomCode };

      io.to(roomCode).emit("user-list", getUsersInRoom(roomCode));
    });

    socket.on("send-message", async ({ text }) => {
      const { username, roomCode } = users[socket.id] || {};
      if (!roomCode) return;

      const message = new Message({ roomCode, sender: username, text });
      await message.save();

      io.to(roomCode).emit("receive-message", {
        sender: username,
        text,
        timestamp: message.timestamp,
      });
    });

    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user) {
        delete users[socket.id];
        io.to(user.roomCode).emit("user-list", getUsersInRoom(user.roomCode));
      }
    });
  });
};

function getUsersInRoom(roomCode) {
  return Object.values(users)
    .filter((u) => u.roomCode === roomCode)
    .map((u) => u.username);
}
