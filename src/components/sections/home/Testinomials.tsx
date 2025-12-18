"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { TESTIMONIALS } from "@/constants/home";
import { colors } from "@/utils/colors";

const Testimonials = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#fafafa]">
      <p className="text-center text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8 md:mb-10 px-4">
        Testimonials
      </p>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={15}
          loop={true}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={4002}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {TESTIMONIALS.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col justify-between">
                {/* Added min-h-32 to enforce minimum height on the text for uniform box size */}

                <p className="text-gray-700 text-sm leading-relaxed mb-6 min-h-32">
                  {t.text}
                </p>

                <div className="flex items-center gap-3">
                  <div
                    style={{ background: colors.primeYellow }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  >
                    {t.name.charAt(0)}
                  </div>

                  <p className="text-gray-800 text-sm font-semibold">
                    {t.name}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
