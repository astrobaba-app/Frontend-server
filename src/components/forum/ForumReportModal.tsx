'use client';

import React, { useMemo, useState } from 'react';
import { Flag, X } from 'lucide-react';
import { FORUM_REPORT_REASON_OPTIONS, type ForumReportReasonOption } from '@/store/api/general/forum';

interface ForumReportModalProps {
  isOpen: boolean;
  postTitle: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: { reason: ForumReportReasonOption['value']; details?: string }) => void;
}

export default function ForumReportModal({
  isOpen,
  postTitle,
  submitting = false,
  onClose,
  onSubmit,
}: ForumReportModalProps) {
  const [reason, setReason] = useState<ForumReportReasonOption['value']>('abusive_content');
  const [details, setDetails] = useState('');

  const selectedReason = useMemo(
    () => FORUM_REPORT_REASON_OPTIONS.find((option) => option.value === reason),
    [reason],
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-4xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-600">
              <Flag className="h-3.5 w-3.5" />
              Report Post
            </div>
            <h3 className="mt-3 text-xl font-black text-gray-900">Send this post to moderators</h3>
            <p className="mt-1 text-sm leading-5 text-gray-600">Choose a reason and optionally add details.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            aria-label="Close report modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Selected Discussion</p>
          <p className="mt-1 line-clamp-2 text-sm font-bold text-gray-900">{postTitle}</p>
        </div>

        <div className="mt-4 max-h-60 space-y-2 overflow-y-auto pr-1">
          {FORUM_REPORT_REASON_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setReason(option.value)}
              className={`w-full rounded-2xl border px-3 py-2.5 text-left transition ${
                reason === option.value
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <p className="text-sm font-bold text-gray-900">{option.label}</p>
              <p className="mt-0.5 text-xs leading-4 text-gray-500">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Extra Details</label>
          <textarea
            value={details}
            onChange={(event) => setDetails(event.target.value.slice(0, 1000))}
            rows={3}
            placeholder={`Add details for moderators about ${selectedReason?.label.toLowerCase() || 'this report'}`}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-red-300"
          />
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-black text-gray-700 hover:border-gray-900 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onSubmit({ reason, details: details.trim() || undefined })}
            className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Confirm Report'}
          </button>
        </div>
      </div>
    </div>
  );
}