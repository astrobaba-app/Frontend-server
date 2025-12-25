"use client";

import React from "react";
import { colors } from "@/utils/colors";
import { FiHeart } from "react-icons/fi";

export default function AstrologerFollowersPage() {
  return (
    <div className="md:px-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.black }}>
          My Followers
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <FiHeart
              className="w-24 h-24 mx-auto mb-4"
              style={{ color: colors.gray }}
            />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
              Followers List
            </h2>
            <p style={{ color: colors.gray }}>
              This feature is coming soon. You'll be able to see all your followers here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
