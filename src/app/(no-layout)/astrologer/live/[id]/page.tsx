"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getHostToken, endLiveSession } from "@/store/api/live/live";
import { LiveStreamProvider } from "@/contexts/LiveStreamContext";

// Dynamic import to prevent SSR
const LiveStreamHostView = dynamic(
  () => import("@/components/live/LiveStreamHostView"),
  { ssr: false, loading: () => <LoadingScreen /> }
);

const FloatingLivePlayer = dynamic(
  () => import("@/components/live/FloatingLivePlayer"),
  { ssr: false }
);

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Starting live stream...</p>
      </div>
    </div>
  );
}

const AstrologerLivePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const fetchToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching host token for session:", sessionId);
      const response = await getHostToken(sessionId);
      console.log("Host token response:", response);
      
      // Validate response
      if (!response || !response.token || !response.appId || !response.channelName) {
        throw new Error("Invalid token response from server");
      }
      
      setTokenData(response);
    } catch (err: any) {
      console.error("Failed to get host token:", err);
      setError(err.message || "Failed to get host token");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    // Only fetch once when component mounts
    if (!tokenData && !error) {
      fetchToken();
    }
  }, []); // Empty deps - only run once on mount

  const handleEndStream = async () => {
    try {
      // Add small delay to ensure device cleanup completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await endLiveSession(sessionId);
      if (response.success) {
        alert(
          `Stream ended!\n\nTotal Viewers: ${response.liveSession?.totalViewers}\nPeak Viewers: ${response.liveSession?.maxViewers}\nRevenue: ₹${response.liveSession?.totalRevenue}\nDuration: ${response.liveSession?.duration} minutes`
        );
        
        // Add another small delay before navigation to ensure alert is dismissed
        await new Promise(resolve => setTimeout(resolve, 300));
        router.push("/astrologer/dashboard/live-history");
      } else {
        alert(response.error || "Failed to end stream");
      }
    } catch (error: any) {
      console.error("Failed to end stream:", error);
      alert(error.message || "Failed to end stream");
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    router.push("/astrologer/dashboard");
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    router.push(`/astrologer/live/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Starting live stream...</p>
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
            Unable to Start Stream
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/astrologer/dashboard/go-live")}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Back to Go Live
          </button>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return null;
  }

  return (
    <LiveStreamProvider>
      {isMinimized ? (
        <FloatingLivePlayer
          isHost={true}
          onMaximize={handleMaximize}
          onClose={handleEndStream}
        />
      ) : (
        <LiveStreamHostView
          sessionId={sessionId}
          channelName={tokenData.channelName}
          token={tokenData.token}
          appId={tokenData.appId}
          uid={tokenData.uid}
          onEndStream={handleEndStream}
          onMinimize={handleMinimize}
          showMinimize={true}
        />
      )}
    </LiveStreamProvider>
  );
};

export default AstrologerLivePage;
