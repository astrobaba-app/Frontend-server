import React from 'react';
import Image from 'next/image';
import { PRODUCTS } from '@/constants/home';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    alt: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="text-center w-24 sm:w-28 md:w-32 flex flex-col items-center">
    <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] bg-[#FFFFEC] rounded-lg mb-2 flex justify-center items-center p-2 shadow-sm overflow-hidden relative">
      <Image 
        src={product.imageUrl} 
        alt={product.alt} 
        fill
        className="object-contain"
        sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 150px"
      />
    </div>
    <div className="text-xs sm:text-sm font-medium text-gray-800">{product.name}</div>
  </div>
);

const Store: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-6 sm:py-8 md:py-10 bg-gray-50">
      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-wide mb-3 sm:mb-4 px-4">Graho Store</p>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 border border-gray-200 rounded-xl bg-white shadow-xl relative">
        <a
          href="/store"
          className="absolute top-3 sm:top-4 right-4 sm:right-6 text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out"
        >
          Visite Store
        </a>

        <div className="flex justify-center flex-wrap gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-6 md:gap-x-8 md:gap-y-8 pt-6 sm:pt-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
