import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, X, Users, Minimize2, MessageSquare } from "lucide-react";
import { useLiveStream } from "@/contexts/LiveStreamContext";
import LiveChat from "./LiveChat";

interface LiveStreamHostViewProps {
  sessionId: string;
  channelName: string;
  token: string;
  appId: string;
  uid: number;
  onEndStream: () => void;
  onMinimize?: () => void;
  showMinimize?: boolean;
}

const LiveStreamHostView: React.FC<LiveStreamHostViewProps> = ({
  sessionId,
  channelName,
  token,
  appId,
  uid,
  onEndStream,
  onMinimize,
  showMinimize = true,
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [client, setClient] = useState<any | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const isInitializingRef = useRef(false); // Track if already initialized
  const [initError, setInitError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const { participantCount, joinLiveSession, leaveLiveSession, connect, isConnected } = useLiveStream();

  useEffect(() => {
    // Connect to live stream socket (non-blocking)
    console.log("Connecting to live stream socket...");
    connect();
  }, [connect]);

  useEffect(() => {
    if (isConnected) {
      console.log("Socket connected, joining live session:", sessionId);
      joinLiveSession(sessionId);
    }

    return () => {
      if (isConnected) {
        leaveLiveSession();
      }
    };
  }, [sessionId, isConnected, joinLiveSession, leaveLiveSession]);

  useEffect(() => {
    let agoraClient: any = null;
    let audioTrack: any = null;
    let videoTrack: any = null;

    const initAgora = async () => {
      if (isInitializingRef.current) {
        console.log("Already initializing, skipping...");
        return;
      }
      
      isInitializingRef.current = true;
      
      try {
        // Dynamic import to avoid SSR issues
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        
        console.log("Initializing Agora client...", { appId, channelName, uid });
        
        // Create Agora client
        agoraClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        console.log("Agora client created");
        
        // Set client role to host
        await agoraClient.setClientRole("host");
        console.log("Client role set to host");

        // Join channel - Use uid 0 to let Agora auto-assign to avoid conflicts
        const joinUid = 0; // Let Agora assign unique UID
        await agoraClient.join(appId, channelName, token, joinUid);
        console.log("Joined Agora channel as host with auto-assigned uid");

        // Create local tracks
        console.log("Requesting camera and microphone access...");
        audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        console.log("Microphone track created");
        
        videoTrack = await AgoraRTC.createCameraVideoTrack();
        console.log("Camera track created");

        // Publish tracks
        await agoraClient.publish([audioTrack, videoTrack]);
        console.log("Published audio and video tracks");

        // Play local video
        if (videoContainerRef.current) {
          videoTrack.play(videoContainerRef.current);
          console.log("Local video playing");
        }

        setClient(agoraClient);
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        setIsJoined(true);
        setInitError(null);
        console.log("Agora initialization complete!");
      } catch (error: any) {
        console.error("Failed to initialize Agora:", error);
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          code: error.code
        });
        
        let errorMessage = error.message;
        
        // Handle specific error cases
        if (error.code === "PERMISSION_DENIED" || error.message?.includes("permission")) {
          errorMessage = "Camera and microphone access denied. Please allow permissions in your browser settings and try again.";
        } else if (error.code === "NOT_READABLE" || error.message?.includes("in use")) {
          errorMessage = "Camera or microphone is already in use by another application. Please close other apps and try again.";
        } else if (error.code === "OPERATION_ABORTED" || error.message?.includes("cancel")) {
          errorMessage = "Camera/microphone access was cancelled. Please allow permissions to start the live stream.";
        }
        
        setInitError(errorMessage);
        isInitializingRef.current = false; // Reset on error
      }
    };

    if (!isJoined && !isInitializingRef.current) {
      console.log("Starting Agora initialization...");
      initAgora();
    }

    return () => {
      // Cleanup
      if (audioTrack) {
        audioTrack.close();
      }
      if (videoTrack) {
        videoTrack.close();
      }
      if (agoraClient) {
        agoraClient.leave();
      }
      isInitializingRef.current = false;
    };
  }, [appId, channelName, token, uid]); // Removed isJoined from dependencies

  const toggleMute = async () => {
    if (localAudioTrack && typeof localAudioTrack.setEnabled === 'function') {
      try {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState); // Update UI immediately
        await localAudioTrack.setEnabled(!newMutedState); // Then update track
        console.log(`Audio ${newMutedState ? 'muted' : 'unmuted'} successfully`);
      } catch (error) {
        console.error("Error toggling mute:", error);
        setIsMuted(!isMuted); // Revert on error
      }
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack && typeof localVideoTrack.setEnabled === 'function') {
      try {
        const newVideoOffState = !isVideoOff;
        setIsVideoOff(newVideoOffState); // Update UI immediately
        await localVideoTrack.setEnabled(!newVideoOffState); // Then update track
        console.log(`Video ${newVideoOffState ? 'disabled' : 'enabled'} successfully`);
      } catch (error) {
        console.error("Error toggling video:", error);
        setIsVideoOff(!isVideoOff); // Revert on error
      }
    }
  };

  const handleEndStream = async () => {
    if (confirm("Are you sure you want to end this live stream?")) {
      try {
        console.log("=== START CLEANUP ===");
        console.log("Initial state:", {
          hasClient: !!client,
          hasAudioTrack: !!localAudioTrack,
          hasVideoTrack: !!localVideoTrack,
          isJoined,
        });
        
        // Prevent re-initialization
        setIsJoined(false);
        console.log("Set isJoined to false");
        
        // Unpublish tracks BEFORE leaving channel (important when users are connected)
        if (client && (localAudioTrack || localVideoTrack)) {
          try {
            const tracksToUnpublish = [];
            if (localAudioTrack) tracksToUnpublish.push(localAudioTrack);
            if (localVideoTrack) tracksToUnpublish.push(localVideoTrack);
            
            if (tracksToUnpublish.length > 0) {
              console.log("Unpublishing tracks from channel...");
              await client.unpublish(tracksToUnpublish);
              console.log("✓ Tracks unpublished successfully");
            }
          } catch (err) {
            console.error("✗ Error unpublishing tracks:", err);
          }
        }
        
        // Small delay after unpublish
        console.log("Waiting 200ms after unpublish...");
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Stop and close audio track
        if (localAudioTrack) {
          try {
            console.log("Stopping audio track...");
            await localAudioTrack.stop();
            console.log("✓ Audio track stopped");
            
            console.log("Closing audio track...");
            await localAudioTrack.close();
            console.log("✓ Audio track closed");
          } catch (err) {
            console.error("✗ Error closing audio track:", err);
          }
          setLocalAudioTrack(null);
          console.log("Set localAudioTrack to null");
        } else {
          console.warn("⚠ No audio track to close");
        }
        
        // Stop and close video track
        if (localVideoTrack) {
          try {
            console.log("Stopping video track...");
            await localVideoTrack.stop();
            console.log("✓ Video track stopped");
            
            console.log("Closing video track...");
            await localVideoTrack.close();
            console.log("✓ Video track closed");
          } catch (err) {
            console.error("✗ Error closing video track:", err);
          }
          setLocalVideoTrack(null);
          console.log("Set localVideoTrack to null");
        } else {
          console.warn("⚠ No video track to close");
        }
        
        // Leave Agora channel AFTER tracks are closed
        if (client) {
          try {
            console.log("Leaving Agora channel...");
            await client.leave();
            console.log("✓ Left Agora channel successfully");
          } catch (err) {
            console.error("✗ Error leaving channel:", err);
          }
          setClient(null);
          console.log("Set client to null");
        }
        
        // Wait a bit more to ensure hardware is released
        console.log("Waiting 300ms for hardware release...");
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log("=== CLEANUP COMPLETE ===");
      } catch (error) {
        console.error("=== CLEANUP FAILED ===", error);
      } finally {
        console.log("Calling onEndStream...");
        // Call parent's onEndStream after cleanup completes
        onEndStream();
      }
    }
  };
  const retryInitialization = () => {
    setInitError(null);
    setIsJoined(false);
    // Force re-render to trigger useEffect
    window.location.reload();
  };

  // Show error overlay if initialization failed
  if (initError) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gray-800 rounded-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Failed to Start Live Stream
          </h2>
          <p className="text-gray-300 mb-6">{initError}</p>
          
          <div className="bg-gray-700 p-4 rounded mb-6 text-left text-sm text-gray-300">
            <p className="font-semibold mb-2">To reset permissions in Edge/Chrome:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the 🔒 lock icon in the address bar</li>
              <li>Click "Site settings" or "Permissions"</li>
              <li>Find Camera and Microphone</li>
              <li>Change from "Block" to "Ask" or "Allow"</li>
              <li>Click the retry button below</li>
            </ol>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={retryInitialization}
              className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handleEndStream}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full h-screen bg-black flex flex-col">
      {/* Video Container */}
      <div className="relative flex-1">
        <div
          ref={videoContainerRef}
          className="w-full h-full bg-gray-900"
          style={{ display: isVideoOff ? "none" : "block" }}
        />
        {isVideoOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <VideoOff className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-white text-lg">Camera is off</p>
            </div>
          </div>
        )}

        {/* Participant Count Overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white font-semibold">LIVE</span>
          <Users className="w-4 h-4 text-white ml-2" />
          <span className="text-white font-semibold">{participantCount}</span>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-all ${
                isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all ${
                isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="w-6 h-6 text-white" />
              ) : (
                <Video className="w-6 h-6 text-white" />
              )}
            </button>

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
              onClick={handleEndStream}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold transition-all ml-4"
            >
              End Stream
            </button>
          </div>
        </div>
      </div>

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
            <LiveChat sessionId={sessionId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreamHostView;
