'use client';

import React, { useState, useEffect } from 'react';
import { User, GeneratedData, AppState } from '../types';
import RamadanForm from '../components/RamadanForm';
import FlyerPreview from '../components/FlyerPreview';
import LoginScreen from '../components/LoginScreen';
import AdminDashboard from '../components/AdminDashboard';
import Sidebar from '../components/Sidebar';
import SettingsScreen from '../components/SettingsScreen';
import Toast from '../components/Toast';
import { Menu, Sparkles, Download, Clock } from 'lucide-react';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({ 
    view: 'login', 
    currentUser: null, 
    isDarkMode: false 
  });
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [downloadedFlyerUrl, setDownloadedFlyerUrl] = useState<string | null>(null);
  const [hasDownloadedToday, setHasDownloadedToday] = useState(false);
  const [countdownTime, setCountdownTime] = useState<string>('00:00:00');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  
  // Persist login session and Theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // Check Theme
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setAppState(prev => ({...prev, isDarkMode: true}));
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
  }, []);

  // Countdown timer for daily limit
  useEffect(() => {
    if (!hasDownloadedToday || !appState.currentUser?.last_generation_date) return;

    const interval = setInterval(() => {
      const now = new Date();
      const lastGen = new Date(appState.currentUser!.last_generation_date!);
      const nextAllowed = new Date(lastGen.getTime() + 24 * 60 * 60 * 1000);
      const diff = nextAllowed.getTime() - now.getTime();

      if (diff <= 0) {
        setHasDownloadedToday(false);
        setCountdownTime('00:00:00');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasDownloadedToday, appState.currentUser?.last_generation_date]);

  const handleLogin = (user: User) => {
    setAppState(prev => ({ ...prev, view: 'app', currentUser: user }));
  };

  const handleLogout = () => {
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
    // Optimistic update of generation_count locally
    if (appState.currentUser) {
       const u = appState.currentUser;
       const updatedUser = { ...u, generation_count: u.generation_count + 1 };
       setAppState(prev => ({ ...prev, currentUser: updatedUser }));

       // Persist generation history to localStorage for sidebar (topic + day)
       try {
         const key = 'generationHistory';
         const raw = localStorage.getItem(key);
         const history = raw ? JSON.parse(raw) : [];
         history.unshift({ topic: data.formData.topic, day: data.formData.day, date: new Date().toISOString() });
         localStorage.setItem(key, JSON.stringify(history.slice(0, 50)));
       } catch (e) {
         // ignore storage errors
       }
    }
  };

  const handleFlyerDownloaded = async (flyerUrl: string) => {
    setDownloadedFlyerUrl(flyerUrl);
    
    // Show success notification
    setToast({ type: 'success', message: '✓ Flyer downloaded successfully!' });

    // Fetch latest user state from server to get accurate remaining limits
    try {
      const res = await fetch(`/api/user?id=${appState.currentUser!.id}`);
        if (res.ok) {
                const json = await res.json();
                if (json.user) {
                    setAppState(prev => ({ ...prev, currentUser: json.user }));

                    // Determine if user has reached limit for today (API returns today_generations, remaining, limit)
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

    // Main App View
    const user = appState.currentUser!;

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#000000] dark:via-[#0a0a0a] dark:to-[#000000] transition-colors duration-300">
            
            {/* Sidebar */}
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

            {/* Header - Apple Style */}
            <header className="relative flex-shrink-0 px-5 py-4 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-40">
                <div className="flex items-center justify-between">
                    {/* Left: Menu Button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                        aria-label="Open Menu"
                    >
                        <Menu size={20} className="text-gray-700 dark:text-gray-200" />
                    </button>

                    {/* Center: App Title */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                            RamadanBot
                        </h1>
                    </div>

                    {/* Right: Theme Toggle & Daily Limit Badge */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle - Subtle */}
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

                        {/* Daily Limit Badge - Clean */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                            <Download size={14} className="text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                {typeof user.remaining !== 'undefined' ? user.remaining : (user.rate_limit_override || 3)}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area - Apple Style Scrolling */}
            <main className="flex-1 overflow-y-auto scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="px-5 py-6 space-y-6">
                    {generatedData ? (
                        // Flyer Preview
                        <div className="animate-fade-in">
                            <FlyerPreview 
                                message={generatedData.text}
                                formData={generatedData.formData}
                                onReset={handleReset}
                                user={user}
                                onDownloaded={handleFlyerDownloaded}
                            />
                        </div>
                    ) : hasDownloadedToday ? (
                        // Daily Limit Reached - Apple Style
                        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center space-y-8 px-4">
                            {/* Icon */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                                    <Clock size={48} className="text-white" strokeWidth={2} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-black flex items-center justify-center">
                                    <span className="text-lg">✨</span>
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    Daily Limit Reached
                                </h2>
                                <p className="text-base text-gray-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                                    You've created your reflection for today. Come back after:
                                </p>
                            </div>

                            {/* Countdown Timer - Apple Watch Style */}
                            <div className="w-full max-w-sm">
                                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Next Generation In
                                        </span>
                                    </div>
                                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 font-mono tracking-tight">
                                        {countdownTime}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                                        Resets automatically every 24 hours
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons - Apple Style */}
                            <div className="w-full max-w-sm space-y-3">
                                <button
                                    onClick={handleRedownload}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-all active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                >
                                    <Download size={20} />
                                    <span>Re-download Today's Flyer</span>
                                </button>
                                <button
                                    onClick={() => setHasDownloadedToday(false)}
                                    className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-4 rounded-2xl transition-all active:scale-98"
                                >
                                    Continue to Home
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Main Form View
                        <div className="animate-fade-in-up space-y-6">
                            {/* Greeting - Apple Style */}
                            <div className="space-y-1">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    Salam, {user.name.split(' ')[0]} 👋
                                </h2>
                                <p className="text-base text-gray-600 dark:text-gray-400">
                                    Ready for today's reflection?
                                </p>
                            </div>

                            {/* Form */}
                            <RamadanForm 
                                onSuccess={handleSuccess} 
                                initialName={user.name} 
                                userId={user.id}
                                disabled={hasDownloadedToday}
                            />

                            {/* Stats Cards - Apple Card Style */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                {/* Streak Card */}
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/5 rounded-3xl p-5 border border-orange-200/50 dark:border-orange-900/30 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-black/20 flex items-center justify-center shadow-sm">
                                                <Sparkles size={24} className="text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                                                    Streak
                                                </p>
                                                <p className="text-4xl font-bold text-orange-700 dark:text-orange-300">
                                                    {user.streak}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    days
                                                </p>
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="w-full bg-orange-200/50 dark:bg-orange-900/20 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500" 
                                                    style={{ width: `${Math.min(100, Math.round((user.streak/30)*100))}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Daily Limit Card */}
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-100/50 dark:from-blue-50 to-cyan-100/50 dark:from-blue-900/20 dark:to-cyan-900/5 rounded-3xl p-5 border border-blue-200/50 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-black/20 flex items-center justify-center shadow-sm">
                                                <Download size={24} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                                                    Daily Limit
                                                </p>
                                                <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                                                    {typeof user.remaining !== 'undefined' ? user.remaining : (user.rate_limit_override || 3)}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    remaining
                                                </p>
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="w-full bg-blue-200/50 dark:bg-blue-900/20 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500" 
                                                    style={{ width: `${Math.round(((user.limit || user.rate_limit_override || 3) - (user.today_generations||0))/ (user.limit || user.rate_limit_override || 3) * 100)}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Card - Subtle */}
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

                {/* Bottom Safe Area */}
                <div className="h-6"></div>
            </main>
        </div>
    );
  };

  return (
    // DESKTOP FRAME WRAPPER - Simulates iPhone
    <div className={`relative w-full h-full flex justify-center items-center p-0 md:p-8 ${appState.isDarkMode ? 'dark' : ''}`}>
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={4000}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Phone Chassis - More Refined */}
      <div className="relative w-full h-full md:max-w-[400px] md:max-h-[850px] bg-white dark:bg-black md:rounded-[48px] md:shadow-[0_0_0_14px_#1f2937,0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300 isolate">
        
        {/* Dynamic Island (Desktop Only) - More Refined */}
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-[126px] h-[30px] bg-black rounded-b-[20px] z-50 pointer-events-none shadow-lg"></div>
        
        {renderContent()}

        {/* Home Bar - More Refined */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1.5 bg-black/30 dark:bg-white/30 rounded-full pointer-events-none z-50"></div>
      </div>

    </div>
  );
}

           
