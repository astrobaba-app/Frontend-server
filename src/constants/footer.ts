export interface NavLink {
  name: string;
  href: string;
}

export const QUICK_LINKS: NavLink[] = [
  { name: 'About us', href: '#' },
  { name: 'Terms & Conditions', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Chat with Astrologer', href: '#' },
];

export const ACCOUNTS_LINKS: NavLink[] = [
  { name: 'Login', href: '/auth/login' },
  { name: 'Register', href: '/auth/login' },
  { name: 'Profile', href: '/profile' },
  { name: 'Register As Astrologer', href: '#' },
];

export const CONTACT_INFO = {
  address: 'IIEST SHIBPUR, Howrah, West Bengal',
  phone: '+91 4567891234',
  email: 'contact@astrobaba.live',
};

export const SOCIAL_MEDIA = [
  { name: 'Facebook', href: '#' },
  { name: 'Youtube', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'Twitter', href: '#' },
];

export const COMPANY_INFO = {
  name: 'Astrobaba',
  tagline: 'Shubh Drishti, Shubh Marg.',
  logo: '/images/footer_logo.png',
  copyright: 'Copyright © 2025-26 Astrobaba. All Right Reserved.',
};
