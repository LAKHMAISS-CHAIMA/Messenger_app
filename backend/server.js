const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" Connecté à MongoDB"))
.catch((err) => {
  console.error(" Erreur MongoDB :", err.message);
  process.exit(1);
});

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send(" Serveur en ligne");
});

const io = new Server(server, {
  cors: { origin: "*" },
});

require("./socket")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Serveur lancé sur le port ${PORT}`));
