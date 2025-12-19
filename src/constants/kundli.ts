// Basic Details
export interface BasicDetails {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  janeeDoe: string;
  nakshatra: string;
  ascendant: string;
  ayanamsa: string;
}

export const BASIC_DETAILS: BasicDetails = {
  name: 'John Doe',
  birthDate: '02 Nov 2005',
  birthTime: '06:55 AM',
  birthPlace: 'Howrah, West Bengal',
  janeeDoe: 'Adinatha',
  nakshatra: 'Adinatha',
  ascendant: 'Leo',
  ayanamsa: '23.77143',
};

// Kundli Details
export interface KundliDetail {
  label: string;
  value: string;
}

export const KUNDLI_DETAILS: KundliDetail[][] = [
  [
    { label: 'Nakshatra Lord', value: 'Ketu' },
    { label: 'Yog', value: 'Vyatipaat' },
    { label: 'Tithi', value: 'Shukla Dwadashi' },
    { label: 'Tatva', value: 'Fire' },
    { label: 'Paya', value: 'Gold' },
    { label: 'Varna', value: 'Kshatriya' },
    { label: 'Sign Lord', value: 'Mars' },
    { label: 'Yoni', value: 'Ashwa' },
  ],
  [
    { label: 'Charan', value: '1' },
    { label: 'Karan', value: 'Balava' },
    { label: 'Yoni', value: 'Poorva' },
    { label: 'Name Alphabet', value: 'Choo' },
    { label: 'Gan', value: 'Dev' },
    { label: 'Nadi', value: 'Adi' },
    { label: 'Vashya', value: 'Chatuspad' },
    { label: 'Nakshatra', value: 'Adinatha' },
  ],
];

// Favourable Details
export interface FavourableItem {
  label: string;
  value: string | number;
}

export const FAVOURABLE_DETAILS: FavourableItem[][] = [
  [
    { label: 'Name', value: 'SHALU KUMARI' },
    { label: 'Destiny Number', value: 5 },
    { label: 'Evil Number', value: 5 },
    { label: 'Lucky Day', value: 'Sunday, Monday, Friday' },
    { label: 'Lucky Months', value: 'Om Som Somy Namah ||' },
    { label: 'Lucky Stone', value: 'Pearl' },
    { label: 'Friendly Number', value: '6,9,9' },
    { label: 'Radical Number', value: 2 },
  ],
  [
    { label: 'Date', value: '02/12/2025' },
    { label: 'Name Number', value: 3 },
    { label: 'Lucky Color', value: 'White' },
    { label: 'Lucky God', value: 'Shiva' },
    { label: 'Lucky Metal', value: 'Silver' },
    { label: 'Lucky Substone', value: 'Moon Stone' },
    { label: 'Neutral Number', value: '1,3,4,9' },
    { label: 'Radical Ruler', value: 'Moon' },
  ],
];

// Planet Data
export interface Planet {
  name: string;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshLord: string;
  degree: string;
  retro: string;
  combust: string;
  avastha: string;
  house: number | string;
  status: string;
}

