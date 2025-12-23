"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface LiveChatMessage {
  id: string;
  liveSessionId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  message: string;
  messageType: "text" | "emoji" | "system";
  timestamp: string;
  createdAt?: string;
}

interface LiveStreamContextType {
  // Socket connection
  socket: Socket | null;
  isConnected: boolean;
  
  // Live session state
  currentSessionId: string | null;
  participantCount: number;
  role: "host" | "audience" | null;
  
  // Chat messages
  messages: LiveChatMessage[];
  
  // Methods
  connect: () => void;
  disconnect: () => void;
  joinLiveSession: (sessionId: string) => void;
  leaveLiveSession: () => void;
  sendMessage: (message: string) => Promise<boolean>;
  sendEmoji: (emoji: string) => Promise<boolean>;
  updateParticipantCount: (count: number) => void;
  
  // Minimized player state
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
}

const LiveStreamContext = createContext<LiveStreamContextType | undefined>(undefined);

export const useLiveStream = () => {
  const context = useContext(LiveStreamContext);
  if (!context) {
    throw new Error("useLiveStream must be used within a LiveStreamProvider");
  }
  return context;
};

interface LiveStreamProviderProps {
  children: React.ReactNode;
}

export const LiveStreamProvider: React.FC<LiveStreamProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [role, setRole] = useState<"host" | "audience" | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log("Live socket already connected");
      return;
    }

    const backendUrl = (() => {
      // Try NEXT_PUBLIC_BACKEND_URL first
      if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        return process.env.NEXT_PUBLIC_BACKEND_URL;
      }
      
      // Derive from API_BASE_URL (remove /api suffix)
      if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api$/, '');
      }
      
      // In browser, try to use current origin if on same domain
      if (typeof window !== 'undefined') {
        const currentOrigin = window.location.origin;
        // If we're on a production domain, use it
        if (!currentOrigin.includes('localhost')) {
          return currentOrigin;
        }
      }
      
      // Fallback to localhost for development
      return "http://localhost:6001";
    })();
    
    console.log("[Live Socket] Backend URL:", backendUrl);
    
    // Get token from localStorage - check all possible token keys
    const token = typeof window !== "undefined" 
      ? localStorage.getItem("token_astrologer") || 
        localStorage.getItem("token_middleware") || 
        localStorage.getItem("token")
      : null;

    if (!token) {
      console.error("No authentication token found for live stream. Checked: token_astrologer, token_middleware, token");
      return;
    }

    console.log("Connecting to live socket with token authentication");

    const newSocket = io(`${backendUrl}/live`, {
      auth: { token },
      path: "/socket.io",
      transports: ["polling", "websocket"], // Try polling first
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      upgrade: true,
      rememberUpgrade: true,
    });

    newSocket.on("connect", () => {
      console.log("Live socket connected successfully");
      setIsConnected(true);
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      console.log("Live socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("error", (error: any) => {
      console.error("Live socket error:", error);
    });

    newSocket.on("live:joined", (data: { sessionId: string; participantCount: number; role: string }) => {
      console.log("Joined live session:", data);
      setParticipantCount(data.participantCount);
      setRole(data.role as "host" | "audience");
    });

    newSocket.on("live:participant_joined", (data: { sessionId: string; participantCount: number }) => {
      console.log("Participant joined:", data);
      setParticipantCount(data.participantCount);
    });

    newSocket.on("live:participant_left", (data: { sessionId: string; participantCount: number }) => {
      console.log("Participant left:", data);
      setParticipantCount(data.participantCount);
    });

    newSocket.on("live:participant_count", (data: { sessionId: string; participantCount: number }) => {
      setParticipantCount(data.participantCount);
    });

    newSocket.on("live:chat_message", (message: LiveChatMessage) => {
      console.log("Received chat message:", message);
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("live:chat_emoji", (message: LiveChatMessage) => {
      console.log("Received emoji:", message);
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("live_session_ended", (data: { sessionId: string; message: string; astrologerName: string }) => {
      console.log("Live session ended by astrologer:", data);
      // Store the event for components to handle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("liveSessionEnded", { detail: data }));
      }
    });

    newSocket.on("live:ended", (data: { sessionId: string }) => {
      console.log("Live session ended:", data);
      // Handle session end (legacy event)
      if (data.sessionId === currentSessionId) {
        alert("Live session has ended");
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  }, [currentSessionId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setCurrentSessionId(null);
      setMessages([]);
      setRole(null);
      setParticipantCount(0);
    }
  }, []);

  const joinLiveSession = useCallback((sessionId: string) => {
    if (!socketRef.current?.connected) {
      console.error("Socket not connected. Attempting to connect...");
      connect();
      // Retry after a delay
      setTimeout(() => {
        if (socketRef.current?.connected) {
          console.log("Joining live session after reconnect:", sessionId);
          socketRef.current.emit("join_live_session", { sessionId });
          setCurrentSessionId(sessionId);
          setMessages([]);
        } else {
          console.error("Failed to connect socket for joining session");
        }
      }, 1000);
      return;
    }

    console.log("Joining live session:", sessionId);
    socketRef.current.emit("join_live_session", { sessionId });
    setCurrentSessionId(sessionId);
    setMessages([]); // Clear previous messages
  }, [connect]);

  const leaveLiveSession = useCallback(() => {
    if (!socketRef.current?.connected || !currentSessionId) {
      return;
    }

    console.log("Leaving live session:", currentSessionId);
    socketRef.current.emit("leave_live_session", { sessionId: currentSessionId });
    setCurrentSessionId(null);
    setMessages([]);
    setRole(null);
    setParticipantCount(0);
  }, [currentSessionId]);

  const sendMessage = useCallback(async (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!socketRef.current?.connected) {
        console.error("Cannot send message: socket not connected");
        console.log("Socket status:", {
          socketExists: !!socketRef.current,
          isConnected: socketRef.current?.connected,
          hasSession: !!currentSessionId
        });
        resolve(false);
        return;
      }

      if (!currentSessionId) {
        console.error("Cannot send message: no active session");
        resolve(false);
        return;
      }

      console.log("[Live Chat] Sending message:", { sessionId: currentSessionId, message });

      socketRef.current.emit(
        "live_chat_message",
        { sessionId: currentSessionId, message, messageType: "text" },
        (response: { success: boolean; error?: string }) => {
          if (response.success) {
            console.log("[Live Chat] Message sent successfully");
            resolve(true);
          } else {
            console.error("[Live Chat] Failed to send message:", response.error);
            resolve(false);
          }
        }
      );
    });
  }, [currentSessionId]);

  const sendEmoji = useCallback(async (emoji: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!socketRef.current?.connected) {
        console.error("Cannot send emoji: socket not connected");
        resolve(false);
        return;
      }

      if (!currentSessionId) {
        console.error("Cannot send emoji: no active session");
        resolve(false);
        return;
      }

      socketRef.current.emit(
        "live_chat_emoji",
        { sessionId: currentSessionId, emoji },
        (response: { success: boolean; error?: string }) => {
          if (response.success) {
            console.log("Emoji sent successfully");
            resolve(true);
          } else {
            console.error("Failed to send emoji:", response.error);
            resolve(false);
          }
        }
      );
    });
  }, [currentSessionId]);

  const updateParticipantCount = useCallback((count: number) => {
    setParticipantCount(count);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value: LiveStreamContextType = {
    socket,
    isConnected,
    currentSessionId,
    participantCount,
    role,
    messages,
    connect,
    disconnect,
    joinLiveSession,
    leaveLiveSession,
    sendMessage,
    sendEmoji,
    updateParticipantCount,
    isMinimized,
    setIsMinimized,
  };

  return (
    <LiveStreamContext.Provider value={value}>
      {children}
    </LiveStreamContext.Provider>
  );
};
