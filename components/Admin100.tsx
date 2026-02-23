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
  CheckCircle, AlertCircle, Loader2, Eye, EyeOff
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface AdminProps {
  onBack: () => void;
}

type TabType = 'dashboard' | 'users' | 'broadcasts';
type SortField = 'name' | 'created_at' | 'streak' | 'generation_count';
type SortDir = 'asc' | 'desc';

const Admin100: React.FC<AdminProps> = ({ onBack }) => {
  // Auth
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Users table
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Broadcast compose
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastActionText, setBroadcastActionText] = useState('');
  const [broadcastActionUrl, setBroadcastActionUrl] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLimit, setEditLimit] = useState(3);

  const USERS_PER_PAGE = 50;

  // Login
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

  // Load all data
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

  // Users sorting & filtering
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
  const paginatedUsers = filteredAndSorted.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // User actions
  const handleBan = async (id: string, isBanned: boolean) => {
    await toggleUserBan(id, !isBanned);
    loadAllData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? All data will be removed. This cannot be undone.`)) return;
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

  // Broadcast
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
          alert('Broadcast sent');
          loadBroadcasts();
        }
      } else {
        const error = await res.json();
        alert(`Failed: ${error.error}`);
      }
    } catch (error) {
      alert('Error sending broadcast');
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
      <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: '#000' }}>Admin Access</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Secure dashboard for RamadanBot management</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                    padding: '11px 40px 11px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
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
                    color: '#999',
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
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: authLoading ? 'not-allowed' : 'pointer',
                opacity: authLoading ? 0.6 : 1,
                marginTop: '8px',
                fontFamily: 'inherit'
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
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit'
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
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', color: '#000' }}>
      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        background: '#f5f5f5',
        borderRight: '1px solid #e5e5e5',
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
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #e5e5e5' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#000' }}>🌙 RamadanBot</h2>
          <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0 0' }}>Admin Dashboard</p>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                padding: '10px 12px',
                border: 'none',
                background: activeTab === item.id ? '#fff' : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === item.id ? 600 : 500,
                color: activeTab === item.id ? '#000' : '#666',
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

        <div style={{ padding: '16px 12px', borderTop: '1px solid #e5e5e5' }}>
          <button
            onClick={() => { setAuthenticated(false); onBack(); }}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              color: '#856404',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
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
          background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '8px',
              color: '#666'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0, flex: 1, color: '#000' }}>
            {activeTab === 'dashboard' && '📊 Dashboard'}
            {activeTab === 'users' && '👥 Users'}
            {activeTab === 'broadcasts' && '📢 Broadcasts'}
          </h1>

          <button
            onClick={loadAllData}
            style={{
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: '#666',
              fontFamily: 'inherit'
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
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#000' }}>Analytics Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                  {[
                    { label: 'Total Users', value: analytics.totalUsers, color: '#3b82f6' },
                    { label: 'Active Today', value: analytics.activeToday || 0, color: '#10b981' },
                    { label: 'Reflections', value: analytics.totalGenerations, color: '#f59e0b' },
                    { label: 'Avg per User', value: (analytics.avgGenerationsPerUser || 0).toFixed(1), color: '#8b5cf6' },
                    { label: 'Max Streak', value: analytics.maxStreak || 0, color: '#ec4899' },
                    { label: 'Reading Active', value: analytics.quranActiveUsers || 0, color: '#06b6d4' }
                  ].map((stat, idx) => (
                    <div key={idx} style={{ background: '#f9f9f9', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px' }}>
                      <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
                      <p style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: stat.color }}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <button
                    onClick={() => { if (confirm('Reset all streaks?')) { resetAllStreaks(); loadAllData(); } }}
                    style={{ padding: '12px', background: '#fee8e8', border: '1px solid #fdd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#d32f2f', fontFamily: 'inherit' }}
                  >
                    ⚠️ Reset All Streaks
                  </button>
                  <button
                    onClick={() => { if (confirm('Reset all Quran progress?')) { resetAllQuranProgress(); loadAllData(); } }}
                    style={{ padding: '12px', background: '#fef8e8', border: '1px solid #fce', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#b45309', fontFamily: 'inherit' }}
                  >
                    ⚠️ Reset Quran Progress
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    style={{
                      width: '100%',
                      maxWidth: '360px',
                      padding: '10px 14px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #e5e5e5' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Name</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => toggleSort('created_at')}> Joined {sortField === 'created_at' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => toggleSort('streak')}>Streak {sortField === 'streak' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => toggleSort('generation_count')}>Reflections {sortField === 'generation_count' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user, idx) => (
                        <tr key={user.id} style={{ borderBottom: idx < paginatedUsers.length - 1 ? '1px solid #f0f0f0' : 'none', background: '#fff', transition: 'background 0.2s' }}>
                          <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                            {editingId === user.id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', width: '140px' }}
                                autoFocus
                              />
                            ) : (
                              <span style={{ fontWeight: 500 }}>{user.name}</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: '#666' }}>
                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>🔥 {user.streak}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: '#3b82f6', fontWeight: 600 }}>{user.generation_count}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '12px',
                              fontWeight: 600,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: user.is_banned ? '#fee' : '#efe',
                              color: user.is_banned ? '#d32f2f' : '#2e7d32'
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
                                    style={{ padding: '6px 12px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#2e7d32', fontFamily: 'inherit' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    style={{ padding: '6px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#666', fontFamily: 'inherit' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => { setEditingId(user.id); setEditName(user.name); setEditLimit(user.rate_limit_override); }}
                                    style={{ padding: '6px 12px', background: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#1976d2', fontFamily: 'inherit' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleBan(user.id, user.is_banned)}
                                    style={{ padding: '6px 12px', background: user.is_banned ? '#e8f5e9' : '#fee', border: user.is_banned ? '1px solid #c8e6c9' : '1px solid #fdd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: user.is_banned ? '#2e7d32' : '#d32f2f', fontFamily: 'inherit' }}
                                  >
                                    {user.is_banned ? 'Unban' : 'Ban'}
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id, user.name)}
                                    style={{ padding: '6px 12px', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#c62828', fontFamily: 'inherit' }}
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
                    <div style={{ padding: '48px 16px', textAlign: 'center', color: '#999' }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>No users found</p>
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                      Showing {(currentPage - 1) * USERS_PER_PAGE + 1} to {Math.min(currentPage * USERS_PER_PAGE, filteredAndSorted.length)} of {filteredAndSorted.length}
                    </p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '8px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', opacity: currentPage === 1 ? 0.5 : 1 }}
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          style={{ width: '32px', height: '32px', background: currentPage === i + 1 ? '#000' : '#f5f5f5', color: currentPage === i + 1 ? '#fff' : '#666', border: '1px solid ' + (currentPage === i + 1 ? '#000' : '#ddd'), borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '8px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', opacity: currentPage === totalPages ? 0.5 : 1 }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'broadcasts' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1000px' }}>
                {/* Compose */}
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#000' }}>Compose</h2>
                  <div style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={broadcastSubject}
                      onChange={(e) => setBroadcastSubject(e.target.value)}
                      style={{ padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                    />
                    <textarea
                      placeholder="Message body (optional)"
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      style={{ padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', minHeight: '120px', resize: 'vertical' }}
                    />
                    <input
                      type="text"
                      placeholder="Button text (optional)"
                      value={broadcastActionText}
                      onChange={(e) => setBroadcastActionText(e.target.value)}
                      style={{ padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                    />
                    <input
                      type="url"
                      placeholder="Button URL (optional)"
                      value={broadcastActionUrl}
                      onChange={(e) => setBroadcastActionUrl(e.target.value)}
                      style={{ padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                    />
                    <button
                      onClick={handleSendBroadcast}
                      disabled={broadcastLoading || !broadcastSubject.trim()}
                      style={{
                        padding: '12px 16px',
                        background: '#000',
                        color: '#fff',
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
                        gap: '8px'
                      }}
                    >
                      {broadcastLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                      {broadcastLoading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#000' }}>
                    Active ({broadcasts.length})
                  </h2>
                  {broadcasts.length === 0 ? (
                    <div style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '32px 20px', textAlign: 'center', color: '#999' }}>
                      <p style={{ margin: 0, fontSize: '13px' }}>No active broadcasts</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {broadcasts.map(msg => (
                        <div key={msg.id} style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 6px 0', color: '#000' }}>{msg.message}</p>
                            {msg.action_text && <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Button: {msg.action_text}</p>}
                            <p style={{ fontSize: '11px', color: '#999', margin: '6px 0 0 0' }}>{new Date(msg.created_at).toLocaleDateString()}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteBroadcast(msg.id)}
                            style={{ padding: '6px 10px', background: '#fee', border: '1px solid #fdd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#d32f2f', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
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
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Admin100;
