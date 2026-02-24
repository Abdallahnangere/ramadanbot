import React, { useState } from 'react';
import { X, Settings, LogOut, Shield, Heart, UserCircle, Mail, MessageCircle, History, Lock } from 'lucide-react';
import { User } from '../types';
import HistoryModal from './HistoryModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onAdmin: () => void;
  onSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user, onLogout, onAdmin, onSettings }) => {
  const [infoTab, setInfoTab] = useState<'about' | 'contact'>('about');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handlePrivacyClick = () => {
    window.open('https://ramadanbot.vercel.app/privacy', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      
      {/* Backdrop - Apple-style blur */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-md z-40 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel - Pure Apple Design */}
      <div className={`absolute top-0 left-0 bottom-0 w-[320px] bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Close Button - Minimalist Apple Style */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 z-10"
          aria-label="Close sidebar"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {/* Header - Clean & Elegant */}
        <div className="p-6 pt-14 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold shadow-lg ring-2 ring-blue-100">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 leading-tight tracking-tight">{user.name}</h2>
              <p className="text-sm text-gray-500 font-medium capitalize mt-0.5">{user.role}</p>
            </div>
          </div>
          
          {/* Streak Badge - Refined */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-600">🔥 Streak:</span>
            <span className="text-sm font-bold text-blue-600">{user.streak} Days</span>
          </div>
        </div>

        {/* Menu Items - Scrollable with Apple-style spacing */}
        <div 
          className="px-5 py-6 space-y-8 overflow-y-auto" 
          style={{ 
            maxHeight: 'calc(100vh - 320px)', 
            touchAction: 'pan-y', 
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          
          {/* App Section */}
          <div className="space-y-2">
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">App</h3>
            
            {user.role === 'admin' && (
              <button 
                onClick={() => { onAdmin(); onClose(); }} 
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Shield size={20} strokeWidth={2} />
                <span className="font-medium text-[15px]">Admin Dashboard</span>
              </button>
            )}

            <button 
              onClick={() => { onSettings(); onClose(); }} 
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <Settings size={20} strokeWidth={2} />
              <span className="font-medium text-[15px]">Settings</span>
            </button>

            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <History size={20} strokeWidth={2} />
              <span className="font-medium text-[15px]">Generation History</span>
            </button>
          </div>

          {/* Information Section - Apple-style tabs */}
          <div className="space-y-2">
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Information</h3>
            
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
              {/* Tab Navigation - Refined */}
              <div className="flex p-1 bg-white border-b border-gray-200">
                <button 
                  onClick={() => setInfoTab('about')}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    infoTab === 'about' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  About
                </button>
                <button 
                  onClick={() => setInfoTab('contact')}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    infoTab === 'contact' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Contact
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5">
                {infoTab === 'about' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🌙</div>
                      <h4 className="font-semibold text-gray-900 text-base">Ramadan Bot</h4>
                      <p className="text-sm text-gray-500 mt-1">Version 2.1.0</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed text-center">
                      A sophisticated platform for crafting personalized Ramadan reflections and spiritual flyers grounded in authentic Islamic teachings.
                    </p>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        <span className="block font-semibold mb-1 text-gray-700">Developer</span>
                        Abdallah Nangere 🇳🇬
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Built with ❤️ for the Ummah
                    </p>
                  </div>
                )}

                {infoTab === 'contact' && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Have questions or feedback? Reach out today.
                    </p>
                    
                    <a 
                      href="mailto:founder@ramadanbot.app"
                      className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:shadow-md transition-all duration-200 group border border-red-100"
                    >
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Mail size={18} className="text-red-600 group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Email</p>
                        <p className="text-xs text-red-600 font-medium">founder@ramadanbot.app</p>
                      </div>
                    </a>

                    <a 
                      href="https://wa.me/2348164135836"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-200 group border border-green-100"
                    >
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <MessageCircle size={18} className="text-green-600 group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">WhatsApp</p>
                        <p className="text-xs text-green-600 font-medium">+234 816 413 5836</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Policy - Prominent Placement */}
          <div className="space-y-2">
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</h3>
            
            <button 
              onClick={handlePrivacyClick}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <Lock size={20} strokeWidth={2} />
              <span className="font-medium text-[15px]">Privacy Policy</span>
            </button>
          </div>

        </div>

        {/* Footer - Sign Out with Apple Polish */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold py-3.5 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200"
          >
            <LogOut size={20} strokeWidth={2} />
            <span className="text-[15px]">Sign Out</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
