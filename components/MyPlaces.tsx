import React, { useState, useMemo } from 'react';
import type { ServiceProvider, CatalogueItem } from '../types';
import ServiceCard from './ServiceCard';

// --- Icons ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;


const placeFilters = {
    SPORTS: {
        title: 'Unleash Your Inner Athlete',
        subtitle: 'Discover courts, fields, and pools for your favorite activities.',
        bannerUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
        children: ['all', 'tennis', 'basketball', 'football', 'swimming', 'gym']
    },
    'FOOD & DRINK': {
        title: 'Savor Every Moment',
        subtitle: 'Explore the best local restaurants, cafes, and bars.',
        bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        children: ['all', 'restaurants', 'cafes', 'bars', 'bakeries', 'catering']
    },
    HEALTH: {
        title: 'Focus On Your Wellbeing',
        subtitle: 'Find clinics, pharmacies, and specialists to keep you healthy.',
        bannerUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop',
        children: ['all', 'hospitals', 'clinics', 'pharmacies']
    },
    SHOPPING: {
        title: 'Retail Therapy Awaits',
        subtitle: 'From large malls to unique boutiques, find what you need.',
        bannerUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=800&auto=format&fit=crop',
        children: ['all', 'malls', 'markets', 'boutiques', 'supermarkets']
    },
    RENTALS: {
        title: 'Rent Anything, Anytime',
        subtitle: 'From tools to tents, find what you need for temporary use.',
        bannerUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800&auto=format&fit=crop',
        children: ['all', 'equipment', 'vehicles', 'party supplies', 'housing']
    }
};

type ParentCategory = keyof typeof placeFilters;

interface MyPlacesProps {
    providers: ServiceProvider[];
    onSelectProvider: (provider: ServiceProvider) => void;
    onBack: () => void;
    catalogueItems: CatalogueItem[];
}

