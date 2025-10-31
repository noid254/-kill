import React, { useState, useEffect } from 'react';
import * as api from './services/api';
import type { ServiceProvider, CatalogueItem, Document, Invitation, BusinessAssets as BusinessAssetsType, Ticket, SpecialBanner, Gig } from './types';

import SideMenu from './components/SideMenu';
import NikoSoko from './components/NikoSoko';
import Tukosoko from './components/Tukosoko';
import MyPlaces from './components/MyPlaces';
import GatePass from './components/GatePass';
import MentorshipPage from './components/MentorshipPage';
import InvoiceHub from './components/InvoiceHub';
import InvoiceGenerator from './components/InvoiceGenerator';
import QuoteGenerator from './components/QuoteGenerator';
import ReceiptGenerator from './components/ReceiptGenerator';
import BusinessAssets from './components/BusinessAssets';
import MyDocumentsView from './components/MyDocumentsView';
import ScanDocumentView from './components/ScanDocumentView';
import ProfileView from './components/ProfileView';
import MyTicketsView from './components/MyTicketsView';
import CatalogueView from './components/CatalogueView';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import MyContactsView from './components/MyContactsView';
import SettingsView from './components/SettingsView';
import AuthModal from './components/AuthModal';
import GigsPage from './components/GigsPage';
import AddServiceCardView from './components/AddServiceCardView';
import MessageCenterView from './components/MessageCenterView';
import AssetRegistryView from './components/AssetRegistryView';
import RegisterAssetView from './components/RegisterAssetView';
import OwnershipCheckView from './components/OwnershipCheckView';
import DocumentDetailView from './components/DocumentDetailView';


// --- SVG Icons ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const BellIcon: React.FC<{ hasNotification: boolean }> = ({ hasNotification }) => (
    <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        {hasNotification && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-brand-navy"></div>}
    </div>
);
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block ml-2 text-green-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const GatePassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-1.026.977-2.27.977-3.632V8.528c0-2.28-1.47-4.243-3.588-4.832A12.015 12.015 0 0012 3.5c-2.433 0-4.66.736-6.412 2.001A9.44 9.44 0 002.5 8.528v4.84c0 1.362.332 2.606.977 3.632M15 15h.01M4.988 15h.01M12 15h.01" /></svg>;
const InvoicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const MyPlacesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const NikosokoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const TukosokoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0"/></svg>;
const MentorHubIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;



// --- Home page sub-components ---

const banners = [
  {
    id: 1,
    content: (
      <>
        <h2 className="text-4xl font-extrabold leading-tight text-brand-gold">
          KARIBU SOKO
        </h2>
        <p className="mt-2 opacity-90 text-md text-gray-200">Skill, your borderless currency</p>
      </>
    ),
  },
  {
    id: 2,
    content: (
      <div className="flex flex-col items-center text-white">
        <p className="text-xl opacity-90 -mb-2">Bila</p>
        <h2 className="text-7xl font-extrabold leading-none tracking-tighter text-brand-gold">$KILL</h2>
        <p className="text-lg opacity-90">itakuwa ngumu</p>
      </div>
    ),
  },
  {
    id: 3,
    content: (
       <>
        <h2 className="text-3xl font-extrabold leading-tight text-brand-gold">
          Build Your A-Team
        </h2>
        <p className="mt-2 opacity-90 text-md text-gray-200">Save your favorite artisans & build your go-to contact list.</p>
      </>
    )
  }
];

