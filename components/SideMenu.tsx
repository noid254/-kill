import React from 'react';
import type { ServiceProvider } from '../types';
import type { CurrentPage } from '../App';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: CurrentPage | 'profile') => void;
  currentUser: ServiceProvider | null;
  isSuperAdmin: boolean;
  onLogout: () => void;
}

// --- Icons for the new side menu design ---
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ContactsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const TicketsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const CatalogueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>;

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate, currentUser, isSuperAdmin, onLogout }) => {
  const menuItems: { label: string; page: CurrentPage | 'profile'; icon: React.ReactNode }[] = [
    { label: 'My Profile', page: 'profile', icon: <ProfileIcon /> },
    { label: 'My Contacts', page: 'mycontacts', icon: <ContactsIcon /> },
    { label: 'My Tickets', page: 'mytickets', icon: <TicketsIcon /> },
    { label: 'My Catalogue', page: 'mycatalogue', icon: <CatalogueIcon /> },
    { label: 'Settings', page: 'settings', icon: <SettingsIcon /> },
  ];

  const handleNavigate = (page: CurrentPage | 'profile') => {
    onNavigate(page);
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
      <div
        className={`relative w-4/5 max-w-xs h-full bg-brand-dark text-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Logo Section */}
        <div className="p-6 text-left border-b border-gray-700">
            <div className="font-bold text-4xl tracking-tighter">$KILL</div>
            <p className="text-sm text-gray-400">the borderless currency</p>
        </div>
        
        {/* User Profile Section */}
        {currentUser && (
            <header className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <img src={currentUser.avatarUrl || 'https://i.pravatar.cc/150?img=5'} alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-white/30" />
                    <div>
                        <p className="font-semibold text-lg">{currentUser.name}</p>
                        <p className="text-xs text-gray-400">{currentUser.service}</p>
                    </div>
                </div>
            </header>
        )}

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.page}
              onClick={() => handleNavigate(item.page)}
              className="w-full flex items-center gap-4 text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          {isSuperAdmin && (
             <button
              onClick={() => handleNavigate('admin')}
              className="w-full flex items-center gap-4 text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <AdminIcon />
              <span className="font-medium">Admin</span>
            </button>
          )}
        </nav>
        
        {/* Logout Section */}
        <footer className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            <LogoutIcon />
            <span className="font-medium">Logout</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SideMenu;