export const PLANETS: Planet[] = [
  { name: 'Ascendant', sign: 'Taurus', signLord: 'Venus', nakshatra: 'Rohini', nakshLord: 'Moon', degree: "15'48'31\"", retro: 'Direct', combust: 'No', avastha: '--', house: 1, status: '--' },
  { name: 'Sun', sign: 'Sagittarius', signLord: 'Jupiter', nakshatra: 'Purva Ashadha', nakshLord: 'Venus', degree: "17'11'38\"", retro: 'Direct', combust: 'No', avastha: 'Yuva', house: 8, status: 'Friendly' },
  { name: 'Moon', sign: 'Aquarius', signLord: 'Saturn', nakshatra: 'Shatabhisha', nakshLord: 'Rahu', degree: "10'52'34\"", retro: 'Direct', combust: 'No', avastha: 'Kumara', house: 10, status: 'Enemy' },
  { name: 'Mercury', sign: 'Capricorn', signLord: 'Saturn', nakshatra: 'Uttara Ashadha', nakshLord: 'Sun', degree: "1'55'19\"", retro: 'Retro', combust: 'No', avastha: 'Mrita', house: 9, status: 'Friendly' },
  { name: 'Venus', sign: 'Capricorn', signLord: 'Saturn', nakshatra: 'Shravana', nakshLord: 'Moon', degree: "12'29'17\"", retro: 'Retro', combust: 'No', avastha: 'Yuva', house: 9, status: 'Friendly' },
  { name: 'Mars', sign: 'Scorpio', signLord: 'Mars', nakshatra: 'Anuradha', nakshLord: 'Saturn', degree: "16'20'55\"", retro: 'Direct', combust: 'No', avastha: 'Yuva', house: 7, status: 'Owned' },
  { name: 'Jupiter', sign: 'Gemini', signLord: 'Mercury', nakshatra: 'Aadra', nakshLord: 'Rahu', degree: "11'24'53\"", retro: 'Retro', combust: 'No', avastha: 'Kumara', house: 2, status: 'Enemy' },
  { name: 'Saturn', sign: 'Sagittarius', signLord: 'Jupiter', nakshatra: 'Purva Ashadha', nakshLord: 'Venus', degree: "21'56'54\"", retro: 'Direct', combust: 'Yes', avastha: 'Viddha', house: 8, status: '--' },
  { name: 'Rahu', sign: 'Capricorn', signLord: 'Saturn', nakshatra: 'Dhanishta', nakshLord: 'Mars', degree: "24'42'32\"", retro: 'Retro', combust: 'No', avastha: 'Bala', house: 9, status: '--' },
  { name: 'Ketu', sign: 'Cancer', signLord: 'Moon', nakshatra: 'Ashlesha', nakshLord: 'Mercury', degree: "24'42'32\"", retro: 'Retro', combust: 'No', avastha: 'Bala', house: 3, status: '--' },
  { name: 'Neptune', sign: 'Sagittarius', signLord: 'Jupiter', nakshatra: 'Purva Ashadha', nakshLord: 'Venus', degree: "18'19'16\"", retro: 'Direct', combust: 'No', avastha: 'Viddha', house: 8, status: '--' },
  { name: 'Uranus', sign: 'Sagittarius', signLord: 'Jupiter', nakshatra: 'Mula', nakshLord: 'Ketu', degree: "12'4'14\"", retro: 'Direct', combust: 'No', avastha: 'Yuva', house: 8, status: '--' },
  { name: 'Pluto', sign: 'Libra', signLord: 'Venus', nakshatra: 'Vishakha', nakshLord: 'Jupiter', degree: "23'22'30\"", retro: 'Direct', combust: 'No', avastha: 'Viddha', house: 6, status: '--' },
];

// Vimshottari Dasha
export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
}

export const VIMSHOTTARI_DASHA: DashaPeriod[] = [
  { planet: 'Rahu', startDate: 'Birth', endDate: '26-Apr-2002' },
  { planet: 'Jupiter', startDate: '26-Apr-2002', endDate: '26-Apr-2018' },
  { planet: 'Saturn', startDate: '26-Apr-2018', endDate: '26-Apr-2037' },
  { planet: 'Mercury', startDate: '26-Apr-2037', endDate: '26-Apr-2054' },
  { planet: 'Ketu', startDate: '26-Apr-2054', endDate: '26-Apr-2061' },
  { planet: 'Venus', startDate: '26-Apr-2061', endDate: '26-Apr-2081' },
  { planet: 'Sun', startDate: '26-Apr-2081', endDate: '27-Apr-2087' },
  { planet: 'Moon', startDate: '27-Apr-2087', endDate: '26-Apr-2097' },
  { planet: 'Mars', startDate: '26-Apr-2097', endDate: '27-Apr-2104' },
];

// KP System Data
export interface KPPlanet {
  planet: string;
  cusp: number | string;
  sign: string;
  signLord: string;
  starLord: string;
  subLord: string;
}

