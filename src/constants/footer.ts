export interface NavLink {
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
