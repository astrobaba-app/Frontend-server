"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChatHistorySessionDto,
  getUserAstrologerChatHistory,
} from "@/store/api/chat";

const PAGE_SIZE = 1;
const INITIAL_MESSAGES_PER_SESSION = 3;
const LOAD_MORE_MESSAGES_STEP = 5;

export default function AstrologerHistoryDetailPage() {
  const params = useParams<{ astrologerId: string }>();
  const astrologerId = params?.astrologerId || "";

  const [historySessions, setHistorySessions] = useState<ChatHistorySessionDto[]>([]);
  const [visibleMessageCountBySession, setVisibleMessageCountBySession] = useState<
    Record<string, number>
  >({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore = historySessions.length > 0 && page < totalPages;

  const loadHistory = useCallback(
    async (targetPage: number, append = false) => {
      if (!astrologerId) return;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await getUserAstrologerChatHistory(astrologerId, {
          page: targetPage,
          limit: PAGE_SIZE,
        });

        const incoming = response.historySessions || [];
        let addedUniqueCount = incoming.length;

        setHistorySessions((previous) => {
          if (!append) return incoming;

          const merged = [...previous, ...incoming];
          const seen = new Set<string>();

          const deduped = merged.filter((session) => {
            if (seen.has(session.id)) return false;
            seen.add(session.id);
            return true;
          });

          addedUniqueCount = deduped.length - previous.length;
          return deduped;
        });

        setVisibleMessageCountBySession((previous) => {
          const next = { ...previous };

          incoming.forEach((session) => {
            if (!next[session.id]) {
              next[session.id] = INITIAL_MESSAGES_PER_SESSION;
            }
          });

          return next;
        });

        const nextPage = response.pagination?.page || targetPage;
        const nextTotalPages = response.pagination?.totalPages || 1;

        // If API page didn't add any unique session, stop showing load-more to avoid endless button.
        if (append && addedUniqueCount <= 0) {
          setPage(nextPage);
          setTotalPages(nextPage);
        } else {
          setPage(nextPage);
          setTotalPages(nextTotalPages);
        }
      } catch (error) {
        console.error("Failed to load astrologer chat history", error);
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [astrologerId]
  );

  useEffect(() => {
    if (!astrologerId) return;
    void loadHistory(1, false);
  }, [astrologerId, loadHistory]);

  const astrologerInfo = useMemo(() => {
    if (historySessions.length === 0) return null;
    return historySessions[0].astrologer || null;
  }, [historySessions]);

  const handleLoadMoreMessagesForSession = useCallback((sessionId: string) => {
    setVisibleMessageCountBySession((previous) => ({
      ...previous,
      [sessionId]: (previous[sessionId] || INITIAL_MESSAGES_PER_SESSION) +
        LOAD_MORE_MESSAGES_STEP,
    }));
  }, []);

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {astrologerInfo?.fullName || "Astrologer"} Chat History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Dedicated history page showing previous chats only.
            </p>
          </div>
          <Link
            href="/profile/chat-history"
            className="text-xs px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        {isLoading && historySessions.length === 0 ? (
          <p className="text-sm text-gray-600">Loading chat history...</p>
        ) : historySessions.length === 0 ? (
          <p className="text-sm text-gray-600">No previous chats found for this astrologer.</p>
        ) : (
          <div className="space-y-4">
            {historySessions.map((session) => (
              <div key={session.id} className="rounded-xl border border-gray-100 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-700">
                    {session.endTime
                      ? new Date(session.endTime).toLocaleString()
                      : "Previous chat"}
                  </p>
                </div>

                <div className="space-y-2">
                  {(session.messages || [])
                    .slice(0, visibleMessageCountBySession[session.id] || INITIAL_MESSAGES_PER_SESSION)
                    .map((message) => {
                    const isUser = message.senderType === "user";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[82%] rounded-lg px-3 py-2 text-sm ${
                            isUser
                              ? "bg-[#F0DF20] text-gray-900 rounded-br-none"
                              : "bg-gray-100 text-gray-900 rounded-bl-none"
                          }`}
                        >
                          {message.messageType === "image" && message.fileUrl ? (
                            <img
                              src={message.fileUrl}
                              alt="History image"
                              className="max-h-40 rounded-md object-cover"
                            />
                          ) : message.messageType === "voice" && message.fileUrl ? (
                            <audio controls preload="metadata" className="w-[260px] max-w-full">
                              <source src={message.fileUrl} />
                              Your browser does not support audio playback.
                            </audio>
                          ) : (
                            <p className="whitespace-pre-wrap wrap-break-word">
                              {message.isDeleted
                                ? "This message was deleted"
                                : message.message}
                            </p>
                          )}

                          <p className="mt-1 text-[10px] text-gray-600">
                            {new Date(message.originalCreatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {(session.messages || []).length >
                    (visibleMessageCountBySession[session.id] || INITIAL_MESSAGES_PER_SESSION) && (
                    <div className="pt-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleLoadMoreMessagesForSession(session.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-200 bg-white hover:bg-gray-50"
                      >
                        Load More Chats
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => void loadHistory(page + 1, true)}
                  disabled={isLoadingMore}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60"
                >
                  {isLoadingMore ? "Loading..." : "Load More Sessions"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
