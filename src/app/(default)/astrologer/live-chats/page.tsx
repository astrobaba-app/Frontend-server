"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiPaperclip,
  FiMic,
  FiCamera,
  FiSend,
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowBack } from "react-icons/io";
import { colors } from "@/utils/colors";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getChatSocket } from "@/utils/chatSocket";
import AgoraCall from "@/components/AgoraCall";
import type { ChatMessageDto, ChatSessionSummary } from "@/store/api/chat";
import type { CallSession } from "@/store/api/call";
import {
  approveChatRequest,
  getAstrologerChatSessions,
  getChatMessages,
  rejectChatRequest,
  sendChatMessageHttp,
} from "@/store/api/chat";
import {
  acceptCall,
  rejectCall,
  getCallToken,
  endCall,
} from "@/store/api/call";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";

function formatDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type MessageGroup = {
  dateKey: string;
  label: string;
  items: ChatMessageDto[];
};

function groupMessagesByDate(messages: ChatMessageDto[]): MessageGroup[] {
  const groups: Record<string, MessageGroup> = {};

  messages.forEach((msg) => {
    const createdAt = new Date(msg.createdAt);
    const key = createdAt.toISOString().slice(0, 10);
    if (!groups[key]) {
      groups[key] = {
        dateKey: key,
        label: formatDateLabel(createdAt),
        items: [],
      };
    }
    groups[key].items.push(msg);
  });

  return Object.values(groups).sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey)
  );
}

type TabType = "chats" | "requests";

