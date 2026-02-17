'use client';

import React, { useState, useEffect } from 'react';
import { User, GeneratedData, AppState } from '../../types';
import RamadanForm from '../../components/RamadanForm';
import FlyerPreview from '../../components/FlyerPreview';
import LoginScreen from '../../components/LoginScreen';
import AdminDashboard from '../../components/AdminDashboardEnhanced';
import Sidebar from '../../components/Sidebar';
import SettingsScreen from '../../components/SettingsScreen';
import { useRouter } from 'next/navigation';
import Toast from '../../components/Toast';
import BroadcastToast from '../../components/BroadcastToast';
import { Menu, Sparkles, Download, Clock, BookOpen, Moon, Sun } from 'lucide-react';

interface BroadcastMessage {
  id: string;
  message: string;
  action_text?: string;
  action_url?: string;
  created_at: string;
}

export default function HomeApp() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>({ 
    view: 'login', 
    currentUser: null, 
    isDarkMode: false 
  });
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'flyer' | 'quran'>('flyer');
  const [downloadedFlyerUrl, setDownloadedFlyerUrl] = useState<string | null>(null);
  const [hasDownloadedToday, setHasDownloadedToday] = useState(false);
  const [countdownTime, setCountdownTime] = useState<string>('00:00:00');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [broadcastMessages, setBroadcastMessages] = useState<BroadcastMessage[]>([]);
  
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

  // Load completed Quran phases on app initialization
  useEffect(() => {
    if (!appState.currentUser?.id) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/user?id=${appState.currentUser!.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.user) {
            const hasChanges = 
              json.user.streak !== appState.currentUser?.streak ||
              json.user.remaining !== appState.currentUser?.remaining ||
              json.user.generation_count !== appState.currentUser?.generation_count;
            
            if (hasChanges) {
              setAppState(prev => ({ ...prev, currentUser: json.user }));
              try {
                localStorage.setItem('ramadanbot_user', JSON.stringify(json.user));
              } catch (e) {
                console.error('Failed to update user session:', e);
              }
            }
          }
        }
      } catch (error) {
        // Silent fail - polling is non-critical
      }
    }, 30000); // Poll every 30 seconds instead of 5 - 6x reduction

    return () => clearInterval(pollInterval);
  }, [appState.currentUser?.id]);

  // Fetch broadcast messages for display
  useEffect(() => {
    if (appState.view !== 'app') return;

    const fetchBroadcastMessages = async () => {
      try {
        const res = await fetch('/api/broadcast/active');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.messages)) {
            setBroadcastMessages(data.messages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch broadcast messages:', error);
      }
    };

    fetchBroadcastMessages();

    // Poll for new messages every 30 seconds
    const pollInterval = setInterval(fetchBroadcastMessages, 30000);

    return () => clearInterval(pollInterval);
  }, [appState.view]);

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
            {/* Gamified Quran Reader */}
            {activeTab === 'quran' && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 dark:bg-black/80 pointer-events-auto" onClick={() => {}}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl">
                  <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Qur'ān Journey</h2>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">29 Days • 145 Phases</p>
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      📖 <span className="font-medium">5–10 minutes after each prayer</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Complete the entire Qur'ān in Ramadan with daily short sessions designed to fit your prayer routine.
                    </p>
                  </div>
                  <button 
                    onClick={() => router.push('/quran')}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
                  >
                    Begin Your Journey →
                  </button>
                </div>
              </div>
            )}

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

            {/* Header - Polished Apple Style */}
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
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                            🌙 RamadanBot
                        </h1>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                        aria-label="Toggle Theme"
                    >
                        {appState.isDarkMode ? (
                            <Sun size={20} className="text-yellow-500" />
                        ) : (
                            <Moon size={20} className="text-gray-600" />
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content Area - Scrollable on Short Displays */}
            <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="px-5 py-6 space-y-6 pb-28">
                    {activeTab === 'flyer' ? (
                        <>
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
                        </>
                    ) : null}
                </div>
            </main>

            {/* Bottom Navigation - Fixed and Always Visible */}
            <nav className="fixed bottom-0 left-0 right-0 flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-5 py-3 md:max-w-[400px] md:left-1/2 md:-translate-x-1/2 md:rounded-t-3xl z-40">
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('flyer')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === 'flyer'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Sparkles size={18} />
                  <span>Flyer</span>
                </button>
                <button
                  onClick={() => setActiveTab('quran')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === 'quran'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <BookOpen size={18} />
                  <span>Quran</span>
                </button>
              </div>
            </nav>
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
      
      <BroadcastToast 
        messages={broadcastMessages}
        onDismiss={(id) => {
          setBroadcastMessages(prev => prev.filter(m => m.id !== id));
        }}
      />
      
      <div className="relative w-full h-full md:max-w-[400px] md:max-h-[850px] bg-white dark:bg-black md:rounded-[48px] md:shadow-[0_0_0_14px_#1f2937,0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300 isolate">
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-[126px] h-[30px] bg-black rounded-b-[20px] z-50 pointer-events-none shadow-lg"></div>
        {isHydrated ? renderContent() : <LoginScreen onLogin={handleLogin} />}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1.5 bg-black/30 dark:bg-white/30 rounded-full pointer-events-none z-50"></div>
      </div>
    </div>
  );
}
