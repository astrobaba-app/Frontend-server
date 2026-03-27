"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/atoms/Heading";
import { Heart, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMyFollowingAstrologers,
  FollowingAstrologer,
} from "@/store/api/general/astrologer";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";

export default function FollowingPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<FollowingAstrologer[]>([]);

  useEffect(() => {
    const loadFollowing = async () => {
      if (!isLoggedIn) {
        router.push("/auth/login");
        return;
      }

      try {
        setLoading(true);
        const response = await getMyFollowingAstrologers(1, 100);
        if (response.success) {
          setFollowing(response.following || []);
        }
      } catch (error: any) {
        showToast(error.message || "Failed to load following", "error");
      } finally {
        setLoading(false);
      }
    };

    loadFollowing();
  }, [isLoggedIn, router, showToast]);

  return (
    <div className="w-full pb-12 transition-all duration-500">
      <Heading
        level={2}
        className="mb-4 text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter"
      >
        My Following
      </Heading>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <p className="text-gray-500 text-sm">Loading your following list...</p>
        </div>
      ) : following.length === 0 ? (
        <div className="bg-white text-center py-16 px-6 sm:py-24 sm:px-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-yellow-200 blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative z-10 bg-yellow-50 p-6 rounded-full">
              <Heart
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-[#F0DF20]"
                fill="#F0DF20"
              />
            </div>
          </div>

          <p className="text-gray-500 max-w-sm mx-auto text-sm sm:text-lg leading-relaxed">
            You are not following any astrologer yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {following.map((astrologer) => (
            <Link
              key={astrologer.followId}
              href={`/astrologer/${astrologer.id}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5"
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-yellow-400">
                    {astrologer.photo ? (
                      <img
                        src={astrologer.photo}
                        alt={astrologer.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-yellow-50 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  {astrologer.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {astrologer.fullName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {astrologer.skills?.join(", ") || "Astrologer"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹ {astrologer.pricePerMinute}/min
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-yellow-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}