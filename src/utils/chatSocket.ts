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

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const userToken = window.localStorage.getItem("astrobaba_token");
  const astrologerToken = window.localStorage.getItem("astrologer_token");
  return userToken || astrologerToken;
}

export function getChatSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (socket && socket.connected) {
    return socket;
  }

  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  socket = io(baseUrl, {
    withCredentials: true,
    auth: token
      ? {
          token,
        }
      : undefined,
  });

  socket.on("connect_error", (err) => {
    console.error("Chat socket connection error:", err.message || err);
  });

  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
