import React from "react";
import Image from "next/image";
import Link from "next/link";
import { colors } from "@/utils/colors";
import { Eye } from "lucide-react";

interface LiveAstrologerCardProps {
    name: string;
    imageSrc: string;
    link: string;
    isLive?: boolean;
    viewerCount?: number;
}

const LiveAstrologerCard: React.FC<LiveAstrologerCardProps> = ({
    name,
    imageSrc,
    link,
    isLive = false,
    viewerCount = 0,
}) => {
    return (
        <Link
            href={link}
            style={{ background: colors.creamyYellow }}
            className="flex flex-col items-center p-4 cursor-pointer group 
                       w-40 md:w-52 h-48 md:h-60 rounded-3xl transition-all duration-300
                       hover:shadow-md hover:scale-[1.02] flex-shrink-0 relative"
        >
            {/* Live Badge */}
            {isLive && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-md z-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                </div>
            )}

            {/* Viewer Count */}
            {isLive && viewerCount > 0 && (
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-md z-10">
                    <Eye className="w-3 h-3" />
                    {viewerCount}
                </div>
            )}

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
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-none text-center">
                {name}
            </h3>
        </Link>
    );
};

export default LiveAstrologerCard;