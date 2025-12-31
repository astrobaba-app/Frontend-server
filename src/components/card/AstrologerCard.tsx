import { User, Star } from "lucide-react";
import Link from "next/link";
import { IoChatbubblesSharp, IoCallSharp } from "react-icons/io5";
import { Button } from "../atoms";
import { colors } from "@/utils/colors";

export interface Astrologer {
  id?: string;
  name: string;
  photo?: string | null;
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
  onCallClick?: (e?: React.MouseEvent) => void;
  onChatClick?: (e?: React.MouseEvent) => void;
}

const AstrologerCard: React.FC<OurAstrologerCardProps> = ({
  astrologer,
  mode = "chat",
  onCallClick,
  onChatClick,
}) => {
  const {
    id,
    name,
    photo,
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

  const photoStyle = photo
    ? {
        backgroundImage: `url(${photo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { background: colors.primeYellow };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden relative">
      {getStatusBadge()}

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 relative">
            <div
              style={photoStyle}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex flex-col items-center justify-center relative bg-gray-100"
            >
              {/* Online Status Badge */}

              {status === "available" && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}

              {/* Default Icon if no photo */}

              {!photo && (
                <User
                  style={{ color: "white" }}
                  className="w-12 h-12 sm:w-16 sm:h-16 -mb-4 sm:-mb-5"
                />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-900 truncate">{name}</p>

            <p className="text-sm text-gray-600 leading-snug line-clamp-1">
              {specialties.join(", ")} ...
            </p>
            <p className="text-sm text-gray-600 leading-snug line-clamp-1">
              {languages.join(", ")}...
            </p>
            <p className="text-sm text-gray-600 mt-1">Exp: {experience}</p>

            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <span
                  className="text-sm font-bold"
                  style={{ color: colors.primeYellow }}
                >
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

        <div className="mt-3 flex gap-2">
          <Link
            href={
              id
                ? `/chat?astrologerId=${id}&mode=${
                    isCallMode ? "call" : "chat"
                  }`
                : "/chat"
            }
            className="w-full"
          >
            <Button
              onClick={(e) => {
                if (isCallMode && onCallClick) onCallClick(e);
                if (!isCallMode && onChatClick) onChatClick(e);
              }}
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
                <span role="img" aria-label={isCallMode ? "call" : "chat"}>
                  {isCallMode ? <IoCallSharp /> : <IoChatbubblesSharp />}
                </span>
              }
            >
              {isCallMode ? "Call" : "Chat"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AstrologerCard;
