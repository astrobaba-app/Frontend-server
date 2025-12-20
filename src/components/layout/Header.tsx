"use client";

import React, { useState, useEffect } from "react";

import {
  Menu,
  X,
  User,
  Home,
  Star,
  MessageSquare,
  Phone,
  Moon,
  ShoppingBag,
} from "lucide-react";

import { BsChatLeftTextFill } from "react-icons/bs";

import { FiPhone } from "react-icons/fi";

import { useAuth } from "@/contexts/AuthContext";

import { colors } from "@/utils/colors";

import Link from "next/link";

import type { AstrologerProfile } from "@/store/api/astrologer/profile";

import { getAstrologerProfile } from "@/store/api/astrologer/profile";
import { getCookie } from "@/utils/cookies";

const NAV_LINKS = [
  { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },

  {
    name: "Free Kundli",
    href: "/profile/kundli",
    icon: <Star className="w-5 h-5" />,
  },

  {
    name: "Live Chat",
    href: "/astrologer?mode=chat",
    icon: <MessageSquare className="w-5 h-5" />,
  },

  { name: "Horoscope", href: "/horoscope", icon: <Moon className="w-5 h-5" /> },

  {
    name: "Graho Store",
    href: "/store",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoggedIn, user } = useAuth();

  const [astrologerProfile, setAstrologerProfile] =
    useState<AstrologerProfile | null>(null);

  // Initialize auth state synchronously to prevent flash
  const [isAstrologer, setIsAstrologer] = useState(() => {
    if (typeof window !== "undefined") {
      return !!getCookie("token_astrologer");
    }
    return false;
  });

  const [role, setRole] = useState<"user" | "astrologer" | null>(() => {
    if (typeof window !== "undefined") {
      const astrologerToken = getCookie("token_astrologer");
      const middlewareToken = getCookie("token_middleware");
      if (astrologerToken) return "astrologer";
      if (middlewareToken) return "user";
    }
    return null;
  });

  useEffect(() => {
    const checkRoleAndLoadProfile = async () => {
      if (typeof window === "undefined") return;

      const astrologerToken = getCookie("token_astrologer");
      const middlewareToken = getCookie("token_middleware");

      if (astrologerToken) {
        setRole("astrologer");
        try {
          const response = await getAstrologerProfile();

          if (response.success) {
            setAstrologerProfile(response.astrologer);

            setIsAstrologer(true);

            return;
          }
        } catch (error) {
          console.error("Failed to load astrologer profile:", error);
        }
      } else if (middlewareToken) {
        setRole("user");
      } else {
        setRole(null);
      }

      setAstrologerProfile(null);

      setIsAstrologer(false);
    };

    checkRoleAndLoadProfile();

    const handleRoleChange = () => checkRoleAndLoadProfile();

    window.addEventListener("storage", handleRoleChange);

    window.addEventListener("auth_change", handleRoleChange);

    return () => {
      window.removeEventListener("storage", handleRoleChange);

      window.removeEventListener("auth_change", handleRoleChange);
    };
  }, []);

  const isSomeoneLoggedIn = isAstrologer || isLoggedIn;

  const profileHref =
    role === "astrologer" ? "/astrologer/dashboard" : "/profile";

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 font-inter">
      {/* Top Main Header */}

      <div className="px-4 py-2 md:py-3 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Section */}

          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition duration-150"
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-12 sm:h-14 md:h-20 w-auto object-contain"
            />

            <div className="hidden md:block">
              <p
                style={{ color: colors.primeYellow }}
                className="text-xl md:text-4xl font-extrabold leading-none"
              >
                Graho
              </p>

              <p
                style={{ color: colors.gray }}
                className="text-[10px] md:text-sm font-medium"
              >
                Grah Disha, Jeevan Disha
              </p>
            </div>
          </Link>

          {/* Desktop Call/Chat Actions */}

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/astrologer?mode=chat"
              style={{ color: colors.darkGray }}
              className="flex gap-2 text-base font-bold hover:text-red-500 transition-colors"
            >
              <BsChatLeftTextFill
                style={{ color: colors.primeRed }}
                className="mt-1"
              />
              Chat Astrologers
            </Link>

            <Link
              href="/astrologer?mode=call"
              style={{ color: colors.darkGray }}
              className="flex gap-2 text-base font-bold hover:text-green-600 transition-colors"
            >
              <FiPhone style={{ color: colors.primeGreen }} className="mt-1" />
              Talk with Astrologers
            </Link>
          </div>

          {/* Right Side: Auth & Mobile Toggle */}

          <div className="flex items-center space-x-3">
            {isSomeoneLoggedIn ? (
              <Link
                href={profileHref}
                style={{ background: colors.primeYellow, color: colors.black }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-sm hover:brightness-95 transition-all"
              >
                <User className="w-4 h-4" />

                <span className="hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  style={{ background: colors.primeYellow, color: colors.black }}
                  className="px-4 py-2 text-xs sm:text-sm font-bold rounded-full shadow-sm hover:brightness-95 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/astrologer/signup"
                  style={{ background: colors.primeRed, color: colors.white }}
                  className="hidden sm:flex px-4 py-2 text-xs sm:text-sm font-bold rounded-full shadow-sm hover:brightness-95 transition-all"
                >
                  Register as Astrologer
                </Link>
              </>
            )}

            <button
              className="md:hidden p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar */}

      <nav
        style={{ background: colors.primeYellow }}
        className="hidden md:block shadow-md"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-10 px-4 py-2.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold uppercase tracking-wider text-black hover:opacity-70 transition-opacity"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Improved Mobile Menu Overlay */}

      <div
        className={`fixed inset-0 z-60 md:hidden transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}

        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Content (Drawer) */}

        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Drawer Header */}

            <div
              style={{ background: colors.primeYellow }}
              className="p-4 flex justify-between items-center"
            >
              <span className="font-bold text-black uppercase tracking-tight">
                Menu
              </span>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 bg-white/20 rounded-full"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            {/* Quick Action Cards (Mobile Specific) */}

            <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50">
              <Link
                href="/astrologer?mode=chat"
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <BsChatLeftTextFill
                  style={{ color: colors.primeRed }}
                  className="text-xl mb-1"
                />

                <span className="text-[10px] font-bold text-gray-700">
                  Chat Now
                </span>
              </Link>

              <Link
                href="/astrologer?mode=call"
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <FiPhone
                  style={{ color: colors.primeGreen }}
                  className="text-xl mb-1"
                />

                <span className="text-[10px] font-bold text-gray-700">
                  Talk Now
                </span>
              </Link>
            </div>

            {/* Links List */}

            <div className="flex-1 overflow-y-auto py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 border-b border-gray-50 transition-colors"
                >
                  <span className="text-gray-400">{link.icon}</span>

                  <span className="text-base font-semibold">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Auth Section (Mobile) */}
            {!isSomeoneLoggedIn && (
              <div className="p-4 space-y-2 border-t border-gray-200">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  style={{ background: colors.primeYellow, color: colors.black }}
                  className="block w-full text-center px-4 py-3 text-sm font-bold rounded-full shadow-sm hover:brightness-95 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/astrologer/signup"
                  onClick={() => setIsOpen(false)}
                  style={{ background: colors.primeRed, color: colors.white }}
                  className="block w-full text-center px-4 py-3 text-sm font-bold rounded-full shadow-sm hover:brightness-95 transition-all"
                >
                  Register as Astrologer
                </Link>
              </div>
            )}

           
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
