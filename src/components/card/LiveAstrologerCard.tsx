import React from "react";
import Image from "next/image";
import Link from "next/link";
import { colors } from "@/utils/colors";
interface LiveAstrologerCardProps {
    name: string;
    imageSrc: string;
    link: string;
}
const LiveAstrologerCard: React.FC<LiveAstrologerCardProps> = ({
    name,
    imageSrc,
    link,
}) => {
    return (
        <Link
            href={link}
            style={{ background: colors.creamyYellow }}
            className="flex flex-col items-center p-4 cursor-pointer group 
                       w-40 md:w-52 h-48 md:h-60 rounded-3xl transition-all duration-300
                       hover:shadow-md hover:scale-[1.02] flex-shrink-0"
        >
            <div
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden 
                           mt-2 mb-4 md:mb-6 border-4 border-[#FFD700] shadow-inner"
            >
                <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100px, 128px"
                />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-none">
                {name}
            </h3>
        </Link>
    );
};
export default LiveAstrologerCard;