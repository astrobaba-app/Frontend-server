"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function getApiBaseUrl() {
  if (typeof window === "undefined") return "";
  const env = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6001/api";
  try {
    const url = new URL(env);
    // Strip trailing /api if present so Socket.IO connects to the root server
    const pathname = url.pathname.replace(/\/?api\/?$/, "/");
    url.pathname = pathname;
    return url.toString().replace(/\/$/, "");
  } catch {
    // Fallback
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

  if (socket) {
    return socket;
  }

  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  socket = io(baseUrl, {
    path: "/socket.io",
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    timeout: 20000,
    auth: token ? { token } : undefined,
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
  }
}
