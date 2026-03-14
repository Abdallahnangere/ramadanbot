'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, GeneratedData, AppState } from '../../types';
import RamadanForm from '../../components/RamadanForm';
import FlyerPreview from '../../components/FlyerPreview';
import LoginScreen from '../../components/LoginScreen';
import AdminDashboard from '../../components/AdminDashboardEnhanced';
import SettingsScreen from '../../components/SettingsScreen';
import { useRouter } from 'next/navigation';
import Toast from '../../components/Toast';
import BroadcastToast from '../../components/BroadcastToast';
import { Menu, Sparkles, Download, Clock, BookOpen, LogOut, Settings, Shield, ChevronRight, Check, Flame, MoreVertical, X, ChevronDown, Home, User as UserIcon } from 'lucide-react';

/**
 * ═════════════════════════════════════════════════════════════════
 * APPLE-GRADE DESIGN SYSTEM
 * ═════════════════════════════════════════════════════════════════
 */
function getAppleDesignSystem() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    :root {
      --sys-bg-primary: #FFFFFF;
      --sys-bg-secondary: #F2F2F7;
      --sys-surface-primary: #FFFFFF;
      --sys-surface-secondary: #F5F5F7;
      --sys-text-primary: #000000;
      --sys-text-secondary: rgba(0, 0, 0, 0.55);
      --sys-text-tertiary: rgba(0, 0, 0, 0.30);
      --sys-border-primary: rgba(0, 0, 0, 0.08);
      --sys-accent-primary: #007AFF;
      --sys-gold: #CF9500;
      --sys-success: #34C759;
      --font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
    }

    [data-theme="dark"] {
      --sys-bg-primary: #000000;
      --sys-bg-secondary: #0F0F0F;
      --sys-surface-primary: #1C1C1E;
      --sys-surface-secondary: #2C2C2E;
      --sys-text-primary: #FFFFFF;
      --sys-text-secondary: rgba(255, 255, 255, 0.55);
      --sys-text-tertiary: rgba(255, 255, 255, 0.30);
      --sys-border-primary: rgba(255, 255, 255, 0.08);
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background: var(--sys-bg-primary);
      color: var(--sys-text-primary);
      -webkit-font-smoothing: antialiased;
    }

    /* Typography Scale */
    .sys-display { font-size: 34px; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; }
    .sys-title { font-size: 22px; font-weight: 600; line-height: 1.3; }
    .sys-body { font-size: 17px; font-weight: 400; line-height: 1.5; }
    .sys-subhead { font-size: 15px; font-weight: 400; line-height: 1.4; }
    .sys-caption { font-size: 13px; font-weight: 400; color: var(--sys-text-secondary); }

    /* Components */
    .sys-card {
      background: var(--sys-surface-primary);
      border: 1px solid var(--sys-border-primary);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06);
      transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sys-btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 0 24px;
      background: var(--sys-accent-primary);
      color: #FFFFFF;
      border: none;
      border-radius: 9999px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: var(--font-family);
    }

    .sys-btn-primary:active {
      transform: scale(0.97);
    }

    .sys-input {
      width: 100%;
      min-height: 44px;
      padding: 12px 16px;
      background: var(--sys-surface-secondary);
      border: 1px solid var(--sys-border-primary);
      border-radius: 10px;
      font-size: 16px;
      font-family: var(--font-family);
      color: var(--sys-text-primary);
    }

    .sys-input:focus {
      outline: 2px solid var(--sys-accent-primary);
      outline-offset: 2px;
    }

    .sys-glass {
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }

    [data-theme="dark"] .sys-glass {
      background: rgba(28, 28, 30, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Layout */
    .app-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      grid-template-rows: 64px 1fr;
      height: 100vh;
      width: 100%;
    }

    .app-sidebar {
      grid-column: 1;
      grid-row: 1 / -1;
      background: var(--sys-surface-primary);
      border-right: 1px solid var(--sys-border-primary);
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .app-topnav {
      grid-column: 2;
      grid-row: 1;
      background: var(--sys-surface-primary);
      border-bottom: 1px solid var(--sys-border-primary);
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .app-main {
      grid-column: 2;
      grid-row: 2;
      overflow-y: auto;
      padding: 32px 24px;
    }

    @media (max-width: 1024px) {
      .app-layout { grid-template-columns: 1fr; }
      .app-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 260px;
        height: 100vh;
        z-index: 50;
        transform: translateX(-100%);
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .app-sidebar.open { transform: translateX(0); }
      .app-topnav { grid-column: 1 / -1; }
      .app-main { grid-column: 1 / -1; }
    }

    /* Sidebar Navigation */
    .sidebar-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 15px;
      color: var(--sys-text-secondary);
      border: none;
      background: none;
      cursor: pointer;
      transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      text-align: left;
    }

    .sidebar-item:hover {
      color: var(--sys-text-primary);
      background: var(--sys-bg-secondary);
    }

    .sidebar-item.active {
      background: rgba(0, 122, 255, 0.10);
      color: var(--sys-accent-primary);
      font-weight: 600;
    }

    /* Avatar */
    .sys-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--sys-accent-primary);
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      flex-shrink: 0;
    }

    /* Dropdown Menu */
    .dropdown-menu {
      position: fixed;
      background: var(--sys-glass);
      border: 1px solid var(--sys-border-primary);
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 12px 40px rgba(0, 0, 0, 0.10);
      z-index: 200;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--sys-text-primary);
      font-size: 15px;
      width: 100%;
      text-align: left;
      transition: all 120ms ease;
    }

    .dropdown-item:hover {
      background: rgba(0, 122, 255, 0.08);
      color: var(--sys-accent-primary);
    }
  `;
}

interface BroadcastMessage {
  id: string;
  message: string;
  action_text?: string;
  action_url?: string;
  created_at: string;
}

/**
 * ═════════════════════════════════════════════════════════════════
 * MAIN APP COMPONENT
 * ═════════════════════════════════════════════════════════════════
 */
export default function AppPage() {
  const router = useRouter();
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // ─── State Management ───
  const [appState, setAppState] = useState<AppState>({
    view: 'login',
    currentUser: null,
    isDarkMode: false
  });
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [broadcastMessages, setBroadcastMessages] = useState<BroadcastMessage[]>([]);
  const [downloadedFlyerUrl, setDownloadedFlyerUrl] = useState<string | null>(null);
  const [hasDownloadedToday, setHasDownloadedToday] = useState(false);

  // ─── Initialize App & Hydration ───
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Restore theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setAppState(prev => ({ ...prev, isDarkMode: true }));
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Restore persistent login
    try {
      const savedUser = localStorage.getItem('ramadanbot_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setAppState(prev => ({ ...prev, view: 'app', currentUser: user }));
      }
    } catch (e) {
      console.error('Failed to restore user:', e);
    }

    setIsHydrated(true);
  }, []);

  // ─── Poll User Data ───
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
              json.user.remaining !== appState.currentUser?.remaining;

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
        console.error('Poll error:', error);
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [appState.currentUser?.id]);

  // ─── Fetch Broadcast Messages ───
  useEffect(() => {
    if (appState.view !== 'app') return;

    const fetchMessages = async () => {
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

    fetchMessages();
    const pollInterval = setInterval(fetchMessages, 30000);

    return () => clearInterval(pollInterval);
  }, [appState.view]);

  // ─── Event Handlers ───
  const handleLogin = (user: User) => {
    try {
      localStorage.setItem('ramadanbot_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user session:', e);
    }
    setAppState(prev => ({ ...prev, view: 'app', currentUser: user }));
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ramadanbot_user');
    } catch (e) {
      console.error('Failed to clear user session:', e);
    }
    setAppState(prev => ({ ...prev, view: 'login', currentUser: null }));
    setGeneratedData(null);
    setSidebarOpen(false);
    setAvatarDropdownOpen(false);
  };

  const toggleTheme = () => {
    setAppState(prev => {
      const newMode = !prev.isDarkMode;
      if (newMode) {
        localStorage.theme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        localStorage.theme = 'light';
        document.documentElement.setAttribute('data-theme', 'light');
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
      try {
        localStorage.setItem('ramadanbot_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to update user session:', e);
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
          try {
            localStorage.setItem('ramadanbot_user', JSON.stringify(json.user));
          } catch (e) {
            console.error('Failed to update user session:', e);
          }

          const usedToday = json.user.today_generations || 0;
          const limit = json.user.limit || json.user.rate_limit_override || 3;
          if (usedToday >= limit && json.user.role !== 'admin') {
            setHasDownloadedToday(true);
            setToast({ type: 'warning', message: 'Daily limit reached. Next generation available in 24 hours.' });
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

  // ─── Render Content ───
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
      return (
        <SettingsScreen
          onBack={() => setAppState(prev => ({ ...prev, view: 'app' }))}
          isDarkMode={appState.isDarkMode}
          toggleTheme={toggleTheme}
          user={appState.currentUser!}
          onLogout={handleLogout}
        />
      );
    }

    const user = appState.currentUser!;

    // ─── Main App View ───
    return (
      <div className="app-layout" data-theme={appState.isDarkMode ? 'dark' : 'light'}>
        <style dangerouslySetInnerHTML={{ __html: getAppleDesignSystem() }} />

        {/* Background overlay for sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── SIDEBAR ─── */}
        <nav className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, marginBottom: '8px' }}>🌙 RamadanBot</h2>
            <p style={{ fontSize: '13px', color: 'var(--sys-text-secondary)', margin: 0 }}>Daily spiritual growth</p>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <button
              className="sidebar-item active"
              onClick={() => setSidebarOpen(false)}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            <button
              className="sidebar-item"
              onClick={() => router.push('/quran')}
            >
              <BookOpen size={20} />
              <span>Qur'ān Reader</span>
            </button>
            <button
              className="sidebar-item"
              onClick={() => router.push('/prayer')}
            >
              <Clock size={20} />
              <span>Prayer Times</span>
            </button>
          </div>

          {/* Footer */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--sys-border-primary)' }}>
            {user.role === 'admin' && (
              <button
                className="sidebar-item"
                onClick={() => {
                  setAppState(prev => ({ ...prev, view: 'admin' }));
                  setSidebarOpen(false);
                }}
              >
                <Shield size={20} />
                <span>Admin Panel</span>
              </button>
            )}
            <button
              className="sidebar-item"
              onClick={() => {
                setAppState(prev => ({ ...prev, view: 'settings' }));
                setSidebarOpen(false);
              }}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* ─── TOP NAVIGATION ─── */}
        <header className="app-topnav">
          {/* Left: Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
            style={{
              width: '44px',
              height: '44px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sys-text-primary)',
            }}
            aria-label="Toggle Menu"
          >
            <Menu size={20} />
          </button>

          {/* Center: Title */}
          <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0, flex: 1, textAlign: 'center' }}>Dashboard</h1>

          {/* Right: Avatar with Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              ref={avatarRef}
              className="sys-avatar"
              onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
              title="Account menu"
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>

            {/* Avatar Dropdown Menu */}
            {avatarDropdownOpen && (
              <div
                className="dropdown-menu"
                style={{
                  top: avatarRef.current ? avatarRef.current.getBoundingClientRect().bottom + 8 : 0,
                  right: 0,
                  minWidth: '200px',
                }}
              >
                <div style={{ padding: '8px' }}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setAppState(prev => ({ ...prev, view: 'settings' }));
                      setAvatarDropdownOpen(false);
                    }}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      handleLogout();
                      setAvatarDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ─── MAIN CONTENT ─── */}
        <main className="app-main">
          {generatedData ? (
            // ─── Generated Output View ───
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <FlyerPreview
                message={generatedData.text}
                formData={generatedData.formData}
                user={user}
                onReset={() => setGeneratedData(null)}
                onDownloaded={handleFlyerDownloaded}
              />
            </div>
          ) : (
            // ─── Dashboard Home ───
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* Hero Greeting */}
              <div style={{ marginBottom: '40px' }}>
                <h1 className="sys-display" style={{ marginBottom: '8px' }}>
                  Good morning, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="sys-subhead" style={{ color: 'var(--sys-text-secondary)', margin: 0 }}>
                  Your daily spiritual companion for Ramadan
                </p>
              </div>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Streak Card */}
                <div className="sys-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px' }}>🔥</span>
                  </div>
                  <div style={{ fontSize: '34px', fontWeight: '700', marginBottom: '4px' }}>
                    {user?.streak || 0}
                  </div>
                  <p className="sys-caption" style={{ margin: 0 }}>Day Streak</p>
                </div>

                {/* Generations Card */}
                <div className="sys-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px' }}>✨</span>
                  </div>
                  <div style={{ fontSize: '34px', fontWeight: '700', marginBottom: '4px' }}>
                    {typeof user?.remaining !== 'undefined' ? user.remaining : (user?.rate_limit_override || 3)}
                  </div>
                  <p className="sys-caption" style={{ margin: 0 }}>Generations Left</p>
                </div>

                {/* Total Generated Card */}
                <div className="sys-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px' }}>📊</span>
                  </div>
                  <div style={{ fontSize: '34px', fontWeight: '700', marginBottom: '4px' }}>
                    {user?.generation_count || 0}
                  </div>
                  <p className="sys-caption" style={{ margin: 0 }}>Total Generated</p>
                </div>
              </div>

              {/* Main Form */}
              <RamadanForm
                onSuccess={handleSuccess}
                initialName={user?.name || ''}
                userId={user?.id || ''}
                hasLimitReached={hasDownloadedToday}
              />
            </div>
          )}
        </main>

        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Broadcast Messages */}
        {broadcastMessages.length > 0 && (
          <BroadcastToast
            messages={broadcastMessages}
          />
        )}
      </div>
    );
  };

  if (!isHydrated) {
    return null;
  }

  return renderContent();
}
