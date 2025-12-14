import Image from 'next/image'
import { Lightbulb, LucideIcon } from 'lucide-react'
import { FaBrain } from "react-icons/fa6"
import { RiRobot2Line } from "react-icons/ri"
import { BiSolidZap } from "react-icons/bi"
import { colors } from '@/utils/colors'
import { Button } from '@/components/atoms'
import Link from 'next/link'

interface FeatureCardProps {
  icon: LucideIcon | any
  title: string
  description: string
  bgColor: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, bgColor }) => (
  <div className={`p-3 rounded-xl ${bgColor} flex items-start border border-yellow-100 shadow-sm`}>
    <div style={{ background: colors.primeYellow }} className="p-3 mr-4 rounded-full">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p style={{ color: colors.darkGray }} className="text-lg font-semibold">{title}</p>
      <p style={{ color: colors.gray }} className="text-sm">{description}</p>
    </div>
  </div>
)

const Hero2: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full aspect-4/3 max-w-sm sm:max-w-md lg:max-w-full mx-auto rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero2.png"
                alt="AI Astrologer Expert"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div style={{ background: colors.primeYellow }} className="inline-block text-white font-semibold py-1 px-3 sm:px-4 rounded-full mb-3 sm:mb-4 shadow-md text-xs sm:text-sm">
              <Lightbulb className="inline text-white w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              AI-Powered Insights
            </div>

            <p style={{ color: colors.darkGray }} className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 leading-tight">
              Meet Our 24/7 AI Astrologer
            </p>

            <p style={{ color: colors.gray }} className="mb-4 sm:mb-5 max-w-md text-xs sm:text-sm">
              Get instant astrological guidance anytime with AI-powered astrologers. Each AI expert specializes in different domains—from Vedic astrology to tarot reading, love advice to career guidance.
            </p>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
              <FeatureCard
                icon={BiSolidZap}
                title="Instant Responses"
                description="No waiting time—get answers to your questions immediately"
                bgColor="bg-yellow-50"
              />
              <FeatureCard
                icon={FaBrain}
                title="Personalized Insights"
                description="AI remembers your previous conversations for better guidance"
                bgColor="bg-yellow-50"
              />
              <FeatureCard
                icon={RiRobot2Line}
                title="Always Available"
                description="Access astrological wisdom anytime, day or night"
                bgColor="bg-yellow-50"
              />
            </div>

            <Link href="/aichat">
              <Button
                href="/aichat"
                variant="custom"
                size="md"
                className="shadow-xl"
                customColors={{
                  backgroundColor: colors.primeYellow,
                  textColor: colors.white,
                }}
                customStyles={{
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                }}
              >
                Try AI Astrologer Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero2
