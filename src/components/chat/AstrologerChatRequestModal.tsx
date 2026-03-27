"use client";

import React, { useEffect, useMemo, useState } from "react";
import { approveChatRequest, rejectChatRequest } from "@/store/api/chat";
import {
  getWebPushPublicKey,
  subscribeAstrologerWebPush,
} from "@/store/api/notification/webPush";
import { getChatSocket } from "@/utils/chatSocket";
import { useRouter } from "next/navigation";

type IncomingRequestPayload = {
  sessionId: string;
  expiresAt?: string;
  user?: {
    id?: string;
    fullName?: string;
    email?: string | null;
  };
};

type PendingRequest = {
  sessionId: string;
  expiresAt: string;
  userName: string;
};

type ActiveSessionWarning = {
  id: string;
  userName: string;
};

const DEFAULT_TIMEOUT_SECONDS = 30;

function buildDefaultExpiry() {
  return new Date(Date.now() + DEFAULT_TIMEOUT_SECONDS * 1000).toISOString();
}

function canUseBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

function canUseWebPush() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    canUseBrowserNotifications()
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function AstrologerChatRequestModal() {
  const router = useRouter();
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forceWarning, setForceWarning] = useState<ActiveSessionWarning | null>(null);

  useEffect(() => {
    if (!canUseWebPush()) return;

    const setupWebPush = async () => {
      const astrologerToken = localStorage.getItem("token_astrologer");
      if (!astrologerToken) return;

      let permission = Notification.permission;
      if (permission === "default") {
        permission = await Notification.requestPermission();
      }
      if (permission !== "granted") return;

      const registration = await navigator.serviceWorker.register("/push-sw.js");
      await navigator.serviceWorker.ready;

      const vapidPublicKey =
        process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
        (await getWebPushPublicKey()).publicKey;

      const sanitizedPublicKey = (vapidPublicKey || "").trim();

      if (!sanitizedPublicKey) {
        console.warn("Missing VAPID public key for web push");
        return;
      }

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(sanitizedPublicKey),
        });
      }

      const payload = subscription.toJSON();
      if (!payload.endpoint || !payload.keys?.p256dh || !payload.keys?.auth) {
        return;
      }

      await subscribeAstrologerWebPush({
        endpoint: payload.endpoint,
        expirationTime: payload.expirationTime,
        keys: {
          p256dh: payload.keys.p256dh,
          auth: payload.keys.auth,
        },
      });
    };

    setupWebPush().catch((error) => {
      console.error("Web push setup failed:", error);
    });
  }, []);

  const currentRequest = useMemo(() => {
    if (requests.length === 0) return null;
    return [...requests].sort(
      (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    )[0];
  }, [requests]);

  const secondsLeft = useMemo(() => {
    if (!currentRequest) return 0;
    const remainingMs = new Date(currentRequest.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }, [currentRequest, requests]);

  useEffect(() => {
    const socket = getChatSocket();
    if (!socket) return;

    const handleIncomingRequest = (payload: IncomingRequestPayload) => {
      if (!payload?.sessionId) return;

      const nextRequest: PendingRequest = {
        sessionId: payload.sessionId,
        expiresAt: payload.expiresAt || buildDefaultExpiry(),
        userName: payload.user?.fullName || "User",
      };

      setRequests((prev) => {
        const filtered = prev.filter((item) => item.sessionId !== payload.sessionId);
        return [nextRequest, ...filtered];
      });

      const shouldShowDesktopAlert =
        canUseBrowserNotifications() &&
        Notification.permission === "granted" &&
        (document.hidden || !document.hasFocus());

      if (shouldShowDesktopAlert) {
        const notification = new Notification("New Chat Invitation", {
          body: `${nextRequest.userName} wants to start a chat with you.`,
          tag: `chat-request-${nextRequest.sessionId}`,
        });

        notification.onclick = () => {
          window.focus();
          router.push(`/astrologer/live-chats?sessionId=${nextRequest.sessionId}`);
          notification.close();
        };
      }
    };

    const handleChatUpdated = (payload: {
      sessionId: string;
      session?: { requestStatus?: string; status?: string };
    }) => {
      if (!payload?.sessionId) return;
      const requestStatus = payload.session?.requestStatus;
      const status = payload.session?.status;
      if (requestStatus && requestStatus !== "pending") {
        setRequests((prev) => prev.filter((item) => item.sessionId !== payload.sessionId));
      }
      if (status && status !== "active") {
        setRequests((prev) => prev.filter((item) => item.sessionId !== payload.sessionId));
      }
    };

    socket.on("chat:request:new", handleIncomingRequest);
    socket.on("chat:updated", handleChatUpdated);

    return () => {
      socket.off("chat:request:new", handleIncomingRequest);
      socket.off("chat:updated", handleChatUpdated);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setRequests((prev) =>
        prev.filter((item) => new Date(item.expiresAt).getTime() > now)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const removeRequest = (sessionId: string) => {
    setRequests((prev) => prev.filter((item) => item.sessionId !== sessionId));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("astrologer_chat_sessions_refresh"));
    }
  };

  const onReject = async () => {
    if (!currentRequest || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await rejectChatRequest(currentRequest.sessionId);
      removeRequest(currentRequest.sessionId);
    } catch (error) {
      console.error("Failed to reject chat request", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAccept = async (forceAccept = false) => {
    if (!currentRequest || isSubmitting) return;
    const acceptedSessionId = currentRequest.sessionId;
    setIsSubmitting(true);
    try {
      await approveChatRequest(acceptedSessionId, forceAccept);
      removeRequest(acceptedSessionId);
      setForceWarning(null);
      router.push(`/astrologer/live-chats?sessionId=${acceptedSessionId}`);
    } catch (error: any) {
      const statusCode = error?.response?.status;
      const data = error?.response?.data;

      if (statusCode === 409 && data?.requiresForce) {
        setForceWarning({
          id: data?.activeSession?.id,
          userName: data?.activeSession?.userName || "current user",
        });
      } else if (statusCode === 410 || data?.code === "CHAT_REQUEST_EXPIRED") {
        removeRequest(currentRequest.sessionId);
      } else {
        console.error("Failed to approve chat request", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentRequest) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-yellow-200">
        <h3 className="text-xl font-bold text-gray-900">New Chat Invitation</h3>
        <p className="mt-2 text-sm text-gray-600">
          {currentRequest.userName} wants to start a chat with you.
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Accept within <span className="font-semibold text-red-600">{secondsLeft}s</span>.
        </p>

        {forceWarning && (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            You are currently chatting with {forceWarning.userName}. If you accept this request, that active chat will end immediately.
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onReject}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => onAccept(!!forceWarning)}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-500 disabled:opacity-60"
          >
            {forceWarning ? "Accept And End Current" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