export const KP_PLANETS: KPPlanet[] = [
  { planet: 'Sun', cusp: 8, sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ve', subLord: 'Mo' },
  { planet: 'Moon', cusp: 10, sign: 'Aquarius', signLord: 'Sa', starLord: 'Ra', subLord: 'Sa' },
  { planet: 'Mars', cusp: 7, sign: 'Scorpio', signLord: 'Ma', starLord: 'Sa', subLord: 'Sa' },
  { planet: 'Rahu', cusp: 9, sign: 'Capricorn', signLord: 'Sa', starLord: 'Ma', subLord: 'Ra' },
  { planet: 'Jupiter', cusp: 1, sign: 'Gemini', signLord: 'Me', starLord: 'Ra', subLord: 'Sa' },
  { planet: 'Saturn', cusp: 8, sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ve', subLord: 'Sa' },
  { planet: 'Mercury', cusp: 8, sign: 'Capricorn', signLord: 'Sa', starLord: 'Su', subLord: 'Ju' },
  { planet: 'Ketu', cusp: 3, sign: 'Cancer', signLord: 'Mo', starLord: 'Me', subLord: 'Ra' },
  { planet: 'Venus', cusp: 9, sign: 'Capricorn', signLord: 'Sa', starLord: 'Mo', subLord: 'Ra' },
  { planet: 'Neptune', cusp: 8, sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ve', subLord: 'Ra' },
  { planet: 'Uranus', cusp: 8, sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ke', subLord: 'Me' },
  { planet: 'Pluto', cusp: 6, sign: 'Libra', signLord: 'Ve', starLord: 'Ju', subLord: 'Sa' },
];

export interface CuspData {
  cusp: number;
  degree: string;
  sign: string;
  signLord: string;
  starLord: string;
  subLord: string;
}

export const CUSP_DATA: CuspData[] = [
  { cusp: 1, degree: '45.81', sign: 'Taurus', signLord: 'Ve', starLord: 'Mo', subLord: 'Sa' },
  { cusp: 2, degree: '71.94', sign: 'Gemini', signLord: 'Me', starLord: 'Ra', subLord: 'Sa' },
  { cusp: 3, degree: '97.73', sign: 'Cancer', signLord: 'Mo', starLord: 'Sa', subLord: 'Ke' },
  { cusp: 4, degree: '126.1', sign: 'Leo', signLord: 'Su', starLord: 'Ke', subLord: 'Ra' },
  { cusp: 5, degree: '158.45', sign: 'Virgo', signLord: 'Me', starLord: 'Su', subLord: 'Ve' },
  { cusp: 6, degree: '192.93', sign: 'Libra', signLord: 'Ve', starLord: 'Ra', subLord: 'Me' },
  { cusp: 7, degree: '225.81', sign: 'Scorpio', signLord: 'Ma', starLord: 'Sa', subLord: 'Ju' },
  { cusp: 8, degree: '251.94', sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ke', subLord: 'Ju' },
  { cusp: 9, degree: '277.73', sign: 'Capricorn', signLord: 'Sa', starLord: 'Su', subLord: 'Ke' },
  { cusp: 10, degree: '306.1', sign: 'Aquarius', signLord: 'Sa', starLord: 'Ma', subLord: 'Mo' },
  { cusp: 11, degree: '338.45', sign: 'Pisces', signLord: 'Ju', starLord: 'Sa', subLord: 'Ve' },
  { cusp: 12, degree: '12.93', sign: 'Aries', signLord: 'Ma', starLord: 'Ke', subLord: 'Me' },
];

// Charts Names
export const CHART_NAMES = [
  'Chalit', 'Sun', 'Moon',
  'Lagna / Ascendant / Basic Birth Chart', 'Hora (Wealth / Income Chart)', 'Drekkana (Relationship with siblings)',
  'Chaturthamsa (Assets)', 'Saptamsa (Progeny)', 'Navamsa (Prospects of marriage)',
  'Dasamsa (Profession)', 'Dwadasamsa (Native parents / Ancestors)', 'Shodasamsa (Travel)',
  'Vimsamsa (Spiritual progress)', 'Chaturvimsamsa (Intellectual)', 'Saptavimsamsa (Strength / Protection)',
  'Trimsamsa (Misfortunes)', 'Khavedamsa (Auspicious time)', 'Akshavedamsa (General issues)',
  'Shashtiamsa (Summary of charts)'
];

// Free Report Content
export const FREE_REPORT_GENERAL = {
  sections: [
    {
      title: 'Description',
      content: "Ascendant is one of the most sought concepts in astrology when it comes to predicting the minute events in your life. At the time of birth, the sign which rises in the eastern horizon, is called the person's ascendant. It helps in making predictions about the minute events, unlike your Moon or Sun sign that help in making weekly or monthly predictions",
    },
    {
      title: 'Personality',
      content: "Those born with the Taurus ascendant are relatively introverted, despite the fact they represent the animal bull. These people like to create their own little secret bubble and nobody is likely to get access to it. However, while having these luxuries will require hardcore work and sacrifice, these people are very patient and strategic. These individuals are extremely reliable and fun-loving. These people also have a great sense of humor, and you could never get bored when around them. However, one should know that if Taurus ascendants are forced or asked to rush through something or get them to open up beyond what they would like to, you would hardly know about their demons.",
    },
    {
      title: 'Physical Appearance',
      content: "Ruled by the planet Venus, Taurus ascendants possess a short physique that is inclined to carelessness. They are generally gifted with a lovely face, gleaming eyes, nicely formed ears, nose, and mouth. Physical robustness comes naturally to them as they generally have a healthy physical shape, they are not too bulky. They have a gorgeous face with thick eyebrows and a full-fat figure, with the possibility of a mark somewhat on the sides or back. People born with Taurus rising have a delightful persona. These natives also have large, powerful necks. Consider a bull to comprehend why Taurus Ascendants possess such a powerful appearance.",
    },
    {
      title: 'Health',
      content: "The Taurus natives usually are good with health for the most part of their life. But they, too, have their weak spots in various instances. The people born under the sign of Taurus are prone to nervous spells. Inability to get a satisfying or having a good sleep is very important for these people as if they don't, they develop skin problems faster than anyone else. Their romance with intimacy can leave them suffering from sexual diseases. Also, these people should not ignore problems when in the bladder, neck, or chest area.",
    },
    {
      title: 'Career',
      content: "Taurus ascendants are known for their dedication and perseverance in their professional life. They excel in careers that require patience, attention to detail, and steady progress. Banking, finance, real estate, agriculture, and arts are some of the fields where they can achieve great success. Their practical approach and determination help them build stable and prosperous careers.",
    },
    {
      title: 'Relationships',
      content: "In relationships, Taurus ascendants are loyal, devoted, and seek stability. They value long-term commitments and are not interested in casual flings. While they may take time to open up, once they do, they are deeply affectionate and caring partners. They need partners who understand their need for security and appreciate their steadfast nature.",
    },
  ],
};

export const RUDRAKSHA_REPORT = {
  title: 'Rudraksha Suggestion Report',
  type: '9-Mukhi Rudraksha',
  rulingPlanet: 'Ruled by Rahu',
  description: 'Having been born in the Shatabhisha nakshatra, the most suitable rudraksha for you is the 9-Mukhi Rudraksha. As per astrology, the nine-Mukhi rudraksha is ruled by the planet Rahu and influenced by Goddess Durga. Before opting for this Rudraksha, it is recommended that you consult an astrologer as there might be planetary combinations in your chart in the current scenario based on which the Rudraksha recommendation might change for you.',
  benefits: [
    'The wearer of the nine-Mukhi rudraksha is blessed with an abundance of positive energy, enthusiasm, and fearlessness.',
    'Wearing the nine-Mukhi rudraksha gives the native the power to take on things headstrong and enhances his willpower.',
    'This Rudraksha is also known as the nine-Mukhi rudraksha and strength is also known as wearing it helps in controlling the blood pressure of the native.',
    'The nine-Mukhi rudraksha saves them from the ill impact of creating a positive environment around the wearer.',
    'This bead acts as a shield and protects the wearer from negative or evil influence as it has the power to negate the negative influence.',
  ],
  whoShouldWear: [
    'People who are born in Shatabhisha nakshatra',
    'Those who want to remove obstacles and negativity',
    'Anyone seeking spiritual growth and protection',
    'Those who need courage and willpower',
  ],
  howToWear: {
    day: 'Monday',
    time: 'Morning after bath',
    metal: 'Silver or Gold',
    mantra: 'Om Hreem Hum Namah',
  },
};

export const GEMSTONE_REPORT = {
  lifeStone: {
    name: 'Diamond',
    type: 'Life Stone',
    rulingPlanet: 'Ruled by Venus',
    description: 'A life stone is a gem for the Lagna lord, which the native can wear throughout his or her life. A life stone collectively influences everything that makes your self image, i.e. your wealth, education, health, business, spouse, intellect, etc. The lord of the Taurus ascendant/Lagna is Venus, and to please Venus, the person born with Taurus Ascendant (Vrishabha Lagna) must wear Diamond.',
    benefits: [
      'Enhances self-image and confidence',
      'Improves wealth and prosperity',
      'Strengthens relationships',
      'Boosts intellectual abilities',
      'Provides overall life stability',
    ],
    howToWear: {
      day: 'Friday',
      finger: 'Middle finger',
      metal: 'Gold or Silver',
      weight: '1-2 carats',
    },
  },
  luckyStone: {
    name: 'Emerald',
    type: 'Lucky Stone',
    rulingPlanet: 'Ruled by Mercury',
    description: 'A lucky gemstone is worn to enhance the native\'s luck and open new doors to success for him. An individual\'s lucky stone is one that keeps luck ticking for him while enduring all of favourable planets upon him. As Mercury and Saturn are beneficial planets for Taurus, hence the Lucky gemstone for the Taurus Ascendant is: Emerald (Panna)',
    benefits: [
      'Opens doors to new opportunities',
      'Enhances communication skills',
      'Improves business prospects',
      'Brings mental clarity',
      'Attracts good fortune',
    ],
    howToWear: {
      day: 'Wednesday',
      finger: 'Ring or Little finger',
      metal: 'Gold',
      weight: '3-6 carats',
    },
  },
  fortuneStone: {
    name: 'Blue Sapphire',
    type: 'Fortune Stone',
    rulingPlanet: 'Ruled by Saturn',
    description: 'A fortune stone helps in creating wealth and abundance in life. As Saturn is beneficial for Taurus ascendant, Blue Sapphire acts as a fortune stone that brings prosperity, success in career, and protection from negative influences.',
    benefits: [
      'Brings wealth and prosperity',
      'Provides career success',
      'Offers protection from enemies',
      'Enhances discipline and focus',
      'Removes obstacles in life',
    ],
    howToWear: {
      day: 'Saturday',
      finger: 'Middle finger',
      metal: 'Gold or Silver',
      weight: '4-7 carats',
    },
  },
};

export const DOSHA_ANALYSIS = {
  manglik: {
    isPresent: true,
    description: 'Since mars is in seventh house and in scorpio sign person is Manglik. [This is a computer generated result. Please consult an Astrologer to confirm & understand this in detail.]',
    details: [
      { planet: 'Mars', house: '7th House', status: 'Scorpio Sign' },
    ],
  },
  kalsarpa: {
    isPresent: false,
    description: 'Kundli is free from Kalsharpa Dosha.',
    type: null,
  },
  sadesati: {
    isUndergoing: true,
    description: 'You are currently running into Setting phase of Sadesati from 29-Mar-2025 to 03-Jun-2027',
    currentPhase: 'Setting Phase',
    startDate: '29-Mar-2025',
    endDate: '03-Jun-2027',
  },
};

// Tab names
export const KUNDLI_TABS = [
  { id: 'basic', label: 'Basic' },
  { id: 'kundli', label: 'Kundli' },
  { id: 'kp', label: 'KP' },
  { id: 'ashtakvarga', label: 'Ashtakvarga' },
  { id: 'charts', label: 'Charts' },
  { id: 'dasha', label: 'Dasha' },
  { id: 'free-report', label: 'Free Report' },
];

// Lucky Elements for Basic Tab
export const LUCKY_ELEMENTS_KUNDLI = [
  { type: 'Lucky Number', value: '2', color: 'bg-[#F0DF20]' },
  { type: 'Lucky Color', value: 'Red', color: 'bg-red-500' },
  { type: 'Lucky Gemstone', value: 'Garnet', color: 'bg-orange-500' },
];
