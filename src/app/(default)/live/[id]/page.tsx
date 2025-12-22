"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { joinLiveSession, leaveLiveSession } from "@/store/api/live/live";
import LiveStreamAudienceView from "@/components/live/LiveStreamAudienceView";
import FloatingLivePlayer from "@/components/live/FloatingLivePlayer";
import { LiveStreamProvider } from "@/contexts/LiveStreamContext";

const LiveSessionPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const hasJoinedRef = React.useRef(false);
  const sessionDataRef = React.useRef<any>(null);

  useEffect(() => {
    // Only join once - prevent React StrictMode double invocation
    if (!hasJoinedRef.current) {
      hasJoinedRef.current = true;
      handleJoinSession();
    }

    // Listen for live session ended event
    const handleSessionEnded = (event: any) => {
      const { message, astrologerName } = event.detail;
      alert(message || `${astrologerName} has ended the live session`);
      handleLeaveSession(true); // Navigate back to live sessions list
    };

    window.addEventListener("liveSessionEnded", handleSessionEnded);

    return () => {
      window.removeEventListener("liveSessionEnded", handleSessionEnded);
      // Only cleanup if we actually joined successfully
      if (hasJoinedRef.current && sessionDataRef.current) {
        handleLeaveSession();
      }
    };
  }, []); // Empty deps - run once on mount

  const handleJoinSession = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await joinLiveSession(sessionId);

      if (response.success) {
        setSessionData(response);
        sessionDataRef.current = response; // Store in ref for cleanup
        console.log("Successfully joined live session");
      } else {
        console.error("Failed to join:", response.error);
        setError(response.error || "Failed to join live session");
      }
    } catch (err: any) {
      console.error("Error joining session:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSession = async (navigate: boolean = false) => {
    try {
      await leaveLiveSession(sessionId);
      if (navigate) {
        router.push("/live");
      }
    } catch (error) {
      console.error("Failed to leave session:", error);
      if (navigate) {
        router.push("/live");
      }
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    // Navigate away from live page but keep stream running
    router.push("/");
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    router.push(`/live/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Joining live session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Join Session
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/live")}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Back to Live Sessions
          </button>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return null;
  }

  return (
    <LiveStreamProvider>
      {isMinimized ? (
        <FloatingLivePlayer
          isHost={false}
          astrologerName={sessionData.liveSession?.astrologer?.fullName}
          onMaximize={handleMaximize}
          onClose={() => handleLeaveSession(true)}
        />
      ) : (
        <LiveStreamAudienceView
          sessionId={sessionId}
          channelName={sessionData.channelName}
          token={sessionData.token}
          appId={sessionData.appId}
          uid={sessionData.uid}
          astrologerName={sessionData.liveSession?.astrologer?.fullName || "Astrologer"}
          onLeave={() => handleLeaveSession(true)}
          onMinimize={handleMinimize}
          showMinimize={true}
        />
      )}
    </LiveStreamProvider>
  );
};

export default LiveSessionPage;
