"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/utils/colors";
import Link from "next/link";
import type { AstrologerProfile } from "@/store/api/astrologer/profile";
import { getAstrologerProfile } from "@/store/api/astrologer/profile";
const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Free Kundli", href: "/profile/kundli" },
  { name: "Live Chat", href: "/astrologer?mode=chat" },
  { name: "Horoscope", href: "/horoscope" },
  { name: "Graho Store", href: "/store" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const [astrologerProfile, setAstrologerProfile] = useState<AstrologerProfile | null>(null);
  const [isAstrologer, setIsAstrologer] = useState(false);
  const [role, setRole] = useState<"user" | "astrologer" | null>(null);

  // Determine current role and, if astrologer, load profile via cookie-based auth
  useEffect(() => {
    const checkRoleAndLoadProfile = async () => {
      if (typeof window === "undefined") return;
      const storedRole = localStorage.getItem("auth_role");
      setRole((storedRole as "user" | "astrologer") || null);

      if (storedRole === "astrologer") {
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
      }

      setAstrologerProfile(null);
      setIsAstrologer(false);
    };

    checkRoleAndLoadProfile();

    const handleRoleChange = () => {
      checkRoleAndLoadProfile();
    };

    window.addEventListener("storage", handleRoleChange);
    window.addEventListener("auth_role_change", handleRoleChange);

    return () => {
      window.removeEventListener("storage", handleRoleChange);
      window.removeEventListener("auth_role_change", handleRoleChange);
    };
  }, []);

  const isSomeoneLoggedIn = isAstrologer || isLoggedIn;
  const profileHref = role === "astrologer" ? "/astrologer/dashboard" : "/profile";

  return (
    <header className="w-full bg-white shadow-md font-inter">
      <div className="p-3 md:p-4 md:py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 no-underline hover:opacity-80 transition duration-150"
          >
            <img
              src="/images/logo.png"
              alt="Astrobaba Logo"
              className="h-14 sm:h-16 md:h-20 w-auto object-cover"
            />
            <div className="hidden sm:block">
              <p
                style={{ color: colors.primeYellow }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
              >
                Graho
              </p>
              <p
                style={{ color: colors.gray }}
                className="text-xs sm:text-sm text-gray-600"
              >
                Grah Disha, Jeevan Disha
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center justify-center space-x-8">
            <Link
              href="/astrologer?mode=chat"
              style={{ color: colors.darkGray }}
              className="flex gap-2 text-base font-bold hover:opacity-80 transition duration-150"
            >
              <BsChatLeftTextFill
                style={{ color: colors.primeRed }}
                className="mt-2"
              />
              Chat Astrologers
            </Link>

            <Link
              href="/astrologer?mode=call"
              style={{ color: colors.darkGray }}
              className="flex gap-2 text-base font-bold hover:opacity-80 transition duration-150"
            >
              <FiPhone style={{ color: colors.primeGreen }} className="mt-2" />
              Talk with Astrologers
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isSomeoneLoggedIn ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href={profileHref}
                    style={{ background: colors.primeYellow, color: colors.black }}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full shadow-md hover:opacity-80 transition duration-150 ease-in-out whitespace-nowrap"
                  >
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />Profile
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    style={{
                      background: colors.primeYellow,
                      color: colors.black,
                    }}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full shadow-md hover:opacity-80 transition duration-150 ease-in-out whitespace-nowrap"
                  >
                    Register/Login
                  </Link>
                </>
              )}
            </div>

            <button
              style={{ color: colors.darkGray }}
              className="md:hidden p-1.5 sm:p-2 rounded-full bg-white shadow-md transition duration-150 hover:bg-gray-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <nav style={{ background: colors.primeYellow }} className=" shadow-xl">
        <div className="max-w-7xl mx-auto hidden md:flex items-center justify-center lg:space-x-12 px-4">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              style={{ color: colors.black }} // Added text color from variable
              className="text-base font-semibold uppercase tracking-wider hover:opacity-80 transition duration-150 ease-in-out py-2"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div
          style={{ background: colors.primeYellow }}
          className={`fixed inset-0 z-40 bg-opacity-95 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex justify-end p-4">
            <button
              style={{ color: colors.black }}
              className="p-2 rounded-full hover:opacity-80"
              onClick={() => setIsOpen(false)}
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col items-center space-y-6 mt-8">
            {NAV_LINKS.map((link) => (
              <Link // Switched from <a> to Link
                key={link.name}
                href={link.href}
                style={{ color: colors.black }} // Added text color from variable
                className="text-xl font-medium hover:opacity-80 transition duration-150"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
