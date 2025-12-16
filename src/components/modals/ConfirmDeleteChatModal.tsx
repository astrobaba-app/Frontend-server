"use client";

import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Button } from "../atoms";

interface ConfirmDeleteChatModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteChatModal: React.FC<ConfirmDeleteChatModalProps> = ({
  isOpen,
  title = "Delete Chat",
  message = "Are you sure you want to delete this chat? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-5 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <RxCross2 className="w-4 h-4 text-gray-500" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-5">{message}</p>

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            type="button"
            className="px-4 py-2"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteChatModal;
