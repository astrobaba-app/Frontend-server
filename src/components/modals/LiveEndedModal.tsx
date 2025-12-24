import React from 'react';
import Button from '@/components/atoms/Button';
import { FiVideo, FiX } from 'react-icons/fi';

interface LiveEndedModalProps {
  isOpen: boolean;
  onClose: () => void;
  astrologerName?: string;
  stats?: {
    totalViewers?: number;
    maxViewers?: number;
    totalRevenue?: number;
    duration?: number;
  };
  isHost?: boolean;
}

export const LiveEndedModal: React.FC<LiveEndedModalProps> = ({
  isOpen,
  onClose,
  astrologerName = "Astrologer",
  stats,
  isHost = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
          <FiVideo className="w-6 h-6 text-yellow-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
          {isHost ? "Stream Ended" : "Live Session Ended"}
        </h3>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          {isHost 
            ? "Your live stream has ended successfully."
            : `${astrologerName} has ended the live session.`
          }
        </p>

        {/* Stats (only for host) */}
        {isHost && stats && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Viewers:</span>
              <span className="font-semibold text-gray-900">{stats.totalViewers || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Peak Viewers:</span>
              <span className="font-semibold text-gray-900">{stats.maxViewers || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Revenue:</span>
              <span className="font-semibold text-gray-900">₹{stats.totalRevenue || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold text-gray-900">{stats.duration || 0} minutes</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="primary"
            className="flex-1"
          >
            {isHost ? "View History" : "Browse Live Sessions"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveEndedModal;
