'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { ForumIdentityMode } from '@/store/api/general/forum';

export default function ForumComposer({
  isLoggedIn,
  identityMode,
  anonymousHandle,
  onSubmit,
  onRequireAuth,
  submitting,
}: {
  isLoggedIn: boolean;
  identityMode: ForumIdentityMode;
  anonymousHandle?: string | null;
  onSubmit: (payload: { title: string; description: string; tags: string[]; images: File[] }) => Promise<void>;
  onRequireAuth: () => void;
  submitting: boolean;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      onRequireAuth();
      return;
    }

    await onSubmit({
      title,
      description,
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      images,
    });

    setTitle('');
    setDescription('');
    setTagsInput('');
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400">Start a Discussion</p>
          <h2 className="mt-2 text-xl font-black text-gray-900">Ask the community anything</h2>
        </div>
        <div className="rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          Posting as {identityMode === 'anonymous' ? anonymousHandle || 'Anonymous' : 'your profile'}
        </div>
      </div>

      <div className="grid gap-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onFocus={() => {
            if (!isLoggedIn) {
              onRequireAuth();
            }
          }}
          placeholder="Title"
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-amber-400"
          maxLength={180}
          required
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onFocus={() => {
            if (!isLoggedIn) {
              onRequireAuth();
            }
          }}
          placeholder="Describe your question or share your perspective"
          className="min-h-32 w-full rounded-3xl border border-gray-200 px-4 py-4 text-sm text-gray-700 outline-none transition focus:border-amber-400"
          required
        />

        <div>
          <input
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="Tags, separated by commas"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-amber-400"
          />
        </div>

        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => setImages(Array.from(event.target.files || []))}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-amber-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-amber-800 hover:file:bg-amber-200"
          />
          {images.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">{images.length} image{images.length > 1 ? 's' : ''} selected</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Anonymous posts stay anonymous permanently, even if you change your profile mode later.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-black text-gray-900 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Posting...' : 'Publish'}
          </button>
        </div>
      </div>
    </form>
  );
}