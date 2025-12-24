import React, { useEffect, useRef, useState } from "react";
import { X, Users, Minimize2, MessageSquare, Maximize2 } from "lucide-react";
import { useLiveStream } from "@/contexts/LiveStreamContext";
import LiveChat from "./LiveChat";
import FloatingMessages from "./FloatingMessages";
import Toast, { ToastType } from "@/components/atoms/Toast";
import LeaveLiveConfirmModal from "@/components/modals/LeaveLiveConfirmModal";

interface LiveStreamAudienceViewProps {
  sessionId: string;
  channelName: string;
  token: string;
  appId: string;
  uid: number;
  astrologerName: string;
  onLeave: () => void;
  onMinimize?: () => void;
  showMinimize?: boolean;
}

const LiveStreamAudienceView: React.FC<LiveStreamAudienceViewProps> = ({
  sessionId,
  channelName,
  token,
  appId,
  uid,
  astrologerName,
  onLeave,
  onMinimize,
  showMinimize = true,
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [client, setClient] = useState<any | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const isInitializingRef = useRef(false); // Prevent double initialization
  const [showChat, setShowChat] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const { participantCount, joinLiveSession, leaveLiveSession, connect, isConnected } = useLiveStream();

  useEffect(() => {
    // Connect to live stream socket
    if (!isConnected) {
      connect();
    }
  }, [connect, isConnected]);

  useEffect(() => {
    if (isConnected) {
      joinLiveSession(sessionId);
    }

    return () => {
      leaveLiveSession();
    };
  }, [sessionId, isConnected, joinLiveSession, leaveLiveSession]);

  useEffect(() => {
    let agoraClient: any = null;

    const initAgora = async () => {
      if (isInitializingRef.current) {
        console.log("Already initializing audience view, skipping...");
        return;
      }

      isInitializingRef.current = true;

      try {
        // Dynamic import to avoid SSR issues
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        
        console.log("Initializing Agora audience client...");
        
        // Create Agora client
        agoraClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

        // Set client role to audience (no publishing)
        await agoraClient.setClientRole("audience");
        console.log("Client role set to audience");

        // Join channel
        await agoraClient.join(appId, channelName, token, uid);
        console.log("Joined Agora channel as audience");

        // Handle remote user published
        agoraClient.on("user-published", async (user: any, mediaType: any) => {
          console.log("Remote user published:", user.uid, mediaType);
          await agoraClient.subscribe(user, mediaType);

          if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            if (remoteVideoTrack && videoContainerRef.current) {
              // Clear previous video
              videoContainerRef.current.innerHTML = "";
              remoteVideoTrack.play(videoContainerRef.current);
            }
          }

          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack?.play();
          }

          setRemoteUsers((prev) => {
            const existing = prev.find((u) => u.uid === user.uid);
            if (existing) {
              return prev;
            }
            return [...prev, user];
          });
        });

        // Handle remote user unpublished
        agoraClient.on("user-unpublished", (user: any, mediaType: any) => {
          console.log("Remote user unpublished:", user.uid, mediaType);
          if (mediaType === "video" && videoContainerRef.current) {
            videoContainerRef.current.innerHTML = "";
          }
        });

        // Handle remote user left
        agoraClient.on("user-left", (user: any) => {
          console.log("Remote user left:", user.uid);
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          if (videoContainerRef.current) {
            videoContainerRef.current.innerHTML = "";
          }
        });

        setClient(agoraClient);
        setIsJoined(true);
        console.log("Audience view initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Agora audience view:", error);
        // Don't show alert on React StrictMode double-mount errors
        if (!isJoined) {
          console.error("This may be due to React StrictMode double-mounting in development");
        }
        isInitializingRef.current = false; // Reset on error
      }
    };

    if (!isJoined && !isInitializingRef.current) {
      console.log("Starting Agora audience initialization...");
      initAgora();
    }

    return () => {
      // Cleanup
      console.log("Cleaning up audience view...");
      isInitializingRef.current = false;
      if (agoraClient) {
        agoraClient.leave();
      }
    };
  }, [appId, channelName, token, uid]);

  const handleLeave = () => {
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    setShowLeaveModal(false);
    onLeave();
  };

  const handleChatError = (message: string) => {
    setToast({ message, type: "error" });
  };

  return (
    <div className="relative w-full h-screen bg-black flex flex-col">
      {/* Video Container */}
      <div className="relative flex-1">
        <div
          ref={videoContainerRef}
          className="w-full h-full bg-gray-900"
        />
        {remoteUsers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Connecting to {astrologerName}...</p>
            </div>
          </div>
        )}

        {/* Live Indicator & Participant Count */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white font-semibold">LIVE</span>
          <Users className="w-4 h-4 text-white ml-2" />
          <span className="text-white font-semibold">{participantCount}</span>
        </div>

        {/* Astrologer Name */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-white font-semibold">{astrologerName}</p>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-all"
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </button>

            {showMinimize && onMinimize && (
              <button
                onClick={onMinimize}
                className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-all"
              >
                <Minimize2 className="w-6 h-6 text-white" />
              </button>
            )}

            <button
              onClick={handleLeave}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold transition-all ml-4"
            >
              Leave Stream
            </button>
          </div>
        </div>
      </div>

      {/* Floating Messages */}
      <FloatingMessages />

      {/* Live Chat Sidebar */}
      {showChat && (
        <div className="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <LiveChat sessionId={sessionId} onError={handleChatError} />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Leave Confirmation Modal */}
      <LeaveLiveConfirmModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleConfirmLeave}
        astrologerName={astrologerName}
      />
    </div>
  );
};

export default LiveStreamAudienceView;
