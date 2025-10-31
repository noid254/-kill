import React, { useState, useMemo } from 'react';
import type { CatalogueItem, ServiceProvider } from '../types';

// --- Icons ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;

// --- Card Component ---
const TukosokoItemCard: React.FC<{
    item: CatalogueItem;
    provider?: ServiceProvider;
    onClick: () => void;
}> = ({ item, provider, onClick }) => {
    return (
        <div onClick={onClick} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="overflow-hidden">
                <img src={item.imageUrls[0]} alt={item.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-3">
                <h3 className="font-bold text-gray-800 text-sm mt-1 truncate group-hover:underline">{item.title}</h3>
                <p className="text-sm font-semibold text-gray-600 mt-2">{item.price}</p>
                {provider && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                        <img src={provider.avatarUrl} alt={provider.name} className="w-6 h-6 rounded-full object-cover" />
                        <p className="text-xs text-gray-500 truncate">{provider.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const tukosokoFilters = {
    VEHICLES: {
        title: 'Hit the Road',
        subtitle: 'Find cars, bikes, and parts for your next journey.',
        bannerUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
        children: ['All', 'Cars', 'Motorcycles', 'Spare Parts']
    },
    ELECTRONICS: {
        title: 'Get Connected',
        subtitle: 'The latest in phones, laptops, and home entertainment.',
        bannerUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop',
        children: ['All', 'Phones', 'Computers', 'TVs', 'Cameras']
    },
    FASHION: {
        title: 'Style Redefined',
        subtitle: 'Discover trends in clothing, shoes, and accessories.',
        bannerUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop',
        children: ['All', 'Clothing', 'Shoes', 'Watches', 'Bags']
    },
    HOME: {
        title: 'Upgrade Your Home',
        subtitle: 'Furniture, appliances, and decor for every room.',
        bannerUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
        children: ['All', 'Furniture', 'Appliances', 'Decor']
    },
};

type ParentCategory = keyof typeof tukosokoFilters;

interface TukosokoProps {
    items: CatalogueItem[];
    providers: ServiceProvider[];
    onSelectProvider: (provider: ServiceProvider) => void;
    onBack: () => void;
}

const Tukosoko: React.FC<TukosokoProps> = ({ items, providers, onSelectProvider, onBack }) => {
    const [activeParent, setActiveParent] = useState<ParentCategory>('ELECTRONICS');
    const [activeChild, setActiveChild] = useState<string>('All');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // FIX: Changed providerId parameter from number to string to match the type in ServiceProvider.
    const findProvider = (providerId: string) => providers.find(p => p.id === providerId);

    const handleParentClick = (parent: ParentCategory) => {
        setActiveParent(parent);
        setActiveChild('All');
    };

    const displayedItems = useMemo(() => {
        // 1. Base filter for products only
        let baseItems = items.filter(i => i.category === 'Product' || i.category === 'For Sale');
        
        const categoryKeywords: Record<ParentCategory, string[]> = {
            VEHICLES: ['car', 'vehicle', 'motorcycle', 'scooter', 'prado', 'tx', 'brake'],
            ELECTRONICS: ['phone', 'laptop', 'tv', 'camera', 'audio', 'iphone', 'samsung'],
            FASHION: ['shirt', 'dress', 'shoes', 'watch', 'jewellery', 'bag'],
            HOME: ['sofa', 'table', 'chair', 'fridge', 'cooker', 'bed', 'box'],
        };
        
        // 2. Filter by parent category using keywords
        let parentFilteredItems = baseItems.filter(item => {
            const searchString = `${item.title.toLowerCase()} ${item.description.toLowerCase()}`;
            return categoryKeywords[activeParent].some(keyword => searchString.includes(keyword));
        });

        // 3. Filter by child category
        let childFilteredItems = parentFilteredItems;
        if (activeChild !== 'All') {
            const childKeyword = activeChild.toLowerCase().replace(/s$/, ''); // simple plural to singular
            childFilteredItems = parentFilteredItems.filter(item => item.title.toLowerCase().includes(childKeyword));
        }

        // 4. Filter by search term
        return searchTerm
            ? childFilteredItems.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : childFilteredItems;
    }, [items, activeParent, activeChild, searchTerm]);
    
    const { title, subtitle, bannerUrl } = tukosokoFilters[activeParent];
    const parentCategories = Object.keys(tukosokoFilters) as ParentCategory[];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
             <style>{`
              @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
              .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
            `}</style>

            {isSearchActive && (
                <div className="sticky top-0 z-30 bg-white shadow-md p-4 animate-fade-in-down">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-sm rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                autoFocus
                            />
                        </div>
                        <button onClick={() => { setIsSearchActive(false); setSearchTerm(''); }} className="text-sm font-semibold text-slate-600 flex-shrink-0">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="relative w-full h-80 shadow-lg">
                <img src={bannerUrl} key={bannerUrl} alt={title} className="absolute inset-0 w-full h-full object-cover animate-fade-in" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
                
                <header className="absolute top-0 left-0 right-0 pt-4 px-4 flex justify-between items-center text-white z-10">
                    <button onClick={onBack} className="p-2 -ml-2"><BackIcon /></button>
                    <span className="font-bold tracking-widest text-sm">TUKOSOKO</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSearchActive(true)}><SearchIcon /></button>
                        <button><BellIcon /></button>
                    </div>
                </header>

                <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
                    <h1 className="text-4xl font-bold font-serif">{title}</h1>
                    <p className="mt-2 max-w-sm text-base opacity-90">{subtitle}</p>
                </div>
            </div>

            <div className="p-4 relative z-10">
                 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {parentCategories.map(parent => (
                        <React.Fragment key={parent}>
                            <button 
                                onClick={() => handleParentClick(parent)}
                                className={`flex-shrink-0 px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-200 shadow-md ${activeParent === parent ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
                            >
                                {parent.replace('_', ' & ')}
                            </button>
                            {activeParent === parent && tukosokoFilters[parent].children.map(child => (
                                <button
                                    key={child}
                                    onClick={() => setActiveChild(child)}
                                    className={`flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${activeChild === child ? 'bg-slate-400 text-white' : 'bg-slate-200 text-slate-600'}`}
                                >
                                    {child}
                                </button>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <main className="px-4 pb-8">
                 <h2 className="text-center font-serif font-bold text-2xl text-slate-800 my-4">
                    {activeChild === 'All' ? `All ${activeParent.replace('_', ' & ')}` : `Featured ${activeChild}`}
                </h2>
                {displayedItems.length > 0 ? (
                    <div key={`${activeParent}-${activeChild}-${searchTerm}`} className="grid grid-cols-2 gap-4 animate-fade-in">
                        {displayedItems.map(item => {
                            const provider = findProvider(item.providerId);
                            return (
                                <TukosokoItemCard 
                                    key={item.id} 
                                    item={item} 
                                    provider={provider} 
                                    onClick={() => provider && onSelectProvider(provider)} 
                                />
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        <p>No products found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Tukosoko;
