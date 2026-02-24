'use client';

import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { 
  fetchAllUsers, updateUserLimit, toggleUserBan, getAnalytics, adminLogin, 
  deleteUser, updateUserName, resetAllStreaks, getEnhancedAnalytics, 
  resetAllQuranProgress, getAllLimits, setUserLimit, removeUserLimit
} from '../app/actions';
import { 
  LogOut, Menu, X, BarChart3, Users, Zap, Search, Edit2, Save, Trash2, 
  Ban, Download, RefreshCw, Clock, TrendingUp, Activity, Shield, AlertCircle
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import html2canvas from 'html2canvas';

interface AdminPanelProps {
  onBack: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'broadcast' | 'limits';

const AdminPanelPremium: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Edit states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLimit, setEditLimit] = useState(0);
  
  // Broadcast
  const [broadcastMessages, setBroadcastMessages] = useState<any[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastDetails, setBroadcastDetails] = useState('');
  const [broadcastActionText, setBroadcastActionText] = useState('');
  const [broadcastActionUrl, setBroadcastActionUrl] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [downloadingAnalytics, setDownloadingAnalytics] = useState(false);

  // Limits management
  const [allLimits, setAllLimits] = useState<any[]>([]);
  const [limitsSearch, setLimitsSearch] = useState('');
  const [editingLimitId, setEditingLimitId] = useState<string | null>(null);
  const [editingLimitValue, setEditingLimitValue] = useState(0);

  const USERS_PER_PAGE = 50;

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminLogin(password);
    if (res.success) {
      setIsAuthenticated(true);
      loadData();
      loadBroadcasts();
    } else {
      alert('Invalid password');
    }
    setLoading(false);
  };

  // Load limits when tab is selected
  useEffect(() => {
    if (activeTab === 'limits' && isAuthenticated) {
      loadAllLimits();
    }
  }, [activeTab, isAuthenticated]);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, analyticsData] = await Promise.all([
        fetchAllUsers(),
        getEnhancedAnalytics()
      ]);
      setUsers(usersData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Load failed:', error);
    }
    setLoading(false);
  };

  const loadBroadcasts = async () => {
    try {
      const res = await fetch('/api/broadcast/active');
      if (res.ok) {
        const data = await res.json();
        setBroadcastMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load broadcasts:', error);
    }
  };

  // User management
  const handleBan = async (id: string, isBanned: boolean) => {
    await toggleUserBan(id, !isBanned);
    loadData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete "${name}" and all their data? This cannot be undone.`)) {
      const result = await deleteUser(id);
      if (result.success) {
        alert('User deleted');
        loadData();
      }
    }
  };

  const handleSaveUser = async (userId: string) => {
    if (!editName.trim()) {
      alert('Name cannot be empty');
      return;
    }
    const result = await updateUserName(userId, editName);
    if (result.success) {
      await updateUserLimit(userId, editLimit);
      setEditingUserId(null);
      loadData();
    }
  };

  // Broadcast
  const handleCreateBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      alert('Message required');
      return;
    }
    setBroadcastLoading(true);
    try {
      const res = await fetch('/api/broadcast/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: broadcastDetails.trim() || broadcastMessage.trim(),
          actionText: broadcastActionText.trim() || null,
          actionUrl: broadcastActionUrl.trim() || null,
          adminId: 'system-broadcast'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBroadcastMessage('');
          setBroadcastDetails('');
          setBroadcastActionText('');
          setBroadcastActionUrl('');
          alert('Message sent');
          loadBroadcasts();
        }
      } else {
        const errorData = await res.json();
        alert(`Failed: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error creating broadcast');
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    if (confirm('Delete this message?')) {
      try {
        const res = await fetch(`/api/broadcast/${id}`, { method: 'DELETE' });
        if (res.ok) {
          loadBroadcasts();
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const downloadAnalyticsImage = async () => {
    if (!analytics) return;
    setDownloadingAnalytics(true);
    try {
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1600px;background:#fff;padding:0;';
      
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const time = new Date().toLocaleTimeString('en-US');
      const quranLabel = 'Qur\'ān Active';

      container.innerHTML = `
        <div style="padding:60px; background:linear-gradient(135deg,#f0f9ff 0%,#ecfdf5 100%); color:#1f2937; font-family:-apple-system,sans-serif;">
          <div style="background:linear-gradient(135deg,#10b981 0%,#06b6d4 100%); color:white; border-radius:24px; padding:50px 60px; margin-bottom:40px; box-shadow:0 20px 40px rgba(16,185,129,0.2);">
            <div style="display:flex; align-items:center; gap:24px; margin-bottom:24px;">
              <div style="width:80px; height:80px; background:rgba(255,255,255,0.2); border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:48px;">🌙</div>
              <div>
                <div style="font-size:28px; font-weight:800; margin-bottom:6px;">RamadanBot</div>
                <div style="font-size:16px; opacity:0.9;">Admin Analytics Report</div>
              </div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-bottom:40px;">
            ${[
              { label: 'Total Users', value: analytics.totalUsers, emoji: '👥' },
              { label: 'Reflections', value: analytics.totalGenerations, emoji: '✨' },
              { label: 'Active Today', value: analytics.activeToday || 0, emoji: '🔥' },
              { label: 'Avg per User', value: analytics.avgGenerationsPerUser?.toFixed(1) || '0', emoji: '📊' },
              { label: 'Max Streak', value: analytics.maxStreak || 0, emoji: '🏆' },
              { label: 'Reading Active', value: analytics.quranActiveUsers || 0, emoji: '📖' }
            ].map(stat => `
              <div style="background:white; border-radius:20px; padding:36px; border:2px solid #e5e7eb; text-align:center;">
                <div style="font-size:48px; margin-bottom:12px;">${stat.emoji}</div>
                <div style="font-size:12px; color:#6b7280; font-weight:600; text-transform:uppercase; margin-bottom:8px;">${stat.label}</div>
                <div style="font-size:52px; font-weight:800; color:#059669;">${stat.value}</div>
              </div>
            `).join('')}
          </div>
          <div style="background:white; border-radius:20px; padding:30px 40px; border:2px solid #e5e7eb; display:flex; justify-content:space-between;">
            <div>
              <div style="font-size:20px; font-weight:800; color:#059669;">RamadanBot</div>
              <div style="font-size:12px; color:#9ca3af; margin-top:4px;">www.ramadanbot.app</div>
            </div>
            <div style="text-align:right; color:#6b7280; font-size:12px;">
              <div style="font-weight:600;">${date}</div>
              <div style="opacity:0.7;">${time}</div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `ramadanbot-analytics-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      document.body.removeChild(container);
      alert('✅ Analytics downloaded');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download');
    } finally {
      setDownloadingAnalytics(false);
    }
  };

  // Limits management - CRUD operations
  const loadAllLimits = async () => {
    const result = await getAllLimits();
    if (result.success) {
      setAllLimits(result.limits || []);
    }
  };

  const handleSaveLimit = async (userId: string, newLimit: number) => {
    const result = await setUserLimit(userId, newLimit);
    if (result.success) {
      alert(`✓ Limit updated to ${newLimit}`);
      await loadAllLimits();
      setEditingLimitId(null);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleRemoveLimit = async (userId: string, userName: string) => {
    if (confirm(`Remove custom limit for "${userName}"? They will revert to default (3).`)) {
      const result = await removeUserLimit(userId);
      if (result.success) {
        alert('✓ Limit removed');
        await loadAllLimits();
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #047857 0%, #0891b2 100%)',
            color: 'white',
            padding: '48px 40px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, marginBottom: '12px' }}>Admin Access</h1>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Secure dashboard for RamadanBot management</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ padding: '40px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #047857 0%, #0891b2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Unlocking...' : 'Unlock Dashboard'}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: '#6b7280',
                border: 'none',
                marginTop: '16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Back to App
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main dashboard
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>🌙 RamadanBot</div>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Admin Dashboard</p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'broadcast', label: 'Broadcast', icon: '📢' },
            { id: 'limits', label: 'Limits', icon: '⚡' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: activeTab === item.id ? '#f3f4f6' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                marginBottom: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === item.id ? '600' : '500',
                color: activeTab === item.id ? '#047857' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid #f3f4f6' }}>
          <button
            onClick={() => { setIsAuthenticated(false); onBack(); }}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#fee2e2',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? '280px' : '0', transition: 'margin 0.3s ease' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
            {activeTab === 'dashboard' && '📊 Dashboard'}
            {activeTab === 'users' && '👥 Users'}
            {activeTab === 'broadcast' && '📢 Broadcast'}
            {activeTab === 'limits' && '⚡ Limits'}
          </h1>
          <button
            onClick={loadData}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {activeTab === 'dashboard' && analytics && (
            <div>
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '20px', fontWeight: 'bold' }}>Analytics Overview</h2>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Real-time system metrics</p>
                </div>
                <button
                  onClick={downloadAnalyticsImage}
                  disabled={downloadingAnalytics}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  {downloadingAnalytics ? 'Downloading...' : '⬇ Download PNG'}
                </button>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {[
                  { label: 'Total Users', value: analytics.totalUsers, color: '#3b82f6' },
                  { label: 'Reflections', value: analytics.totalGenerations, color: '#8b5cf6' },
                  { label: 'Active Today', value: analytics.activeToday || 0, color: '#10b981' },
                  { label: 'Avg per User', value: analytics.avgGenerationsPerUser?.toFixed(1) || '0', color: '#f59e0b' }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'white',
                      border: `2px solid ${stat.color}20`,
                      borderRadius: '16px',
                      padding: '24px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>
                      {stat.label}
                    </p>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <button
                  onClick={() => { if (confirm('Reset all streaks?')) { resetAllStreaks(); loadData(); } }}
                  style={{
                    background: '#fee2e2',
                    border: '2px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#dc2626',
                    fontSize: '14px'
                  }}
                >
                  ⚠️ Reset All Streaks
                </button>
                <button
                  onClick={() => { if (confirm('Reset all Qur\'ān progress?')) { resetAllQuranProgress(); loadData(); } }}
                  style={{
                    background: '#fef3c7',
                    border: '2px solid #fde68a',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#b45309',
                    fontSize: '14px'
                  }}
                >
                  ⚠️ Reset Qur'ān Progress
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              {/* Search */}
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    background: 'white',
                    color: '#1F2937',
                    caretColor: '#047857'
                  }}
                />
              </div>

              {/* Users Table */}
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>Name</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>Streak</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>Reflections</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>Reading Day</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user, idx) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {editingUserId === user.id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{ padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', width: '140px' }}
                              />
                            ) : (
                              <span style={{ fontWeight: '500', color: '#111827' }}>{user.name}</span>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            {user.is_banned ? (
                              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                Banned
                              </span>
                            ) : (
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                Active
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center', color: '#f59e0b', fontWeight: 'bold' }}>🔥 {user.streak}</td>
                          <td style={{ padding: '16px', textAlign: 'center', color: '#3b82f6', fontWeight: 'bold' }}>{user.generation_count}</td>
                          <td style={{ padding: '16px', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>{user.quran_current_day || '-'}</td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              {editingUserId === user.id ? (
                                <>
                                  <button
                                    onClick={() => handleSaveUser(user.id)}
                                    style={{ background: '#dcfce7', border: 'none', color: '#166534', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingUserId(null)}
                                    style={{ background: '#f3f4f6', border: 'none', color: '#6b7280', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => { setEditingUserId(user.id); setEditName(user.name); setEditLimit(user.rate_limit_override); }}
                                    style={{ background: '#eff6ff', border: 'none', color: '#1e40af', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleBan(user.id, user.is_banned)}
                                    style={{ background: user.is_banned ? '#dcfce7' : '#fee2e2', border: 'none', color: user.is_banned ? '#166534' : '#dc2626', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                  >
                                    {user.is_banned ? 'Unban' : 'Ban'}
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id, user.name)}
                                    style={{ background: '#fecaca', border: 'none', color: '#991b1b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
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
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                      Showing {(currentPage - 1) * USERS_PER_PAGE + 1} to {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                          fontSize: '12px',
                          opacity: currentPage === 1 ? 0.5 : 1
                        }}
                      >
                        ← Prev
                      </button>
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          style={{
                            background: currentPage === i + 1 ? '#047857' : '#f3f4f6',
                            color: currentPage === i + 1 ? 'white' : '#6b7280',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '12px'
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                          fontSize: '12px',
                          opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div style={{ maxWidth: '700px' }}>
              {/* Compose Section */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
                <h2 style={{ margin: 0, marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Compose Message</h2>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Brief message title"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#1F2937',
                      caretColor: '#047857'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Message (Optional)
                  </label>
                  <textarea
                    value={broadcastDetails}
                    onChange={(e) => setBroadcastDetails(e.target.value)}
                    placeholder="Full message details"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      minHeight: '100px',
                      background: 'white',
                      color: '#1F2937',
                      caretColor: '#047857'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={broadcastActionText}
                      onChange={(e) => setBroadcastActionText(e.target.value)}
                      placeholder="e.g., Learn More"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        background: 'white',
                        color: '#1F2937',
                        caretColor: '#047857'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Button URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={broadcastActionUrl}
                      onChange={(e) => setBroadcastActionUrl(e.target.value)}
                      placeholder="https://..."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        background: 'white',
                        color: '#1F2937',
                        caretColor: '#047857'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateBroadcast}
                  disabled={broadcastLoading || !broadcastMessage.trim()}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #047857 0%, #0891b2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: broadcastLoading || !broadcastMessage.trim() ? 'not-allowed' : 'pointer',
                    opacity: broadcastLoading || !broadcastMessage.trim() ? 0.6 : 1
                  }}
                >
                  {broadcastLoading ? 'Sending...' : '📤 Send to All Users'}
                </button>
              </div>

              {/* Messages List */}
              <div>
                <h2 style={{ margin: 0, marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Active Messages ({broadcastMessages.length})
                </h2>
                
                {broadcastMessages.length === 0 ? (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb',
                    color: '#9ca3af'
                  }}>
                    <p style={{ margin: 0 }}>No active messages</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {broadcastMessages.map(msg => (
                      <div
                        key={msg.id}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          gap: '16px'
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, marginBottom: '8px', fontWeight: 'bold', color: '#111827' }}>{msg.message}</p>
                          {msg.action_text && (
                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Button: {msg.action_text}</p>
                          )}
                          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                            {new Date(msg.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteBroadcast(msg.id)}
                          style={{
                            background: '#fee2e2',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            color: '#dc2626',
                            fontSize: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Limits CRUD Management */}
          {activeTab === 'limits' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '20px', fontWeight: 'bold' }}>Daily Generation Limits</h2>
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Manage user-specific generation limits (overrides default limit of 3)</p>
                  </div>
                  <button
                    onClick={() => { setLimitsSearch(''); loadAllLimits(); }}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    🔄 Refresh
                  </button>
                </div>

                {/* Search */}
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="Search by user name..."
                    value={limitsSearch}
                    onChange={(e) => setLimitsSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#1F2937',
                      caretColor: '#047857'
                    }}
                  />
                </div>

                {/* Limits List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {allLimits.filter(l => l.name.toLowerCase().includes(limitsSearch.toLowerCase())).length === 0 ? (
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '32px',
                      textAlign: 'center',
                      color: '#9ca3af'
                    }}>
                      <p style={{ margin: 0 }}>No custom limits set. All users using default limit (3).</p>
                    </div>
                  ) : (
                    allLimits.filter(l => l.name.toLowerCase().includes(limitsSearch.toLowerCase())).map(user => (
                      <div
                        key={user.id}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            Role: {user.role} • Joined: {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {editingLimitId === user.id ? (
                            <>
                              <input
                                type="number"
                                value={editingLimitValue}
                                onChange={(e) => setEditingLimitValue(parseInt(e.target.value) || 0)}
                                min="0"
                                max="100"
                                style={{
                                  width: '80px',
                                  padding: '8px 12px',
                                  border: '1px solid #10b981',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  textAlign: 'center'
                                }}
                              />
                              <button
                                onClick={() => handleSaveLimit(user.id, editingLimitValue)}
                                style={{
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                ✓ Save
                              </button>
                              <button
                                onClick={() => setEditingLimitId(null)}
                                style={{
                                  background: '#f3f4f6',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                ✕ Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <div style={{ 
                                background: '#fef3c7', 
                                color: '#92400e', 
                                padding: '6px 16px', 
                                borderRadius: '6px',
                                fontWeight: '600',
                                minWidth: '80px',
                                textAlign: 'center'
                              }}>
                                {user.custom_limit || '0'} / day
                              </div>
                              <button
                                onClick={() => {
                                  setEditingLimitId(user.id);
                                  setEditingLimitValue(user.custom_limit || 0);
                                }}
                                style={{
                                  background: '#dbeafe',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#1e40af'
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleRemoveLimit(user.id, user.name)}
                                style={{
                                  background: '#fee2e2',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#dc2626'
                                }}
                              >
                                🗑️ Remove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Set New Limit Section */}
                <div style={{ marginTop: '32px', background: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Set Limit for Any User</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Search user..."
                      value={limitsSearch}
                      onChange={(e) => setLimitsSearch(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        color: '#1F2937',
                        caretColor: '#047857'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="New limit"
                      min="0"
                      max="100"
                      value={editingLimitValue}
                      onChange={(e) => setEditingLimitValue(parseInt(e.target.value) || 0)}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        color: '#1F2937',
                        caretColor: '#047857'
                      }}
                      }}
                    />
                    <button
                      onClick={() => {
                        const user = allLimits.find(u => u.name.toLowerCase().includes(limitsSearch.toLowerCase()));
                        if (user) {
                          handleSaveLimit(user.id, editingLimitValue);
                        } else {
                          alert('User not found');
                        }
                      }}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      Set Limit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPremium;
