"use client";
import React, { useState, useRef, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Send, ArrowLeft, Phone, ChevronRight, X, MoreVertical, Video, Clock, AlertCircle, Wallet as WalletIcon } from 'lucide-react';
import { IoChatbubblesSharp } from "react-icons/io5";
import Image from 'next/image';
import {  FiPaperclip, FiCheck } from 'react-icons/fi';
import { TfiWallet } from "react-icons/tfi";
import { GiHamburgerMenu } from "react-icons/gi";
import { colors } from '@/utils/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import { getChatSocket } from "@/utils/chatSocket";
import AgoraCall from "@/components/AgoraCall";
import type { ChatMessageDto, ChatSessionSummary } from "@/store/api/chat";
import type { CallSession } from "@/store/api/call";
import {
  endChatSession,
  getMyChatSessions,
  getChatMessages,
  startChatSession,
  sendChatMessageHttp,
} from "@/store/api/chat";
import {
  initiateCall,
} from "@/store/api/call";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { useAstrologerChatWallet } from "@/hooks/useAstrologerChatWallet";
import Link from "next/link";

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

type SessionMessageCache = {
  messages: ChatMessageDto[];
  cachedAt: number;
  totalPages: number;
  oldestLoadedPage: number;
  newestLoadedPage: number;
};

const MESSAGE_PAGE_SIZE = 50;
const MESSAGE_CACHE_TTL_MS = 30_000;
const LOAD_OLDER_SCROLL_THRESHOLD = 100;
const STICK_TO_BOTTOM_THRESHOLD = 48;

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

function ChatPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();
  const { showToast, toastProps, hideToast } = useToast();
  const searchParams = useSearchParams();
  const astrologerIdFromUrl = useMemo(
    () => searchParams.get("astrologerId"),
    [searchParams]
  );
  const [showSidebar, setShowSidebar] = useState(false);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [replyTo, setReplyTo] = useState<ChatMessageDto | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTypingAstrologer, setIsTypingAstrologer] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);
  const [isChatSessionActive, setIsChatSessionActive] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [inviteSecondsLeft, setInviteSecondsLeft] = useState(0);
  const [pendingRequestSessionId, setPendingRequestSessionId] = useState<string | null>(null);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [isMobileAppWebView, setIsMobileAppWebView] = useState(false);
  const [visualViewportHeight, setVisualViewportHeight] = useState<number | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const astrologerTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inviteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingSentRef = useRef(false);
  const selectedSessionIdRef = useRef<string | null>(null);
  const isWaitingForApprovalRef = useRef(false);
  const isChatSessionActiveRef = useRef(false);
  const lastMarkReadAtRef = useRef<Map<string, number>>(new Map());
  const messageCacheRef = useRef<Map<string, SessionMessageCache>>(new Map());
  const messageFetchRef = useRef<Map<string, Promise<ChatMessageDto[]>>>(new Map());
  const olderMessageFetchRef = useRef<Map<string, Promise<void>>>(new Map());
  const pendingScrollAnchorRef = useRef<
    { sessionId: string; previousHeight: number; previousTop: number } | null
  >(null);
  const shouldStickToBottomRef = useRef(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectMobileAppWebView = () => {
      const fromBridge = Boolean(
        (window as Window & { ReactNativeWebView?: unknown }).ReactNativeWebView
      );
      const fromWindow = Boolean(
        (window as Window & { isGrahoMobileApp?: boolean }).isGrahoMobileApp
      );
      const fromStorage = window.localStorage.getItem("isGrahoMobileApp") === "true";

      if (fromBridge || fromWindow || fromStorage) {
        setIsMobileAppWebView(true);
      }
    };

    detectMobileAppWebView();
    const firstRetry = window.setTimeout(detectMobileAppWebView, 300);
    const secondRetry = window.setTimeout(detectMobileAppWebView, 1200);

    return () => {
      window.clearTimeout(firstRetry);
      window.clearTimeout(secondRetry);
    };
  }, []);

  useEffect(() => {
    if (!isMobileAppWebView) return;
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
  }, [isMobileAppWebView]);

  useEffect(() => {
    if (!isMobileAppWebView) return;
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
  }, [isMobileAppWebView]);

  const selectedSession = useMemo(
    () => sessions.find((s) => s.id === selectedSessionId) || null,
    [sessions, selectedSessionId]
  );

  const targetAstrologerId = useMemo(() => {
    if (astrologerIdFromUrl) return astrologerIdFromUrl;
    if (selectedSession) return selectedSession.astrologerId;
    if (sessions.length === 1) return sessions[0].astrologerId;
    return null;
  }, [astrologerIdFromUrl, selectedSession, sessions]);

  const astrologerInfo = useMemo(() => {
    if (!selectedSession || !selectedSession.astrologer) return null;
    return {
      name: selectedSession.astrologer.fullName,
      title: "Astrologer", // Could be extended when backend exposes skills
      photo: selectedSession.astrologer.photo || "/images/logo.png",
      isOnline: true,
    };
  }, [selectedSession]);

  const astrologerPricePerMinute = useMemo(() => {
    // Treat 0, null, undefined as invalid - use fallback
    const sessionPriceRaw = selectedSession?.pricePerMinute as any;
    const sessionPrice =
      sessionPriceRaw !== undefined && sessionPriceRaw !== null
        ? Number(sessionPriceRaw)
        : undefined;

    const astrologerPriceRaw = (selectedSession?.astrologer as any)?.pricePerMinute;
    const astrologerPrice =
      astrologerPriceRaw !== undefined && astrologerPriceRaw !== null
        ? Number(astrologerPriceRaw)
        : undefined;

    const price = sessionPrice && sessionPrice > 0
      ? sessionPrice
      : astrologerPrice && astrologerPrice > 0
      ? astrologerPrice
      : 10;
    console.log('=== PRICE DEBUG ===');
    console.log('selectedSession.pricePerMinute:', sessionPrice);
    console.log('selectedSession.astrologer?.pricePerMinute:', astrologerPrice);
    console.log('Final price:', price);
    return price;
  }, [selectedSession]);

  const rootContainerStyle = {
    ...(isMobileAppWebView && visualViewportHeight && visualViewportHeight > 0
      ? { height: `${visualViewportHeight}px` }
      : {}),
    ...(isMobileAppWebView
      ? {
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
          boxSizing: "border-box" as const,
        }
      : {}),
  };

  // Wallet integration
  const {
    balance,
    isChatting,
    chatDuration,
    chatCost,
    startChatTimer,
    stopChatTimer,
    hasSufficientBalance,
    pricePerMinute,
  } = useAstrologerChatWallet({
    userId: user?.id ? String(user.id) : undefined,
    astrologerPricePerMinute,
    onInsufficientBalance: () => {
      setShowInsufficientBalanceModal(true);
      showToast("Insufficient balance. Please recharge your wallet.", "error");
    },
  });

  const showToastRef = useRef(showToast);
  const startChatTimerRef = useRef(startChatTimer);
  const stopChatTimerRef = useRef(stopChatTimer);

  useEffect(() => {
    selectedSessionIdRef.current = selectedSessionId;
  }, [selectedSessionId]);

  useEffect(() => {
    setIsTypingAstrologer(false);
    if (astrologerTypingTimeoutRef.current) {
      clearTimeout(astrologerTypingTimeoutRef.current);
      astrologerTypingTimeoutRef.current = null;
    }
  }, [selectedSessionId]);

  useEffect(() => {
    isWaitingForApprovalRef.current = isWaitingForApproval;
  }, [isWaitingForApproval]);

  useEffect(() => {
    isChatSessionActiveRef.current = isChatSessionActive;
  }, [isChatSessionActive]);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    startChatTimerRef.current = startChatTimer;
  }, [startChatTimer]);

  useEffect(() => {
    stopChatTimerRef.current = stopChatTimer;
  }, [stopChatTimer]);

  const cacheSessionMessages = useCallback(
    (
      sessionId: string,
      sessionMessages: ChatMessageDto[],
      metadata?: Partial<Pick<SessionMessageCache, "totalPages" | "oldestLoadedPage" | "newestLoadedPage">>
    ) => {
      const existing = messageCacheRef.current.get(sessionId);

      messageCacheRef.current.set(sessionId, {
        messages: sessionMessages,
        cachedAt: Date.now(),
        totalPages: metadata?.totalPages ?? existing?.totalPages ?? 1,
        oldestLoadedPage: metadata?.oldestLoadedPage ?? existing?.oldestLoadedPage ?? 1,
        newestLoadedPage: metadata?.newestLoadedPage ?? existing?.newestLoadedPage ?? 1,
      });
    },
    []
  );

  const getFreshCachedSession = useCallback((sessionId: string) => {
    const cacheEntry = messageCacheRef.current.get(sessionId);
    if (!cacheEntry) return null;

    if (Date.now() - cacheEntry.cachedAt > MESSAGE_CACHE_TTL_MS) {
      return null;
    }

    return cacheEntry;
  }, []);

  const fetchLatestSessionMessages = useCallback(async (sessionId: string) => {
    const firstPage = await getChatMessages(sessionId, {
      page: 1,
      limit: MESSAGE_PAGE_SIZE,
    });

    const totalPages = firstPage.pagination?.totalPages || 1;

    if (totalPages <= 1) {
      return {
        messages: firstPage.messages || [],
        totalPages,
        latestPage: 1,
      };
    }

    const latestPage = await getChatMessages(sessionId, {
      page: totalPages,
      limit: MESSAGE_PAGE_SIZE,
    });

    return {
      messages: latestPage.messages || [],
      totalPages,
      latestPage: totalPages,
    };
  }, []);

  const loadSessionMessages = useCallback(
    async (sessionId: string, force = false) => {
      if (!force) {
        const cached = getFreshCachedSession(sessionId);
        if (cached) {
          return cached.messages;
        }
      }

      const ongoingRequest = messageFetchRef.current.get(sessionId);
      if (ongoingRequest) {
        return ongoingRequest;
      }

      const requestPromise = (async () => {
        try {
          const latestResult = await fetchLatestSessionMessages(sessionId);
          const existingCache = messageCacheRef.current.get(sessionId);
          const existingCachedMessages = existingCache?.messages || [];
          const mergedMap = new Map<string, ChatMessageDto>();

          latestResult.messages.forEach((message) => {
            mergedMap.set(message.id, message);
          });

          existingCachedMessages.forEach((message) => {
            if (!mergedMap.has(message.id)) {
              mergedMap.set(message.id, message);
            }
          });

          const mergedMessages = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          cacheSessionMessages(sessionId, mergedMessages, {
            totalPages: latestResult.totalPages,
            oldestLoadedPage: Math.min(existingCache?.oldestLoadedPage ?? latestResult.latestPage, latestResult.latestPage),
            newestLoadedPage: latestResult.latestPage,
          });

          return mergedMessages;
        } finally {
          messageFetchRef.current.delete(sessionId);
        }
      })();

      messageFetchRef.current.set(sessionId, requestPromise);
      return requestPromise;
    },
    [cacheSessionMessages, fetchLatestSessionMessages, getFreshCachedSession]
  );

  const updateSessionMessages = useCallback(
    (sessionId: string, updater: (previous: ChatMessageDto[]) => ChatMessageDto[]) => {
      const previous = messageCacheRef.current.get(sessionId)?.messages || [];
      const next = updater(previous);
      cacheSessionMessages(sessionId, next);

      if (selectedSessionIdRef.current === sessionId) {
        setMessages(next);
      }
    },
    [cacheSessionMessages]
  );

  const loadOlderMessages = useCallback(async () => {
    const activeSessionId = selectedSessionIdRef.current;
    if (!activeSessionId) return;

    const activeCache = messageCacheRef.current.get(activeSessionId);
    if (!activeCache || activeCache.oldestLoadedPage <= 1) {
      return;
    }

    const existingRequest = olderMessageFetchRef.current.get(activeSessionId);
    if (existingRequest) {
      await existingRequest;
      return;
    }

    const scrollContainer = chatScrollRef.current;
    if (scrollContainer) {
      pendingScrollAnchorRef.current = {
        sessionId: activeSessionId,
        previousHeight: scrollContainer.scrollHeight,
        previousTop: scrollContainer.scrollTop,
      };
    }

    setIsLoadingOlderMessages(true);
    const targetPage = activeCache.oldestLoadedPage - 1;

    const requestPromise = (async () => {
      try {
        const olderPage = await getChatMessages(activeSessionId, {
          page: targetPage,
          limit: MESSAGE_PAGE_SIZE,
        });

        const olderMessages = olderPage.messages || [];

        updateSessionMessages(activeSessionId, (previous) => {
          const mergedMap = new Map<string, ChatMessageDto>();

          olderMessages.forEach((message) => {
            mergedMap.set(message.id, message);
          });

          previous.forEach((message) => {
            if (!mergedMap.has(message.id)) {
              mergedMap.set(message.id, message);
            }
          });

          return Array.from(mergedMap.values()).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

        const cacheAfterMerge = messageCacheRef.current.get(activeSessionId);
        if (cacheAfterMerge) {
          cacheSessionMessages(activeSessionId, cacheAfterMerge.messages, {
            totalPages: olderPage.pagination?.totalPages || cacheAfterMerge.totalPages,
            oldestLoadedPage: targetPage,
            newestLoadedPage: cacheAfterMerge.newestLoadedPage,
          });
        }
      } catch (error) {
        console.error("Failed to load older chat messages", error);
      } finally {
        olderMessageFetchRef.current.delete(activeSessionId);
        if (selectedSessionIdRef.current === activeSessionId) {
          setIsLoadingOlderMessages(false);
        }
      }
    })();

    olderMessageFetchRef.current.set(activeSessionId, requestPromise);
    await requestPromise;
  }, [cacheSessionMessages, updateSessionMessages]);

  const handleMessageAreaScroll = useCallback(() => {
    const container = chatScrollRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < STICK_TO_BOTTOM_THRESHOLD;

    if (container.scrollTop <= LOAD_OLDER_SCROLL_THRESHOLD) {
      void loadOlderMessages();
    }
  }, [loadOlderMessages]);

  const emitMarkRead = useCallback((sessionId: string, force = false) => {
    const now = Date.now();
    const lastSent = lastMarkReadAtRef.current.get(sessionId) || 0;

    if (!force && now - lastSent < 1200) {
      return;
    }

    const socket = getChatSocket();
    if (!socket || !socket.connected) {
      return;
    }

    socket.emit("mark_read", { sessionId });
    lastMarkReadAtRef.current.set(sessionId, now);
  }, []);

  const userDisplayName = user?.fullName || "Friend";

  const selectedSessionUnread = useMemo(() => {
    if (!selectedSession) return 0;
    return selectedSession.unreadCount || 0;
  }, [selectedSession]);

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

  const messageLookupById = useMemo(() => {
    const lookup = new Map<string, ChatMessageDto>();
    messages.forEach((message) => {
      lookup.set(message.id, message);
    });
    return lookup;
  }, [messages]);

  const selectedSessionCache = selectedSessionId
    ? messageCacheRef.current.get(selectedSessionId) || null
    : null;

  const hasOlderMessages = !!selectedSessionCache && selectedSessionCache.oldestLoadedPage > 1;

  const clearInviteTimer = useCallback(() => {
    if (inviteTimerRef.current) {
      clearInterval(inviteTimerRef.current);
      inviteTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isWaitingForApproval) {
      clearInviteTimer();
      return;
    }

    clearInviteTimer();
    inviteTimerRef.current = setInterval(() => {
      setInviteSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInviteTimer();
          setIsWaitingForApproval(false);
          setPendingRequestSessionId(null);
          showToast("Chat request timed out. Please try again.", "error");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInviteTimer();
    };
  }, [clearInviteTimer, isWaitingForApproval, showToast]);

  // Ensure only one session per astrologer is displayed in Conversations
  const uniqueSessionsByAstrologer = useMemo(() => {
    const map = new Map<string, ChatSessionSummary>();
    sessions.forEach((session) => {
      const key = session.astrologerId;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, session);
      }
    });
    return Array.from(map.values());
  }, [sessions]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [isLoggedIn, loading, router]);

  // Load existing chat sessions for the logged-in user
  useEffect(() => {
    if (!isLoggedIn || loading) return;

    const fetchSessions = async () => {
      try {
        const data = await getMyChatSessions({ page: 1, limit: 50 });
        const list = data.sessions || [];
        setSessions(list);

        if (astrologerIdFromUrl) {
          // Try to find an existing session for this astrologer
          const existing = list.find(
            (s) => s.astrologerId === astrologerIdFromUrl
          );

          if (existing) {
            setSelectedSessionId(existing.id);
          } else {
            // Start a new session for this astrologer
            const { session } = await startChatSession(astrologerIdFromUrl);
            setSessions((prev) => [session, ...prev]);
            setSelectedSessionId(session.id);
          }
        } else if (list.length > 0) {
          setSelectedSessionId(list[0].id);
        }
      } catch (error) {
        console.error("Failed to load chat sessions", error);
      }
    };

    fetchSessions();
  }, [isLoggedIn, loading, astrologerIdFromUrl]);

  // Load messages when session changes
  useEffect(() => {
    if (!selectedSessionId) return;

    shouldStickToBottomRef.current = true;
    setIsLoadingOlderMessages(false);

    let cancelled = false;
    const cached = getFreshCachedSession(selectedSessionId);

    if (cached) {
      setMessages(cached.messages);
      return;
    }

    // Avoid showing previous session messages while loading a new session.
    setMessages([]);

    loadSessionMessages(selectedSessionId)
      .then((loadedMessages) => {
        if (cancelled) return;
        if (selectedSessionIdRef.current !== selectedSessionId) return;
        setMessages(loadedMessages);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load chat messages", error);
      });

    return () => {
      cancelled = true;
    };
  }, [getFreshCachedSession, loadSessionMessages, selectedSessionId]);

  useEffect(() => {
    if (!pendingRequestSessionId || !selectedSessionId) return;
    if (pendingRequestSessionId !== selectedSessionId) {
      setIsWaitingForApproval(false);
      setInviteSecondsLeft(0);
      setPendingRequestSessionId(null);
      clearInviteTimer();
    }
  }, [pendingRequestSessionId, selectedSessionId]);

  // Setup Socket.IO listeners for the selected session
  useEffect(() => {
    if (!selectedSessionId || !isLoggedIn || loading) return;

    const socket = getChatSocket();
    if (!socket) return;

    const activeSessionId = selectedSessionId;

    const ensureRoomJoin = () => {
      socket.emit("join_chat", { sessionId: activeSessionId });
      // Mark messages as read when opening/rejoining a chat.
      emitMarkRead(activeSessionId, true);
    };

    ensureRoomJoin();

    const handleNewMessage = (payload: { sessionId: string; message: ChatMessageDto }) => {
      if (payload.sessionId !== selectedSessionIdRef.current) return;
      
      // Add new message to the list (whether it's text or image)
      updateSessionMessages(payload.sessionId, (prev) => {
        // Check if message already exists to avoid duplicates
        if (prev.some(m => m.id === payload.message.id)) {
          return prev;
        }
        return [...prev, payload.message];
      });

      // Immediately mark as read when user has this chat open (throttled).
      if (payload.message.senderType === "astrologer") {
        emitMarkRead(payload.sessionId);
      }
    };

    const handleTyping = (payload: { sessionId: string; from: "user" | "astrologer"; isTyping: boolean }) => {
      if (payload.sessionId !== selectedSessionIdRef.current) return;
      if (payload.from === "astrologer") {
        if (payload.isTyping) {
          setIsTypingAstrologer(true);

          if (astrologerTypingTimeoutRef.current) {
            clearTimeout(astrologerTypingTimeoutRef.current);
          }

          // Failsafe: hide indicator if stop-typing event is delayed or missed.
          astrologerTypingTimeoutRef.current = setTimeout(() => {
            setIsTypingAstrologer(false);
            astrologerTypingTimeoutRef.current = null;
          }, 2200);
        } else {
          setIsTypingAstrologer(false);

          if (astrologerTypingTimeoutRef.current) {
            clearTimeout(astrologerTypingTimeoutRef.current);
            astrologerTypingTimeoutRef.current = null;
          }
        }
      }
    };

    const handleChatUpdated = (payload: { sessionId: string; session: ChatSessionSummary }) => {
      const incoming = payload.session;

      if (incoming.status !== "active" || incoming.requestStatus !== "approved") {
        setSessions((prev) => prev.filter((s) => s.id !== payload.sessionId));
      } else {
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== payload.sessionId) return s;

            // Some chat:updated payloads may not include the astrologer object.
            // Preserve existing astrologer info in that case so header/profile stays visible.
            if (!incoming.astrologer && s.astrologer) {
              return { ...incoming, astrologer: s.astrologer } as ChatSessionSummary;
            }

            return incoming;
          })
        );
      }

      if (payload.sessionId === selectedSessionIdRef.current) {
        if (payload.session.requestStatus === "approved" && payload.session.status === "active") {
          if (isWaitingForApprovalRef.current) {
            setIsWaitingForApproval(false);
            isWaitingForApprovalRef.current = false;
            setPendingRequestSessionId(null);
            setInviteSecondsLeft(0);
            clearInviteTimer();
            showToastRef.current("Astrologer accepted your chat request", "success");
          }
          if (!isChatSessionActiveRef.current) {
            setIsChatSessionActive(true);
            isChatSessionActiveRef.current = true;
            startChatTimerRef.current();
          }
        }

        if (payload.session.requestStatus === "rejected") {
          setIsWaitingForApproval(false);
          isWaitingForApprovalRef.current = false;
          setPendingRequestSessionId(null);
          setInviteSecondsLeft(0);
          clearInviteTimer();
          if (isChatSessionActiveRef.current) {
            setIsChatSessionActive(false);
            isChatSessionActiveRef.current = false;
            stopChatTimerRef.current();
          }
          showToastRef.current("Astrologer rejected your chat request", "error");
        }

        if (payload.session.status !== "active" && isChatSessionActiveRef.current) {
          setIsChatSessionActive(false);
          isChatSessionActiveRef.current = false;
          stopChatTimerRef.current();
          updateSessionMessages(payload.sessionId, () => []);
        }
      }
    };

    const handleChatApproved = (payload: { sessionId: string }) => {
      if (payload.sessionId !== selectedSessionIdRef.current) return;
      setIsWaitingForApproval(false);
      isWaitingForApprovalRef.current = false;
      setPendingRequestSessionId(null);
      setInviteSecondsLeft(0);
      clearInviteTimer();
      if (!isChatSessionActiveRef.current) {
        setIsChatSessionActive(true);
        isChatSessionActiveRef.current = true;
        startChatTimerRef.current();
      }
      showToastRef.current("Astrologer accepted your chat request", "success");
    };

    const handleChatRejected = (payload: { sessionId: string }) => {
      if (payload.sessionId !== selectedSessionIdRef.current) return;
      setIsWaitingForApproval(false);
      isWaitingForApprovalRef.current = false;
      setPendingRequestSessionId(null);
      setInviteSecondsLeft(0);
      clearInviteTimer();
      if (isChatSessionActiveRef.current) {
        setIsChatSessionActive(false);
        isChatSessionActiveRef.current = false;
        stopChatTimerRef.current();
      }
      showToastRef.current("Astrologer rejected your chat request", "error");
    };

    const handleChatEnded = (payload: { sessionId: string; endedBy: string; reason?: string }) => {
      if (payload.sessionId !== selectedSessionIdRef.current) return;
      setIsWaitingForApproval(false);
      isWaitingForApprovalRef.current = false;
      setPendingRequestSessionId(null);
      setInviteSecondsLeft(0);
      clearInviteTimer();
      if (isChatSessionActiveRef.current) {
        setIsChatSessionActive(false);
        isChatSessionActiveRef.current = false;
        stopChatTimerRef.current();
      }
      showToastRef.current("Chat session ended", "info");
    };

    const handleMessagesRead = (payload: { sessionId: string; readerRole: "user" | "astrologer" }) => {
      if (payload.sessionId !== selectedSessionIdRef.current) return;

      updateSessionMessages(payload.sessionId, (prev) =>
        prev.map((m) => {
          if (payload.readerRole === "user") {
            // Current user read astrologer messages
            if (m.senderType === "astrologer") {
              return { ...m, isRead: true };
            }
          } else {
            // Astrologer read user messages
            if (m.senderType === "user") {
              return { ...m, isRead: true };
            }
          }
          return m;
        })
      );
    };

    const handleUnreadUpdate = (payload: { sessionId: string; unreadCount: number; viewerRole: "user" | "astrologer" }) => {
      if (payload.viewerRole !== "user") return;

      setSessions((prev) =>
        prev.map((s) =>
          s.id === payload.sessionId ? { ...s, unreadCount: payload.unreadCount } : s
        )
      );
    };

    const handleCallAccepted = (payload: { callSession: CallSession }) => {
      console.log("[User] Received call:accepted event:", payload);
      setActiveCall(payload.callSession);
      console.log("[User] Set activeCall state:", payload.callSession);
      showToastRef.current("Astrologer accepted your call! Connecting...", "success");
    };

    const handleCallRejected = (payload: { callSession: CallSession; reason: string }) => {
      console.log("[User] Received call:rejected event:", payload);
      setActiveCall(null);
      showToastRef.current(`Call rejected: ${payload.reason}`, "error");
    };

    const handleCallEnded = (payload: { callSession: CallSession; endedBy: string }) => {
      console.log("[User] Received call:ended event:", payload);
      setActiveCall(null);
      showToastRef.current(`Call ended by ${payload.endedBy}`, "info");
    };

    const handleWalletUpdated = (payload: { balance: number; deduction: number; reason: string }) => {
      console.log("[User] Received wallet:updated event:", payload);
      // Trigger balance refresh in the hook
      window.dispatchEvent(new CustomEvent("refreshWalletBalance"));
    };

    socket.on("message:new", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("connect", ensureRoomJoin);
    socket.on("chat:updated", handleChatUpdated);
    socket.on("messages:read", handleMessagesRead);
    socket.on("unread:update", handleUnreadUpdate);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("call:rejected", handleCallRejected);
    socket.on("call:ended", handleCallEnded);
    socket.on("wallet:updated", handleWalletUpdated);
    socket.on("chat:approved", handleChatApproved);
    socket.on("chat:rejected", handleChatRejected);
    socket.on("chat:ended", handleChatEnded);

    return () => {
      socket.emit("leave_chat", { sessionId: activeSessionId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (typingSentRef.current && socket.connected) {
        socket.emit("typing", { sessionId: activeSessionId, isTyping: false });
      }
      typingSentRef.current = false;

      if (astrologerTypingTimeoutRef.current) {
        clearTimeout(astrologerTypingTimeoutRef.current);
        astrologerTypingTimeoutRef.current = null;
      }
      setIsTypingAstrologer(false);

      socket.off("message:new", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("connect", ensureRoomJoin);
      socket.off("chat:updated", handleChatUpdated);
      socket.off("messages:read", handleMessagesRead);
      socket.off("unread:update", handleUnreadUpdate);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("call:rejected", handleCallRejected);
      socket.off("call:ended", handleCallEnded);
      socket.off("wallet:updated", handleWalletUpdated);
      socket.off("chat:approved", handleChatApproved);
      socket.off("chat:rejected", handleChatRejected);
      socket.off("chat:ended", handleChatEnded);
    };
  }, [
    clearInviteTimer,
    emitMarkRead,
    isLoggedIn,
    loading,
    selectedSessionId,
    updateSessionMessages,
  ]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = chatScrollRef.current;
    if (!container) return;

    container.scrollTo({ top: container.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    const pendingAnchor = pendingScrollAnchorRef.current;

    if (
      pendingAnchor &&
      selectedSessionIdRef.current &&
      pendingAnchor.sessionId === selectedSessionIdRef.current
    ) {
      const container = chatScrollRef.current;
      if (container) {
        const newHeight = container.scrollHeight;
        container.scrollTop = pendingAnchor.previousTop + (newHeight - pendingAnchor.previousHeight);
      }
      pendingScrollAnchorRef.current = null;
      return;
    }

    if (shouldStickToBottomRef.current) {
      scrollToBottom("auto");
    }
  }, [messages.length, scrollToBottom]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      stopChatTimer();
      clearInviteTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Don't render anything while checking auth or if not logged in
  if (!isMounted || loading || !isLoggedIn) {
    return null;
  }

  const handleSendMessage = async (
    e: React.FormEvent,
    messageText: string = inputMessage
  ) => {
    e.preventDefault();
    if (messageText.trim() === "") {
      return;
    }

    // Require active chat session
    if (!isChatSessionActive) {
      if (isWaitingForApproval) {
        showToast("Please wait for astrologer to accept your request", "info");
        return;
      }
      showToast("Please start chat session first", "error");
      return;
    }

    if (isSending) return;

    let sessionId = selectedSessionId;

    // If no session is selected yet, try to auto-create or reuse one
    // based on the target astrologer (from URL or existing sessions).
    if (!sessionId) {
      if (!targetAstrologerId) {
        if (typeof window !== "undefined") {
          showToast(
            "Unable to determine astrologer for this chat. Please start chat from an astrologer profile or select a conversation.",
            "error"
          );
        }
        return;
      }

      try {
        const { session } = await startChatSession(targetAstrologerId);
        setSessions((prev) => {
          // Ensure we keep a single session per user-astrologer pair by
          // replacing any existing session for this astrologer.
          const filtered = prev.filter((s) => s.astrologerId !== targetAstrologerId);
          return [session, ...filtered];
        });
        setSelectedSessionId(session.id);
        sessionId = session.id;
      } catch (err) {
        console.error("Failed to start chat session from send handler", err);
        if (typeof window !== "undefined") {
          const anyErr: any = err;
          const backendMessage =
            anyErr?.response?.data?.message || anyErr?.response?.data?.error;
          showToast(
            backendMessage ||
              "Unable to start chat session. Please refresh the page and try again.",
            "error"
          );
        }
        return;
      }
    }

    try {
      shouldStickToBottomRef.current = true;
      setIsSending(true);
      const socket = getChatSocket();

      let shouldFallbackToHttp = true;

      if (socket && socket.connected) {
        await new Promise<void>((resolve) => {
          socket.emit(
            "send_message",
            {
              sessionId,
              text: messageText,
              messageType: "text",
              replyToMessageId: replyTo?.id,
            },
            (response: { success: boolean; error?: string; message?: ChatMessageDto }) => {
              if (!response?.success && response?.error) {
                console.error("Failed to send message via socket:", response.error);
                shouldFallbackToHttp = true;
              } else if (response?.success) {
                shouldFallbackToHttp = false;

                // Append immediately from ack payload so sender always sees message,
                // even if room echo is delayed/missed after reconnect.
                if (response.message && sessionId) {
                  updateSessionMessages(sessionId, (prev) => {
                    if (prev.some((m) => m.id === response.message?.id)) {
                      return prev;
                    }
                    return [...prev, response.message as ChatMessageDto];
                  });
                }
              }
              resolve();
            }
          );
        });
      }

      if (shouldFallbackToHttp) {
        const response = await sendChatMessageHttp(sessionId, {
          message: messageText,
          messageType: "text",
          replyToMessageId: replyTo?.id,
        });

        // When Socket.IO is not connected, we won't receive "message:new".
        // Optimistically append the sent message from HTTP response so the
        // user immediately sees their message in the UI.
        if (response?.success && response.chatMessage) {
          updateSessionMessages(sessionId, (prev) => [
            ...prev,
            response.chatMessage as ChatMessageDto,
          ]);
        }
      }

      setInputMessage("");
      setReplyTo(null);
    } catch (error) {
      console.error("Send message error", error);
      if (typeof window !== "undefined") {
        showToast("Failed to send message. Please try again.", "error");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleTypingChange = (value: string) => {
    setInputMessage(value);

    if (!selectedSessionId) return;
    const socket = getChatSocket();
    if (!socket || !socket.connected) return;

    const sessionIdForTyping = selectedSessionId;
    const trimmedValue = value.trim();

    if (trimmedValue.length > 0 && !typingSentRef.current) {
      socket.emit("typing", { sessionId: sessionIdForTyping, isTyping: true });
      typingSentRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (trimmedValue.length === 0) {
      if (typingSentRef.current) {
        socket.emit("typing", { sessionId: sessionIdForTyping, isTyping: false });
        typingSentRef.current = false;
      }
      return;
    }

    typingTimeoutRef.current = setTimeout(() => {
      const activeSocket = getChatSocket();
      if (
        activeSocket &&
        activeSocket.connected &&
        typingSentRef.current &&
        selectedSessionIdRef.current === sessionIdForTyping
      ) {
        activeSocket.emit("typing", { sessionId: sessionIdForTyping, isTyping: false });
        typingSentRef.current = false;
      }
    }, 1200);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    // Validate file size (5MB max)
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
      shouldStickToBottomRef.current = true;
      setIsUploading(true);
      await sendChatMessageHttp(selectedSessionId, {
        message: "[Image]",
        messageType: "image",
        file: selectedFile,
        replyToMessageId: replyTo?.id,
      });

      // Don't manually add message - let socket event handle it to avoid duplicates

      // Clear preview and states
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

  const handleInitiateCall = async (callType: "audio" | "video") => {
    console.log("=== INITIATE CALL DEBUG ===");
    console.log("targetAstrologerId:", targetAstrologerId);
    console.log("selectedSession:", selectedSession);
    console.log("selectedSession?.astrologerId:", selectedSession?.astrologerId);
    console.log("astrologerIdFromUrl:", astrologerIdFromUrl);
    console.log("sessions:", sessions);
    
    if (!targetAstrologerId) {
      showToast("Please select an astrologer to call. No astrologer ID found.", "error");
      return;
    }

    if (!selectedSession) {
      showToast("Please select a chat session first", "error");
      return;
    }

    try {
      setIsInitiatingCall(true);
      // Send astrologerId as string (UUID format)
      console.log("Sending call request with astrologerId:", targetAstrologerId);
      
      const response = await initiateCall(targetAstrologerId, callType);
      
      if (response.success && response.callSession) {
        setActiveCall(response.callSession);
        showToast(
          `${callType === "audio" ? "Audio" : "Video"} call initiated! Waiting for astrologer to accept...`,
          "info"
        );
      }
    } catch (error: any) {
      console.error("Failed to initiate call", error);
      const errorMessage = error?.response?.data?.message || "Failed to initiate call";
      showToast(errorMessage, "error");
    } finally {
      setIsInitiatingCall(false);
    }
  };

  const handleStartStopChat = async () => {
    if (isChatSessionActive) {
      try {
        if (selectedSessionId) {
          await endChatSession(selectedSessionId);
        }
      } catch (error) {
        console.error("Failed to end chat session", error);
      }

      setIsChatSessionActive(false);
      isChatSessionActiveRef.current = false;
      setIsWaitingForApproval(false);
      isWaitingForApprovalRef.current = false;
      setPendingRequestSessionId(null);
      setInviteSecondsLeft(0);
      clearInviteTimer();
      stopChatTimer();
      showToast("Chat session ended", "success");
      return;
    }

    if (isWaitingForApproval) {
      showToast("Waiting for astrologer response", "info");
      return;
    }

    if (!hasSufficientBalance(pricePerMinute)) {
      setShowInsufficientBalanceModal(true);
      showToast("Insufficient balance to start chat", "error");
      return;
    }

    if (!targetAstrologerId) {
      showToast("Please select an astrologer first", "error");
      return;
    }

    try {
      const response = await startChatSession(targetAstrologerId);
      const session = response.session;

      setSessions((prev) => {
        const filtered = prev.filter((s) => s.astrologerId !== targetAstrologerId);
        return [session, ...filtered];
      });
      setSelectedSessionId(session.id);

      if (session.requestStatus === "approved") {
        setIsChatSessionActive(true);
        isChatSessionActiveRef.current = true;
        setIsWaitingForApproval(false);
        isWaitingForApprovalRef.current = false;
        setPendingRequestSessionId(null);
        setInviteSecondsLeft(0);
        clearInviteTimer();
        startChatTimer();
        showToast(`Chat session started. ₹${pricePerMinute} will be deducted per minute.`, "success");
      } else {
        const timeoutSeconds = response.requestTimeoutSeconds || 30;
        setIsWaitingForApproval(true);
        isWaitingForApprovalRef.current = true;
        setPendingRequestSessionId(session.id);
        setInviteSecondsLeft(timeoutSeconds);
        showToast("Chat request sent. Waiting for astrologer approval.", "info");
      }
    } catch (error: any) {
      console.error("Failed to start chat session", error);
      const backendMessage =
        error?.response?.data?.message || "Unable to start chat session";
      showToast(backendMessage, "error");
    }
  };

  return (
    <div className="flex md:py-5 h-dvh min-h-0 bg-gray-50 overflow-hidden" style={rootContainerStyle}>
      {/* 1. Left Sidebar (Fixed) */}
      <div
        className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:hidden fixed left-0 top-0 w-80 h-full bg-gray-50 border-r border-gray-200 transition-transform duration-300 z-30 flex flex-col`}
      >
        {/* Sidebar Header with Back (desktop + mobile) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                try {
                  router.back();
                } catch {
                  router.push('/');
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <p className="text-sm font-semibold text-gray-900">Chats</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>
        {/* Astrologer Info Header for selected session */}
        {astrologerInfo && (
          <div className="p-8 flex items-center gap-3 border-b border-gray-100">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={astrologerInfo.photo}
                  alt={astrologerInfo.name}
                  className="object-cover w-full h-full"
                />
              </div>
              {astrologerInfo.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{astrologerInfo.name}</p>
              <p className="text-sm text-gray-500">{astrologerInfo.title}</p>
            </div>
          </div>
        )}
        
        {/* Chat/Call Tabs (Matching the design image) */}
        <div className="flex p-4 gap-2 border-b border-gray-100">
          <button 
            className="flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold shadow-md" 
            style={{ backgroundColor: colors.primeYellow, color: colors.darkGray }}
          >
            <IoChatbubblesSharp className="w-5 h-5 mr-2" />Chat
          </button>
          {/* <button 
            className="flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold bg-white text-gray-600 border border-gray-300 shadow-sm"
          >
            <Phone className="w-5 h-5 mr-2" />Call
          </button> */}
        </div>

        {/* Available Balance & Chat Control Section */}
        <div className="px-4 py-3 border-b border-gray-100 bg-white space-y-3">
          {/* Balance Display */}
          <Link href="/profile/wallet" className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-5 h-5 text-gray-800" />
              <span className="text-sm font-semibold text-gray-900">Available Balance</span>
            </div>
            <span className="text-sm font-bold text-gray-900">₹{balance.toFixed(2)}</span>
          </Link>
          
          {/* Chat Timer & Cost */}
          {isChatting && (
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: colors.offYellow, border: `2px solid ${colors.primeYellow}` }}
            >
              <div className="flex items-center gap-2">
                <Clock size={18} style={{ color: colors.darkGray }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.darkGray }}>
                    {chatDuration}
                  </p>
                  <p className="text-xs" style={{ color: colors.gray }}>
                    ₹{pricePerMinute}/min
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold" style={{ color: colors.darkGray }}>
                ₹{chatCost.toFixed(2)}
              </p>
            </div>
          )}
          
          {/* Start/Stop Chat Button */}
          {selectedSession && (
            <button
              onClick={handleStartStopChat}
              disabled={
                (!isChatSessionActive && !isWaitingForApproval && !hasSufficientBalance(pricePerMinute)) ||
                isWaitingForApproval
              }
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
              style={{
                backgroundColor: isChatSessionActive
                  ? "#EF4444"
                  : isWaitingForApproval
                  ? "#9CA3AF"
                  : colors.primeGreen,
                color: colors.white,
              }}
            >
              <Clock size={18} />
              <span>
                {isChatSessionActive
                  ? "Stop Chat"
                  : isWaitingForApproval
                  ? "Waiting..."
                  : "Start Chat"}
              </span>
            </button>
          )}
        </div>
      </div>
      
      {/* 2. Right Chat Area (Main Content) */}
      <div className="flex-1 min-h-0 flex justify-center items-stretch px-0 lg:px-0">
        <div className="w-full max-w-5xl h-full lg:my-4 lg:border-2 lg:border-[#F0DF20] lg:rounded-xl bg-transparent flex flex-col min-h-0 overflow-hidden">
          {/* Header - Back, Astrologer, Time, Balance, Call */}
          <div className="px-2 sm:px-6 py-4 sm:py-4 flex items-center justify-between shrink-0 z-10 gap-1 sm:gap-2" style={{ backgroundColor: colors.primeYellow }}>
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  try {
                    router.back();
                  } catch {
                    router.push('/');
                  }
                }}
                className="p-1 sm:p-2 hidden md:block rounded-full hover:bg-yellow-200/80 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
              </button>
              <button
                type="button"
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-1 sm:p-2 rounded-full hover:bg-yellow-200/80 transition-colors shrink-0"
                aria-label="Open sidebar"
              >
                <GiHamburgerMenu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
              </button>
              {astrologerInfo && (
                <div className="flex flex-row items-center gap-2 min-w-0">
                  <div className="hidden sm:block w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white">
                    <img
                      src={astrologerInfo.photo}
                      alt={astrologerInfo.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{astrologerInfo.name}</p>
                    <p className="text-[11px] text-green-700 truncate">Online</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Start/Stop Chat, Timer, Wallet, Call Buttons */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0 flex-wrap justify-end">
              {/* Keep Stop button in current easy-to-reach position */}
              {selectedSession && isChatSessionActive && (
                <button
                  onClick={handleStartStopChat}
                  disabled={
                    (!isChatSessionActive && !isWaitingForApproval && !hasSufficientBalance(pricePerMinute)) ||
                    isWaitingForApproval
                  }
                  className="flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[10px] sm:text-xs font-semibold shrink-0"
                  style={{
                    backgroundColor: isChatSessionActive
                      ? "#EF4444"
                      : isWaitingForApproval
                      ? "#9CA3AF"
                      : colors.primeGreen,
                    color: colors.white,
                  }}
                >
                  <Clock size={16} className="sm:w-3.5 sm:h-3.5" />
                  <span className="whitespace-nowrap text-sm">
                    Stop
                  </span>
                </button>
              )}

              {/* Timer and Cost Combined */}
              {isChatting && (
                <div
                  className="flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg shrink-0 border-2"
                  style={{ backgroundColor: colors.offYellow, borderColor: colors.primeYellow }}
                >
                  <Clock size={12} className="sm:w-4 sm:h-4" style={{ color: colors.darkGray }} />
                  <div className="flex flex-col leading-tight">
                    <span style={{ color: colors.darkGray }} className="text-[10px] sm:text-xs font-semibold">{chatDuration}</span>
                    <span style={{ color: colors.gray }} className="text-[9px] sm:text-[10px]">₹{chatCost.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Wallet Balance - Hidden on Mobile */}
              <Link 
                href="/profile/wallet" 
                className="hidden sm:flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-sm font-bold text-gray-900 hover:bg-yellow-200/80 px-1 sm:px-2 py-0.5 sm:py-1 rounded transition-colors shrink-0 border border-gray-900"
              >
                <TfiWallet className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">₹{balance.toFixed(2)}</span>
              </Link>

              {/* Call and Video Call Buttons */}
              {selectedSession && (
                <>
                  <button
                    type="button"
                    onClick={() => handleInitiateCall("audio")}
                    disabled={isInitiatingCall}
                    className="p-1 sm:p-2 hover:bg-yellow-200/80 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    title="Audio Call"
                  >
                    <Phone className="w-5 h-5 sm:w-5 sm:h-5 text-gray-900" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateCall("video")}
                    disabled={isInitiatingCall}
                    className="p-1 sm:p-2 hover:bg-yellow-200/80 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    title="Video Call"
                  >
                    <Video className="w-6 h-6 sm:w-5 sm:h-5 text-gray-900" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Overlay for mobile sidebar */}
          {showSidebar && (
            <div
              className="fixed inset-0 bg-white/20 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}
          
          {/* Chat Messages Area */}
          <div 
          ref={chatScrollRef}
          onScroll={handleMessageAreaScroll}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-6 space-y-4"
          style={{
            backgroundImage: `url("/images/bg4.png")`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'contain',
          }}
        >
          {messages.length === 0 ? (
            // Empty state when there are no messages yet
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-8">
                <Image
                  src="/images/logo.png"
                  alt="Shooting Stars"
                  width={60}
                  height={60}
                  className="mx-auto mb-4"
                />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Namaste, {userDisplayName}</h2>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Start a conversation with your astrologer. Your previous chats and new messages will appear here.
                </p>
              </div>
            </div>
          ) : (
            // Conversation History
            <div className="max-w-4xl mx-auto px-2">
              {(isLoadingOlderMessages || hasOlderMessages) && (
                <div className="flex justify-center mb-3">
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-600 font-medium">
                      {isLoadingOlderMessages ? "Loading older messages..." : "Scroll up to load older messages"}
                    </p>
                  </div>
                </div>
              )}

              {groupedMessages.map((group) => (
                <div key={group.dateKey}>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-600 font-medium">{group.label}</p>
                    </div>
                  </div>

                  {group.items.map((message) => {
                    const isUser = message.senderType === "user";
                    const repliedTo = message.replyToMessageId
                      ? messageLookupById.get(message.replyToMessageId) || null
                      : null;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-[65%] rounded-lg shadow-md ${
                            message.messageType === "image" ? "p-0 overflow-hidden" : "px-3 py-2"
                          } ${
                            isUser
                              ? "bg-[#F0DF20] text-gray-900 rounded-br-none"
                              : "bg-white text-gray-900 rounded-bl-none"
                          }`}
                        >
                          {repliedTo && (
                            <div className="mb-1 px-2 py-1 text-[11px] rounded bg-black/5 text-gray-700">
                              <span className="font-semibold mr-1">
                                Replying to {repliedTo.senderType === "user" ? "You" : astrologerInfo?.name || "Astrologer"}
                              </span>
                              <span className="truncate block max-w-[180px]">
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
                              <p className="text-[10px] text-gray-600">
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              {isUser && (
                                message.isRead ? (
                                  <div className="flex">
                                    <FiCheck className="w-3 h-3 text-blue-500 -mr-1" />
                                    <FiCheck className="w-3 h-3 text-blue-500" />
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
                                  onClick={() => setOpenMenuId(openMenuId === message.id ? null : message.id)}
                                  className="p-1 hover:bg-gray-200 rounded-full transition"
                                  aria-label="Message options"
                                >
                                  <MoreVertical className="w-3 h-3 text-gray-600" />
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
                                    {isUser && (
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
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

          {/* Fixed Input Bar */}
          <div className="border-t border-gray-200 px-4 py-3 sticky bottom-0 bg-white/70">
          <form 
            onSubmit={(e) => handleSendMessage(e, inputMessage)}
            className="max-w-4xl mx-auto flex items-center gap-3"
          >
            {/* Image Preview Modal */}
            {imagePreview && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-700">Send Image</p>
                    <button
                      type="button"
                      onClick={handleCancelImage}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Cancel"
                    >
                      <X className="w-4 h-4" />
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
              </div>
            )}

            {replyTo && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3">
                <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-700 mb-0.5">
                      Replying to {replyTo.senderType === "user" ? "You" : astrologerInfo?.name || "Astrologer"}
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
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleAttachClick}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Attach image"
            >
              <FiPaperclip className="w-5 h-5 text-gray-600" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => handleTypingChange(e.target.value)}
                placeholder={
                  isWaitingForApproval
                    ? `Waiting for astrologer acceptance (${inviteSecondsLeft}s)...`
                    : !isChatSessionActive
                    ? "Click 'Start Chat' to begin..."
                    : "Ask Anything From Our Astrologer......"
                }
                disabled={!isChatSessionActive}
                className="w-full px-5 py-3 pr-12 bg-gray-100 border border-gray-300 rounded-full focus:outline-none text-sm text-gray-900 placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
                autoFocus
              />
              {isTypingAstrologer && (
                <div className="absolute -top-8 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm text-xs text-gray-600">
                  Astrologer is typing...
                </div>
              )}
              {/* Send / Start Button Inside Input */}
              {isChatSessionActive ? (
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className={`w-5 h-5 ${
                    inputMessage.trim() ? "text-[#F0DF20] hover:text-[#ffea00]" : "text-gray-400"
                  }`} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartStopChat}
                  disabled={!isWaitingForApproval && !hasSufficientBalance(pricePerMinute)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isWaitingForApproval ? "#9CA3AF" : colors.primeGreen,
                    color: colors.white,
                  }}
                  aria-label="Start chat"
                >
                  {isWaitingForApproval ? `Wait ${inviteSecondsLeft}s` : "Start"}
                </button>
              )}
            </div>
          </form>
          </div>
        </div>
      </div>

      {/* Active Call Component */}
      {activeCall && activeCall.status !== "rejected" && (
        <AgoraCall 
          callSession={activeCall} 
          onCallEnd={() => setActiveCall(null)} 
        />
      )}

      {isWaitingForApproval && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">
              Waiting For Astrologer Response
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your chat invitation has been sent. Please wait while astrologer accepts your request.
            </p>
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
              <p className="text-sm font-semibold text-yellow-800">
                Time left: {inviteSecondsLeft}s
              </p>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Wallet deduction starts only after astrologer accepts.
            </p>
          </div>
        </div>
      )}

      {/* Insufficient Balance Modal */}
      {showInsufficientBalanceModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#FEF2F2" }}
              >
                <AlertCircle size={32} style={{ color: "#EF4444" }} />
              </div>

              <h3
                className="text-xl font-bold mb-2"
                style={{ color: colors.darkGray }}
              >
                Insufficient Balance
              </h3>

              <p className="text-sm mb-6" style={{ color: colors.gray }}>
                You don't have enough balance to chat with {astrologerInfo?.name || 'this astrologer'}.
                Price: ₹{pricePerMinute}/minute. Please recharge your wallet to continue.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowInsufficientBalanceModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                  style={{
                    borderColor: colors.gray,
                    color: colors.darkGray,
                  }}
                >
                  Cancel
                </button>
                <Link href="/profile/wallet" className="flex-1">
                  <button
                    className="w-full px-4 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: colors.primeYellow,
                      color: colors.white,
                    }}
                  >
                    Recharge Wallet
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastProps.isVisible && (
        <Toast
          message={toastProps.message}
          type={toastProps.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default function chat(){
  return (
    <Suspense fallback={<div>Loading Chat...</div>}>
      <ChatPage />
    </Suspense>
  );
}