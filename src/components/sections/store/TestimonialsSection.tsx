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
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
        Testimonials
      </h2>

      <div className="relative  px-20">
        {/* Left Arrow */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition">
          <ChevronLeft className="text-black" />
        </button>

        {/* Right Arrow */}
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition">
          <ChevronRight className="text-black" />
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 p-20 rounded-2xl bg-white border border-gray-200 md:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {testimonials[0].message}
            </p>
            <p className="font-semibold text-gray-900">
              {testimonials[0].name}
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <div className="relative w-40 h-52 rounded-lg overflow-hidden">
              <Image
                src={testimonials[0].image}
                alt="Customer testimonial"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
