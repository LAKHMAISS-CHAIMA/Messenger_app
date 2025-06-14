const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// More permissive CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Serveur en ligne");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling'],
  allowEIO3: true,
  path: '/socket.io/',
  serveClient: false,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e8,
  connectTimeout: 45000,
  allowUpgrades: false // Disable upgrades to websocket for now
});

// Socket.IO connection logging
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  console.log('Transport:', socket.conn.transport.name);
  console.log('Headers:', socket.handshake.headers);
  console.log('Query:', socket.handshake.query);

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });
});

// Socket.IO error handling
io.engine.on('connection_error', (err) => {
  console.log('Connection error:', err);
});

io.engine.on('headers', (headers, req) => {
  console.log('Socket.IO headers:', headers);
});

require("./socket")(io);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  const addresses = require('os').networkInterfaces();
  console.log('Server running on:');
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://${HOST}:${PORT}`);
  Object.keys(addresses).forEach((interfaceName) => {
    addresses[interfaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`- Local IP: http://${iface.address}:${PORT}`);
      }
    });
  });
  console.log('Socket.IO server is running');
  console.log('Available transports:', io.engine.transports);
});
