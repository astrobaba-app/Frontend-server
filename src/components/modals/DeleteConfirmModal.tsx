import React from 'react';
import Button from '@/components/atoms/Button';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Blog",
  message = "Are you sure you want to delete this blog? This action cannot be undone.",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <FiAlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            fullWidth
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
