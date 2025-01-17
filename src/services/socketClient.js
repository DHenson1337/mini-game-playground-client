// src/services/socketClient.js
import { io } from "socket.io-client";
import { getUserFromSession } from "../utils/userSession";

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
        autoConnect: true,
      }
    );

    this.socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      const userData = getUserFromSession();
      if (userData) {
        this.socket.emit("auth_user", userData);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this;
  }

  joinGame(gameId) {
    if (!this.socket?.connected) this.connect();
    this.socket.emit("join_game", gameId);
  }

  leaveGame(gameId) {
    if (this.socket?.connected) {
      this.socket.emit("leave_game", gameId);
    }
  }

  onScoreUpdate(gameId, callback) {
    if (!this.socket?.connected) this.connect();

    const eventName = "score_update";
    // Remove existing listener if any
    if (this.listeners.has(eventName)) {
      this.socket.off(eventName, this.listeners.get(eventName));
    }

    const listener = (data) => {
      if (data.gameId === gameId) {
        callback(data);
      }
    };

    this.listeners.set(eventName, listener);
    this.socket.on(eventName, listener);
  }

  emitNewScore(scoreData) {
    if (!this.socket?.connected) this.connect();
    this.socket.emit("new_score", scoreData);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance
const socketClient = new SocketClient();
export default socketClient;
