"use client";

import React, { useEffect, useRef, useState } from "react";
import { Phone, Mic, MicOff, Video, VideoOff, X } from "lucide-react";
import { getCallToken, endCall } from "@/store/api/call";
import type { CallSession } from "@/store/api/call";

interface AgoraCallProps {
  callSession: CallSession;
  onCallEnd: () => void;
}

export default function AgoraCall({ callSession, onCallEnd }: AgoraCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callSession.callType === "audio");
  const [hasVideoTrack, setHasVideoTrack] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const agoraClientRef = useRef<any | null>(null);
  const localAudioTrackRef = useRef<any | null>(null);
  const localVideoTrackRef = useRef<any | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupAgora = () => {
    // Stop duration timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Stop and close local tracks
    const audioTrack = localAudioTrackRef.current;
    if (audioTrack) {
      try {
        if (typeof audioTrack.stop === "function") {
          audioTrack.stop();
        }
        audioTrack.close();
      } catch (err) {
        console.error("[AgoraCall] Error cleaning up local audio track", err);
      }
      localAudioTrackRef.current = null;
    }

    const videoTrack = localVideoTrackRef.current;
    if (videoTrack) {
      try {
        if (typeof videoTrack.stop === "function") {
          videoTrack.stop();
        }
        videoTrack.close();
      } catch (err) {
        console.error("[AgoraCall] Error cleaning up local video track", err);
      }
      localVideoTrackRef.current = null;
    }

    // Leave Agora channel
    const client = agoraClientRef.current;
    if (client) {
      try {
        if (typeof client.removeAllListeners === "function") {
          client.removeAllListeners();
        }
        // leave returns a promise; fire and forget here
        client.leave().catch((err: any) => {
          console.error("[AgoraCall] Error leaving Agora client", err);
        });
      } catch (err) {
        console.error("[AgoraCall] Error during Agora client cleanup", err);
      }
      agoraClientRef.current = null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeCall = async () => {
      try {
        // Get Agora token from backend
        const tokenData = await getCallToken(callSession.id);

        // Dynamically import Agora SDK (only when needed)
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

        // Create Agora client
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        
        if (!mounted) return;
        agoraClientRef.current = client;

        // Join the channel
        await client.join(
          tokenData.appId,
          tokenData.channelName,
          tokenData.token,
          tokenData.uid
        );

        // Create local audio track (required for both audio and video calls)
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localAudioTrackRef.current = audioTrack;

        // Build list of tracks to publish
        const tracksToPublish: any[] = [audioTrack];

        if (callSession.callType === "video") {
          try {
            const videoTrack = await AgoraRTC.createCameraVideoTrack();
            localVideoTrackRef.current = videoTrack;
            setHasVideoTrack(true);
            setIsVideoOff(false);

            // Play local video
            if (localVideoRef.current) {
              videoTrack.play(localVideoRef.current);
            }

            tracksToPublish.push(videoTrack);
          } catch (videoError) {
            console.error("[AgoraCall] Failed to start video track, falling back to audio-only", videoError);
            localVideoTrackRef.current = null;
            setHasVideoTrack(false);
            setIsVideoOff(true);
          }
        }

        // Publish whatever tracks we have (audio-only or audio+video)
        await client.publish(tracksToPublish);

        // Mark as connected after successful publish
        setIsConnecting(false);

        // Handle remote users
        client.on("user-published", async (user: any, mediaType: "video" | "audio") => {
          console.log("[AgoraCall] user-published:", user.uid, mediaType);
          await client.subscribe(user, mediaType);

          if (mediaType === "video" && remoteVideoRef.current) {
            console.log("[AgoraCall] Playing remote video for uid", user.uid);
            user.videoTrack?.play(remoteVideoRef.current);
          }

          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });

        client.on("user-unpublished", (user: any) => {
          // Handle user leaving
          console.log("[AgoraCall] user-unpublished", user.uid);
        });

        // Start call duration timer
        durationIntervalRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);

      } catch (error) {
        console.error("Failed to initialize call:", error);
        cleanupAgora();
        alert("Failed to connect to call. Please try again.");
        onCallEnd();
      }
    };

    initializeCall();

    return () => {
      mounted = false;
      cleanupAgora();
    };
  }, [callSession.id]);

  const handleEndCall = async () => {
    try {
      console.log("[AgoraCall] Ending call, callSessionId:", callSession.id);
      // Immediately clean up local media so mic/camera stop right away
      cleanupAgora();
      await endCall(callSession.id);
      console.log("[AgoraCall] Call ended successfully");
      onCallEnd();
    } catch (error) {
      console.error("[AgoraCall] Failed to end call:", error);
      onCallEnd();
    }
  };

  const toggleMute = () => {
    const audioTrack = localAudioTrackRef.current;
    if (audioTrack) {
      audioTrack.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localVideoTrackRef.current;
    if (videoTrack) {
      videoTrack.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex flex-col">
      {/* Call Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            {callSession.callType === "audio" ? "Audio Call" : "Video Call"}
          </h3>
          <p className="text-sm text-gray-300">
            {isConnecting ? "Connecting..." : `Duration: ${formatDuration(callDuration)}`}
          </p>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative bg-white/30 backdrop-blur-sm">
        {/* Remote Video (Full Screen) */}
        <div ref={remoteVideoRef} className="absolute inset-0 bg-gray-800" />

        {/* Local Video (Picture-in-Picture) */}
        {callSession.callType === "video" && hasVideoTrack && (
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div ref={localVideoRef} className="w-full h-full" />
          </div>
        )}

        {/* Connecting Overlay */}
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
              <p>Connecting to call...</p>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="bg-gray-800 p-6 flex items-center justify-center gap-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-colors ${
            isMuted ? "bg-red-500" : "bg-gray-600 hover:bg-gray-700"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </button>

        {callSession.callType === "video" && hasVideoTrack && (
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-colors ${
              isVideoOff ? "bg-red-500" : "bg-gray-600 hover:bg-gray-700"
            }`}
            title={isVideoOff ? "Turn On Video" : "Turn Off Video"}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>
        )}

        <button
          onClick={handleEndCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          title="End Call"
        >
          <Phone className="w-6 h-6 text-white rotate-135" />
        </button>
      </div>
    </div>
  );
}
