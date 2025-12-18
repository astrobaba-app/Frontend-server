import { POPULAR_CATEGORIES } from '@/constants/home';
import { IconType } from 'react-icons';
import { colors } from '@/utils/colors';
import Link from 'next/link';
import { SiTicktick } from "react-icons/si";
interface QuestionCardProps {
  icon: IconType;
  title: string;
  questions: string[];
  iconBg: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ icon: Icon, title, questions, iconBg }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 relative overflow-hidden">
    <div
      style={{ background: colors.primeYellow }}
      className="absolute left-0 top-0 h-full w-1 sm:w-1.5 rounded-l-xl sm:rounded-l-2xl"
    ></div>

    <div className="ml-2 sm:ml-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl mb-3 sm:mb-4 shadow"
        style={{ background: colors.primeYellow }}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>

      <p style={{ color: colors.darkGray }} className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
        {title}
      </p>

      <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
        {questions.map((q, index) => (
          <li key={index} className="flex items-start">
            <SiTicktick style={{ color: colors.primeYellow }} className="w-3 h-3 sm:w-4 sm:h-4 mt-1 mr-2 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-700">{q}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/astrologer?mode=chat"
        className="font-semibold text-xs sm:text-sm inline-block"
        style={{ color: colors.primeYellow }}
      >
        Ask Now
      </Link>
    </div>
  </div>
)


const PopularQuestions: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 md:py-20 relative overflow-hidden">
     <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg2.jpg')",
          opacity: 0.1,
          zIndex: -1,
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <p style={{color:colors.darkGray}} className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-8 sm:mb-12 md:mb-16">
          Popular Questions
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {POPULAR_CATEGORIES.map((category, index) => (
            <QuestionCard
              key={index}
              icon={category.icon}
              title={category.title}
              questions={category.questions}
              iconBg={category.iconBg}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularQuestions;
