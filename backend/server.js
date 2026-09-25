const dns = require("dns");
const tls = require("tls");

console.log("========== RUNTIME DIAGNOSTICS ==========");
console.log("Node:", process.version);
console.log("OpenSSL:", process.versions.openssl);
console.log("Platform:", process.platform);
console.log("Architecture:", process.arch);
console.log("==========================================");

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
console.log("========== PORT DIAGNOSTIC ==========");
console.log("PORT from Railway:", process.env.PORT);
console.log("PORT used by app:", PORT);
console.log("=====================================");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://aitvolleyball.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/matches", createMatchRoutes(io));
app.use("/api/events", eventRoutes);

// Normal API test
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AIT Volleyball API is running",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    message: "AIT Volleyball backend is running",
  });
});

// ==========================================
// TEMPORARY RAW TLS DIAGNOSTIC
// ==========================================

app.get("/diagnostics/tls", async (req, res) => {
  const host =
    "ac-ovikmiy-shard-00-00.s4sbnkg.mongodb.net";

  console.log("========== RAW TLS TEST ==========");
  console.log("Host:", host);

  try {
    const addresses = await dns.promises.lookup(host, {
      all: true,
    });

    console.log("DNS addresses:", addresses);

    const result = {
      node: process.version,
      openssl: process.versions.openssl,
      host,
      dns: addresses,
      tls: null,
    };

    await new Promise((resolve) => {
      const socket = tls.connect(
        {
          host,
          port: 27017,
          servername: host,

          // Diagnostic only
          rejectUnauthorized: false,

          // Force TLS 1.2 at the native Node TLS layer
          minVersion: "TLSv1.2",
          maxVersion: "TLSv1.2",
        },
        () => {
          console.log("RAW TLS: CONNECTED");
          console.log(
            "Protocol:",
            socket.getProtocol()
          );
          console.log(
            "Cipher:",
            socket.getCipher()
          );

          result.tls = {
            connected: true,
            protocol: socket.getProtocol(),
            cipher: socket.getCipher(),
          };

          socket.end();
          resolve();
        }
      );

      socket.setTimeout(10000);

      socket.on("timeout", () => {
        console.error("RAW TLS: TIMEOUT");

        result.tls = {
          connected: false,
          error: "TLS connection timeout",
        };

        socket.destroy();
        resolve();
      });

      socket.on("error", (error) => {
        console.error("RAW TLS: ERROR");
        console.error("Message:", error.message);
        console.error("Code:", error.code);

        result.tls = {
          connected: false,
          error: error.message,
          code: error.code || null,
        };

        resolve();
      });
    });

    console.log("=================================");

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("RAW TLS TEST FAILED:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("Viewer connected:", socket.id);

  socket.emit("welcome", {
    message: "Connected to AIT Volleyball live server",
  });

  socket.on("disconnect", () => {
    console.log("Viewer disconnected:", socket.id);
  });
});

// ==========================================
// START SERVER
// ==========================================
process.on("uncaughtException", (error) => {
  console.error("========== UNCAUGHT EXCEPTION ==========");
  console.error(error);
});

process.on("unhandledRejection", (reason) => {
  console.error("========== UNHANDLED REJECTION ==========");
  console.error(reason);
});

const startServer = () => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`SERVER IS LISTENING ON ${PORT}`);
  });

  connectDB()
    .then(() => {
      console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection failed.");
      console.error(error.message);
      console.error("HTTP server will remain running.");
    });
};

startServer();