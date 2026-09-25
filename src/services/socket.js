import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

console.log("🔌 Connecting Socket.IO to:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
});

socket.on("connect", () => {
  console.log("🟢 SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ SOCKET CONNECTION ERROR:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 SOCKET DISCONNECTED:", reason);
});

socket.on("scoreUpdated", (match) => {
  console.log("🔥🔥 SCORE EVENT RECEIVED:", match);
});

export default socket;