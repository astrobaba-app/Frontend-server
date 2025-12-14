import React from 'react';

const GooglePlayImage: React.FC = () => (
    <a href="#" target="_blank" rel="noopener noreferrer">
        <img
            src="https://placehold.co/130x40/000000/ffffff?text=Google+Play+Badge"
            alt="Get it on Google Play"
            className="w-[130px] h-10 object-contain rounded-sm"
        />
    </a>
);

const AppStoreImage: React.FC = () => (
    <a href="#" target="_blank" rel="noopener noreferrer">
        <img
            src="https://placehold.co/130x40/000000/ffffff?text=App+Store+Badge"
            alt="Download on the App Store"
            className="w-[130px] h-10 object-contain rounded-sm"
        />
    </a>
);

const QRCode: React.FC = () => (
    <div className="w-24 h-24 bg-white p-1">
        <img
            src="https://placehold.co/100x100/ffffff/000000?text=QR+Code"
            alt="Scan to download app QR code"
            className="w-full h-full object-contain"
        />
    </div>
);

const DownloadAppSection: React.FC = () => {
    return (
        <div className="p-10 space-y-4 bg-[#404040] text-white rounded-lg">
            <div className="space-y-1">
                <p className="text-xl font-normal text-white">
                    Download App
                </p>
                <p className="text-sm text-gray-400 font-normal">
                    Scan to download our app
                </p>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
                
                <div className="flex flex-col space-y-3">
                    <GooglePlayImage />
                    <AppStoreImage />
                </div>
                
                <QRCode />
            </div>
        </div>
    );
};

export default DownloadAppSection;