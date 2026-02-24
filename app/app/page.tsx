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
import { Menu, Sparkles, Download, Clock, BookOpen } from 'lucide-react';

function getAppCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    
    /* ── Light Theme (default) ──────────────────────────── */
    [data-app-theme="light"], :root {
      --app-bg: #FAFAF7;
      --app-bg-alt: #F3F2EE;
      --app-sf: #FFFFFF;
      --app-sf2: #F0EFE9;
      --app-bd: rgba(0,0,0,0.08);
      --app-bd-med: rgba(0,0,0,0.13);
      --app-t1: #0F0E0C;
      --app-t2: #5B5955;
      --app-t3: #9C9990;
      --app-gold: #B8900A;
      --app-gold-b: #D4A830;
      --app-gold-dim: rgba(184,144,10,0.1);
      --app-gold-brd: rgba(184,144,10,0.22);
      --app-emerald: #047857;
      --app-em-dim: rgba(4,120,87,0.08);
      --app-em-brd: rgba(4,120,87,0.18);
      --app-purple: #6D28D9;
      --app-pu-dim: rgba(109,40,217,0.08);
      --app-pu-brd: rgba(109,40,217,0.18);
      --app-amber: #B45309;
    }
    
    /* ── Dark Theme ─────────────────────────────────────── */
    [data-app-theme="dark"] {
      --app-bg: #07080F;
      --app-bg-alt: #0C0D1A;
      --app-sf: #111320;
      --app-sf2: #181A2C;
      --app-bd: rgba(255,255,255,0.07);
      --app-bd-med: rgba(255,255,255,0.12);
      --app-t1: #EDE8DC;
      --app-t2: #8A93AE;
      --app-t3: #424B64;
      --app-gold: #D4A853;
      --app-gold-b: #F0C060;
      --app-gold-dim: rgba(212,168,83,0.12);
      --app-gold-brd: rgba(212,168,83,0.22);
      --app-emerald: #34D399;
      --app-em-dim: rgba(52,211,153,0.12);
      --app-em-brd: rgba(52,211,153,0.22);
      --app-purple: #A78BFA;
      --app-pu-dim: rgba(167,139,250,0.12);
      --app-pu-brd: rgba(167,139,250,0.22);
      --app-amber: #F59E0B;
    }

    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    .app-header { background: var(--app-sf); border-bottom: 1px solid var(--app-bd); }
    .app-header.dark { background: var(--app-sf); }
    .app-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 700; color: var(--app-t1); }
    .app-greeting { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 700; color: var(--app-t1); line-height: 1.1; }
    .app-subtext { font-size: 15px; font-weight: 400; color: var(--app-t2); }
    .app-card { background: var(--app-sf); border: 1px solid var(--app-bd); border-radius: 18px; padding: 24px; transition: all 0.25s ease; }
    .app-card:hover { border-color: var(--app-gold-brd); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
    .app-card.dark { background: var(--app-sf); }
    .app-card-label { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--app-t3); }
    .app-card-value { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 48px; font-weight: 700; color: var(--app-t1); line-height: 1; }
    .app-card-sublabel { font-size: 13px; font-weight: 500; color: var(--app-t2); margin-top: 4px; }
    .app-progress-bar { height: 6px; background: var(--app-bd); border-radius: 3px; overflow: hidden; }
    .app-progress-fill { height: 100%; background: linear-gradient(90deg, var(--app-gold-b), var(--app-gold)); border-radius: 3px; transition: width 0.6s ease-out; }
    .app-btn-primary { background: linear-gradient(135deg, var(--app-gold-b), var(--app-gold)); color: #0A0800; border: none; border-radius: 12px; padding: 14px 28px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s ease; }
    .app-btn-primary:hover { transform: scale(1.03); filter: brightness(1.08); box-shadow: 0 8px 24px rgba(184,144,10,0.3); }
    .app-btn-secondary { background: var(--app-sf2); border: 1px solid var(--app-bd-med); color: var(--app-t1); border-radius: 12px; padding: 12px 20px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
    .app-btn-secondary:hover { border-color: var(--app-gold-brd); background: var(--app-bg-alt); }
    .app-infobox { background: var(--app-gold-dim); border: 1px solid var(--app-gold-brd); border-radius: 14px; padding: 16px; }
    .app-infobox-title { font-weight: 600; font-size: 13px; color: var(--app-t1); margin-bottom: 6px; }
    .app-infobox-text { font-size: 12px; line-height: 1.6; color: var(--app-t2); }
    .app-nav-bottom { background: var(--app-sf); border-top: 1px solid var(--app-bd); }
    .app-nav-btn { padding: 12px 16px; border-radius: 12px; border: none; background: var(--app-sf2); color: var(--app-t2); font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
    .app-nav-btn.active { background: linear-gradient(135deg, var(--app-purple), var(--app-purple)); color: white; }
    .app-nav-btn:hover:not(.active) { background: var(--app-bg-alt); color: var(--app-t1); }
  `;
}

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
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [bannerWasDismissed, setBannerWasDismissed] = useState(false);
  
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

  // Android Intent + Modal Overlay flow
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent;
    const isAndroid = /android/i.test(ua);
    const isWebView = /wv/.test(ua) || /Version\/[\d.]+.*Chrome\/[\d.]+ Mobile/.test(ua);
    const shouldRedirect = isAndroid && !isWebView;

    if (!shouldRedirect) return;

    const intentUrl = 'intent://ramadanbot.app/app#Intent;scheme=https;package=app.ramadanbot.twa;end';
    const playUrl = 'https://play.google.com/store/apps/details?id=app.ramadanbot.twa';

    // Try opening the app via intent URL
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = intentUrl;
      document.body.appendChild(iframe);
      setTimeout(() => iframe.remove(), 1000);
    } catch (e) {
      // ignore
    }

    // Show modal immediately
    setShowInstallBanner(true);

    // After 8s, if modal still open, hard-redirect to Play Store
    const redirectTimer = window.setTimeout(() => {
      if (document.querySelector('[data-android-modal]')) {
        window.location.href = playUrl;
      }
    }, 8000);

    return () => clearTimeout(redirectTimer);
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
        <div className="flex flex-col h-full" style={{ backgroundColor: `var(--app-bg)`, color: `var(--app-t1)` }} data-app-theme={appState.isDarkMode ? 'dark' : 'light'}>
            <style dangerouslySetInnerHTML={{ __html: getAppCSS() }} />
            
            {/* Gamified Quran Reader Modal */}
            {activeTab === 'quran' && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm pointer-events-auto">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-6">
                  <div className="space-y-3">
                    <h2 className="app-greeting" style={{ fontSize: '28px' }}>Qur'ān Journey</h2>
                    <p className="app-subtext" style={{ fontSize: '16px', fontWeight: '600', color: `var(--app-gold)` }}>29 Days • 145 Phases</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="app-subtext">📖 <span style={{ fontWeight: '500' }}>5–10 minutes after each prayer</span></p>
                    <p className="app-subtext" style={{ fontSize: '14px' }}>Complete the entire Qur'ān in Ramadan with daily short sessions designed to fit your prayer routine.</p>
                  </div>
                  
                  <button 
                    onClick={() => router.push('/quran')}
                    className="app-btn-primary w-full"
                  >
                    Begin Your Journey →
                  </button>
                </div>
              </div>
            )}

            <Sidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={appState.currentUser!}
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

            {/* ⭐ Enhanced Premium Header with Brilliant Design */}
            <header className="app-header flex-shrink-0 sticky top-0 z-40" style={{
                background: `linear-gradient(180deg, color-mix(in srgb, var(--app-sf) 98%, transparent) 0%, color-mix(in srgb, var(--app-sf) 85%, transparent) 100%)`,
                borderBottom: `1px solid ${`color-mix(in srgb, var(--app-bd) 35%, transparent)`}`,
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                padding: '0 16px',
                minHeight: '72px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
                    {/* Left Section - Menu + Profile */}
                    <div className="flex items-center gap-3">
                        {/* Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex items-center justify-center transition-all duration-300 hover:scale-105"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                backgroundColor: `color-mix(in srgb, var(--app-gold-dim) 1, transparent)`,
                                border: `1px solid ${`color-mix(in srgb, var(--app-bd) 25%, transparent)`}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            aria-label="Open Menu"
                            title="Menu"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--app-gold-dim) 8, transparent)`;
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(184,144,10,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--app-gold-dim) 1, transparent)`;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <Menu size={20} color={`var(--app-t1)`} strokeWidth={1.8} />
                        </button>

                        {/* Profile Info Card */}
                        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5" style={{
                            backgroundColor: `color-mix(in srgb, var(--app-gold-dim) 3, transparent)`,
                            border: `1px solid ${`color-mix(in srgb, var(--app-gold-brd) 15%, transparent)`}`,
                            borderRadius: '12px'
                        }}>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm" style={{
                                background: `linear-gradient(135deg, var(--app-gold-b), var(--app-gold))`,
                                color: '#0A0800'
                            }}>
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p style={{ fontSize: '12px', fontWeight: '600', color: `var(--app-t1)`, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {user?.name?.split(' ')[0]}
                                </p>
                                <p style={{ fontSize: '11px', color: `var(--app-t3)`, margin: 0, marginTop: '2px' }}>Ready</p>
                            </div>
                        </div>
                    </div>

                    {/* Center - Branding */}
                    <div className="flex-1 flex justify-center px-4">
                        <h1 className="app-title" style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            letterSpacing: '-0.5px',
                            background: `linear-gradient(135deg, #D4A830 0%, var(--app-gold) 50%, var(--app-t1) 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap'
                        }}>
                            🌙 RamadanBot
                        </h1>
                    </div>

                    {/* Right Section - Quick Stats */}
                    <div className="hidden sm:flex items-center gap-2">
                        {/* Streak Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5" style={{
                            backgroundColor: `color-mix(in srgb, #FFA500 10%, transparent)`,
                            border: `1px solid ${`color-mix(in srgb, #FFA500 20%, transparent)`}`,
                            borderRadius: '10px'
                        }}>
                            <span style={{ fontSize: '12px' }}>🔥</span>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: `var(--app-t1)` }}>{user?.streak || 0}</span>
                        </div>

                        {/* Daily Limit Badge - Real-time from API */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5" style={{
                            backgroundColor: `color-mix(in srgb, var(--app-emerald) 10%, transparent)`,
                            border: `1px solid ${`color-mix(in srgb, var(--app-emerald) 20%, transparent)`}`,
                            borderRadius: '10px'
                        }}>
                            <span style={{ fontSize: '12px' }}>✨</span>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: `var(--app-t1)` }}>{typeof user.remaining !== 'undefined' ? user.remaining : (user.rate_limit_override || 3)}</span>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => {
                                const newDarkMode = !appState.isDarkMode;
                                setAppState(prev => ({ ...prev, isDarkMode: newDarkMode }));
                                if (newDarkMode) {
                                    document.documentElement.classList.add('dark');
                                    localStorage.theme = 'dark';
                                } else {
                                    document.documentElement.classList.remove('dark');
                                    localStorage.theme = 'light';
                                }
                            }}
                            className="flex items-center justify-center transition-all duration-300 hover:scale-110"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                backgroundColor: `color-mix(in srgb, var(--app-sf2) 70%, transparent)`,
                                border: `1px solid ${`color-mix(in srgb, var(--app-bd) 25%, transparent)`}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            aria-label="Toggle dark mode"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--app-sf2) 85%, transparent)`;
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--app-sf2) 70%, transparent)`;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>{appState.isDarkMode ? '☀️' : '🌙'}</span>
                        </button>
                    </div>

                    {/* Mobile Right Spacer */}
                    <div className="sm:hidden" style={{ width: '40px', height: '40px' }} />
                </div>
            </header>

            {/* Main Content Area - Scrollable */}
            <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="px-5 py-6 space-y-6 pb-28 max-w-2xl mx-auto">
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
                                    {/* Greeting */}
                                    <div className="space-y-2">
                                        <h2 className="app-greeting">{user.name.split(' ')[0]}'s Reflection</h2>
                                        <p className="app-subtext">Ready for today's spiritual journey?</p>
                                    </div>

                                    {/* Form Section */}
                                    <div className="app-card">
                                        <RamadanForm 
                                            onSuccess={handleSuccess} 
                                            initialName={user.name} 
                                            userId={user.id}
                                            disabled={hasDownloadedToday}
                                            countdownTime={countdownTime}
                                            hasLimitReached={hasDownloadedToday}
                                        />
                                    </div>

                                    {/* Premium Cards Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                      {/* Streak Card */}
                                      <div className="app-card" style={{ backgroundColor: `var(--app-gold-dim)`, borderColor: `var(--app-gold-brd)` }}>
                                        <div className="space-y-3">
                                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `var(--app-gold-dim)` }}>
                                            🔥
                                          </div>
                                          <div>
                                            <p className="app-card-label">Streak</p>
                                            <p className="app-card-value">{user.streak}</p>
                                            <p className="app-card-sublabel">day{user.streak !== 1 ? 's' : ''} on fire</p>
                                          </div>
                                          <div className="pt-2">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="app-card-label" style={{ color: `var(--app-t3)` }}>Goal Progress</span>
                                              <span style={{ fontSize: '12px', fontWeight: '700', color: `var(--app-t1)` }}>{Math.min(100, Math.round((user.streak/30)*100))}%</span>
                                            </div>
                                            <div className="app-progress-bar">
                                              <div 
                                                className="app-progress-fill" 
                                                style={{ width: `${Math.min(100, Math.round((user.streak/30)*100))}%` }} 
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Daily Limit Card */}
                                      <div className="app-card" style={{ backgroundColor: `var(--app-em-dim)`, borderColor: `var(--app-em-brd)` }}>
                                        <div className="space-y-3">
                                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `var(--app-em-dim)` }}>
                                            ✨
                                          </div>
                                          <div>
                                            <p className="app-card-label">Daily Limit</p>
                                            <p className="app-card-value">{typeof user.remaining !== 'undefined' ? user.remaining : (user.rate_limit_override || 3)}</p>
                                            <p className="app-card-sublabel">generation{(user.remaining || 3) !== 1 ? 's' : ''} left</p>
                                          </div>
                                          <div className="pt-2">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="app-card-label" style={{ color: `var(--app-t3)` }}>Daily Usage</span>
                                              <span style={{ fontSize: '12px', fontWeight: '700', color: `var(--app-t1)` }}>{Math.round(((user.limit || user.rate_limit_override || 3) - (user.today_generations||0))/ (user.limit || user.rate_limit_override || 3) * 100)}%</span>
                                            </div>
                                            <div className="app-progress-bar">
                                              <div 
                                                className="app-progress-fill" 
                                                style={{ 
                                                  background: `linear-gradient(90deg, var(--app-emerald), var(--app-emerald))`,
                                                  width: `${Math.round(((user.limit || user.rate_limit_override || 3) - (user.today_generations||0))/ (user.limit || user.rate_limit_override || 3) * 100)}%` 
                                                }} 
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Tips Box */}
                                    <div className="app-infobox">
                                        <p className="app-infobox-title">💡 Daily Reflection Tips</p>
                                        <p className="app-infobox-text">
                                            Choose a topic that resonates with your spiritual journey. Add specific verses or Hadith for more personalized content.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="app-nav-bottom fixed bottom-0 left-0 right-0 flex-shrink-0 px-5 py-3 z-40" style={{ backgroundColor: `var(--app-sf)`, borderColor: `var(--app-bd)` }}>
              <div className="flex gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => setActiveTab('flyer')}
                  className={`app-nav-btn flex-1 flex items-center justify-center gap-2 ${activeTab === 'flyer' ? 'active' : ''}`}
                >
                  <Sparkles size={18} />
                  <span>Flyer</span>
                </button>
                <button
                  onClick={() => setActiveTab('quran')}
                  className={`app-nav-btn flex-1 flex items-center justify-center gap-2 ${activeTab === 'quran' ? 'active' : ''}`}
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
    <div className={`relative w-full h-full flex justify-center items-center p-0 md:p-8`} data-app-theme={appState.isDarkMode ? 'dark' : 'light'}>
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
      
      <div className="relative w-full h-full md:max-w-[400px] md:max-h-[850px] overflow-hidden transition-colors duration-300 isolate md:rounded-[48px]" style={{ backgroundColor: `var(--app-bg)` }}>
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-[126px] h-[30px] bg-black rounded-b-[20px] z-50 pointer-events-none shadow-lg"></div>
        {isHydrated ? renderContent() : <LoginScreen onLogin={handleLogin} />}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1.5 bg-black/30 dark:bg-white/30 rounded-full pointer-events-none z-50"></div>

        {showInstallBanner && (
          <div data-android-modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm">
            <div className="rounded-3xl shadow-2xl flex flex-col items-center gap-6 p-8 max-w-sm mx-4 app-card">
              <div className="text-center space-y-2">
                <h2 className="app-greeting" style={{ fontSize: '24px' }}>Get RamadanBot App</h2>
                <p className="app-subtext">Install from Google Play for the best experience</p>
              </div>
              
              <a
                href="https://play.google.com/store/apps/details?id=app.ramadanbot.twa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
                onClick={() => setShowInstallBanner(false)}
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-16 w-auto mx-auto"
                />
              </a>

              <button
                className="app-btn-secondary w-full"
                onClick={() => setShowInstallBanner(false)}
              >
                Continue in Browser
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
