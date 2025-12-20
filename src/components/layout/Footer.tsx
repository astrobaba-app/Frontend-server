"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Twitter,
  LucideIcon,
} from "lucide-react";
import { colors } from "@/utils/colors";

// --- 1. INTERFACES (Must be at the top) ---
interface LinkItem {
  name: string;
  href: string;
}

interface Social {
  name: string;
  href: string;
}

interface SocialMediaIconProps {
  icon: LucideIcon;
  color: string;
  href: string;
}

// --- 2. CONSTANTS ---
const QUICK_LINKS: LinkItem[] = [
  { name: "About us", href: "/about" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Chat with Astrologer", href: "/chat" },
];

const CONTACT_INFO = {
  address: "IIEST SHIBPUR, Howrah, West Bengal",
  phone: "+91 4567891234",
  email: "contact@astrobaba.live",
};

const SOCIAL_MEDIA: Social[] = [
  { name: "Facebook", href: "https://facebook.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Twitter", href: "https://twitter.com" },
];

const COMPANY_INFO = {
  name: "Graho",
  tagline: "Grah Disha, Jeevan Disha.",
  logo: "/images/footer_logo.png",
  copyright: "Copyright © 2025-26 Graho. All Right Reserved.",
};

const socialIcons: Record<string, LucideIcon> = {
  Facebook,
  Instagram,
  Twitter,
};

// --- 3. SUB-COMPONENTS ---
const GooglePlayImage: React.FC = () => (
  <Link href="#" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/googleplay.png"
      alt="Get it on Google Play"
      className="w-[120px] h-12 object-contain rounded-md"
    />
  </Link>
);

const AppStoreImage: React.FC = () => (
  <Link href="#" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/appstore.png"
      alt="Download on the App Store"
      className="w-[120px] h-12 object-contain rounded-md"
    />
  </Link>
);

const QRCode: React.FC = () => (
  <div className="w-24 h-24 rounded-sm overflow-hidden">
    <img
      src="/images/QR.png"
      alt="Scan to download app QR code"
      className="w-full h-full object-contain"
    />
  </div>
);

const SocialMediaIcon: React.FC<SocialMediaIconProps> = ({
  icon: Icon,
  color,
  href,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
    style={{ backgroundColor: color }}
  >
    <Icon style={{ color: colors.white }} className="w-4 h-4" />
  </a>
);

const DownloadAppSection: React.FC = () => (
  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-[#575757] text-white rounded-lg">
    <div className="space-y-1">
      <p className="text-lg sm:text-xl md:text-2xl font-normal text-white">
        Download App
      </p>
      <p className="text-xs sm:text-sm text-gray-400 font-normal">
        Scan to download our app
      </p>
    </div>
    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
      <div className="flex flex-col space-y-1">
        <GooglePlayImage />
        <AppStoreImage />
      </div>
      <QRCode />
    </div>
  </div>
);

// --- 4. MAIN FOOTER COMPONENT ---
const Footer: React.FC = () => {
  return (
    <footer
      style={{ background: colors.darkGray }}
      className="w-full text-white font-inter border-t border-gray-800"
    >
      <div className="max-w-7xl mx-auto py-10 sm:py-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="w-full flex flex-col items-center sm:items-start space-y-3">
              <img
                src={COMPANY_INFO.logo}
                alt="Logo"
                className="h-20 sm:h-24 md:h-32 w-auto object-contain"
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {COMPANY_INFO.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">
                  {COMPANY_INFO.tagline}
                </p>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              {SOCIAL_MEDIA.map((social) => (
                <SocialMediaIcon
                  key={social.name}
                  icon={socialIcons[social.name]}
                  color={colors.primeYellow}
                  href={social.href}
                />
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.15em] border-b border-gray-700 pb-2 inline-block">
              Quick Links
            </p>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Contact */}
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.15em] border-b border-gray-700 pb-2 inline-block">
              Contact Info
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start group">
                <div className="p-2 rounded-lg bg-gray-800 mr-3 group-hover:bg-gray-700 transition-colors">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="text-gray-400">{CONTACT_INFO.address}</span>
              </div>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center group"
              >
                <div className="p-2 rounded-lg bg-gray-800 mr-3 group-hover:bg-gray-700">
                  <Phone className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="text-gray-400">{CONTACT_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center group"
              >
                <div className="p-2 rounded-lg bg-gray-800 mr-3 group-hover:bg-gray-700">
                  <Mail className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="text-gray-400">{CONTACT_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Download */}
          <div className="lg:col-span-1 sm:col-span-2">
            <DownloadAppSection />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 bg-[#333333]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            {COMPANY_INFO.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
