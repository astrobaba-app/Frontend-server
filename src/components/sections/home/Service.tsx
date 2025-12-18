'use client';

import { featureServices } from '@/constants/featuresService';
import FeatureCard from '@/components/card/FeatureCard';
import { colors } from '@/utils/colors';

const FeatureServiceSection: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-56 py-8 sm:py-12 md:py-16 lg:py-24 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
          <p style={{color:colors.darkGray}} className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            Explore Our Services
          </p>
          <p style={{color: colors.gray}} className="text-sm sm:text-base mt-3 sm:mt-4 px-2 sm:px-4">
            Get personal advice just for your life. We help you understand your best qualities, handle tough times easily, and see your path ahead clearly. Let the stars guide you!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {featureServices.map((service, index) => (
            <FeatureCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureServiceSection;
