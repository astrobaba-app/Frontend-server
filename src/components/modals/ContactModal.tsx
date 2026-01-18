import React from "react";
import { Mail, Globe, MapPin, X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-dark transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-3xl text-dark mb-2">Contact Us</h2>
          <div className="mb-8">
            <p className="font-bold text-lg text-dark">Penzo Technologies Private Limited</p>
            <p className="text-gray-600 font-medium">(Brand: Graho)</p>
          </div>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email</p>
                <a href="mailto:hello@graho.in" className="text-dark font-medium">
                  hello@graho.in
                </a>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-center gap-4">
              <div className="bg-cyan-50 p-3 rounded-full text-cyan-600">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Website</p>
                <a href="https://www.graho.in" target="_blank" rel="noopener noreferrer" className="text-blue-600  font-medium">
                  https://www.graho.in
                </a>
              </div>
            </div>

            {/* Registered Office */}
            <div className="flex items-start gap-4">
              <div className="bg-red-50 p-3 rounded-full text-red-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Registered Office</p>
                <p className="text-dark font-medium">Goa, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-2 bg-dark w-full" />
      </div>
    </div>
  );
}