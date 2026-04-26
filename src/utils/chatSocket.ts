"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentSocketToken: string | null = null;

function getApiBaseUrl() {
  if (typeof window === "undefined") return "";

  // Prefer an explicit backend URL when available.
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "");
  }

  const env = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6001/api";
  try {
    const url = new URL(env);
    // Strip trailing /api if present so Socket.IO connects to the root server
    const pathname = url.pathname.replace(/\/?api\/?$/, "/");
    url.pathname = pathname;
    return url.toString().replace(/\/$/, "");
  } catch {
    // Fallback to current origin for production browser environments.
    if (typeof window !== "undefined" && !window.location.origin.includes("localhost")) {
      return window.location.origin;
    }
    return env.replace(/\/?api\/?$/, "");
  }
}

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token_astrologer") ||
    localStorage.getItem("token_middleware") ||
    localStorage.getItem("token")
  );
}

export function getChatSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  const latestToken = getAuthToken();

  // If auth context changed (user <-> astrologer, relogin, token refresh),
  // recreate socket so server room binding uses the latest role token.
  if (socket && currentSocketToken !== latestToken) {
    socket.disconnect();
    socket = null;
    currentSocketToken = null;
  }

  if (socket) {
    if (!socket.connected) {
      socket.auth = latestToken ? { token: latestToken } : {};
      socket.connect();
    }
    return socket;
  }

  const baseUrl = getApiBaseUrl();
  const socketPath = process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io";

  currentSocketToken = latestToken;

  socket = io(baseUrl, {
    path: socketPath,
    withCredentials: true,
    // Keep polling as fallback to avoid websocket-only connection failures.
    transports: ["polling", "websocket"],
    upgrade: true,
    rememberUpgrade: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    timeout: 20000,
    auth: latestToken ? { token: latestToken } : {},
  });

  socket.on("connect", () => {
    console.log("Chat socket connected");
  });

  socket.on("connect_error", (err) => {
    console.error("Chat socket connection error:", err?.message || err);
  });

  socket.on("disconnect", (reason) => {
    console.log("Chat socket disconnected:", reason);
  });

  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentSocketToken = null;
  }
}
