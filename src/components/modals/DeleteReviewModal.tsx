import React from "react";
import { colors } from "@/utils/colors";
import Button from "../atoms/Button";

interface DeleteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteReviewModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10">
        <h2
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: colors.black }}
        >
          Delete Review
        </h2>

        <p
          className="text-center mb-8 text-base"
          style={{ color: colors.darkGray }}
        >
          Are you sure you want to delete this review? This action cannot be undone.
        </p>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
            style={{ backgroundColor: colors.primeRed }}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
