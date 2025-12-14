// Zodiac Signs Data
export interface ZodiacSign {
  name: string;
  slug: string;
  dateRange: string;
  element: string;
  icon: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', slug: 'aries', dateRange: 'Mar 21 - Apr 19', element: 'Fire', icon: '♈' },
  { name: 'Taurus', slug: 'taurus', dateRange: 'Apr 20 - May 20', element: 'Earth', icon: '♉' },
  { name: 'Gemini', slug: 'gemini', dateRange: 'May 21 - Jun 20', element: 'Air', icon: '♊' },
  { name: 'Cancer', slug: 'cancer', dateRange: 'Jun 21 - Jul 22', element: 'Water', icon: '♋' },
  { name: 'Leo', slug: 'leo', dateRange: 'Jul 23 - Aug 22', element: 'Fire', icon: '♌' },
  { name: 'Virgo', slug: 'virgo', dateRange: 'Aug 23 - Sep 22', element: 'Earth', icon: '♍' },
  { name: 'Libra', slug: 'libra', dateRange: 'Sep 23 - Oct 22', element: 'Air', icon: '♎' },
  { name: 'Scorpio', slug: 'scorpio', dateRange: 'Oct 23 - Nov 21', element: 'Water', icon: '♏' },
  { name: 'Sagittarius', slug: 'sagittarius', dateRange: 'Nov 22 - Dec 21', element: 'Fire', icon: '♐' },
  { name: 'Capricorn', slug: 'capricorn', dateRange: 'Dec 22 - Jan 19', element: 'Earth', icon: '♑' },
  { name: 'Aquarius', slug: 'aquarius', dateRange: 'Jan 20 - Feb 18', element: 'Air', icon: '♒' },
  { name: 'Pisces', slug: 'pisces', dateRange: 'Feb 19 - Mar 20', element: 'Water', icon: '♓' },
];



// Horoscope Time Periods
export interface TimePeriod {
  id: string;
  label: string;
}

export const TIME_PERIODS: TimePeriod[] = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'annual', label: 'Annual' },
];

// Lucky Elements
export interface LuckyElement {
  type: string;
  value: string | number;
  color: string;
}

export const LUCKY_ELEMENTS: LuckyElement[] = [
  { type: 'Lucky Number', value: 2, color: 'bg-[#F0DF20]' },
  { type: 'Lucky Color', value: 'Red', color: 'bg-red-500' },
  { type: 'Lucky Gemstone', value: 'Garnet', color: 'bg-orange-500' },
];

// Compatibility Data
export interface CompatibilityPair {
  sign1: string;
  sign2: string;
  compatibility: number;
  description: string;
}

export const COMPATIBILITY_INTRO = {
  title: 'Compatibility',
  subtitle: 'Check your love compatibility',
  description: `You don't always get along like a blaze on flames with people, but when you're with that "special person," you feel happy and in control of the situation. We encounter numerous people throughout life. One person would be your life partner out of all those who may be terrific friends or mentors for you. You must make the appropriate choice for life. They must make you feel at home. 

Do you believe your heart might have jumped a beat if you had met that particular someone? If so, find out what your Sun sign conspires to have you do by checking your zodiac sign love compatibility.

Zodiac sign compatibility reveals more than just compatibility in romantic relationships. You can also find information on friendship compatibility and your zodiac love compatibility. This can ensure a long-lasting relationship with shared understanding while also assisting you in learning further about your mate and your bond.

Love compatibility can also forecast how your relationship will develop in the future, in addition to letting you know how things stand right now. Moreover, it reveals the strength of your current bond, what makes it unique, and how to fix any flaws. You may find out when problems might arise and whether they can be fixed. You may determine whether your connection is likely to progress in the ways you want by simply entering the appropriate zodiac sign. Kudos if your sign and your partner's sign align! Seamless times are predictable in advance.`,
};

// FAQs
export interface FAQ {
  question: string;
  answer: string;
}

export const HOROSCOPE_FAQS: FAQ[] = [
  {
    question: "Can today's horoscope predict life-changing events for a zodiac sign?",
    answer: "Today's horoscope can tell a bit about all the twelve zodiac signs. You can know how negative things may get or how positive your day will be. And yes, it can definitely predict the big events that may occur in the day.",
  },
  {
    question: "How much to plan the day around today's horoscope?",
    answer: "While horoscopes provide guidance, they should be used as insights rather than strict rules. Use them to be aware of potential opportunities or challenges, but make decisions based on your own judgment and circumstances.",
  },
  {
    question: "What are Aries characteristics?",
    answer: "Aries natives are known for their ambitious, driven personality, and they are very headstrong and fiery. These people are very passionate and fun to be around, and they are very competitive. They can be aggressive and hot-tempered. Furthermore, Aries' tendency to be an explosive hotspot, which is an Aries characteristic that lets may want to be careful about.",
  },
  {
    question: "Aries represents which animal?",
    answer: "Aries is represented by the Ram symbol, which reflects their bold, pioneering spirit and natural leadership qualities.",
  },
  {
    question: "What is Aries personality like?",
    answer: "Aries personalities are bold, energetic, confident, and natural-born leaders. They are passionate, enthusiastic, and always ready to take on new challenges with courage and determination.",
  },
  {
    question: "Aries dates?",
    answer: "Aries dates range from March 21 to April 19 each year.",
  },
];

// Astrologer Filters
export interface AstrologerFilter {
  id: string;
  label: string;
  icon: string;
}

export const ASTROLOGER_FILTERS: AstrologerFilter[] = [
  { id: 'all', label: 'All', icon: '⭐' },
  { id: 'love', label: 'Love', icon: '❤️' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'marriage', label: 'Marriage', icon: '💍' },
  { id: 'health', label: 'Health', icon: '❤️‍🩹' },
  { id: 'wealth', label: 'Wealth', icon: '💰' },
  { id: 'parents', label: 'Parents', icon: '👨‍👩‍👧' },
  { id: 'remedies', label: 'Remedies', icon: '🔮' },
];

// Today's Horoscope Description
export const TODAYS_HOROSCOPE_INTRO = {
  title: "Today's Horoscope",
  subtitle: "Check your today's horoscope",
  description: 'Your horoscope is like a helpful daily map based on the stars and planets. It gives you simple predictions for your personal Zodiac sign (like Aries, Taurus, Gemini, etc.). You can quickly find out what might happen in love, work, friendships, health, and money. Reading it gives you smart ideas for the day, week, or month ahead, helping you make good choices and feel better.',
};
