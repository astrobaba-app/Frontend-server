"use client";
import React, { useState } from "react";
// Import the necessary components and icons
import { Menu, X, Mail, Phone } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
// 1. Import the Register component (assuming it's in the same directory or a child path)
import RegisterModal from "@/components/modals/Register";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/" },
  { name: "Free Kundli", href: "/" },
  { name: "Live Chat", href: "/" },
  { name: "Horoscope", href: "/" },
  { name: "Contact us", href: "/" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  // 2. Add state to control the Register Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="w-full font-inter">
      <div className="bg-gray-100 p-4 md:py-3 border-b border-gray-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap">
          <a
            href="/" 
            className="flex items-center space-x-2 no-underline hover:opacity-80 transition duration-150" 
          >
            <img
              src="/images/logo.png"
              alt="Astrobaba Logo"
              className="h-20 sm:h-20 md:h-30 w-auto rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-4xl font-bold text-[#F0DF20]">Astrobaba</p>
              <p className="text-sm text-gray-600">Shubh Drishti, Shubh Marg</p>
            </div>
          </a>

          {/* Contact Details Section (hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <a
              href="mailto:contact@astrobaba.live"
              className="flex items-center space-x-2 p-2 rounded-lg group"
            >
              <div className="text-red-600 group-hover:text-red-700 transition duration-150 flex items-center justify-center">
                <Mail className="w-7 h-7" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-base font-bold text-gray-900 group-hover:text-black transition duration-150">
                  Reach us
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  contact@astrobaba.live
                </span>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center space-x-2 p-2 rounded-lg group"
            >
              <div className="text-green-600 group-hover:text-green-700 transition duration-150 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-base font-bold text-gray-900 group-hover:text-black transition duration-150">
                  Talk with Astrologer
                </span>
              </div>
            </a>
          </div>

          {/* Register / Google Sign-in / Menu Toggle Section */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-3">
              {/* 💡 FIX: Changed <a> to <button> and added onClick handler */}
              <button
                onClick={() => setIsModalOpen(true)} // 3. Open the modal on click
                className="px-4 py-2 bg-[#F0DF20] text-sm font-semibold rounded-full shadow-md hover:bg-[#ffea00] transition duration-150 ease-in-out"
              >
                Register
              </button>

              <button
                className="p-1 h-10 w-10 bg-white rounded-full shadow-md transition duration-150 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                aria-label="Sign in with Google"
              >
                <FcGoogle className="text-2xl" />
              </button>
            </div>

            <button
              className="md:hidden text-gray-800 p-2 rounded-full bg-white shadow-md transition duration-150 hover:bg-gray-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Desktop) */}
      <nav className="bg-[#F0DF20] shadow-xl">
        <div className="max-w-7xl mx-auto hidden md:flex items-center justify-center lg:space-x-12 px-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className=" text-base font-semibold uppercase tracking-wider hover:text-yellow-900 transition duration-150 ease-in-out py-2"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 z-40 bg-[#F0DF20] bg-opacity-95 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex justify-end p-4">
            <button
              className=" p-2 rounded-full hover:bg-[#F0DF20]"
              onClick={() => setIsOpen(false)}
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col items-center space-y-6 mt-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className=" text-xl font-medium hover:text-[#F0DF20] transition duration-150"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Register Modal */}
      <RegisterModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </header>
  );
};

export default Header;
