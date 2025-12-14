import React from 'react';

interface CompatibilityPair {
  sign1: string;
  sign2: string;
  label: string;
  icon1Path: string;
  icon2Path: string; 
}

const getIconPath = (sign: string): string => `/icons/${sign.toLowerCase()}.png`;

const compatibilityData: CompatibilityPair[] = [
  { sign1: 'Aries', sign2: 'Aries', label: 'Aries & Aries', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon1') },
  { sign1: 'Aries', sign2: 'Taurus', label: 'Aries & Taurus', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon2') },
  { sign1: 'Aries', sign2: 'Gemini', label: 'Aries & Gemini', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon3') },
  { sign1: 'Aries', sign2: 'Cancer', label: 'Aries & Cancer', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon4') },
  { sign1: 'Aries', sign2: 'Leo', label: 'Aries & Leo', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon5') },
  { sign1: 'Aries', sign2: 'Virgo', label: 'Aries & Virgo', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon6') },
  { sign1: 'Aries', sign2: 'Libra', label: 'Aries & Libra', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon7') },
  { sign1: 'Aries', sign2: 'Scorpio', label: 'Aries & Scorpio', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon8') },
  { sign1: 'Aries', sign2: 'Sagittarius', label: 'Aries & Sagittarius', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon9') },
  { sign1: 'Aries', sign2: 'Capricorn', label: 'Aries & Capricorn', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon10') },
  { sign1: 'Aries', sign2: 'Aquarius', label: 'Aries & Aquarius', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon11') },
  { sign1: 'Aries', sign2: 'Pisces', label: 'Aries & Pisces', icon1Path: getIconPath('icon1'), icon2Path: getIconPath('icon12') },
];

// Component for rendering a single icon pair
const IconPair: React.FC<CompatibilityPair> = ({ icon1Path, icon2Path }) => {
  return (
    <div className="flex justify-center relative w-40 h-20 mb-3">
     
      <div className="absolute left-0 top-0 w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-md">
        <img src={icon1Path} alt="First Zodiac Sign" className="w-18 h-18 object-contain filter invert" />
      </div>
      {/* Icon 2: positioned on the right, slightly overlapping and in front */}
      <div className="absolute right-0 top-0 w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-yellow-700 shadow-xl z-10">
        {/* The second icon appears darker in the image, so we'll use a darker icon or style */}
        <img src={icon2Path} alt="Second Zodiac Sign" className="w-18 h-18 object-contain" style={{ filter: 'brightness(0.3) invert(0.8)' }} />
      </div>
    </div>
  );
};

// Main component
const CompatibilityCheck: React.FC = () => {
  const backgroundColor = '#fffde7'; 

  return (
    <div className="p-8" style={{ backgroundColor }}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <p className="text-3xl font-bold text-gray-800 tracking-wide">
          CHECK COMPATIBILITY WITH OTHER SIGNS
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Check your relationship compatibility
        </p>
      </div>

      {/* Compatibility Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 max-w-4xl mx-auto">
        {compatibilityData.map((pair) => (
          <div key={pair.label} className="flex flex-col items-center">
            
            <IconPair {...pair} />

           
            <div className="p-2 px-4 bg-white rounded-full shadow-md hover:shadow-lg transition duration-200 cursor-pointer text-sm font-semibold text-gray-700 border border-gray-200">
              {pair.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompatibilityCheck;