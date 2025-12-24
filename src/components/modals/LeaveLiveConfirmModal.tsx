import React from 'react';
import Button from '@/components/atoms/Button';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface LeaveLiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  astrologerName?: string;
}

export const LeaveLiveConfirmModal: React.FC<LeaveLiveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  astrologerName = "the astrologer",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
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
          <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
          Leave Live Stream?
        </h3>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to leave {astrologerName}'s live stream?
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Stay
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            className="flex-1"
          >
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaveLiveConfirmModal;