const Header: React.FC<{
    onMenuClick: () => void;
    user: ServiceProvider | null;
    isAuthenticated: boolean;
    onLoginClick: () => void;
    onMessagesClick: () => void;
    hasNewMessages: boolean;
}> = ({ onMenuClick, user, isAuthenticated, onLoginClick, onMessagesClick, hasNewMessages }) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(timer);
  }, []);
  
  return (
    <header className="bg-brand-navy text-white p-4 pt-5 relative overflow-hidden shadow-lg h-[240px] flex flex-col">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <button onClick={onMenuClick} className="text-white p-2 -ml-2"><MenuIcon /></button>
        <div className="flex items-center space-x-2">
          <button onClick={onMessagesClick} className="text-white p-2"><BellIcon hasNotification={hasNewMessages} /></button>
        </div>
      </div>
      
      {/* Banner Content Wrapper */}
      <div className="relative z-10 px-2 flex-grow flex flex-col justify-center text-center">
        <div key={banners[currentBanner].id} className="animate-fade-in">
            {banners[currentBanner].content}
        </div>
      </div>

      {/* Banner Indicators */}
      <div className="flex justify-center items-center gap-2 pt-4 pb-2 z-10">
        {banners.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentBanner === index ? 'bg-brand-gold scale-125' : 'bg-white/50'}`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
};

const OpportunityCard: React.FC<{
    location: string;
    title: string;
    price: string;
    userAvatar: string;
    imageUrl: string;
    onClick: () => void;
}> = ({ location, title, price, userAvatar, imageUrl, onClick }) => (
  <div onClick={onClick} className="flex-shrink-0 w-56 bg-gray-200 rounded-2xl overflow-hidden relative shadow-md active-scale cursor-pointer">
    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-3 text-white w-full">
      <span className="text-xs font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">{location}</span>
      <h4 className="font-semibold mt-2 truncate">{title}</h4>
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm font-bold">{price}</span>
        <img src={userAvatar} alt="User" className="w-7 h-7 rounded-full border-2 border-white/50" />
      </div>
    </div>
  </div>
);

// --- Main App Component ---

export type CurrentPage = 'home' | 'nikosoko' | 'tukosoko' | 'myplaces' | 'gatepass' | 'hub' | 'mentorhub' | 'mycatalogue' | 'mytickets' | 'mycontacts' | 'settings' | 'admin' | 'gigs' | 'signup' | 'messageCenter' | 'assetRegistry' | 'registerAsset' | 'ownershipCheck';
type HubView = 'hub_home' | 'myDocuments' | 'quoteGenerator' | 'invoice' | 'brandKit' | 'receiptGenerator' | 'scanDocument';

const App: React.FC = () => {
    // Page state
    const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
    const [currentHubView, setCurrentHubView] = useState<HubView>('hub_home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Data state
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [savedContacts, setSavedContacts] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    
    // User state
    const [currentUser, setCurrentUser] = useState<ServiceProvider | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [assets, setAssets] = useState<BusinessAssetsType>({ name: 'Your Company Name', address: 'Your Address', logo: null });
    const [pendingPhone, setPendingPhone] = useState<string | null>(null);

    // UI state
    const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasNewMessages, setHasNewMessages] = useState(true);

    // --- Effects ---
    const fetchData = async () => {
        try {
            const [
                providersData,
                catalogueData,
                documentsData,
                invitationsData,
                ticketsData,
                gigsData,
                categoriesData
            ] = await Promise.all([
                api.getProviders(),
                api.getCatalogueItems(),
                api.getDocuments(),
                api.getInvitations(),
                api.getTickets(),
                api.getGigs(),
                api.getCategories()
            ]);
            setProviders(providersData);
            setCatalogueItems(catalogueData);
            setDocuments(documentsData);
            setInvitations(invitationsData);
            setTickets(ticketsData);
            setGigs(gigsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        }
    };
    
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = api.getToken();
            if (token) {
                try {
                    const userProfile = await api.getMyProfile();
                    setCurrentUser(userProfile);
                    setIsAuthenticated(true);
                    // Assuming isSuperAdmin is part of the userProfile object from the backend
                    // setIsSuperAdmin(userProfile.isSuperAdmin); 
                } catch (error) {
                    console.error("Session invalid. Logging out.", error);
                    api.clearToken();
                }
            }
        };

        checkAuthStatus();
        fetchData();
    }, []);
    
    // --- Handlers ---

    const handleLogin = (response: api.VerifyOtpResponse, phone: string) => {
        if (response.success && response.token) {
            api.setToken(response.token);
            if (response.user) {
                setCurrentUser(response.user);
                setIsAuthenticated(true);
                setIsSuperAdmin(response.isSuperAdmin);
                setAssets({ name: response.user.name, address: response.user.location, logo: response.user.avatarUrl });
                setIsAuthModalOpen(false);
                setPendingPhone(null);
            } else {
                setIsAuthModalOpen(false);
                setIsAuthenticated(true);
                setIsSuperAdmin(response.isSuperAdmin);
                setPendingPhone(phone);
                setCurrentPage('signup');
            }
        }
    };
    
    const handleCreateProfile = async (
        profileData: Omit<ServiceProvider, 'id' | 'name' | 'phone' | 'avatarUrl' | 'whatsapp' | 'flagCount' | 'views' | 'coverImageUrl' | 'isVerified' | 'cta'>,
        name: string,
        avatar: string | null,
        referralCode: string,
        cta: ServiceProvider['cta'],
    ) => {
        if (!pendingPhone) {
            alert("An error occurred: Your phone number is missing. Please sign in again.");
            setCurrentPage('home');
            setIsAuthenticated(false);
            return;
        }

        const newProviderData: Omit<ServiceProvider, 'id'> = {
            ...profileData,
            name,
            phone: pendingPhone,
            whatsapp: pendingPhone,
            avatarUrl: avatar || `https://i.pravatar.cc/150?u=${pendingPhone}`,
            coverImageUrl: `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}-cover/600/400`,
            isVerified: false,
            flagCount: 0,
            views: 0,
            cta,
        };

        try {
            const newUser = await api.createProvider(newProviderData);
            setCurrentUser(newUser);
            setPendingPhone(null);
            setCurrentPage('home');
            fetchData(); // Refetch all data
        } catch (error) {
            console.error("Failed to create profile:", error);
            alert("There was an error creating your profile. Please try again.");
        }
    };

    const handleOpenAuthModal = () => setIsAuthModalOpen(true);
    
    const handleSelectProvider = (provider: ServiceProvider) => {
        setSelectedProvider(provider);
    };

    const handleBack = () => {
        if (selectedProvider) {
            setSelectedProvider(null);
        } else if (selectedDocument) {
            setSelectedDocument(null);
        } else if (currentPage === 'hub') {
            if (currentHubView !== 'hub_home') {
                setCurrentHubView('hub_home');
            } else {
                setCurrentPage('home');
            }
        } else {
            setCurrentPage('home');
        }
    };

    const handleNavigate = (page: CurrentPage | 'profile') => {
        setIsMenuOpen(false);
        const protectedPages: (CurrentPage | 'profile')[] = ['profile', 'mycontacts', 'mytickets', 'mycatalogue', 'settings', 'admin', 'hub', 'gatepass', 'messageCenter', 'assetRegistry', 'registerAsset'];
        
        if (protectedPages.includes(page) && !isAuthenticated) {
            handleOpenAuthModal();
            return;
        }

        const requiresProfile: (CurrentPage | 'profile')[] = ['profile', 'mycatalogue', 'mytickets', 'hub', 'gatepass', 'assetRegistry', 'registerAsset'];
        if (requiresProfile.includes(page) && !currentUser) {
            setCurrentPage('signup');
            return;
        }

        if (page === 'profile' && currentUser) {
            setSelectedProvider(currentUser);
        } else {
            setSelectedProvider(null);
            setSelectedDocument(null);
            setCurrentPage(page as CurrentPage);
        }
    };

    const handleLogout = () => {
        api.clearToken();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsSuperAdmin(false);
        setIsMenuOpen(false);
        setCurrentPage('home');
    };
    
    // --- Data for Home Page ---
    const toolsData = [
      { name: 'Gate Pass', icon: <GatePassIcon />, page: 'gatepass' },
      { name: 'My Workshop', icon: <InvoicesIcon />, notification: documents.length, page: 'hub' },
      { name: 'My Places', icon: <MyPlacesIcon />, page: 'myplaces' },
      { name: 'Nikosoko', icon: <NikosokoIcon />, page: 'nikosoko' },
      { name: 'Tukosoko', icon: <TukosokoIcon />, page: 'tukosoko' },
      { name: 'Mentor Hub', icon: <MentorHubIcon />, page: 'mentorhub' },
    ];

    const opportunitiesData = [
      { location: 'Kileshwa', title: 'Paint a 3-Bedroom Apartme...', price: 'Ksh 15,000 total', userAvatar: 'https://i.pravatar.cc/150?img=1', imageUrl: 'https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=800' },
      { location: 'Nairobi Area', title: 'Weekly House Cleaning', price: 'Ksh 1,200 /hr', userAvatar: 'https://i.pravatar.cc/150?img=2', imageUrl: 'https://images.unsplash.com/photo-1549643276-f7a36c3c7268?q=80&w=800' },
      { location: 'Westlands', title: 'Appliance Repair', price: 'Ksh 2,000 total', userAvatar: 'https://i.pravatar.cc/150?img=3', imageUrl: 'https://images.unsplash.com/photo-1627798394200-5936a0531557?q=80&w=800' },
    ];
    
    const handleToolClick = (page: CurrentPage) => {
        const protectedPages: CurrentPage[] = ['hub', 'gatepass', 'assetRegistry', 'myplaces'];
        if (protectedPages.includes(page) && !isAuthenticated) {
            handleOpenAuthModal();
        } else if (protectedPages.includes(page) && !currentUser) {
            setCurrentPage('signup');
        }
        else {
            setCurrentPage(page);
        }
    };

    const handleOpportunityClick = () => {
        if (!isAuthenticated) {
            handleOpenAuthModal();
        } else {
            setCurrentPage('gigs');
        }
    };


    const ToolButton: React.FC<{ name: string; icon: React.ReactNode; notification?: number; onClick: () => void }> = ({ name, icon, notification, onClick }) => (
      <button onClick={onClick} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center space-y-2.5 hover:shadow-md hover:-translate-y-1 transition-all relative active-scale">
        {notification ? (
          <div className="absolute top-2 right-2 bg-brand-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {notification}
          </div>
        ) : null}
        {icon}
        <span className="text-xs font-semibold text-gray-700">{name}</span>
      </button>
    );

    // --- Render Logic ---

    if (selectedProvider) {
        return <ProfileView 
            profileData={selectedProvider} 
            isOwner={currentUser?.id === selectedProvider.id}
            isAuthenticated={isAuthenticated}
            isSuperAdmin={isSuperAdmin}
            currentUserPhone={currentUser?.phone}
            onBack={() => setSelectedProvider(null)}
            onLogout={handleLogout}
            onUpdate={async (updated) => {
                const updatedUser = await api.updateProvider(updated);
                setSelectedProvider(updatedUser);
                setProviders(providers.map(p => p.id === updatedUser.id ? updatedUser : p));
            }}
            onDelete={async (id) => { 
                await api.deleteProvider(id);
                setProviders(p => p.filter(pr => pr.id !== id)); 
                setSelectedProvider(null); 
            }}
            onContactClick={handleOpenAuthModal}
            onInitiateContact={() => true}
            savedContacts={savedContacts}
            onToggleSaveContact={(id) => setSavedContacts(p => p.includes(id) ? p.filter(cId => cId !== id) : [...p, id])}
            catalogueItems={catalogueItems.filter(ci => ci.providerId === selectedProvider.id)}
            onBook={() => {}}
            onJoin={() => {}}
            isFlaggedByUser={false}
            onFlag={() => {}}
        />;
    }
    
    if (selectedDocument) {
        return <DocumentDetailView 
            document={selectedDocument}
            onBack={() => setSelectedDocument(null)}
            onUpdate={async (doc) => {
                const updatedDoc = await api.updateDocument(doc);
                setDocuments(docs => docs.map(d => d.id === updatedDoc.id ? updatedDoc : d));
                setSelectedDocument(updatedDoc);
            }}
            currentUser={currentUser!}
        />
    }
    
    const renderContent = () => {
        const PageWrapper: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
            <div className="w-full max-w-sm mx-auto bg-gray-50 min-h-screen">
                <header className="p-4 bg-white shadow-sm flex items-center gap-4 sticky top-0 z-10">
                    <button onClick={handleBack} className="text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                </header>
                {children}
            </div>
        );

        switch (currentPage) {
            case 'nikosoko':
                return <NikoSoko 
                    providers={providers} 
                    onSelectProvider={handleSelectProvider} 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                    onBack={handleBack}
                />;
            case 'tukosoko':
                return <Tukosoko items={catalogueItems} providers={providers} onSelectProvider={handleSelectProvider} onBack={handleBack} />;
            case 'myplaces':
                return <MyPlaces providers={providers} onSelectProvider={handleSelectProvider} onBack={handleBack} catalogueItems={catalogueItems} />;
            case 'gatepass':
                return <PageWrapper title="Gate Pass"><GatePass 
                    allProviders={providers}
                    currentUser={currentUser}
                    isSuperAdmin={isSuperAdmin}
                    isAuthenticated={isAuthenticated}
                    invitations={invitations}
                    // FIX: Add missing hostName property to the data object before calling api.createInvitation to resolve type mismatch.
                    onCreateInvitation={async (data) => { 
                        if (!currentUser?.name) return;
                        await api.createInvitation({ ...data, hostName: currentUser.name }, 'Invite'); 
                        fetchData(); 
                    }}
                    // FIX: The `data` object for `onCreateKnock` needs the `hostName`, which is added from the `currentUser`.
                    onCreateKnock={async (data) => { 
                        if (!currentUser?.name) return;
                        await api.createInvitation({ ...data, hostName: currentUser.name }, 'Knock'); 
                        fetchData(); 
                    }}
                    onUpdateInvitationStatus={async (id, status) => { await api.updateInvitation(id, status); fetchData(); }}
                    onAuthClick={handleOpenAuthModal}
                    onGoToSignup={() => setCurrentPage('signup')}
                /></PageWrapper>;
            case 'assetRegistry':
                return <PageWrapper title="Asset Registry"><AssetRegistryView 
                    documents={documents} 
                    currentUser={currentUser}
                    onNavigate={(page) => setCurrentPage(page)}
                    onSelectDocument={setSelectedDocument}
                /></PageWrapper>;
            case 'registerAsset':
                return <PageWrapper title="Register New Asset"><RegisterAssetView 
                    onBack={() => setCurrentPage('assetRegistry')}
                    onSave={async (doc) => {
                        await api.addDocument(doc);
                        fetchData();
                        setCurrentPage('assetRegistry');
                    }}
                /></PageWrapper>;
             case 'ownershipCheck':
                return <PageWrapper title="Ownership Check"><OwnershipCheckView 
                    allDocuments={documents} 
                /></PageWrapper>;
            case 'hub':
                const handleSaveDoc = async (doc: Omit<Document, 'id'>) => {
                    await api.addDocument(doc);
                    fetchData();
                    setCurrentHubView('myDocuments');
                }
                switch (currentHubView) {
                    case 'hub_home':
                        return <PageWrapper title="My Workshop"><InvoiceHub onNavigate={(view) => setCurrentHubView(view)} /></PageWrapper>;
                    case 'invoice':
                        return <PageWrapper title="New Invoice"><InvoiceGenerator assets={assets} onSave={handleSaveDoc} /></PageWrapper>;
                    case 'quoteGenerator':
                        return <PageWrapper title="New Quote"><QuoteGenerator assets={assets} /></PageWrapper>;
                    case 'receiptGenerator':
                        return <PageWrapper title="New Receipt"><ReceiptGenerator assets={assets} onSave={handleSaveDoc} /></PageWrapper>;
                    case 'brandKit':
                        return <PageWrapper title="Brand Kit"><BusinessAssets assets={assets} currentUser={currentUser} onSave={setAssets} onOrder={() => {}} onAddToCatalogue={() => {}} /></PageWrapper>;
                    case 'myDocuments':
                        return <PageWrapper title="My Documents"><MyDocumentsView documents={documents} onScan={() => setCurrentHubView('scanDocument')} onSelectDocument={setSelectedDocument} currentUser={currentUser} /></PageWrapper>;
                    case 'scanDocument':
                        return <PageWrapper title="Scan Asset"><ScanDocumentView onBack={() => setCurrentHubView('myDocuments')} onSave={handleSaveDoc} /></PageWrapper>;
                    default:
                        return <PageWrapper title="My Workshop"><InvoiceHub onNavigate={(view) => setCurrentHubView(view)} /></PageWrapper>;
                }
            case 'mentorhub':
                return <PageWrapper title="Mentor Hub"><MentorshipPage /></PageWrapper>;
            case 'mytickets':
                return <PageWrapper title="My Tickets"><MyTicketsView tickets={tickets} /></PageWrapper>;
            case 'mycatalogue':
                 return <CatalogueView 
                    items={catalogueItems.filter(i => i.providerId === currentUser?.id)} 
                    onUpdateItems={async (items) => { /*This should be an API call per item*/ fetchData(); }} 
                    currentUser={currentUser as ServiceProvider} 
                    onUpdateUser={async (user) => {const updated = await api.updateProvider(user); setCurrentUser(updated); }}
                    isAuthenticated={isAuthenticated}
                    onAuthClick={handleOpenAuthModal}
                    onInitiateContact={() => true}
                    onBack={handleBack}
                />;
            case 'gigs':
                return <PageWrapper title="Gigs & Opportunities"><GigsPage 
                    gigs={gigs} 
                    providers={providers}
                    onSelectProvider={handleSelectProvider}
                    onApply={(gig) => {
                        alert(`Applied for gig: ${gig.title}`);
                    }}
                    isAuthenticated={isAuthenticated}
                    onAuthClick={handleOpenAuthModal}
                /></PageWrapper>;
            case 'mycontacts':
                const contactProviders = providers.filter(p => savedContacts.includes(p.id));
                return <MyContactsView contacts={contactProviders} onSelectContact={handleSelectProvider} onBack={handleBack} />;
            case 'settings':
                return <SettingsView onBack={handleBack} />;
            case 'messageCenter':
                return <MessageCenterView onBack={handleBack} />;
            case 'admin':
                return isSuperAdmin ? <SuperAdminDashboard 
                    onBack={handleBack}
                    providers={providers}
                    onUpdateProvider={() => {}}
                    onDeleteProvider={() => {}}
                    onViewProvider={handleSelectProvider}
                    categories={[]}
                    onAddCategory={() => {}}
                    onDeleteCategory={() => {}}
                    onBroadcast={() => {}}
                    specialBanners={[]}
                    onAddBanner={() => {}}
                    onDeleteBanner={() => {}}
                    onCreateOrganization={() => {}}
                    onApproveRequest={() => {}}
                    onRejectRequest={() => {}}
                /> : <PageWrapper title="Access Denied"><div className="p-4 text-center">You do not have permission to view this page.</div></PageWrapper>;
            case 'signup':
                return <AddServiceCardView
                    onBack={() => setCurrentPage('home')}
                    onSave={handleCreateProfile}
                    categories={categories}
                    currentUser={{ phone: pendingPhone }}
                />;
            case 'home':
            default:
                return (
                    <>
                    <Header 
                        onMenuClick={() => setIsMenuOpen(true)} 
                        user={currentUser} 
                        isAuthenticated={isAuthenticated} 
                        onLoginClick={handleOpenAuthModal}
                        onMessagesClick={() => {
                            if (!isAuthenticated) {
                                handleOpenAuthModal();
                            } else {
                                setHasNewMessages(false);
                                setCurrentPage('messageCenter');
                            }
                        }}
                        hasNewMessages={hasNewMessages}
                    />
                    <main className="space-y-6 py-6">
                        <section className="px-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                        <h3 className="text-lg font-bold text-brand-navy mb-4">My Essential Tools</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {toolsData.map(tool => (
                            <ToolButton key={tool.name} name={tool.name} icon={tool.icon} notification={tool.notification} onClick={() => handleToolClick(tool.page as CurrentPage)} />
                            ))}
                        </div>
                        </section>

                        <section className="animate-slide-in-up" style={{ animationDelay: '250ms' }}>
                        <div className="px-4 mb-4">
                            <h3 className="text-lg font-bold text-brand-navy">Nearby Opportunities</h3>
                            <p className="text-sm text-gray-500">Nairobi Area</p>
                        </div>
                        <div className="flex space-x-4 overflow-x-auto no-scrollbar pl-4 pb-2">
                            {opportunitiesData.map(opp => (
                            <OpportunityCard key={opp.title} {...opp} onClick={handleOpportunityClick} />
                            ))}
                            <div className="w-1 flex-shrink-0"></div> {/* Spacer */}
                        </div>
                        </section>
                    </main>
                    </>
                );
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-gray-50 min-h-screen">
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />}
            <SideMenu 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onNavigate={handleNavigate}
                currentUser={currentUser}
                isSuperAdmin={isSuperAdmin}
                onLogout={handleLogout}
            />
            <div key={currentPage} className="animate-fade-in">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
