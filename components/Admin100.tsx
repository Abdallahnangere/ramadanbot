'use client';

import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { 
  fetchAllUsers, updateUserLimit, toggleUserBan, getAnalytics, adminLogin, 
  deleteUser, updateUserName, resetAllStreaks, getEnhancedAnalytics, 
  resetAllQuranProgress 
} from '../app/actions';
import { 
  LogOut, Menu, X, BarChart3, Users, Send, Search, ArrowUpDown, 
  CheckCircle, AlertCircle, Loader2, Eye, EyeOff, Trash2, Edit2, Ban, Shield
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface AdminProps {
  onBack: () => void;
}

type TabType = 'dashboard' | 'users' | 'broadcasts';
type SortField = 'name' | 'created_at' | 'streak' | 'generation_count';
type SortDir = 'asc' | 'desc';

const colors = {
  primary: '#1f2937',
  secondary: '#f59e0b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  background: '#f3f4f6',
  surface: '#ffffff',
  border: '#e5e7eb',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af'
};

const Admin100: React.FC<AdminProps> = ({ onBack }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastActionText, setBroadcastActionText] = useState('');
  const [broadcastActionUrl, setBroadcastActionUrl] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLimit, setEditLimit] = useState(3);

  const USERS_PER_PAGE = 50;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await adminLogin(password);
      if (res.success) {
        setAuthenticated(true);
        loadAllData();
      } else {
        alert('Invalid password');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usersData, analyticsData] = await Promise.all([
        fetchAllUsers(),
        getEnhancedAnalytics()
      ]);
      setUsers(usersData);
      setAnalytics(analyticsData);
      loadBroadcasts();
    } catch (error) {
      console.error('Load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBroadcasts = async () => {
    try {
      const res = await fetch('/api/broadcast/active');
      if (res.ok) {
        const data = await res.json();
        setBroadcasts(data.messages || []);
      }
    } catch (error) {
      console.error('Load broadcasts failed:', error);
    }
  };

  const filteredAndSorted = users
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      
      if (sortField === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (sortField === 'created_at') {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      } else if (sortField === 'streak') {
        aVal = a.streak;
        bVal = b.streak;
      } else if (sortField === 'generation_count') {
        aVal = a.generation_count;
        bVal = b.generation_count;
      }

      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  const totalPages = Math.ceil(filteredAndSorted.length / USERS_PER_PAGE);
  const paginatedUsers = filteredAndSorted.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const handleBan = async (id: string, isBanned: boolean) => {
    await toggleUserBan(id, !isBanned);
    loadAllData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? All data will be removed.`)) return;
    const result = await deleteUser(id);
    if (result.success) {
      alert('User deleted');
      loadAllData();
    }
  };

  const handleSaveUser = async (id: string) => {
    if (!editName.trim()) {
      alert('Name required');
      return;
    }
    await updateUserName(id, editName);
    await updateUserLimit(id, editLimit);
    setEditingId(null);
    loadAllData();
  };

  const handleSendBroadcast = async () => {
    if (!broadcastSubject.trim()) {
      alert('Subject required');
      return;
    }
    setBroadcastLoading(true);
    try {
      const res = await fetch('/api/broadcast/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: broadcastMessage.trim() || broadcastSubject.trim(),
          actionText: broadcastActionText.trim() || null,
          actionUrl: broadcastActionUrl.trim() || null
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBroadcastSubject('');
          setBroadcastMessage('');
          setBroadcastActionText('');
          setBroadcastActionUrl('');
          alert('✓ Broadcast sent to all users');
          loadBroadcasts();
        }
      } else {
        const error = await res.json();
        alert(`✗ Failed: ${error.error}`);
      }
    } catch (error) {
      alert('✗ Error sending broadcast');
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    if (!confirm('Delete this broadcast?')) return;
    try {
      const res = await fetch(`/api/broadcast/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadBroadcasts();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // LOGIN SCREEN
  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.primary} 0%, #374151 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌙</div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: '#ffffff' }}>Admin Access</h1>
            <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0 }}>Secure dashboard for RamadanBot</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#e5e7eb', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    color: '#ffffff',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#d1d5db',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{
                padding: '12px 16px',
                background: colors.secondary,
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: authLoading ? 'not-allowed' : 'pointer',
                opacity: authLoading ? 0.6 : 1,
                marginTop: '8px',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              {authLoading ? 'Unlocking...' : 'Unlock Dashboard'}
            </button>

            <button
              type="button"
              onClick={onBack}
              style={{
                padding: '12px 16px',
                background: 'transparent',
                color: '#e5e7eb',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              ← Back to App
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div style={{ minHeight: '100vh', background: colors.background, display: 'flex', fontFamily: 'inherit', color: colors.text }}>
      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        background: colors.primary,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        minHeight: '100vh',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
        left: 0
      }}>
        <div style={{ padding: '24px 20px', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#ffffff' }}>🌙 RamadanBot</h2>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>Admin Dashboard</p>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'broadcasts', label: 'Broadcasts', icon: '📢' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: 'none',
                background: activeTab === item.id ? colors.secondary : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === item.id ? 600 : 500,
                color: activeTab === item.id ? '#1f2937' : 'rgba(255,255,255,0.8)',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: `1px solid rgba(255,255,255,0.1)` }}>
          <button
            onClick={() => { setAuthenticated(false); onBack(); }}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fca5a5',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? '280px' : '0', transition: 'margin 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        {/* TOP BAR */}
        <div style={{
          background: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '8px',
              color: colors.textSecondary,
              transition: 'all 0.2s'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, flex: 1, color: colors.text }}>
            {activeTab === 'dashboard' && '📊 Dashboard'}
            {activeTab === 'users' && '👥 Users'}
            {activeTab === 'broadcasts' && '📢 Broadcasts'}
          </h1>

          <button
            onClick={loadAllData}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: colors.textSecondary,
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {activeTab === 'dashboard' && analytics && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '28px', color: colors.text }}>Analytics Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                  {[
                    { label: 'Total Users', value: analytics.totalUsers, color: colors.info, icon: '👥' },
                    { label: 'Active Today', value: analytics.activeToday || 0, color: colors.success, icon: '🔥' },
                    { label: 'Reflections', value: analytics.totalGenerations, color: colors.secondary, icon: '✨' },
                    { label: 'Avg per User', value: (analytics.avgGenerationsPerUser || 0).toFixed(1), color: '#8b5cf6', icon: '📊' },
                    { label: 'Max Streak', value: analytics.maxStreak || 0, color: '#ec4899', icon: '🌟' },
                    { label: 'Reading Active', value: analytics.quranActiveUsers || 0, color: '#06b6d4', icon: '📖' }
                  ].map((stat, idx) => (
                    <div key={idx} style={{
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p style={{ fontSize: '12px', color: colors.textTertiary, margin: '0 0 8px 0', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
                        <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                      </div>
                      <p style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: stat.color }}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <button
                    onClick={() => { if (confirm('Reset all streaks?')) { resetAllStreaks(); loadAllData(); } }}
                    style={{
                      padding: '12px',
                      background: '#fee2e2',
                      border: `1px solid #fecaca`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#dc2626',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                  >
                    ⚠️ Reset All Streaks
                  </button>
                  <button
                    onClick={() => { if (confirm('Reset all Quran progress?')) { resetAllQuranProgress(); loadAllData(); } }}
                    style={{
                      padding: '12px',
                      background: '#fef3c7',
                      border: `1px solid #fde68a`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#b45309',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                  >
                    ⚠️ Reset Quran Progress
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ position: 'relative', maxWidth: '360px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textTertiary }} />
                    <input
                      type="text"
                      placeholder="Search users by name..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                      style={{
                        width: '100%',
                        paddingLeft: '40px',
                        paddingRight: '14px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        color: colors.text,
                        background: colors.surface,
                        transition: 'all 0.2s'
                      }}
                    />
                  </div>
                </div>

                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: colors.background, borderBottom: `1px solid ${colors.border}` }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }} onClick={() => toggleSort('created_at')}>Joined {sortField === 'created_at' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }} onClick={() => toggleSort('streak')}>Streak {sortField === 'streak' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }} onClick={() => toggleSort('generation_count')}>Reflections {sortField === 'generation_count' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user, idx) => (
                        <tr key={user.id} style={{ borderBottom: idx < paginatedUsers.length - 1 ? `1px solid ${colors.border}` : 'none', background: colors.surface, transition: 'all 0.2s' }}>
                          <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                            {editingId === user.id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{ padding: '6px 8px', border: `1px solid ${colors.border}`, borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', width: '140px', color: colors.text }}
                                autoFocus
                              />
                            ) : (
                              <span style={{ fontWeight: 500 }}>{user.name}</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: colors.textSecondary }}>
                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: colors.secondary }}>🔥 {user.streak}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: colors.info, fontWeight: 600 }}>{user.generation_count}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '12px',
                              fontWeight: 600,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: user.is_banned ? '#fee2e2' : '#dcfce7',
                              color: user.is_banned ? '#dc2626' : '#16a34a'
                            }}>
                              {user.is_banned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingId === user.id ? (
                                <>
                                  <button
                                    onClick={() => handleSaveUser(user.id)}
                                    style={{ padding: '6px 12px', background: '#dcfce7', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#16a34a', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    style={{ padding: '6px 12px', background: colors.background, border: `1px solid ${colors.border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, fontFamily: 'inherit', transition: 'all 0.2s' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => { setEditingId(user.id); setEditName(user.name); setEditLimit(user.rate_limit_override); }}
                                    style={{ padding: '6px 12px', background: '#bfdbfe', border: '1px solid #93c5fd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: colors.info, fontFamily: 'inherit', transition: 'all 0.2s' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleBan(user.id, user.is_banned)}
                                    style={{ padding: '6px 12px', background: user.is_banned ? '#dcfce7' : '#fee2e2', border: user.is_banned ? '1px solid #bfdbfe' : '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: user.is_banned ? '#16a34a' : '#dc2626', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                  >
                                    {user.is_banned ? 'Unban' : 'Ban'}
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id, user.name)}
                                    style={{ padding: '6px 12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#dc2626', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {paginatedUsers.length === 0 && (
                    <div style={{ padding: '48px 16px', textAlign: 'center', color: colors.textTertiary }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>No users found</p>
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
                      Showing {(currentPage - 1) * USERS_PER_PAGE + 1} to {Math.min(currentPage * USERS_PER_PAGE, filteredAndSorted.length)} of {filteredAndSorted.length}
                    </p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '8px 12px', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', opacity: currentPage === 1 ? 0.5 : 1, transition: 'all 0.2s' }}
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          style={{ width: '32px', height: '32px', background: currentPage === i + 1 ? colors.primary : colors.surface, color: currentPage === i + 1 ? '#ffffff' : colors.text, border: `1px solid ${currentPage === i + 1 ? colors.primary : colors.border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s' }}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '8px 12px', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', opacity: currentPage === totalPages ? 0.5 : 1, transition: 'all 0.2s' }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'broadcasts' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1000px', alignItems: 'start' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: colors.text }}>Compose Message</h2>
                  <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px', textTransform: 'uppercase' }}>Subject *</label>
                      <input
                        type="text"
                        placeholder="e.g., New Ramadan Feature"
                        value={broadcastSubject}
                        onChange={(e) => setBroadcastSubject(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', color: colors.text, background: colors.background, transition: 'all 0.2s' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px', textTransform: 'uppercase' }}>Message</label>
                      <textarea
                        placeholder="Additional message (optional)"
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', color: colors.text, background: colors.background, minHeight: '100px', resize: 'vertical', transition: 'all 0.2s' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px', textTransform: 'uppercase' }}>Button Text</label>
                      <input
                        type="text"
                        placeholder="e.g., Learn More"
                        value={broadcastActionText}
                        onChange={(e) => setBroadcastActionText(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', color: colors.text, background: colors.background, transition: 'all 0.2s' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px', textTransform: 'uppercase' }}>Button URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={broadcastActionUrl}
                        onChange={(e) => setBroadcastActionUrl(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', color: colors.text, background: colors.background, transition: 'all 0.2s' }}
                      />
                    </div>
                    <button
                      onClick={handleSendBroadcast}
                      disabled={broadcastLoading || !broadcastSubject.trim()}
                      style={{
                        padding: '12px 16px',
                        background: broadcastLoading || !broadcastSubject.trim() ? colors.textTertiary : colors.primary,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: broadcastLoading || !broadcastSubject.trim() ? 'not-allowed' : 'pointer',
                        opacity: broadcastLoading || !broadcastSubject.trim() ? 0.6 : 1,
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {broadcastLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                      {broadcastLoading ? 'Sending...' : 'Send to All Users'}
                    </button>
                  </div>
                </div>

                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: colors.text }}>
                    Active Messages ({broadcasts.length})
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {broadcasts.length === 0 ? (
                      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '32px 20px', textAlign: 'center', color: colors.textTertiary }}>
                        <p style={{ margin: 0, fontSize: '13px' }}>No active broadcasts</p>
                      </div>
                    ) : (
                      broadcasts.map(msg => (
                        <div key={msg.id} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 8px 0', color: colors.text }}>{msg.message || msg.title}</p>
                            {msg.action_label && <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0, padding: '4px 8px', background: colors.background, borderRadius: '4px', display: 'inline-block' }}>🔗 {msg.action_label}</p>}
                            <p style={{ fontSize: '11px', color: colors.textTertiary, margin: '8px 0 0 0' }}>{new Date(msg.created_at).toLocaleDateString()}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteBroadcast(msg.id)}
                            style={{ padding: '6px 10px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#dc2626', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Admin100;
