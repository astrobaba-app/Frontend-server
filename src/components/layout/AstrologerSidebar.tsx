"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { AstrologerProfile } from "@/store/api/astrologer/auth";
import {
  User,
  Wallet,
  Heart,
  Eye,
  MessageSquare,
  FileText,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

interface AstrologerSidebarProps {
  profile: AstrologerProfile | null;
  onLogout: () => void;
}

export default function AstrologerSidebar({
  profile,
  onLogout,
}: AstrologerSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: User,
      label: "My Profile",
      href: "/astrologer/dashboard/profile",
    },
    {
      icon: Wallet,
      label: "My Earning",
      href: "/astrologer/dashboard/earning",
    },
    {
      icon: Heart,
      label: "My followers",
      href: "/astrologer/dashboard/followers",
    },
    {
      icon: IoChatboxEllipsesOutline,
      label: "Live Chats",
      href: "/astrologer/live-chats",
    },
    {
      icon: Eye,
      label: "My Reviews",
      href: "/astrologer/dashboard/reviews",
    },
    {
      icon: MessageSquare,
      label: "My Consultations",
      href: "/astrologer/dashboard/consultations",
    },
    {
      icon: FileText,
      label: "My Blog",
      href: "/astrologer/dashboard/blog",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/astrologer/dashboard/notifications",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/astrologer/dashboard/settings",
    },
  ];

  return (
    <div className="bg-white rounded-2xl overflow-hidden w-full border border-gray-100 shadow-sm transition-all duration-300">
      {/* Profile Section */}
      <div className="p-6 bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden shrink-0">
            {profile?.photo ? (
              <img
                src={profile.photo}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xl">
                {profile?.fullName?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {profile ? (
              <>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {profile.fullName}
                </p>
                <p className="text-xs text-gray-500 truncate">{profile.email}</p>
              </>
            ) : (
              <div className="flex flex-col gap-2 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-100 rounded"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-6 py-3.5 transition-all group ${
                isActive 
                  ? "bg-yellow-50 border-r-4 border-yellow-500" 
                  : "hover:bg-gray-50 border-r-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon className={`w-5 h-5 ${isActive ? "text-yellow-600" : "text-gray-500 group-hover:text-yellow-600"}`} />
                <span className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {item.label}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isActive ? "text-yellow-600" : "text-gray-300 group-hover:text-yellow-600"}`} />
            </Link>
          );
        })}

        <div className="px-4 mt-2">
          <div className="border-t border-gray-100 my-2"></div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-3.5 w-full transition-colors text-red-500 hover:bg-red-50 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </nav>
    </div>
  );
}
