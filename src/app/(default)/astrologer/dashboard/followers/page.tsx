"use client";

import React, { useEffect, useState } from "react";
import { colors } from "@/utils/colors";
import { FiHeart, FiUser } from "react-icons/fi";
import { getMyFollowersUsers, FollowerUser } from "@/store/api/general/astrologer";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";

export default function AstrologerFollowersPage() {
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<FollowerUser[]>([]);

  useEffect(() => {
    const loadFollowers = async () => {
      try {
        setLoading(true);
        const response = await getMyFollowersUsers(1, 100);
        if (response.success) {
          setFollowers(response.followers || []);
        }
      } catch (error: any) {
        showToast(error.message || "Failed to load followers", "error");
      } finally {
        setLoading(false);
      }
    };

    loadFollowers();
  }, [showToast]);

  return (
    <div className="md:px-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.black }}>
          My Followers
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {loading ? (
            <p className="text-sm" style={{ color: colors.gray }}>
              Loading followers...
            </p>
          ) : followers.length === 0 ? (
            <div className="text-center py-12">
              <FiHeart
                className="w-24 h-24 mx-auto mb-4"
                style={{ color: colors.gray }}
              />
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
                No Followers Yet
              </h2>
              <p style={{ color: colors.gray }}>
                Once users follow you, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {followers.map((follower) => (
                <div
                  key={follower.followId}
                  className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-yellow-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
                      <FiUser className="w-5 h-5 text-yellow-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold truncate" style={{ color: colors.black }}>
                        {follower.fullName || "User"}
                      </p>
                      <p className="text-sm truncate" style={{ color: colors.gray }}>
                        {follower.email || "No email available"}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs uppercase tracking-wide" style={{ color: colors.gray }}>
                        Followed on
                      </p>
                      <p className="text-sm font-semibold" style={{ color: colors.black }}>
                        {new Date(follower.followedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
