'use client';
import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import RegisterModal from '@/components/modals/Register';

const QUICK_LINKS = [
    { name: 'About us', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Chat with Astrologer', href: '#' },
];

const ACCOUNTS_LINKS = [
    { name: 'Login', action: 'modal' },
    { name: 'Register', action: 'modal' },
    { name: 'Profile', href: '#' },
    { name: 'Register as Astrologer', href: '#' },
];

const Footer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAccountClick = (link) => {
        if (link.action === 'modal') {
            setIsModalOpen(true);
        }
    };

    return (
        <footer className="w-full bg-[#F0DF20] text-gray-900 font-inter">
            <div className="max-w-7xl mx-auto py-12 px-6 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">


                    <div className=" text-center md:text-left">
                        <div className="flex justify-center md:justify-start items-center space-x-2">
                            <img
                                src="/images/footer_logo.png"
                                alt="Astrobaba Logo"
                                className="h-40 w-auto rounded-full object-cover"
                            />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-0">Astrobaba</p>
                        <p className="text-sm italic text-gray-700">Shubh Dindar, Shubh Murg</p>
                    </div>


                    <div className="space-y-4">
                        <p className="text-md font-bold uppercase tracking-wider">Quick Links</p>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-gray-800 hover:text-gray-900 transition duration-150 block">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div className="space-y-4">
                        <p className="text-md font-bold uppercase tracking-wider ">Accounts</p>
                        <ul className="space-y-2">
                            {ACCOUNTS_LINKS.map((link) => (
                                <li key={link.name}>
                                    {link.action === 'modal' ? (
                                        <button 
                                            onClick={() => handleAccountClick(link)}
                                            className="text-gray-800 hover:text-gray-900 transition duration-150 text-sm text-left"
                                        >
                                            {link.name}
                                        </button>
                                    ) : (
                                        <a href={link.href} className="text-gray-800 hover:text-gray-900 transition duration-150 block text-sm">
                                            {link.name}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div className="space-y-4">
                        <p className="text-md font-bold uppercase tracking-wider mb-4  pb-1">Contact Info</p>

                        <div className="space-y-2 text-sm">
                            <p className="flex items-center text-gray-800">
                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>WEST SHIBPUR, Howrah, West Bengal</span>
                            </p>
                            <p className="flex items-center text-gray-800">
                                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>+91 4567891234</span>
                            </p>
                            <p className="flex items-center text-gray-800">
                                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>contact@astrobaba.live</span>
                            </p>
                        </div>
                    </div>
                    {/* <div className="space-y-4">
                        <div className="text-center">
                            <p className='text-sm mb-3 font-bold'>Get Your Daily Horoscope Daily Lovescope and Daily Tarot Directly in Your Inbox</p>
                            <form className="flex rounded-lg overflow-hidden shadow-md">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    aria-label="Email subscription"

                                    className="w-full px-4 py-2 border-none bg-white outline-none text-gray-800"
                                />
                                <button
                                    type="submit"
                                    className="bg-gray-900 text-white font-semibold px-4 py-2 hover:bg-gray-700 transition duration-150"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-gray-800"></div>
            <div className="bg-[#F0DF20] py-4">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm font-medium text-gray-900">
                    Copyright &copy; 2025-26 Astrobaba. All Right Reserved.
                </div>
            </div>

            {/* Register Modal */}
            <RegisterModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </footer>
    );
};

export default Footer;