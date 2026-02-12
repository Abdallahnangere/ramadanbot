'use client';

import React, { useState, useEffect } from 'react';
import { User, GeneratedData, AppState } from '../../types';
import RamadanForm from '../../components/RamadanForm';
import FlyerPreview from '../../components/FlyerPreview';
import LoginScreen from '../../components/LoginScreen';
import AdminDashboard from '../../components/AdminDashboardEnhanced';
import Sidebar from '../../components/Sidebar';
import SettingsScreen from '../../components/SettingsScreen';
import QuranBottomSheet from '../../components/QuranBottomSheet';
import Toast from '../../components/Toast';
import { Menu, Sparkles, Download, Clock, BookOpen } from 'lucide-react';

export default function HomeApp() {
  const [appState, setAppState] = useState<AppState>({ 
    view: 'login', 
    currentUser: null, 
    isDarkMode: false 
  });
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuranOpen, setIsQuranOpen] = useState(false);
  const [downloadedFlyerUrl, setDownloadedFlyerUrl] = useState<string | null>(null);
  const [hasDownloadedToday, setHasDownloadedToday] = useState(false);
  const [countdownTime, setCountdownTime] = useState<string>('00:00:00');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Initialize app: restore theme and persistent login
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // Restore theme preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setAppState(prev => ({...prev, isDarkMode: true}));
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Restore persistent login if user data exists in localStorage
        try {
            const savedUser = localStorage.getItem('ramadanbot_user');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                setAppState(prev => ({...prev, view: 'app', currentUser: user}));
            }
        } catch (e) {
            console.error('Failed to restore user session:', e);
        }

        setIsHydrated(true);
    }
  }, []);

  // Real-time user data polling
  useEffect(() => {
    if (!appState.currentUser?.id) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/user?id=${appState.currentUser!.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.user) {
            // Update app state
            setAppState(prev => ({ ...prev, currentUser: json.user }));
            // Update localStorage
            try {
              localStorage.setItem('ramadanbot_user', JSON.stringify(json.user));
            } catch (e) {
              console.error('Failed to update user session:', e);
            }
          }
        }
      } catch (error) {
        // Silent fail - polling is non-critical
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [appState.currentUser?.id]);

  const handleLogin = (user: User) => {
    // Save user to localStorage for persistent login
    try {
      localStorage.setItem('ramadanbot_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user session:', e);
    }
    setAppState(prev => ({ ...prev, view: 'app', currentUser: user }));
  };

  const handleLogout = () => {
    // Clear saved user from localStorage
    try {
      localStorage.removeItem('ramadanbot_user');
    } catch (e) {
      console.error('Failed to clear user session:', e);
    }
    setAppState(prev => ({ ...prev, view: 'login', currentUser: null }));
    setGeneratedData(null);
    setIsSidebarOpen(false);
  };

  const toggleTheme = () => {
    setAppState(prev => {
        const newMode = !prev.isDarkMode;
        if (newMode) {
            localStorage.theme = 'dark';
            document.documentElement.classList.add('dark');
        } else {
            localStorage.theme = 'light';
            document.documentElement.classList.remove('dark');
        }
        return { ...prev, isDarkMode: newMode };
    });
  };

  const handleSuccess = (data: GeneratedData) => {
    setGeneratedData(data);
    if (appState.currentUser) {
       const u = appState.currentUser;
       const updatedUser = { ...u, generation_count: u.generation_count + 1 };
       setAppState(prev => ({ ...prev, currentUser: updatedUser }));
       
       // Update persistent login with new user data
       try {
         localStorage.setItem('ramadanbot_user', JSON.stringify(updatedUser));
       } catch (e) {
         console.error('Failed to update user session:', e);
       }

       try {
         const key = 'generationHistory';
         const raw = localStorage.getItem(key);
         const history = raw ? JSON.parse(raw) : [];
         history.unshift({ topic: data.formData.topic, day: data.formData.day, date: new Date().toISOString() });
         localStorage.setItem(key, JSON.stringify(history.slice(0, 50)));
       } catch (e) {
       }
    }
  };

  const handleFlyerDownloaded = async (flyerUrl: string) => {
    setDownloadedFlyerUrl(flyerUrl);
    setToast({ type: 'success', message: '✓ Flyer downloaded successfully!' });

    try {
      const res = await fetch(`/api/user?id=${appState.currentUser!.id}`);
        if (res.ok) {
                const json = await res.json();
                if (json.user) {
                    setAppState(prev => ({ ...prev, currentUser: json.user }));
                    // Update persistent login with new user data
                    try {
                      localStorage.setItem('ramadanbot_user', JSON.stringify(json.user));
                    } catch (e) {
                      console.error('Failed to update user session:', e);
                    }

                    const usedToday = json.user.today_generations || 0;
                    const limit = json.user.limit || json.user.rate_limit_override || 3;
                    if (usedToday >= limit && json.user.role !== 'admin') {
                        setHasDownloadedToday(true);
                        setToast({ type: 'warning', message: `Daily limit reached. Next generation available in 24 hours.` });
                    } else {
                        setHasDownloadedToday(false);
                    }
                }
            }
    } catch (e) {
      console.error('Failed to refresh user after download', e);
      setToast({ type: 'error', message: 'Failed to check limit status' });
      setHasDownloadedToday(true);
    }
  };

  const handleRedownload = () => {
    if (downloadedFlyerUrl) {
      const fileName = `Ramadan_Daily_Flyer.png`;
      const link = document.createElement('a');
      link.href = downloadedFlyerUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast({ type: 'success', message: '✓ Flyer re-downloaded!' });
    }
  };

  const handleReset = () => {
    setGeneratedData(null);
  };

  const renderContent = () => {
    if (appState.view === 'login') {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (appState.view === 'admin') {
      return (
        <AdminDashboard 
          onBack={() => setAppState(prev => ({ ...prev, view: 'app' }))}
        />
      );
    }

    if (appState.view === 'settings') {
        return <SettingsScreen 
            onBack={() => setAppState(prev => ({...prev, view: 'app'}))} 
            isDarkMode={appState.isDarkMode}
            toggleTheme={toggleTheme}
            user={appState.currentUser!}
            onLogout={handleLogout}
        />;
    }

    const user = appState.currentUser!;

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#000000] dark:via-[#0a0a0a] dark:to-[#000000] transition-colors duration-300">
            <Sidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={handleLogout}
                onAdmin={() => {
                    setAppState(prev => ({ ...prev, view: 'admin' }));
                    setIsSidebarOpen(false);
                }}
                onSettings={() => {
                    setAppState(prev => ({ ...prev, view: 'settings' }));
                    setIsSidebarOpen(false);
                }}
            />

            <header className="relative flex-shrink-0 px-5 py-4 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-40">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                        aria-label="Open Menu"
                    >
                        <Menu size={20} className="text-gray-700 dark:text-gray-200" />
                    </button>

                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                            RamadanBot
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                            aria-label="Toggle Theme"
                        >
                            {appState.isDarkMode ? (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                            <Download size={14} className="text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                {typeof user.remaining !== 'undefined' ? user.remaining : (user.rate_limit_override || 3)}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="px-5 py-6 space-y-6">
                    {generatedData ? (
                        <div className="animate-fade-in">
                            <FlyerPreview 
                                message={generatedData.text}
                                formData={generatedData.formData}
                                onReset={handleReset}
                                user={user}
                                onDownloaded={handleFlyerDownloaded}
                            />
                        </div>
                    ) : (
                        <div className="animate-fade-in-up space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    Salam, {user.name.split(' ')[0]} 👋
                                </h2>
                                <p className="text-base text-gray-600 dark:text-gray-400">
                                    Ready for today's reflection?
                                </p>
                            </div>

                            <RamadanForm 
                                onSuccess={handleSuccess} 
                                initialName={user.name} 
                                userId={user.id}
                                disabled={hasDownloadedToday}
                                countdownTime={countdownTime}
                                hasLimitReached={hasDownloadedToday}
                            />

                            {/* Premium Streak & Limit Cards - Apple Standard */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              {/* Streak Card */}
                              <div className="group relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                                {/* Animated background gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="relative p-6 flex flex-col h-full justify-between">
                                  {/* Top section */}
                                  <div>
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all duration-300">
                                      <span className="text-2xl">🔥</span>
                                    </div>
                                    
                                    {/* Label */}
                                    <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-2">
                                      Streak
                                    </p>
                                    
                                    {/* Value */}
                                    <div className="space-y-1">
                                      <p className="text-5xl font-black text-white tracking-tight">
                                        {user.streak}
                                      </p>
                                      <p className="text-xs text-white/60 font-medium">
                                        day{user.streak !== 1 ? 's' : ''} on fire
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Progress bar */}
                                  <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-white/50 font-medium">Progress to 30 days</span>
                                      <span className="text-white font-bold">{Math.min(100, Math.round((user.streak/30)*100))}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                                      <div 
                                        className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 h-full rounded-full transition-all duration-700 ease-out shadow-lg shadow-orange-500/50" 
                                        style={{ width: `${Math.min(100, Math.round((user.streak/30)*100))}%` }} 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Daily Limit Card */}
                              <div className="group relative bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="relative p-6 flex flex-col h-full justify-between">
                                  {/* Top section */}
                                  <div>
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all duration-300">
                                      <Sparkles size={24} className="text-white" />
                                    </div>
                                    
                                    {/* Label */}
                                    <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-2">
                                      Daily Limit
                                    </p>
                                    
                                    {/* Value */}
                                    <div className="space-y-1">
                                      <p className="text-5xl font-black text-white tracking-tight">
                                        {typeof user.remaining !== 'undefined' ? user.remaining : (user.rate_limit_override || 3)}
                                      </p>
                                      <p className="text-xs text-white/60 font-medium">
                                        generation{(user.remaining || 3) !== 1 ? 's' : ''} left today
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Progress bar */}
                                  <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-white/50 font-medium">Daily usage</span>
                                      <span className="text-white font-bold">{Math.round(((user.limit || user.rate_limit_override || 3) - (user.today_generations||0))/ (user.limit || user.rate_limit_override || 3) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                                      <div 
                                        className="bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-500 h-full rounded-full transition-all duration-700 ease-out shadow-lg shadow-emerald-500/50" 
                                        style={{ width: `${Math.round(((user.limit || user.rate_limit_override || 3) - (user.today_generations||0))/ (user.limit || user.rate_limit_override || 3) * 100)}%` }} 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                                            Daily Reflection Tips
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            Choose a topic that resonates with your current spiritual journey. Add specific verses or Hadith for more personalized content.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6"></div>
            </main>

            {/* Quran Tab */}
            {!generatedData && (
              <button
                onClick={() => setIsQuranOpen(true)}
                className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 z-40 group"
              >
                <BookOpen size={24} className="group-hover:animate-bounce" />
              </button>
            )}
        </div>
    );
  };

  return (
    <div className={`relative w-full h-full flex justify-center items-center p-0 md:p-8 ${appState.isDarkMode ? 'dark' : ''}`}>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={4000}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Quran Bottom Sheet */}
      {appState.currentUser && (
        <QuranBottomSheet 
          isOpen={isQuranOpen}
          onClose={() => setIsQuranOpen(false)}
          user={appState.currentUser}
          onProgressUpdate={() => {
            // Refresh user data
            if (appState.currentUser?.id) {
              fetch(`/api/user?id=${appState.currentUser.id}`)
                .then(res => res.json())
                .then(json => {
                  if (json.user) {
                    setAppState(prev => ({ ...prev, currentUser: json.user }));
                    try {
                      localStorage.setItem('ramadanbot_user', JSON.stringify(json.user));
                    } catch (e) {}
                  }
                })
                .catch(e => console.error(e));
            }
          }}
        />
      )}
      
      <div className="relative w-full h-full md:max-w-[400px] md:max-h-[850px] bg-white dark:bg-black md:rounded-[48px] md:shadow-[0_0_0_14px_#1f2937,0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300 isolate">
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-[126px] h-[30px] bg-black rounded-b-[20px] z-50 pointer-events-none shadow-lg"></div>
        {isHydrated ? renderContent() : <LoginScreen onLogin={handleLogin} />}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1.5 bg-black/30 dark:bg-white/30 rounded-full pointer-events-none z-50"></div>
      </div>
    </div>
  );
}
