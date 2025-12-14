"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  LogOut 
} from "lucide-react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
interface AstrologerSidebarProps {
  profile: AstrologerProfile | null;
  onLogout: () => void;
}

const ACCENT_YELLOW = '#FFD700';

export default function AstrologerSidebar({ profile, onLogout }: AstrologerSidebarProps) {
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
      label: "My Consulations",
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
    <div className="bg-white rounded-lg overflow-hidden w-full max-w-xs border border-[#FFD700] h-fit sticky top-4">
      {/* Profile Section */}
      <div className="bg-white p-6 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {profile?.photo ? (
            <Image
              src={profile.photo}
              alt={profile.fullName}
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full scale-75">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-blue-300 border-2 border-white z-10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-t-full bg-blue-700"></div>
              <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 z-20"></div>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {profile?.fullName || "John Doe"}
        </h3>
        <p className="text-sm text-gray-600">
          {profile?.email || "example@gmail.com"}
        </p>
      </div>

      {/* Menu Items */}
      <div className="pt-2 pb-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all border-t border-[#f9f5e0]`}
              style={{
                backgroundColor: isActive ? ACCENT_YELLOW : 'white',
                borderBottom: '1px solid #FFD700',
              }}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-base font-medium ${isActive ? 'text-gray-900' : 'text-gray-800'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="p-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-4 w-full transition-colors bg-white hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-base font-medium text-red-600">Logout</span>
        </button>
      </div>
    </div>
  );
}
