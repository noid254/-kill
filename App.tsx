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


// --- SVG Icons ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block ml-2 text-green-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const SkylineIcon = () => <svg width="311" height="57" viewBox="0 0 311 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 w-full h-auto"><path d="M311 57V45.5L305.5 40L300 45.5V57H311Z" fill="white" fillOpacity="0.1"/><path d="M291 57V42L285 35L279 42V57H291Z" fill="white" fillOpacity="0.1"/><path d="M273 57V48.5L268.5 44L264 48.5V57H273Z" fill="white" fillOpacity="0.1"/><path d="M251 57V35L247 31L243 35V57H251Z" fill="white" fillOpacity="0.1"/><path d="M239 57V26L233 18L227 26V57H239Z" fill="white" fillOpacity="0.1"/><path d="M221 57V48.5L216.5 44L212 48.5V57H221Z" fill="white" fillOpacity="0.1"/><path d="M208 57V45.5L202.5 40L197 45.5V57H208Z" fill="white" fillOpacity="0.1"/><path d="M188 57V42L182 35L176 42V57H188Z" fill="white" fillOpacity="0.1"/><path d="M171 57V22L165 14L159 22V57H171Z" fill="white" fillOpacity="0.1"/><path d="M153 57V48.5L148.5 44L144 48.5V57H153Z" fill="white" fillOpacity="0.1"/><path d="M132 57V45.5L126.5 40L121 45.5V57H132Z" fill="white" fillOpacity="0.1"/><path d="M112 57V42L106 35L100 42V57H112Z" fill="white" fillOpacity="0.1"/><path d="M94 57V48.5L89.5 44L85 48.5V57H94Z" fill="white" fillOpacity="0.1"/><path d="M72 57V35L68 31L64 35V57H72Z" fill="white" fillOpacity="0.1"/><path d="M60 57V26L54 18L48 26V57H60Z" fill="white" fillOpacity="0.1"/><path d="M42 57V48.5L37.5 44L33 48.5V57H42Z" fill="white" fillOpacity="0.1"/><path d="M29 57V45.5L23.5 40L18 45.5V57H29Z" fill="white" fillOpacity="0.1"/><path d="M9 57V42L3 35L-3 42V57H9Z" fill="white" fillOpacity="0.1"/></svg>;
const GatePassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-icon-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-1.026.977-2.27.977-3.632V8.528c0-2.28-1.47-4.243-3.588-4.832A12.015 12.015 0 0012 3.5c-2.433 0-4.66.736-6.412 2.001A9.44 9.44 0 002.5 8.528v4.84c0 1.362.332 2.606.977 3.632M15 15h.01M4.988 15h.01M12 15h.01" /></svg>;
const InvoicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const MyPlacesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-icon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const NikosokoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const TukosokoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0"/></svg>;
const MentorHubIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-icon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

// --- Home page sub-components ---

const Header: React.FC<{ onMenuClick: () => void; user: ServiceProvider | null; onLoginClick: () => void; }> = ({ onMenuClick, user, onLoginClick }) => (
    <header className="bg-brand-green text-white rounded-b-3xl p-4 pt-5 relative overflow-hidden shadow-lg">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onMenuClick} className="text-white p-2 -ml-2"><MenuIcon /></button>
        <div className="flex items-center space-x-2">
          <button className="text-white p-2"><BellIcon /></button>
          {user ? (
             <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full border-2 border-white/50" />
          ) : (
             <button onClick={onLoginClick} className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Sign In</button>
          )}
        </div>
      </div>
      
      {/* Banner Content */}
      <div className="relative z-10 px-2 pb-6">
        <h2 className="text-4xl font-bold leading-tight">
          KARIBU SOKO
          <CheckCircleIcon />
        </h2>
        <p className="mt-2 opacity-90 text-md">Skill, your borderless currency</p>
      </div>
  
      {/* Decorative element */}
      <SkylineIcon />
    </header>
  );

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