export default function LiveChatsPage() {
  const router = useRouter();
  const { showToast, toastProps, hideToast } = useToast();
  const [chatSessions, setChatSessions] = useState<ChatSessionSummary[]>([]);
  const [requestSessions, setRequestSessions] = useState<ChatSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isTypingUser, setIsTypingUser] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessageDto | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallSession | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const selectedSession = useMemo(
    () => chatSessions.find((s) => s.id === selectedSessionId) || null,
    [chatSessions, selectedSessionId]
  );

  const selectedUser = useMemo(() => {
    if (!selectedSession || !selectedSession.user) return null;
    return {
      id: selectedSession.user.id,
      name: selectedSession.user.fullName,
      online: true,
    };
  }, [selectedSession]);

  const filteredChats = useMemo(
    () =>
      chatSessions.filter((session) =>
        (session.user?.fullName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [chatSessions, searchQuery]
  );

  const filteredRequests = useMemo(
    () =>
      requestSessions.filter((session) =>
        (session.user?.fullName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [requestSessions, searchQuery]
  );

  // Ensure a valid selected session whenever the chat session list changes
  useEffect(() => {
    if (chatSessions.length === 0) return;

    const stillExists = selectedSessionId
      ? chatSessions.some((s) => s.id === selectedSessionId)
      : false;

    if (!stillExists) {
      setSelectedSessionId(chatSessions[0].id);
    }
  }, [chatSessions, selectedSessionId]);

  // Debug: Log when incomingCall state changes
  useEffect(() => {
    console.log("[Astrologer] incomingCall state changed:", incomingCall);
  }, [incomingCall]);

  // Load astrologer chat sessions and requests
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const [approvedRes, pendingRes] = await Promise.all([
          getAstrologerChatSessions({ requestStatus: "approved", page: 1, limit: 100 }),
          getAstrologerChatSessions({ requestStatus: "pending", page: 1, limit: 100 }),
        ]);

        const chats = approvedRes.sessions || [];
        const requests = pendingRes.sessions || [];

        setChatSessions(chats);
        setRequestSessions(requests);

        if (!selectedSessionId && chats.length > 0) {
          setSelectedSessionId(chats[0].id);
        }
      } catch (error) {
        console.error("Failed to load astrologer chat sessions", error);
      }
    };

    fetchSessions();
  }, [selectedSessionId]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  // Load messages when selected session changes
  useEffect(() => {
    if (!selectedSessionId) return;

    const loadMessages = async () => {
      try {
        const data = await getChatMessages(selectedSessionId, {
          page: 1,
          limit: 100,
        });
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to load messages for session", error);
      }
    };

    loadMessages();
  }, [selectedSessionId]);

  // Socket.IO integration for real-time updates
  useEffect(() => {
    if (!selectedSessionId) return;
    const socket = getChatSocket();
    if (!socket) return;

    socket.emit("join_chat", { sessionId: selectedSessionId });

    // Mark messages as read when opening chat
    socket.emit("mark_read", { sessionId: selectedSessionId });

    const handleNewMessage = (payload: { sessionId: string; message: ChatMessageDto }) => {
      if (payload.sessionId !== selectedSessionId) return;
      
      setMessages((prev) => {
        // Check if message already exists to avoid duplicates
        if (prev.some(m => m.id === payload.message.id)) {
          return prev;
        }
        return [...prev, payload.message];
      });

      // Mark as read immediately when astrologer has this chat open
      if (payload.message.senderType === "user") {
        socket.emit("mark_read", { sessionId: selectedSessionId });
      }
    };

    const handleTyping = (payload: { sessionId: string; from: "user" | "astrologer"; isTyping: boolean }) => {
      if (payload.sessionId !== selectedSessionId) return;
      if (payload.from === "user") {
        setIsTypingUser(payload.isTyping);
      }
    };

    const handleChatUpdated = (payload: { sessionId: string; session: ChatSessionSummary }) => {
      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === payload.sessionId
            ? {
                // Preserve existing related data like user details
                ...s,
                ...payload.session,
                user: s.user,
              }
            : s
        )
      );

      setRequestSessions((prev) =>
        prev.map((s) =>
          s.id === payload.sessionId
            ? {
                ...s,
                ...payload.session,
                user: s.user,
              }
            : s
        )
      );
    };

    const handleMessagesRead = (payload: { sessionId: string; readerRole: "user" | "astrologer" }) => {
      if (payload.sessionId !== selectedSessionId) return;

      setMessages((prev) =>
        prev.map((m) => {
          if (payload.readerRole === "astrologer") {
            // Astrologer read user messages
            if (m.senderType === "user") {
              return { ...m, isRead: true };
            }
          } else {
            // User read astrologer messages
            if (m.senderType === "astrologer") {
              return { ...m, isRead: true };
            }
          }
          return m;
        })
      );
    };

    const handleUnreadUpdate = (payload: { sessionId: string; unreadCount: number; viewerRole: "user" | "astrologer" }) => {
      if (payload.viewerRole !== "astrologer") return;

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === payload.sessionId ? { ...s, unreadCount: payload.unreadCount } : s
        )
      );
    };

    const handleIncomingCall = (payload: { callSession: CallSession }) => {
      console.log("[Astrologer] Received call:incoming event:", payload);
      setIncomingCall(payload.callSession);
      console.log("[Astrologer] Set incomingCall state:", payload.callSession);
    };

    const handleCallEnded = (payload: { callSession: CallSession; endedBy: string }) => {
      console.log("[Astrologer] Received call:ended event:", payload);
      setActiveCall(null);
      showToast(`Call ended by ${payload.endedBy}`, "info");
    };

    socket.on("message:new", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("chat:updated", handleChatUpdated);
    socket.on("messages:read", handleMessagesRead);
    socket.on("unread:update", handleUnreadUpdate);
    socket.on("call:incoming", handleIncomingCall);
    socket.on("call:ended", handleCallEnded);

    return () => {
      socket.emit("leave_chat", { sessionId: selectedSessionId });
      socket.off("message:new", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("chat:updated", handleChatUpdated);
      socket.off("messages:read", handleMessagesRead);
      socket.off("unread:update", handleUnreadUpdate);
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:ended", handleCallEnded);
      
      // Clean up typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedSessionId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (event.target) {
      event.target.value = "";
    }
  };

  const handleSendImage = async () => {
    if (!selectedFile || !selectedSessionId) return;

    try {
      setIsUploading(true);
      await sendChatMessageHttp(selectedSessionId, {
        message: "[Image]",
        messageType: "image",
        file: selectedFile,
        replyToMessageId: replyTo?.id,
      });

      // Don't manually add message - let socket event handle it to avoid duplicates

      setImagePreview(null);
      setSelectedFile(null);
      setReplyTo(null);
    } catch (error) {
      console.error("Failed to send image", error);
      showToast("Failed to send image. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  // Handle input change and emit typing events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    if (!selectedSessionId) return;

    const socket = getChatSocket();
    if (socket && socket.connected) {
      // Emit typing event
      socket.emit("typing", {
        sessionId: selectedSessionId,
        isTyping: value.length > 0,
      });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator after user stops typing
      if (value.length > 0) {
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typing", {
            sessionId: selectedSessionId,
            isTyping: false,
          });
        }, 1000);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedSessionId || isSending) return;

    try {
      setIsSending(true);
      const socket = getChatSocket();
      let shouldFallbackToHttp = true;

      if (socket && socket.connected) {
        await new Promise<void>((resolve) => {
          socket.emit(
            "send_message",
            {
              sessionId: selectedSessionId,
              text: messageInput,
              messageType: "text",
              replyToMessageId: replyTo?.id,
            },
            (response: { success: boolean; error?: string; message?: ChatMessageDto }) => {
              if (!response?.success && response?.error) {
                console.error("Failed to send message via socket:", response.error);
                shouldFallbackToHttp = true;
              } else if (response?.success) {
                shouldFallbackToHttp = false;
              }
              resolve();
            }
          );
        });
      }

      if (shouldFallbackToHttp) {
        const response = await sendChatMessageHttp(selectedSessionId, {
          message: messageInput,
          messageType: "text",
          replyToMessageId: replyTo?.id,
        });

        // When Socket.IO is not connected, we won't receive "message:new".
        // Optimistically append the sent message from HTTP response so the
        // astrologer immediately sees their message in the UI.
        if (response?.success && response.chatMessage) {
          setMessages((prev) => [...prev, response.chatMessage as ChatMessageDto]);
        }
      }

      setMessageInput("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error sending message", error);
      if (typeof window !== "undefined") {
        showToast("Failed to send message. Please try again.", "error");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptRequest = async (sessionId: string) => {
    try {
      await approveChatRequest(sessionId);
      setRequestSessions((prev) => prev.filter((s) => s.id !== sessionId));
      const updatedReq = await getAstrologerChatSessions({ requestStatus: "pending" });
      const updatedChats = await getAstrologerChatSessions({ requestStatus: "approved" });
      setRequestSessions(updatedReq.sessions || []);
      setChatSessions(updatedChats.sessions || []);
    } catch (error) {
      console.error("Failed to approve chat request", error);
    }
  };

  const handleDeclineRequest = async (sessionId: string) => {
    try {
      await rejectChatRequest(sessionId);
      setRequestSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (error) {
      console.error("Failed to reject chat request", error);
    }
  };

  const handleReplyClick = (message: ChatMessageDto) => {
    if (message.isDeleted) return;
    setReplyTo(message);
  };

  const handleDeleteMessage = (messageId: string) => {
    const socket = getChatSocket();
    if (!socket) return;
    socket.emit("delete_message", { messageId });
  };

  const handleCopyMessage = async (text: string | null) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy message", err);
    }
  };

  const handleAcceptCall = async (callId: number) => {
    try {
      const response = await acceptCall(callId);
      if (response.success) {
        setActiveCall(response.callSession);
        setIncomingCall(null);
        showToast("Call accepted! Connecting...", "success");
      }
    } catch (error: any) {
      console.error("Failed to accept call", error);
      showToast(error?.response?.data?.message || "Failed to accept call", "error");
    }
  };

  const handleRejectCall = async (callId: number) => {
    try {
      await rejectCall(callId, "Busy with another client");
      setIncomingCall(null);
      showToast("Call rejected", "info");
    } catch (error: any) {
      console.error("Failed to reject call", error);
      showToast(
        error?.response?.data?.message || "Failed to reject call",
        "error"
      );
    }
  };

  return (
    <div className="flex  h-screen overflow-hidden">
      {/* Left Panel - Chat List */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-80 sm:w-96 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <IoMdArrowBack className="w-5 h-5  text-gray-700" />
              </button>
              <h2 className="text-2xl font-bold" style={{ color: colors.black }}>
                Live Chats
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <RxCross2  className="w-5 h-5 rotate-90 text-gray-700" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "chats"
                ? "text-gray-900 border-b-2 border-[#FFD700] bg-yellow-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Chats
            {chatSessions.filter((s) => s.unreadCount > 0).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#FFD700] text-xs rounded-full">
                {chatSessions.reduce((acc, s) => acc + (s.unreadCount || 0), 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "requests"
                ? "text-gray-900 border-b-2 border-[#FFD700] bg-yellow-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Requests
            {requestSessions.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {requestSessions.length}
              </span>
            )}
          </button>
        </div>

        {/* Chat/Request List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" ? (
            // Chats List
            filteredChats.length > 0 ? (
              filteredChats.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedSessionId === session.id ? "bg-yellow-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-700">
                          {(session.user?.fullName || "?").charAt(0)}
                        </span>
                      </div>
                      {true && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {session.user?.fullName || "User"}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2 shrink-0">
                          {session.lastMessageAt
                            ? new Date(session.lastMessageAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 truncate">
                          {session.lastMessagePreview || "No messages yet"}
                        </p>
                        {session.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-[#FFD700] text-xs rounded-full font-medium shrink-0">
                            {session.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No chats found
              </div>
            )
          ) : (
            // Requests List
            filteredRequests.length > 0 ? (
              filteredRequests.map((session) => (
                <div
                  key={session.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {(session.user?.fullName || "?").charAt(0)}
                      </span>
                    </div>

                    {/* Request Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {session.user?.fullName || "User"}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {session.startTime
                            ? new Date(session.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {session.lastMessagePreview || "New chat request"}
                      </p>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-[#FFD700] text-sm font-medium rounded hover:bg-yellow-500 transition-colors"
                          onClick={() => handleAcceptRequest(session.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 transition-colors"
                          onClick={() => handleDeclineRequest(session.id)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No pending requests
              </div>
            )
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Right Panel - Chat Window */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {selectedUser && selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile: open sidebar */}
                  <button
                    type="button"
                    onClick={() => setShowSidebar(true)}
                    className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Open chat list"
                  >
                    <GiHamburgerMenu className="w-5 h-5 text-gray-800" />
                  </button>
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {(selectedUser.name || "?").charAt(0)}
                      </span>
                    </div>
                    {selectedUser.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedUser.name || "User"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {selectedUser.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button className="p-2 cursor-pointer hover:bg-yellow-200 rounded-full transition-colors" title="Voice Call">
                    <FiPhone className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 cursor-pointer hover:bg-yellow-200 rounded-full transition-colors" title="Video Call">
                    <FiVideo className="w-5 h-5 text-gray-700" />
                  </button>
                  
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-6">

             
             
              <div className="max-w-4xl mx-auto space-y-4 relative z-10">
                {groupMessagesByDate(messages).map((group) => (
                  <div key={group.dateKey}>
                    <div className="flex justify-center mb-4">
                      <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-600 font-medium">{group.label}</p>
                      </div>
                    </div>

                    {group.items.map((message) => {
                      const isAstrologer = message.senderType === "astrologer";
                      const repliedTo = message.replyToMessageId
                        ? messages.find((m) => m.id === message.replyToMessageId) || null
                        : null;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isAstrologer ? "justify-end" : "justify-start"} mb-3`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg shadow-sm ${
                              message.messageType === "image" ? "p-0 overflow-hidden" : "px-4 py-3"
                            } ${
                              isAstrologer ? "bg-[#FFD700] text-gray-900" : " text-gray-900"
                            }`}
                          >
                            {repliedTo && (
                              <div className="mb-1 px-2 py-1 text-[11px] rounded bg-black text-gray-700">
                                <span className="font-semibold mr-1">
                                  Replying to {repliedTo.senderType === "astrologer" ? "You" : selectedUser?.name || "User"}
                                </span>
                                <span className="truncate block max-w-[220px]">
                                  {repliedTo.messageType === "image" ? "[Image]" : (repliedTo.message || "(message)")}
                                </span>
                              </div>
                            )}

                            {message.messageType === "image" && message.fileUrl ? (
                              <img
                                src={message.fileUrl}
                                alt="Sent image"
                                className="rounded-lg max-w-[250px] max-h-[250px] w-auto h-auto cursor-pointer hover:opacity-90 transition object-cover block"
                                onClick={() => window.open(message.fileUrl || "", "_blank")}
                                onError={(e) => {
                                  e.currentTarget.src = "/images/image-error.png";
                                }}
                              />
                            ) : (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                                {message.isDeleted ? "This message was deleted" : message.message}
                              </p>
                            )}
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-600">
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {isAstrologer && (
                                  message.isRead ? (
                                    <div className="flex text-blue-500">
                                      <FiCheck className="w-3 h-3 -mr-1" />
                                      <FiCheck className="w-3 h-3" />
                                    </div>
                                  ) : (
                                    <FiCheck className="w-3 h-3 text-gray-400" />
                                  )
                                )}
                              </div>
                              {!message.isDeleted && (
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(openMenuId === message.id ? null : message.id);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded-full transition"
                                    aria-label="Message options"
                                  >
                                    <FiMoreVertical className="w-3 h-3 text-gray-600" />
                                  </button>
                                  {openMenuId === message.id && (
                                    <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleReplyClick(message);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                                      >
                                        Reply
                                      </button>
                                      {message.messageType === "text" && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleCopyMessage(message.message || null);
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                                        >
                                          Copy
                                        </button>
                                      )}
                                      {isAstrologer && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleDeleteMessage(message.id);
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 transition"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input Area */}
            <div className=" border-t border-gray-200 p-4 relative">              {/* Image Preview Modal */}
              {imagePreview && (
                <div className="mb-3 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-700">Send Image</p>
                    <button
                      type="button"
                      onClick={handleCancelImage}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Cancel"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={handleSendImage}
                      disabled={isUploading}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                    >
                      {isUploading ? "Sending..." : "Send Image"}
                    </button>
                  </div>
                </div>
              )}

              {/* Reply Preview */}              {replyTo && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3">
                  <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-700 mb-0.5">
                        Replying to {replyTo.senderType === "astrologer" ? "You" : selectedUser?.name || "User"}
                      </p>
                      <p className="text-gray-600 truncate max-w-xs">
                        {replyTo.message || "(message)"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      aria-label="Cancel reply"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Attachment Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  title="Attach file"
                >
                  <FiPaperclip className="w-5 h-5 text-gray-600" />
                </button>

                {/* Message Input with Send Button Inside */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-[#FFD700] bg-gray-50"
                  />
                  {/* Typing Indicator */}
                  {isTypingUser && (
                    <div className="absolute -top-8 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm text-xs text-gray-600">
                      {selectedUser?.name || "User"} is typing...
                    </div>
                  )}
                  {/* Send Button Inside Input */}
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSending}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors disabled:opacity-50"
                    title="Send message"
                  >
                    <FiSend className={`w-5 h-5 ${
                      messageInput.trim() ? "text-[#FFD700] hover:text-yellow-600" : "text-gray-400"
                    }`} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          // No Chat Selected
          <div className="flex-1 flex items-center justify-center bg-linear-to-br from-yellow-50 to-orange-50">
            <div className="text-center">
              <div className="text-8xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Live Chats
              </h3>
              <p className="text-gray-600">
                Select a conversation to start chatting with your clients
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="text-center">
              <FiPhone className="w-16 h-16 mx-auto mb-4 text-green-500 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Incoming {incomingCall.callType} Call</h3>
              <p className="text-gray-600 mb-6">
                {incomingCall.user?.fullName || "User"} is calling you
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleRejectCall(incomingCall.id)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAcceptCall(incomingCall.id)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Call Component */}
      {activeCall && activeCall.status !== "rejected" && (
        <AgoraCall 
          callSession={activeCall} 
          onCallEnd={() => setActiveCall(null)} 
        />
      )}
      {toastProps.isVisible && (
        <Toast
          message={toastProps.message}
          type={toastProps.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
