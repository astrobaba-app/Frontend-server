"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  message: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nikita",
    message:
      "This is my second purchase from your store in the last two months itself. I bought the rose quartz pendant and got so many compliments from my colleagues. Even the colleague I found cute was convinced by the rose quartz saying it's magic. Ordered the bracelet as well now! Excited to try the combo together.",
    image: "/images/testimonial.png",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-8 md:py-8 px-2 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-12 text-center">
        Testimonials
      </h2>

      <div className="relative px-2 md:px-20">
        {/* Left Arrow */}
        <button className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-400 items-center justify-center hover:bg-yellow-500 transition">
          <ChevronLeft className="text-black" />
        </button>

        {/* Right Arrow */}
        <button className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-400 items-center justify-center hover:bg-yellow-500 transition">
          <ChevronRight className="text-black" />
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 p-6 md:p-10 rounded-2xl bg-white border border-gray-200 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Text */}
          <div className="order-2 md:order-1">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
              {testimonials[0].message}
            </p>
            <p className="font-semibold text-gray-900 text-sm md:text-base">
              {testimonials[0].name}
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative w-full h-40 md:w-full md:h-64 rounded-lg overflow-hidden">
              <Image
                src="/images/test.jpg"
                alt="Customer testimonial"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