const MyPlaces: React.FC<MyPlacesProps> = ({ providers, onSelectProvider, onBack, catalogueItems }) => {
    const [activeParent, setActiveParent] = useState<ParentCategory>('SPORTS');
    const [activeChild, setActiveChild] = useState<string>('all');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSort, setActiveSort] = useState<string | null>(null);

    const handleParentClick = (parent: ParentCategory) => {
        setActiveParent(parent);
        setActiveChild('all'); // Reset to 'all' when changing parent category
    };

    const displayedProviders = useMemo(() => {
        let baseProviders: ServiceProvider[];

        // 1. Filter by parent category
        if (activeParent === 'HEALTH') {
            baseProviders = providers.filter(p => ['Emergency', 'Personal'].includes(p.category) || p.service.toLowerCase().includes('clinic') || p.service.toLowerCase().includes('pharmacy'));
        } else if (activeParent === 'SPORTS') {
            baseProviders = providers.filter(p => p.service.toLowerCase().includes('gym') || p.service.toLowerCase().includes('trainer'));
        } else if (activeParent === 'FOOD & DRINK') {
            baseProviders = providers.filter(p => p.service.toLowerCase().includes('catering') || p.category === 'Food');
        } else if (activeParent === 'RENTALS') {
             const rentalProviderIds = new Set(
                catalogueItems
                    .filter(item => item.category === 'For Rent')
                    .map(item => item.providerId)
            );
            baseProviders = providers.filter(p => rentalProviderIds.has(p.id));
        }
        else {
             baseProviders = providers;
        }

        let childFilteredProviders = baseProviders;
        if (activeChild !== 'all') {
            if (activeParent === 'RENTALS') {
                 const childKeyword = activeChild.toLowerCase().replace(/ supplies$/, '');
                childFilteredProviders = baseProviders.filter(provider => {
                    return catalogueItems.some(item => 
                        item.providerId === provider.id &&
                        item.category === 'For Rent' &&
                        (item.title.toLowerCase().includes(childKeyword) || item.description.toLowerCase().includes(childKeyword))
                    );
                });
            } else {
                 childFilteredProviders = baseProviders.filter(p => p.service.toLowerCase().includes(activeChild.toLowerCase()));
            }
        }
       

        // 2. Filter by search term
        let searchedProviders = searchTerm
            ? childFilteredProviders.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.service.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : childFilteredProviders;

        // 3. Sort
        const sortedProviders = [...searchedProviders];
        if (activeSort === 'distance') {
            sortedProviders.sort((a, b) => a.distanceKm - b.distanceKm);
        } else if (activeSort === 'rating') {
            sortedProviders.sort((a, b) => b.rating - a.rating);
        } else if (activeSort === 'online') {
            sortedProviders.sort((a, b) => {
                if (a.isOnline && !b.isOnline) return -1;
                if (!a.isOnline && b.isOnline) return 1;
                return a.distanceKm - b.distanceKm; // secondary sort
            });
        }
        
        return sortedProviders;
    }, [providers, activeParent, activeChild, searchTerm, activeSort, catalogueItems]);

    const { title, subtitle, bannerUrl } = placeFilters[activeParent];
    const parentCategories = Object.keys(placeFilters) as ParentCategory[];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <style>{`
              @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
              .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
            `}</style>
            
            {/* Sticky Search Header */}
            {isSearchActive && (
                <div className="sticky top-0 z-30 bg-white shadow-md p-4 animate-fade-in-down">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="relative flex-grow">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search places..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-sm rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => {
                                setIsSearchActive(false);
                                setSearchTerm('');
                                setActiveSort(null);
                            }}
                            className="text-sm font-semibold text-slate-600 flex-shrink-0"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm overflow-x-auto no-scrollbar">
                        <span className="font-semibold text-slate-500 flex-shrink-0">Sort by:</span>
                        <button onClick={() => setActiveSort('distance')} className={`flex-shrink-0 ${activeSort === 'distance' ? 'font-bold text-slate-800' : 'text-slate-600'}`}>Distance</button>
                        <button onClick={() => setActiveSort('rating')} className={`flex-shrink-0 ${activeSort === 'rating' ? 'font-bold text-slate-800' : 'text-slate-600'}`}>Rating</button>
                        <button onClick={() => setActiveSort('online')} className={`flex-shrink-0 ${activeSort === 'online' ? 'font-bold text-slate-800' : 'text-slate-600'}`}>Open Now</button>
                    </div>
                </div>
            )}

            {/* Hero Banner Section */}
            <div className="relative w-full h-80 shadow-lg">
                <img src={bannerUrl} key={bannerUrl} alt={title} className="absolute inset-0 w-full h-full object-cover rounded-b-3xl animate-fade-in" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 rounded-b-3xl"></div>
                
                <header className="absolute top-0 left-0 right-0 pt-4 px-4 flex justify-between items-center text-white z-10">
                    <button onClick={onBack} className="p-2 -ml-2"><BackIcon /></button>
                    <span className="font-bold tracking-widest text-sm">PLACES</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSearchActive(true)}><SearchIcon /></button>
                        <button><BellIcon /></button>
                    </div>
                </header>

                <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
                    <h1 className="text-5xl font-bold font-serif">{title}</h1>
                    <p className="mt-2 max-w-sm text-lg opacity-90">{subtitle}</p>
                </div>
            </div>
            
            {/* Filtering Controls */}
            <div className="p-4 -mt-16 relative z-10">
                {/* Parent Categories */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {parentCategories.map(parent => (
                        <button 
                            key={parent}
                            onClick={() => handleParentClick(parent)}
                            className={`flex-shrink-0 px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-200 shadow-md ${activeParent === parent ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
                        >
                            {parent}
                        </button>
                    ))}
                </div>

                {/* Child Categories */}
                <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {placeFilters[activeParent].children.map(child => (
                        <button
                            key={child}
                            onClick={() => setActiveChild(child)}
                            className={`flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${activeChild === child ? 'bg-slate-400 text-white' : 'bg-slate-200 text-slate-600'}`}
                        >
                            {child}
                        </button>
                    ))}
                </div>
            </div>

            {/* Provider Grid */}
            <main className="px-4 pb-8">
                <h2 className="text-center font-serif font-bold text-2xl text-slate-800 my-4">
                    {activeChild === 'all' ? `All ${activeParent}` : `Featured ${activeChild}s`}
                </h2>
                {displayedProviders.length > 0 ? (
                    <div key={`${activeParent}-${activeChild}-${searchTerm}-${activeSort}`} className="grid grid-cols-2 gap-4 animate-fade-in">
                        {displayedProviders.map(provider => (
                            <ServiceCard key={provider.id} provider={provider} onClick={() => onSelectProvider(provider)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        <p>No places found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyPlaces;