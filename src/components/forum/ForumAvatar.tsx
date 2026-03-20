'use client';

import React from 'react';

const AVATAR_BACKGROUNDS = [
  'from-amber-200 to-orange-300',
  'from-sky-200 to-blue-300',
  'from-emerald-200 to-green-300',
  'from-rose-200 to-pink-300',
  'from-indigo-200 to-violet-300',
  'from-yellow-200 to-lime-300',
];

const getAvatarIndex = (seed: string) => {
  return Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0) % AVATAR_BACKGROUNDS.length;
};

export default function ForumAvatar({
  name,
  seed,
  size = 'md',
}: {
  name: string;
  seed: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dimensions = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-sm';
  const background = AVATAR_BACKGROUNDS[getAvatarIndex(seed || name || 'A')];
  const initial = (name?.trim()?.charAt(0) || 'G').toUpperCase();

  return (
    <div
      className={`flex ${dimensions} items-center justify-center rounded-2xl bg-gradient-to-br ${background} font-black text-gray-900 shadow-sm`}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}