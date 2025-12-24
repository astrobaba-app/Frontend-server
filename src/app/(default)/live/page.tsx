"use client";

import React, { useEffect, useState } from "react";
import { getActiveLiveSessions, LiveSession } from "@/store/api/live/live";
import { useRouter } from "next/navigation";
import { Eye, Users } from "lucide-react";
import Image from "next/image";

const LiveSessionsPage: React.FC = () => {
  const router = useRouter();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await getActiveLiveSessions({ limit: 50 });
      if (response.success) {
        setSessions(response.liveSessions);
      }
    } catch (error) {
      console.error("Failed to fetch live sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (sessionId: string) => {
    router.push(`/live/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading live sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Astrologers</h1>
          <p className="text-gray-600">
            Join live sessions and interact with expert astrologers in real-time
          </p>
        </div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📹</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No live sessions right now
            </h3>
            <p className="text-gray-500">
              Check back later or explore other features
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleJoinSession(session.id)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-yellow-400 to-yellow-600">
                  {session.thumbnail ? (
                    <Image
                      src={session.thumbnail}
                      alt={session.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {session.astrologer?.photo ? (
                          <Image
                            src={session.astrologer.photo}
                            alt={session.astrologer.fullName}
                            width={96}
                            height={96}
                            className="rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-4xl text-white font-bold">
                            {session.astrologer?.fullName.charAt(0) || "A"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Live Badge */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>

                  {/* Viewer Count */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold">
                    <Eye className="w-4 h-4" />
                    {session.currentViewers}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {session.title}
                  </h3>

                  {/* Astrologer Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 overflow-hidden flex-shrink-0">
                      {session.astrologer?.photo ? (
                        <Image
                          src={session.astrologer.photo}
                          alt={session.astrologer.fullName}
                          width={40}
                          height={40}
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold">
                          {session.astrologer?.fullName.charAt(0) || "A"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {session.astrologer?.fullName}
                      </p>
                      {session.astrologer?.rating && (
                        <p className="text-sm text-gray-500">
                          ⭐ {Number(session.astrologer.rating).toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {session.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {session.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {session.totalViewers} joined
                    </span>
                    <span className="font-semibold text-yellow-600">
                      ₹{session.pricePerMinute}/min
                    </span>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinSession(session.id);
                    }}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Join Live Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSessionsPage;
