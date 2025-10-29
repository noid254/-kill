import React from 'react';
import type { ServiceProvider } from '../types';

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


const ServiceCard: React.FC<{ provider: ServiceProvider; onClick: () => void }> = ({ provider, onClick }) => {
    return (
        <div onClick={onClick} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="relative h-32 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={provider.avatarUrl} alt={provider.name} />
                {provider.isVerified && (
                    <div className="absolute top-1.5 right-1.5 bg-blue-600 rounded-full p-0.5">
                        <CheckIcon />
                    </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 bg-black bg-opacity-50 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    {provider.distanceKm}km Near you
                </div>
            </div>
            <div className="p-2.5 relative min-h-[60px]">
                <p className="font-bold text-sm text-gray-900 truncate">{provider.name}</p>
                <p className="text-xs text-gray-500 truncate">{provider.service}</p>
                 <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md font-semibold">
                    {provider.distanceKm} KM
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;