import React from "react";
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
import Link from "next/link";

interface LinkItem {
    name: string;
    href: string;
}

interface Social {
    name: string;
    href: string;
}

const QUICK_LINKS: LinkItem[] = [
    { name: "About us", href: "/about" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Chat with Astrologer", href: "/chat" },
];

const ACCOUNTS_LINKS: LinkItem[] = [
    { name: "Login", href: "/auth/login" },
    { name: "Register", href: "/auth/login" },
    { name: "Profile", href: "/profile" },
    { name: "Register As Astrologer", href: "/astrologer/signup" },
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

const DownloadAppSection: React.FC = () => {
    return (
        
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
};

interface SocialMediaIconProps {
    icon: LucideIcon;
    color: string;
    href: string;
}

const SocialMediaIcon: React.FC<SocialMediaIconProps> = ({
    icon: Icon,
    color,
    href,
}) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full flex items-center justify-center transition duration-200 hover:opacity-80"
        style={{ backgroundColor: color }}
    >
        <Icon style={{color:colors.white}} className="w-4 h-4 " />
    </a>
);

const socialIcons: Record<string, LucideIcon> = {
    Facebook,
    Instagram,
    Twitter,
};

const Footer: React.FC = () => {
    return (
        <footer style={{ background: colors.darkGray }} className="w-full text-white font-inter">
            <div className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <div className="w-full flex flex-col items-center sm:items-start space-y-2">
                            <div className="flex flex-col items-center sm:items-start justify-center">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center">
                                    <img
                                        src={COMPANY_INFO.logo}
                                        alt={`${COMPANY_INFO.name} Logo with planet icon`}
                                        className="h-full w-auto object-contain"
                                    />
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-white mb-0 leading-none">
                                    {COMPANY_INFO.name}
                                </p>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400 mt-0">
                                {COMPANY_INFO.tagline}
                            </p>
                        </div>

                        <div className="flex space-x-4 sm:space-x-5 mt-4">
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

                    <div className="space-y-3 sm:space-y-4">
                        <p className="text-sm sm:text-md font-bold uppercase tracking-wider text-white">
                            Quick Links
                        </p>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition duration-150 block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <p className="text-sm sm:text-md font-bold uppercase tracking-wider text-white">
                            Accounts
                        </p>
                        <ul className="space-y-2">
                            {ACCOUNTS_LINKS.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition duration-150 block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <p className="text-sm sm:text-md font-bold uppercase tracking-wider mb-3 sm:mb-4 pb-1 text-white">
                            Contact Info
                        </p>
                        <div className="space-y-2 text-xs sm:text-sm">
                            <p className="flex items-start text-gray-400">
                                <MapPin className="w-4 h-4 mr-2 shrink-0 mt-1 text-gray-400" />
                                <span>{CONTACT_INFO.address}</span>
                            </p>
                            <a
                                href={`tel:${CONTACT_INFO.phone}`}
                                className="flex items-center text-gray-400 hover:text-white transition duration-150"
                            >
                                <Phone className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                                <span>{CONTACT_INFO.phone}</span>
                            </a>
                            <a
                                href={`mailto:${CONTACT_INFO.email}`}
                                className="flex items-center text-gray-400 hover:text-white transition duration-150"
                            >
                                <Mail className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                                <span>{CONTACT_INFO.email}</span>
                            </a>
                        </div>
                    </div>
                    
                    <div className="">
                        <DownloadAppSection />
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700"></div>
            <div style={{ background: colors.darkGray }} className="py-3 sm:py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm font-medium text-gray-400">
                    {COMPANY_INFO.copyright}
                </div>
            </div>
        </footer>
    );
};

export default Footer;