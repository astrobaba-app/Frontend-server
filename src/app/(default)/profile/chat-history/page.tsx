"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChatHistorySessionDto,
  getUserChatHistory,
} from "@/store/api/chat";

const PAGE_SIZE = 8;

export default function ChatHistoryPage() {
  const [historySessions, setHistorySessions] = useState<ChatHistorySessionDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore = page < totalPages;

  const loadHistory = useCallback(async (targetPage: number, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getUserChatHistory({
        page: targetPage,
        limit: PAGE_SIZE,
      });

      const incoming = response.historySessions || [];
      setHistorySessions((previous) => {
        if (!append) return incoming;

        const merged = [...previous, ...incoming];
        const seen = new Set<string>();

        return merged.filter((session) => {
          if (seen.has(session.id)) return false;
          seen.add(session.id);
          return true;
        });
      });

      setPage(response.pagination?.page || targetPage);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load chat history", error);
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadHistory(1, false);
  }, [loadHistory]);

  const astrologerHistoryList = useMemo(() => {
    const map = new Map<
      string,
      {
        astrologerId: string;
        astrologerName: string;
        astrologerPhoto: string | null;
        lastChatAt: string | null;
        sessionCount: number;
      }
    >();

    historySessions.forEach((session) => {
      const key = session.astrologerId;
      const existing = map.get(key);
      const endedAt = session.endTime || session.startTime || null;

      if (!existing) {
        map.set(key, {
          astrologerId: key,
          astrologerName: session.astrologer?.fullName || "Astrologer",
          astrologerPhoto: session.astrologer?.photo || null,
          lastChatAt: endedAt,
          sessionCount: 1,
        });
        return;
      }

      const existingTs = existing.lastChatAt ? new Date(existing.lastChatAt).getTime() : 0;
      const nextTs = endedAt ? new Date(endedAt).getTime() : 0;

      existing.sessionCount += 1;
      if (nextTs > existingTs) {
        existing.lastChatAt = endedAt;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const aTs = a.lastChatAt ? new Date(a.lastChatAt).getTime() : 0;
      const bTs = b.lastChatAt ? new Date(b.lastChatAt).getTime() : 0;
      return bTs - aTs;
    });
  }, [historySessions]);

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Chat History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your completed chats are saved here with timestamps.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        {isLoading && historySessions.length === 0 ? (
          <p className="text-sm text-gray-600">Loading chat history...</p>
        ) : astrologerHistoryList.length === 0 ? (
          <p className="text-sm text-gray-600">No chat history available yet.</p>
        ) : (
          <div className="space-y-3">
            {astrologerHistoryList.map((item) => {
              const endedAtText = item.lastChatAt
                ? new Date(item.lastChatAt).toLocaleString()
                : "No timestamp";

              return (
                <div
                  key={item.astrologerId}
                  className="rounded-xl border border-gray-100 p-4 hover:border-yellow-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                        {item.astrologerPhoto ? (
                          <img
                            src={item.astrologerPhoto}
                            alt={item.astrologerName}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.astrologerName}</p>
                        <p className="text-xs text-gray-500 mt-1">Last chat: {endedAtText}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Sessions</p>
                      <p className="text-sm font-semibold text-gray-900">{item.sessionCount}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Link
                      href={`/profile/chat-history/${item.astrologerId}`}
                      className="inline-flex text-xs px-3 py-2 rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    >
                      View Chat History
                    </Link>
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => void loadHistory(page + 1, true)}
                  disabled={isLoadingMore}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60"
                >
                  {isLoadingMore ? "Loading..." : "Load More Chats"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
