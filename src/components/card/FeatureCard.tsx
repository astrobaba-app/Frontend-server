import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { colors } from '@/utils/colors';
interface FeatureCardProps {
    icon: IconType | string;
    title: string;
    description: string;
    href: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, href }) => {
    const isImage = typeof icon === 'string';
    const IconComponent = isImage ? null : icon;
    return (
        <Link
            href={href}
            style={{ borderColor: colors.primeYellow }}
            className="p-3 sm:p-4 rounded-xl border bg-white 
                       flex flex-col px-3 sm:px-6 md:px-10 group transition-shadow duration-300 
                       hover:shadow-2xl hover:border-[#F0DF20] min-h-[160px] sm:min-h-[180px]"
        >
            <div
                style={{ background: colors.primeYellow }}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                rounded-lg sm:rounded-xl 
                flex items-center justify-center 
                mb-2 sm:mb-3 
                shadow-lg 
                transition-transform duration-300 group-hover:scale-105"
            >
                {isImage ? (
                    <Image
                        src={icon}
                        alt={title}
                        width={40}
                        height={40}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
                    />
                ) : (
                    IconComponent && <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                )}
            </div>
            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight mt-1">
                {title}
            </p>
            <p style={{color:colors.gray}} className="text-xs sm:text-sm mt-1">
                {description}
            </p>
        </Link>
    );

};



export default FeatureCard;