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

  const renderContent = () => {
    const { view, currentUser } = appState;

    if (view === 'login') {
      return <LoginScreen onLogin={handleLogin} isDarkMode={appState.isDarkMode} />;
    }

    if (view === 'admin' && currentUser?.role === 'admin') {
      return (
        <AdminDashboard 
          onBack={() => setAppState(prev => ({ ...prev, view: 'app' }))} 
          isDarkMode={appState.isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      );
    }

    if (view === 'settings') {
      return (
        <SettingsScreen 
          onBack={() => setAppState(prev => ({ ...prev, view: 'app' }))} 
          isDarkMode={appState.isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      );
    }

    if (view !== 'app' || !currentUser) return null;
    const user = currentUser;

    return (
        <div className="relative h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
            
            {/* Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={handleLogout}
                onAdmin={() => { setAppState(prev => ({ ...prev, view: 'admin' })); setIsSidebarOpen(false); }}
                onSettings={() => { setAppState(prev => ({ ...prev, view: 'settings' })); setIsSidebarOpen(false); }}
            />

            {/* Top Navigation - Apple Premium */}
            <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
                <div className="px-5 h-14 flex items-center justify-between">
                    {/* Menu Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 active:scale-95"
                        aria-label="Open menu"
                    >
                        <Menu size={20} className="text-gray-700" strokeWidth={2} />
                    </button>

                    {/* Logo & Title */}
                    <div className="flex items-center gap-2">
                        <div className="text-2xl">🌙</div>
                        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">RamadanBot</h1>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 active:scale-95"
                        aria-label="Toggle theme"
                    >
                        <span className="text-lg">{appState.isDarkMode ? '☀️' : '🌙'}</span>
                    </button>
                </div>
            </nav>

            {/* Main Content - Scrollable */}
            <main className="relative h-[calc(100%-3.5rem)] overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="px-5 py-6 max-w-2xl mx-auto space-y-6">
                    
                    {/* Daily Limit Warning - Apple Alert Style */}
                    {hasDownloadedToday && user.role !== 'admin' && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 shadow-sm animate-fade-in">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                        <Clock size={20} className="text-amber-600" strokeWidth={2} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                        Daily Limit Reached
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        You've used all your generations for today. Come back tomorrow for more!
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-amber-200">
                                        <Clock size={14} className="text-amber-600" />
                                        <span className="text-xs font-mono font-semibold text-amber-700">{countdownTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {generatedData ? (
                        // Preview Mode - Enhanced
                        <div className="space-y-5 animate-fade-in">
                            {/* Header */}
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg mb-2">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    Your Flyer is Ready!
                                </h2>
                                <p className="text-sm text-gray-600 max-w-sm mx-auto">
                                    Review your personalized Ramadan reflection below
                                </p>
                            </div>

                            {/* Flyer Preview Card */}
                            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-200">
                                <FlyerPreview 
                                    data={generatedData}
                                    onDownload={handleFlyerDownloaded}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {downloadedFlyerUrl && (
                                    <button
                                        onClick={handleRedownload}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
                                    >
                                        <Download size={20} strokeWidth={2} />
                                        <span className="text-[15px]">Download Again</span>
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => setGeneratedData(null)}
                                    className="w-full px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-200 active:scale-98"
                                >
                                    <span className="text-[15px]">Create Another</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Main Form View
                        <div className="space-y-6 animate-fade-in">
                            {/* Greeting - Apple Elegance */}
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    Salam, {user.name.split(' ')[0]} 👋
                                </h2>
                                <p className="text-base text-gray-600">
                                    Ready for today's reflection?
                                </p>
                            </div>

                            {/* Form Card - Premium Styling */}
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
                                <RamadanForm 
                                    onSuccess={handleSuccess} 
                                    initialName={user.name} 
                                    userId={user.id}
                                    disabled={hasDownloadedToday}
                                />
                            </div>

                            {/* Stats Cards - Apple Premium Design */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Streak Card */}
                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-98">
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="space-y-3">
                                            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                                <Sparkles size={22} className="text-white" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-orange-100 uppercase tracking-wider mb-1">
                                                    Streak
                                                </p>
                                                <p className="text-4xl font-bold text-white leading-none">
                                                    {user.streak}
                                                </p>
                                                <p className="text-xs text-orange-100 mt-1.5 font-medium">
                                                    consecutive days
                                                </p>
                                            </div>
                                        </div>
                                        {/* Progress Ring */}
                                        <div className="mt-4">
                                            <div className="w-full bg-white/20 rounded-full h-1.5">
                                                <div 
                                                    className="bg-white h-1.5 rounded-full transition-all duration-500 shadow-sm" 
                                                    style={{ width: `${Math.min(100, Math.round((user.streak/30)*100))}%` }} 
                                                />
                                            </div>
                                            <p className="text-[10px] text-orange-100 mt-1.5 text-right font-medium">
                                                {Math.min(100, Math.round((user.streak/30)*100))}% to 30 days
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Daily Limit Card */}
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-98">
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="space-y-3">
                                            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                                <Download size={22} className="text-white" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1">
                                                    Daily Limit
                                                </p>
                                                <p className="text-4xl font-bold text-white leading-none">
                                                    {typeof user.remaining !== 'undefined' ? user.remaining : (user.rate_limit_override || 3)}
                                                </p>
                                                <p className="text-xs text-blue-100 mt-1.5 font-medium">
                                                    generations left
                                                </p>
                                            </div>
                                        </div>
                                        {/* Progress Ring */}
                                        <div className="mt-4">
                                            <div className="w-full bg-white/20 rounded-full h-1.5">
                                                <div 
                                                    className="bg-white h-1.5 rounded-full transition-all duration-500 shadow-sm" 
                                                    style={{ width: `${Math.round(((user.limit || user.rate_limit_override || 3) - (user.today_generations||0))/ (user.limit || user.rate_limit_override || 3) * 100)}%` }} 
                                                />
                                            </div>
                                            <p className="text-[10px] text-blue-100 mt-1.5 text-right font-medium">
                                                {user.today_generations || 0} of {user.limit || user.rate_limit_override || 3} used
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Card - Apple Guidelines */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 mb-1">
                                            Daily Reflection Tips
                                        </p>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Choose a topic that resonates with your spiritual journey. Add specific verses or Hadith for personalized content.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Safe Area */}
                <div className="h-8"></div>
            </main>
        </div>
    );
  };

  return (
    // DESKTOP FRAME WRAPPER - Premium iPhone Simulator
    <div className={`relative w-full h-full flex justify-center items-center p-0 md:p-8 bg-gradient-to-br from-gray-100 to-gray-200 ${appState.isDarkMode ? 'dark' : ''}`}>
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={4000}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Phone Chassis - Apple Premium */}
      <div className="relative w-full h-full md:max-w-[400px] md:max-h-[850px] bg-white md:rounded-[56px] md:shadow-[0_0_0_12px_rgba(0,0,0,0.9),0_0_0_14px_rgba(100,100,100,0.3),0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 isolate md:ring-1 md:ring-black/5">
        
        {/* Dynamic Island (Desktop Only) - Refined Proportions */}
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-[130px] h-[32px] bg-black rounded-b-[24px] z-50 pointer-events-none shadow-xl"></div>
        
        {renderContent()}

        {/* Home Indicator - Apple Precision */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1 bg-gray-900/30 rounded-full pointer-events-none z-50"></div>
      </div>

    </div>
  );
}