export type CurrentPage = 'home' | 'nikosoko' | 'tukosoko' | 'myplaces' | 'gatepass' | 'hub' | 'mentorhub' | 'mycatalogue' | 'mytickets' | 'mycontacts' | 'settings' | 'admin' | 'gigs';
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
    const [savedContacts, setSavedContacts] = useState<number[]>([]);
    
    // User state
    const [currentUser, setCurrentUser] = useState<ServiceProvider | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [assets, setAssets] = useState<BusinessAssetsType>({ name: 'Your Company Name', address: 'Your Address', logo: null });

    // UI state
    const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Effects ---
    useEffect(() => {
        // Fetch all data on initial load
        api.getProviders().then(setProviders);
        api.getCatalogueItems().then(setCatalogueItems);
        api.getDocuments().then(setDocuments);
        api.getInvitations().then(setInvitations);
        api.getTickets().then(setTickets);
        api.getGigs().then(setGigs);
        
        // Mock saved contacts for demo
        setSavedContacts([2, 5, 8]);
    }, []);
    
    // --- Handlers ---

    const handleLogin = (response: api.VerifyOtpResponse) => {
        if (response.success && response.user) {
            setCurrentUser(response.user);
            setIsAuthenticated(true);
            setIsSuperAdmin(response.isSuperAdmin);
            if (response.user.name) {
                setAssets({ name: response.user.name, address: response.user.location, logo: response.user.avatarUrl });
            }
            setIsAuthModalOpen(false);
        } else if (response.success && !response.user) {
            alert("Login successful, but you don't have a profile yet. Profile creation is required to proceed.");
            // In a real app, you would redirect to a signup/profile creation page.
            // For now, we close the modal.
            setIsAuthModalOpen(false);
        }
        // If !response.success, the modal will show an error and stay open.
    };
    
    const handleOpenAuthModal = () => setIsAuthModalOpen(true);
    
    const handleSelectProvider = (provider: ServiceProvider) => {
        setSelectedProvider(provider);
    };

    const handleBack = () => {
        if (selectedProvider) {
            setSelectedProvider(null);
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
        const protectedPages: (CurrentPage | 'profile')[] = ['profile', 'mycontacts', 'mytickets', 'mycatalogue', 'settings', 'admin'];
        
        if (protectedPages.includes(page) && !isAuthenticated) {
            handleOpenAuthModal();
            return;
        }

        if (page === 'profile' && currentUser) {
            setSelectedProvider(currentUser);
        } else {
            setSelectedProvider(null);
            setCurrentPage(page as CurrentPage);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsSuperAdmin(false);
        setIsMenuOpen(false);
        setCurrentPage('home'); // Go to home on logout
    };
    
    // --- Data for Home Page ---
    const toolsData = [
      { name: 'Gate Pass', icon: <GatePassIcon />, page: 'gatepass' },
      { name: 'Invoices', icon: <InvoicesIcon />, notification: documents.length, page: 'hub' },
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
        const protectedPages: CurrentPage[] = ['hub', 'gatepass'];
        if (protectedPages.includes(page) && !isAuthenticated) {
            handleOpenAuthModal();
        } else {
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
          <div className="absolute top-2 right-2 bg-icon-lime text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {notification} New
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
            onUpdate={(updated) => {
                setSelectedProvider(updated);
                setProviders(providers.map(p => p.id === updated.id ? updated : p));
            }}
            onDelete={(id) => { setProviders(p => p.filter(pr => pr.id !== id)); setSelectedProvider(null); }}
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
                    onCreateInvitation={async () => { /* mock */ }}
                    onCreateKnock={async () => { /* mock */ }}
                    onUpdateInvitationStatus={async () => { /* mock */ }}
                    onAuthClick={handleOpenAuthModal}
                    onGoToSignup={() => {}}
                /></PageWrapper>;
            case 'hub':
                const handleSaveDoc = (doc: Omit<Document, 'id'>) => {
                    api.addDocument(doc).then(newDoc => {
                        setDocuments(prev => [newDoc, ...prev]);
                        setCurrentHubView('myDocuments');
                    });
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
                        return <PageWrapper title="My Documents"><MyDocumentsView documents={documents} allDocuments={documents} onScan={() => setCurrentHubView('scanDocument')} onSelectDocument={() => {}} currentUser={currentUser} /></PageWrapper>;
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
                    onUpdateItems={(items) => setCatalogueItems(current => [...items, ...current.filter(i => i.providerId !== currentUser?.id)])} 
                    currentUser={currentUser as ServiceProvider} 
                    onUpdateUser={(user) => setCurrentUser(user)}
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
                        // In a real app, this would send an application message to the provider's inbox
                    }}
                    isAuthenticated={isAuthenticated}
                    onAuthClick={handleOpenAuthModal}
                /></PageWrapper>;
            case 'mycontacts':
                const contactProviders = providers.filter(p => savedContacts.includes(p.id));
                return <MyContactsView contacts={contactProviders} onSelectContact={handleSelectProvider} onBack={handleBack} />;
            case 'settings':
                return <SettingsView onBack={handleBack} />;
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
            case 'home':
            default:
                return (
                    <>
                    <Header onMenuClick={() => setIsMenuOpen(true)} user={currentUser} onLoginClick={handleOpenAuthModal} />
                    <main className="space-y-6 py-6">
                        <section className="px-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                        <h3 className="text-lg font-bold text-brand-dark mb-4">My Essential Tools</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {toolsData.map(tool => (
                            <ToolButton key={tool.name} name={tool.name} icon={tool.icon} notification={tool.notification} onClick={() => handleToolClick(tool.page as CurrentPage)} />
                            ))}
                        </div>
                        </section>

                        <section className="animate-slide-in-up" style={{ animationDelay: '250ms' }}>
                        <div className="px-4 mb-4">
                            <h3 className="text-lg font-bold text-brand-dark">Nearby Opportunities</h3>
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