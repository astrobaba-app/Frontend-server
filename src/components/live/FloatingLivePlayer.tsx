"use client";

import React, { useRef, useEffect } from "react";
import { Maximize2, X, Users } from "lucide-react";
import { useLiveStream } from "@/contexts/LiveStreamContext";

interface FloatingLivePlayerProps {
  videoTrack?: any; // Agora video track
  isHost: boolean;
  astrologerName?: string;
  onMaximize: () => void;
  onClose: () => void;
}

const FloatingLivePlayer: React.FC<FloatingLivePlayerProps> = ({
  videoTrack,
  isHost,
  astrologerName,
  onMaximize,
  onClose,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const { participantCount } = useLiveStream();
  const [position, setPosition] = React.useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (videoTrack && videoRef.current) {
      videoTrack.play(videoRef.current);
    }

    return () => {
      if (videoTrack) {
        videoTrack.stop();
      }
    };
  }, [videoTrack]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== "BUTTON") {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      className="fixed z-50 w-80 h-52 bg-black rounded-lg shadow-2xl overflow-hidden cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Video Container */}
      <div className="relative w-full h-full">
        <div ref={videoRef} className="w-full h-full bg-gray-900" />

        {/* Live Indicator */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold">LIVE</span>
        </div>

        {/* Participant Count */}
        <div className="absolute top-2 right-14 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Users className="w-3 h-3 text-white" />
          <span className="text-white text-xs font-semibold">{participantCount}</span>
        </div>

        {/* Astrologer Name (for audience view) */}
        {!isHost && astrologerName && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
            <p className="text-white text-xs font-semibold">{astrologerName}</p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={onMaximize}
            className="p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Role Indicator */}
        <div className="absolute bottom-2 right-2 bg-yellow-500/90 px-2 py-1 rounded text-xs font-semibold text-white">
          {isHost ? "Hosting" : "Watching"}
        </div>
      </div>
    </div>
  );
};

export default FloatingLivePlayer;
