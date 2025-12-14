import { IconType } from 'react-icons';
import { Briefcase, Heart, DollarSign, Activity, Home, GraduationCap } from 'lucide-react';
import { FaMoneyBillAlt } from "react-icons/fa";
export interface LiveAstrologer {
  id: number;
  name: string;
  imageSrc: string;
  link: string;
}

export const LIVE_ASTROLOGERS: LiveAstrologer[] = [
  {
    id: 1,
    name: 'Pt. Preety',
    imageSrc: '/images/astrologer_preety.png',
    link: '/astrologer/preety',
  },
  {
    id: 2,
    name: 'Dr. Sharma',
    imageSrc: '/images/astrologer_sharma.png',
    link: '/astrologer/sharma',
  },
  {
    id: 3,
    name: 'Jyoti Verma',
    imageSrc: '/images/astrologer_jyoti.png',
    link: '/astrologer/jyoti',
  },
  {
    id: 4,
    name: 'Ravi Dutt',
    imageSrc: '/images/astrologer_ravi.png',
    link: '/astrologer/ravi',
  },
];

export interface Astrologer {
  name: string;
  title: string;
  experience: string;
  topics: string[];
  rating: string;
  isOnline: boolean;
}

export const ASTROLOGERS_DATA: Astrologer[] = [
  {
    name: 'Pt. Rajesh Kumar',
    title: 'Vedic Astrologer',
    experience: '15+ Yr Exp.',
    topics: ['Career', 'Marriage', 'Health'],
    rating: '4.9',
    isOnline: true,
  },
  {
    name: 'Dr. Neha Sharma',
    title: 'Tarot Reader',
    experience: '10 Yr Exp.',
    topics: ['Love', 'Finance', 'Spirituality'],
    rating: '4.7',
    isOnline: true,
  },
  {
    name: 'Acharya Vijay',
    title: 'Nadi Astrologer',
    experience: '20+ Yr Exp.',
    topics: ['Business', 'Family', 'Children'],
    rating: '5.0',
    isOnline: true,
  },
];

export interface BlogPost {
  slug: string;
  image: string;
  views: string;
  title: string;
  author: string;
  date: string;
}

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'predictive-astrology-secrets',
    image: 'https://placehold.co/600x400/171717/F0DF20?text=Blog+Image+1',
    views: '3000',
    title: 'Predictive Astrology Secrets: Timing Events with Nakshatra Transits',
    author: 'Astrologer Amit',
    date: 'Nov 14, 2025',
  },
  {
    slug: 'decoding-the-stars',
    image: 'https://placehold.co/600x400/171717/F0DF20?text=Blog+Image+2',
    views: '300',
    title: 'Decoding the Stars: How Graha-Nakshatra Conjunctions Shape Your Personality',
    author: 'Astrologer Amit',
    date: 'Nov 14, 2025',
  },
  {
    slug: 'where-the-planets-reside',
    image: 'https://placehold.co/600x400/171717/F0DF20?text=Blog+Image+3',
    views: '200',
    title: 'Where the Planets Reside: A Guide to the Four Padas of Each Nakshatra',
    author: 'Astrologer Amit',
    date: 'Nov 14, 2025',
  },
];

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  alt: string;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Bracelets', price: 29.99, imageUrl: '/images/bracelet.png', alt: 'Black bead bracelet with orange accents' },
  { id: 2, name: 'Rudraksha', price: 45.0, imageUrl: '/images/bracelet.png', alt: 'Five-faced Rudraksha bead' },
  { id: 3, name: 'Bracelets', price: 34.99, imageUrl: '/images/bracelet.png', alt: 'Black bead bracelet with wood accents' },
  { id: 4, name: 'Bracelets', price: 27.5, imageUrl: '/images/bracelet.png', alt: 'Black bead bracelet, single design' },
  { id: 5, name: 'Bracelets', price: 29.99, imageUrl: '/images/bracelet.png', alt: 'Black bead bracelet, different perspective' },
  { id: 6, name: 'Bracelets', price: 31.0, imageUrl: '/images/bracelet.png', alt: 'Black bead bracelet with small orange beads' },
];

export interface BannerSlide {
  question: string;
  subtext: string;
  imagePath: string;
}

export const BANNER_SLIDES: BannerSlide[] = [
  {
    question: 'Feeling stuck in your job or career path?',
    subtext: 'Ask Astrologer',
    imagePath: '/images/astrologer.png',
  },
  {
    question: 'Should I stay or leave my current relationship?',
    subtext: 'Ask Astrologer',
    imagePath: '/images/astrologer.png',
  },
  {
    question: 'When is the best time for me to change jobs?',
    subtext: 'Ask Astrologer',
    imagePath: '/images/astrologer.png',
  },
  {
    question: 'Will my current partner and I be happy long-term?',
    subtext: 'Ask Astrologer',
    imagePath: '/images/astrologer.png',
  },
  {
    question: "What's the best business or career for my zodiac sign?",
    subtext: 'Ask Astrologer',
    imagePath: '/images/astrologer.png',
  },
];

export interface PopularCategory {
  icon: IconType;
  title: string;
  questions: string[];
  iconBg: string;
}

export const POPULAR_CATEGORIES: PopularCategory[] = [
  {
    icon: Briefcase,
    title: 'Career & Success',
    questions: ['When will I get Promotion?', 'Should I change my job?', 'Best Time to start business?'],
    iconBg: 'bg-yellow-400',
  },
  {
    icon: Heart,
    title: 'Love & Marriage',
    questions: ['When will I find love?', 'Is my partner compatible?', 'When will I get marriage?'],
    iconBg: 'bg-yellow-400',
  },
  {
    icon: FaMoneyBillAlt,
    title: 'Money & Wealth',
    questions: ['Financial growth prediction?', 'Where should I invest?', 'Should I need to start my own business?'],
    iconBg: 'bg-yellow-400',
  },
  {
    icon: Activity,
    title: 'Health & Wellness',
    questions: ['When will be cured of this disease?', 'Recovery Time?', 'Wellness guidance?'],
    iconBg: 'bg-yellow-400',
  },
  {
    icon: Home,
    title: 'Family & Home',
    questions: ['Family relationship issue', 'Child birth prediction', 'Property & home guidance'],
    iconBg: 'bg-yellow-400',
  },
  {
    icon: GraduationCap,
    title: 'Education & Travel',
    questions: ['Best study path & course', 'Foreign travel opportunity', 'Can I crack exam this year?'],
    iconBg: 'bg-yellow-400',
  },
];

export const TESTIMONIALS = [
  {
    text: "The best astrologer in this platform with whom I have spoken. You have not only shown the path but also added the motivation and reason to why that path has been chosen and why I should walk! Thank you mam!",
    name: "Sita Kri."
  },
  {
    text: "Absolutely accurate predictions. I felt very connected and got clear guidance for my next steps. Really appreciate the support.",
    name: "Rohan Verma"
  },
  {
    text: "Amazing experience. The clarity and depth in the reading helped me make an important life decision. Highly recommended.",
    name: "Priya Sen"
  },
  {
    text: "Very calm and positive consultation. I felt heard and guided. It changed my mindset completely.",
    name: "Vikas Sharma"
  },
  {
    text: "Brilliant astrologer. Helped me understand the reasons behind struggles and guided me through solutions.",
    name: "Neha Gupta"
  }
]

