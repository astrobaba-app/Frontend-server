import { User, Star } from "lucide-react";
import Link from "next/link";
import { IoChatbubblesSharp, IoCallSharp } from "react-icons/io5";
import { Button } from "../atoms";
import { colors } from "@/utils/colors";

export interface Astrologer {
  id?: string;
  name: string;
  title: string;
  experience: string;
  rating: string | number;
  topics: string[];
  isOnline?: boolean;
  orders?: number;
  price?: number;
  languages?: string[];
  status?: "available" | "offline" | "wait";
  waitTime?: number;
  followersCount?: number;
}

interface OurAstrologerCardProps {
  astrologer: Astrologer;
  mode?: "chat" | "call";
  onCallClick?: () => void;
}

const AstrologerCard: React.FC<OurAstrologerCardProps> = ({ astrologer, mode = "chat", onCallClick }) => {
  const {
    id,
    name,
    experience,
    rating,
    topics,
    price,
    languages = [],
    status = "available",
    
  } = astrologer;

  const isCallMode = mode === "call";

  const specialties = Array.isArray(topics) ? topics : [];

  const getStatusBadge = () => {
    switch (status) {
      case "available":
        return (
          <div className="absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full border border-green-500 bg-white text-green-600">
            Available
          </div>
        );
      case "offline":
        return (
          <div className="absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full border border-gray-400 bg-white text-gray-600">
            Offline
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden relative">
      {getStatusBadge()}

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
              <User className="w-9 h-9 text-gray-600" strokeWidth={1.5} />
            </div>
            {status === "available" && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            
              <p className="text-base font-bold text-gray-900 truncate">{name}</p>
        
            <p className="text-sm text-gray-600 leading-snug line-clamp-1">
              {specialties.join(", ")} ...
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {languages.join(", ")}
            </p>
            <p className="text-sm text-gray-600 mt-1">Exp: {experience}</p>

            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <span className="text-sm font-bold" style={{ color: colors.primeYellow }}>
                  {rating}
                </span>
              </div>
              <div className="text-right mr-1">
                <span className="text-lg font-bold text-gray-900">
                  ₹ {price}
                </span>
                <span className="text-sm font-normal text-gray-600">/min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          {isCallMode ? (
            <Button
              onClick={onCallClick}
              variant="custom"
              size="md"
              className="shadow-lg w-full"
              customColors={{
                backgroundColor: colors.primeYellow,
                textColor: colors.white,
              }}
              customStyles={{
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              }}
              icon={
                <span role="img" aria-label="call">
                  <IoCallSharp />
                </span>
              }
            >
              Call
            </Button>
          ) : (
            <Button
              href={id ? `/chat?astrologerId=${id}` : "/chat"}
              variant="custom"
              size="md"
              className="shadow-lg w-full"
              customColors={{
                backgroundColor: colors.primeYellow,
                textColor: colors.white,
              }}
              customStyles={{
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              }}
              icon={
                <span role="img" aria-label="chat">
                  <IoChatbubblesSharp />
                </span>
              }
            >
              Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AstrologerCard;
