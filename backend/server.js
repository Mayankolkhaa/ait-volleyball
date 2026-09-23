const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const createMatchRoutes = require("./routes/matchRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "https://aitvolleyball.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/matches", createMatchRoutes(io));
app.use("/api/events", eventRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AIT Volleyball API is running",
  });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Viewer connected:", socket.id);

  socket.emit("welcome", {
    message: "Connected to AIT Volleyball live server",
  });

  socket.on("disconnect", () => {
    console.log("Viewer disconnected:", socket.id);
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
 });

  } catch (error) {
    console.error("Server startup failed:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();