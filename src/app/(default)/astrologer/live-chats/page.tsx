"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiPaperclip,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowBack } from "react-icons/io";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getChatSocket } from "@/utils/chatSocket";
import AgoraCall from "@/components/AgoraCall";
import type { ChatMessageDto, ChatSessionSummary } from "@/store/api/chat";
import type { CallSession } from "@/store/api/call";
import {
  approveChatRequest,
  endAstrologerChatSession,
  getAstrologerChatSessions,
  getChatMessages,
  sendChatMessageHttp,
} from "@/store/api/chat";
import {
  getKundliShareViewForChat,
  getUserKundlisForChat,
  type ChatUserKundliListItem,
} from "@/store/api/chat/kundli";
import {
  acceptCall,
  rejectCall,
} from "@/store/api/call";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import AstrologerChatRequestModal from "@/components/chat/AstrologerChatRequestModal";

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

function LiveChatsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionIdFromUrl = useMemo(
    () => searchParams.get("sessionId"),
    [searchParams]
  );
  const { showToast, toastProps, hideToast } = useToast();
  const [chatSessions, setChatSessions] = useState<ChatSessionSummary[]>([]);
  const [requestSessions, setRequestSessions] = useState<ChatSessionSummary[]>(
    []
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
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
  const [showLeaveSectionConfirm, setShowLeaveSectionConfirm] = useState(false);
  const [showUserEndedModal, setShowUserEndedModal] = useState(false);
  const [userEndedModalName, setUserEndedModalName] = useState<string>("User");
  const [showKundliModal, setShowKundliModal] = useState(false);
  const [kundliModalStep, setKundliModalStep] = useState<"choose" | "render">(
    "choose"
  );
  const [userKundlis, setUserKundlis] = useState<ChatUserKundliListItem[]>([]);
  const [kundliListLoading, setKundliListLoading] = useState(false);
  const [kundliRenderLoading, setKundliRenderLoading] = useState(false);
  const [selectedKundliUrl, setSelectedKundliUrl] = useState<string | null>(
    null
  );
  const [kundliModalError, setKundliModalError] = useState<string | null>(null);
  const [visualViewportHeight, setVisualViewportHeight] = useState<number | null>(
    null
  );
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const messageInputRef = React.useRef<HTMLInputElement | null>(null);
  const autoOpenProcessedSessionRef = React.useRef<string | null>(null);
  const kundliListCacheRef = React.useRef<Map<string, ChatUserKundliListItem[]>>(
    new Map()
  );
  const allowNextPopRef = React.useRef(false);

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

  const hasActiveSelectedChat = useMemo(() => {
    return !!(
      selectedSession &&
      selectedSession.status === "active" &&
      selectedSession.requestStatus === "approved"
    );
  }, [selectedSession]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentState = window.history.state;
    if (!currentState?.__astrologerLiveChatsBackGuard) {
      window.history.pushState(
        {
          ...(currentState || {}),
          __astrologerLiveChatsBackGuard: true,
        },
        "",
        window.location.href
      );
    }

    const handlePopState = () => {
      if (allowNextPopRef.current) {
        allowNextPopRef.current = false;
        return;
      }

      if (hasActiveSelectedChat && selectedSessionId) {
        setShowLeaveSectionConfirm(true);
        window.history.pushState(
          {
            ...(window.history.state || {}),
            __astrologerLiveChatsBackGuard: true,
          },
          "",
          window.location.href
        );
        return;
      }

      allowNextPopRef.current = true;
      window.history.back();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasActiveSelectedChat, selectedSessionId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasActiveSelectedChat || !selectedSessionId) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasActiveSelectedChat, selectedSessionId]);

  const isChoosingKundli = kundliModalStep === "choose";

  const chooseModalWidthClass = useMemo(() => {
    if (kundliListLoading || kundliModalError) return "max-w-3xl";

    if (userKundlis.length <= 1) return "max-w-2xl";
    if (userKundlis.length <= 2) return "max-w-3xl";
    if (userKundlis.length <= 4) return "max-w-4xl";
    return "max-w-6xl";
  }, [kundliListLoading, kundliModalError, userKundlis.length]);

  const chooseModalBodyClass = useMemo(() => {
    if (userKundlis.length > 8) {
      return "max-h-[72vh] overflow-y-auto p-4 sm:p-6";
    }

    if (userKundlis.length > 4) {
      return "max-h-[64vh] overflow-y-auto p-4 sm:p-6";
    }

    return "p-4 sm:p-6";
  }, [userKundlis.length]);

  const chooseGridClass = useMemo(() => {
    if (userKundlis.length <= 1) return "grid grid-cols-1 gap-4";
    if (userKundlis.length <= 2) return "grid grid-cols-1 md:grid-cols-2 gap-4";
    return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4";
  }, [userKundlis.length]);

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

  const refreshSessions = React.useCallback(async () => {
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        getAstrologerChatSessions({
          requestStatus: "approved",
          status: "active",
          page: 1,
          limit: 100,
        }),
        getAstrologerChatSessions({
          requestStatus: "pending",
          page: 1,
          limit: 100,
        }),
      ]);

      const chats = approvedRes.sessions || [];
      const requests = pendingRes.sessions || [];

      setChatSessions(chats);
      setRequestSessions(requests);

      if (sessionIdFromUrl) {
        const matchingSession = chats.find((s) => s.id === sessionIdFromUrl);
        if (matchingSession) {
          setSelectedSessionId(matchingSession.id);
          return;
        }
      }

      if (!selectedSessionId && chats.length > 0) {
        setSelectedSessionId(chats[0].id);
      }
    } catch (error) {
      console.error("Failed to load astrologer chat sessions", error);
    }
  }, [selectedSessionId, sessionIdFromUrl]);

  useEffect(() => {
    if (!sessionIdFromUrl || chatSessions.length === 0) return;
    const matchingSession = chatSessions.find((s) => s.id === sessionIdFromUrl);
    if (matchingSession && selectedSessionId !== matchingSession.id) {
      setSelectedSessionId(matchingSession.id);
    }
  }, [sessionIdFromUrl, chatSessions, selectedSessionId]);

  // If opened from notification with a pending request sessionId, auto-approve and open it.
  useEffect(() => {
    if (!sessionIdFromUrl) return;
    if (autoOpenProcessedSessionRef.current === sessionIdFromUrl) return;

    const alreadyApproved = chatSessions.some((s) => s.id === sessionIdFromUrl);
    if (alreadyApproved) {
      autoOpenProcessedSessionRef.current = sessionIdFromUrl;
      setSelectedSessionId(sessionIdFromUrl);
      return;
    }

    const pending = requestSessions.find((s) => s.id === sessionIdFromUrl);
    if (!pending) return;

    autoOpenProcessedSessionRef.current = sessionIdFromUrl;

    const autoApproveAndOpen = async () => {
      try {
        try {
          await approveChatRequest(sessionIdFromUrl, false);
        } catch (error: any) {
          const statusCode = error?.response?.status;
          const requiresForce = !!error?.response?.data?.requiresForce;
          if (statusCode === 409 && requiresForce) {
            await approveChatRequest(sessionIdFromUrl, true);
          } else {
            throw error;
          }
        }

        await refreshSessions();
        setSelectedSessionId(sessionIdFromUrl);
      } catch (error) {
        console.error("Failed to auto-approve notification chat session", error);
        showToast("Could not auto-open chat request", "error");
      }
    };

    autoApproveAndOpen();
  }, [sessionIdFromUrl, chatSessions, requestSessions, refreshSessions, showToast]);

  // Load astrologer chat sessions and requests
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    const refreshOnEvent = () => {
      refreshSessions();
    };

    window.addEventListener("astrologer_chat_sessions_refresh", refreshOnEvent);
    return () => {
      window.removeEventListener("astrologer_chat_sessions_refresh", refreshOnEvent);
    };
  }, [refreshSessions]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
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

    const handleNewMessage = (payload: {
      sessionId: string;
      message: ChatMessageDto;
    }) => {
      if (payload.sessionId !== selectedSessionId) return;

      setMessages((prev) => {
        // Check if message already exists to avoid duplicates
        if (prev.some((m) => m.id === payload.message.id)) {
          return prev;
        }
        return [...prev, payload.message];
      });

      // Mark as read immediately when astrologer has this chat open
      if (payload.message.senderType === "user") {
        socket.emit("mark_read", { sessionId: selectedSessionId });
      }
    };

    const handleTyping = (payload: {
      sessionId: string;
      from: "user" | "astrologer";
      isTyping: boolean;
    }) => {
      if (payload.sessionId !== selectedSessionId) return;
      if (payload.from === "user") {
        setIsTypingUser(payload.isTyping);
      }
    };

    const handleChatUpdated = (payload: {
      sessionId: string;
      session: ChatSessionSummary;
    }) => {
      const incoming = payload.session;

      if (incoming.status !== "active" || incoming.requestStatus !== "approved") {
        setChatSessions((prev) => prev.filter((s) => s.id !== payload.sessionId));
      } else {
        setChatSessions((prev) =>
          prev.map((s) =>
            s.id === payload.sessionId
              ? {
                  // Preserve existing related data like user details
                  ...s,
                  ...incoming,
                  user: s.user,
                }
              : s
          )
        );
      }

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

    const handleChatEnded = (payload: {
      sessionId: string;
      endedBy: string;
      reason?: string;
    }) => {
      const endedSession = chatSessions.find((s) => s.id === payload.sessionId);
      setChatSessions((prev) => prev.filter((s) => s.id !== payload.sessionId));

      if (payload.endedBy === "user") {
        setUserEndedModalName(endedSession?.user?.fullName || "User");
        setShowUserEndedModal(true);
      }

      if (payload.sessionId === selectedSessionId) {
        setSelectedSessionId(null);
        setMessages([]);
        showToast("Chat ended", "info");
      }
    };

    const handleMessagesRead = (payload: {
      sessionId: string;
      readerRole: "user" | "astrologer";
    }) => {
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

    const handleUnreadUpdate = (payload: {
      sessionId: string;
      unreadCount: number;
      viewerRole: "user" | "astrologer";
    }) => {
      if (payload.viewerRole !== "astrologer") return;

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === payload.sessionId
            ? { ...s, unreadCount: payload.unreadCount }
            : s
        )
      );
    };

    const handleIncomingCall = (payload: { callSession: CallSession }) => {
      console.log("[Astrologer] Received call:incoming event:", payload);
      setIncomingCall(payload.callSession);
      console.log("[Astrologer] Set incomingCall state:", payload.callSession);
    };

    const handleCallEnded = (payload: {
      callSession: CallSession;
      endedBy: string;
    }) => {
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
    socket.on("chat:ended", handleChatEnded);

    return () => {
      socket.emit("leave_chat", { sessionId: selectedSessionId });
      socket.off("message:new", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("chat:updated", handleChatUpdated);
      socket.off("messages:read", handleMessagesRead);
      socket.off("unread:update", handleUnreadUpdate);
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:ended", handleCallEnded);
      socket.off("chat:ended", handleChatEnded);

      // Clean up typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedSessionId, showToast, chatSessions]);

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
            (response: {
              success: boolean;
              error?: string;
              message?: ChatMessageDto;
            }) => {
              if (!response?.success && response?.error) {
                console.error(
                  "Failed to send message via socket:",
                  response.error
                );
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
          setMessages((prev) => [
            ...prev,
            response.chatMessage as ChatMessageDto,
          ]);
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

  const requestLeaveSection = () => {
    if (!hasActiveSelectedChat || !selectedSessionId) {
      router.back();
      return;
    }

    setShowLeaveSectionConfirm(true);
  };

  const confirmLeaveSectionAndEndChat = async () => {
    if (!selectedSessionId) {
      setShowLeaveSectionConfirm(false);
      router.back();
      return;
    }

    try {
      await endAstrologerChatSession(selectedSessionId);
      setChatSessions((prev) => prev.filter((s) => s.id !== selectedSessionId));
      setSelectedSessionId(null);
      setMessages([]);
      showToast("Chat ended", "success");
      setShowLeaveSectionConfirm(false);
      router.back();
    } catch (error) {
      console.error("Failed to end chat while leaving section", error);
      showToast("Could not end active chat", "error");
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
      showToast(
        error?.response?.data?.message || "Failed to accept call",
        "error"
      );
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

  const closeKundliModal = () => {
    setShowKundliModal(false);
    setKundliModalStep("choose");
    setSelectedKundliUrl(null);
    setKundliModalError(null);
  };

  const openKundliChooser = async () => {
    if (!selectedSessionId) {
      showToast("Select a chat first", "info");
      return;
    }

    setShowKundliModal(true);
    setKundliModalStep("choose");
    setSelectedKundliUrl(null);
    setKundliModalError(null);

    const cached = kundliListCacheRef.current.get(selectedSessionId);
    if (cached) {
      setUserKundlis(cached);
      return;
    }

    try {
      setKundliListLoading(true);
      const response = await getUserKundlisForChat(selectedSessionId);
      const list = response.userRequests || [];
      setUserKundlis(list);
      kundliListCacheRef.current.set(selectedSessionId, list);
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to load generated kundlis";
      setKundliModalError(message);
      showToast(message, "error");
    } finally {
      setKundliListLoading(false);
    }
  };

  const renderSelectedKundli = async (userRequestId: string) => {
    if (!selectedSessionId) return;

    try {
      setKundliRenderLoading(true);
      setKundliModalError(null);

      const response = await getKundliShareViewForChat(
        selectedSessionId,
        userRequestId
      );

      let embedUrl = response.shareUrl;
      try {
        const parsed = new URL(response.shareUrl, window.location.origin);
        parsed.searchParams.set("embed", "1");
        embedUrl = parsed.toString();
      } catch {
        embedUrl = `${response.shareUrl}${response.shareUrl.includes("?") ? "&" : "?"}embed=1`;
      }

      setSelectedKundliUrl(embedUrl);
      setKundliModalStep("render");
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to open kundli report";
      setKundliModalError(message);
      showToast(message, "error");
    } finally {
      setKundliRenderLoading(false);
    }
  };

  const formatUserRequestDate = (value: string) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const viewport = window.visualViewport;
    const syncViewportHeight = () => {
      setVisualViewportHeight(Math.round(viewport.height));
    };

    syncViewportHeight();
    viewport.addEventListener("resize", syncViewportHeight);

    return () => {
      viewport.removeEventListener("resize", syncViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevHtmlOverscrollY = html.style.overscrollBehaviorY;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevBodyOverscrollY = body.style.overscrollBehaviorY;

    html.style.overflow = "hidden";
    html.style.height = "100%";
    html.style.overscrollBehaviorY = "none";

    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.overscrollBehaviorY = "none";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      html.style.overscrollBehaviorY = prevHtmlOverscrollY;

      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      body.style.overscrollBehaviorY = prevBodyOverscrollY;
    };
  }, []);

  const rootContainerStyle =
    visualViewportHeight && visualViewportHeight > 0
      ? { height: `${visualViewportHeight}px` }
      : undefined;

  return (
    <div
      className="flex h-dvh min-h-0 overflow-hidden overscroll-none"
      style={rootContainerStyle}
    >
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="border-b border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={requestLeaveSection}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Go back"
            >
              <IoMdArrowBack className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Live Chats
            </h2>
          </div>
        </div>

        {selectedUser && selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="shrink-0 border-b border-gray-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
                      <span className="text-base sm:text-lg font-semibold text-gray-700">
                        {(selectedUser.name || "?").charAt(0)}
                      </span>
                    </div>
                    {selectedUser.online && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {selectedUser.name || "User"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {selectedUser.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={openKundliChooser}
                    className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-yellow-100 text-gray-800 hover:bg-yellow-200 transition-colors"
                    title="View User Generated Kundli"
                  >
                    Kundli
                  </button>
                  <button
                    className="p-1.5 sm:p-2 cursor-pointer hover:bg-yellow-200 rounded-full transition-colors"
                    title="Voice Call"
                  >
                    <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                  <button
                    className="p-1.5 sm:p-2 cursor-pointer hover:bg-yellow-200 rounded-full transition-colors"
                    title="Video Call"
                  >
                    <FiVideo className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6">
              <div className="max-w-4xl mx-auto space-y-4 relative z-10">
                {groupMessagesByDate(messages).map((group) => (
                  <div key={group.dateKey}>
                    <div className="flex justify-center mb-4">
                      <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-600 font-medium">
                          {group.label}
                        </p>
                      </div>
                    </div>

                    {group.items.map((message) => {
                      const isAstrologer = message.senderType === "astrologer";
                      const repliedTo = message.replyToMessageId
                        ? messages.find(
                            (m) => m.id === message.replyToMessageId
                          ) || null
                        : null;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isAstrologer ? "justify-end" : "justify-start"
                          } mb-3`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg shadow-sm ${
                              message.messageType === "image"
                                ? "p-0 overflow-hidden"
                                : "px-4 py-3"
                            } ${
                              isAstrologer
                                ? "bg-[#FFD700] text-gray-900"
                                : " text-gray-900"
                            }`}
                          >
                            {repliedTo && (
                              <div className="mb-1 px-2 py-1 text-[11px] rounded bg-black text-gray-700">
                                <span className="font-semibold mr-1">
                                  Replying to{" "}
                                  {repliedTo.senderType === "astrologer"
                                    ? "You"
                                    : selectedUser?.name || "User"}
                                </span>
                                <span className="truncate block max-w-[220px]">
                                  {repliedTo.messageType === "image"
                                    ? "[Image]"
                                    : repliedTo.message || "(message)"}
                                </span>
                              </div>
                            )}

                            {message.messageType === "image" &&
                            message.fileUrl ? (
                              <img
                                src={message.fileUrl}
                                alt="Sent image"
                                className="rounded-lg max-w-[250px] max-h-[250px] w-auto h-auto cursor-pointer hover:opacity-90 transition object-cover block"
                                onClick={() =>
                                  window.open(message.fileUrl || "", "_blank")
                                }
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/images/image-error.png";
                                }}
                              />
                            ) : (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                                {message.isDeleted
                                  ? "This message was deleted"
                                  : message.message}
                              </p>
                            )}
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-600">
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {isAstrologer &&
                                  (message.isRead ? (
                                    <div className="flex text-blue-500">
                                      <FiCheck className="w-3 h-3 -mr-1" />
                                      <FiCheck className="w-3 h-3" />
                                    </div>
                                  ) : (
                                    <FiCheck className="w-3 h-3 text-gray-400" />
                                  ))}
                              </div>
                              {!message.isDeleted && (
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(
                                        openMenuId === message.id
                                          ? null
                                          : message.id
                                      );
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
                                            handleCopyMessage(
                                              message.message || null
                                            );
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
            <div className="shrink-0 border-t border-gray-200 p-4 relative">
              {" "}
              {/* Image Preview Modal */}
              {imagePreview && (
                <div className="mb-3 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Send Image
                    </p>
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
              {/* Reply Preview */}{" "}
              {replyTo && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3">
                  <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-700 mb-0.5">
                        Replying to{" "}
                        {replyTo.senderType === "astrologer"
                          ? "You"
                          : selectedUser?.name || "User"}
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
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
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
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                  title="Attach file"
                >
                  <FiPaperclip className="w-5 h-5 text-gray-600" />
                </button>

                {/* Message Input with Send Button Inside */}
                <div className="flex-1 relative">
                  <input
                    ref={messageInputRef}
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
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors disabled:opacity-50"
                    title="Send message"
                  >
                    <FiSend
                      className={`w-5 h-5 ${
                        messageInput.trim()
                          ? "text-[#FFD700] hover:text-yellow-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          // No Chat Selected
          <div className="flex-1 flex items-center justify-center bg-linear-to-br from-yellow-50 to-orange-50 p-4">
            <div className="text-center max-w-md">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4">
                💬
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Welcome to Live Chats
              </h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">
                {chatSessions.length === 0 && requestSessions.length === 0
                  ? "No chats or requests yet. Waiting for clients..."
                  : "No active chat right now. Waiting for the next client..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {showKundliModal && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
          <div
            className={`w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              isChoosingKundli
                ? `${chooseModalWidthClass} h-auto`
                : "max-w-6xl h-[90vh]"
            }`}
          >
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {kundliModalStep === "render" && (
                  <button
                    type="button"
                    onClick={() => {
                      setKundliModalStep("choose");
                      setSelectedKundliUrl(null);
                      setKundliModalError(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {kundliModalStep === "choose"
                    ? "Choose User Generated Kundli"
                    : "Kundli Report"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeKundliModal}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close kundli modal"
              >
                <RxCross2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className={isChoosingKundli ? "bg-gray-50" : "flex-1 min-h-0 bg-gray-50"}>
              {kundliModalStep === "choose" ? (
                <div className={chooseModalBodyClass}>
                  {kundliListLoading ? (
                    <div className="min-h-[180px] flex items-center justify-center text-gray-600">
                      Loading user generated kundlis...
                    </div>
                  ) : kundliModalError ? (
                    <div className="min-h-[180px] flex flex-col items-center justify-center text-center px-4">
                      <p className="text-red-600 font-medium">{kundliModalError}</p>
                      <button
                        type="button"
                        onClick={openKundliChooser}
                        className="mt-3 px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-500"
                      >
                        Retry
                      </button>
                    </div>
                  ) : userKundlis.length === 0 ? (
                    <div className="min-h-[180px] flex items-center justify-center text-gray-600">
                      No user-generated kundli found.
                    </div>
                  ) : (
                    <div className={chooseGridClass}>
                      {userKundlis.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => renderSelectedKundli(item.id)}
                          disabled={kundliRenderLoading}
                          className="text-left rounded-xl border border-gray-200 bg-white p-4 hover:border-yellow-400 hover:shadow-sm transition disabled:opacity-60"
                        >
                          <h4 className="font-semibold text-gray-900 truncate">
                            {item.fullName || "User"}
                          </h4>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>Date: {formatUserRequestDate(item.dateOfbirth)}</p>
                            <p>Time: {item.timeOfbirth || "--"}</p>
                            <p className="wrap-break-word">
                              Place: {item.placeOfBirth || "--"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full">
                  {kundliRenderLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-600">
                      Opening kundli report...
                    </div>
                  ) : selectedKundliUrl ? (
                    <iframe
                      src={selectedKundliUrl}
                      title="User Kundli Report"
                      className="w-full h-full border-0 bg-white"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-600">
                      Select a kundli to continue.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-sm sm:max-w-md shadow-xl">
            <div className="text-center">
              <FiPhone className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-green-500 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Incoming {incomingCall.callType} Call
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
                {incomingCall.user?.fullName || "User"} is calling you
              </p>
              <div className="flex gap-2 sm:gap-3 justify-center">
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

      {showLeaveSectionConfirm && (
        <div className="fixed inset-0 z-131 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Leave This Chat?</h3>
            <p className="mt-2 text-sm text-gray-600">
              As soon as you go back, this active chat will end immediately for both you and the user.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLeaveSectionConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={confirmLeaveSectionAndEndChat}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
              >
                Back And End Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserEndedModal && (
        <div className="fixed inset-0 z-132 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Chat Ended By User</h3>
            <p className="mt-2 text-sm text-gray-600">
              {userEndedModalName} ended the chat session.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowUserEndedModal(false)}
                className="rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-500"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      <AstrologerChatRequestModal />

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

export default function LiveChatsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
          Loading chats...
        </div>
      }
    >
      <LiveChatsPageContent />
    </Suspense>
  );
}
