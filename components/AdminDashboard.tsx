'use client';

import React, { useEffect, useState } from 'react';
import { User, AnalyticsData } from '../types';
import { fetchAllUsers, updateUserLimit, toggleUserBan, getAnalytics, adminLogin, deleteUser, updateUserName, resetAllStreaks, getEnhancedAnalytics, resetAllQuranProgress } from '../app/actions';
import { ArrowLeft, Ban, RefreshCcw, Search, ShieldCheck, TrendingUp, Users, Activity, Lock, Edit3, Save, BarChart3, Zap, Target, Trash2, Download, AlertCircle, Check } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import html2canvas from 'html2canvas';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [editLimitId, setEditLimitId] = useState<string | null>(null);
  const [editNameId, setEditNameId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<number>(1);
  const [tempName, setTempName] = useState<string>('');
  const [downloadingAnalytics, setDownloadingAnalytics] = useState(false);

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminLogin(password);
    if (res.success) {
      setIsAuthenticated(true);
      loadData();
    } else {
      alert("Invalid Admin Password");
    }
    setLoading(false);
  };

  // --- DATA LOADING ---
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
      console.error("Failed to load admin data", error);
    }
    setLoading(false);
  };

  // --- MUTATIONS ---
  const handleBan = async (id: string, currentStatus: boolean) => {
    await toggleUserBan(id, !currentStatus);
    loadData();
  };

  const handleDelete = async (id: string, userName: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${userName}" and all their data? This cannot be undone.`)) {
      const result = await deleteUser(id);
      if (result.success) {
        alert(`User "${userName}" deleted successfully`);
        loadData();
      } else {
        alert(`Failed to delete user. Please try again.`);
      }
    }
  };

  const saveLimit = async (id: string) => {
    await updateUserLimit(id, tempLimit);
    setEditLimitId(null);
    loadData();
  };

  const saveName = async (id: string) => {
    if (!tempName.trim()) {
      alert("Name cannot be empty");
      return;
    }
    const result = await updateUserName(id, tempName);
    if (result.success) {
      setEditNameId(null);
      loadData();
    } else {
      alert(result.error || "Failed to update name");
    }
  };

  const handleResetAllStreaks = async () => {
    if (confirm('Are you sure you want to reset ALL user streaks? This action cannot be undone.')) {
      const result = await resetAllStreaks();
      if (result.success) {
        alert('All streaks have been reset');
        loadData();
      } else {
        alert('Failed to reset streaks');
      }
    }
  };

  const handleResetQuranProgress = async () => {
    if (confirm('Are you sure you want to reset ALL Quran progress? This action cannot be undone.')) {
      const result = await resetAllQuranProgress();
      if (result.success) {
        alert('All Quran progress has been reset');
        loadData();
      } else {
        alert('Failed to reset Quran progress');
      }
    }
  };

  const downloadAnalyticsPNG = async () => {
    if (!analytics) return;
    
    setDownloadingAnalytics(true);
    try {
      // Create a temporary container for the analytics PNG
      const container = document.createElement('div');
      container.id = 'analytics-png-container';
      Object.assign(container.style, {
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '1200px',
        backgroundColor: 'white',
        padding: '40px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        color: '#000'
      });

      const formattedTime = new Date().toLocaleString();
      const content = `
        <div style="
          width: 100%;
          padding: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          border-radius: 20px;
        ">
          <div style="font-size: 48px; margin-bottom: 20px; font-weight: 700;">
            🌙 RamadanBot Analytics
          </div>
          <div style="font-size: 28px; margin-bottom: 40px; opacity: 0.9;">
            Dashboard Report
          </div>
          
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
          ">
            <div style="
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              padding: 30px;
              border-radius: 15px;
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <div style="font-size: 16px; opacity: 0.9; margin-bottom: 10px;">Total Users</div>
              <div style="font-size: 48px; font-weight: 700;">${analytics.totalUsers}</div>
            </div>
            
            <div style="
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              padding: 30px;
              border-radius: 15px;
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <div style="font-size: 16px; opacity: 0.9; margin-bottom: 10px;">Total Generations</div>
              <div style="font-size: 48px; font-weight: 700;">${analytics.totalGenerations}</div>
            </div>
            
            <div style="
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              padding: 30px;
              border-radius: 15px;
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <div style="font-size: 16px; opacity: 0.9; margin-bottom: 10px;">Active Today</div>
              <div style="font-size: 48px; font-weight: 700;">${analytics.activeToday}</div>
            </div>
            
            <div style="
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              padding: 30px;
              border-radius: 15px;
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <div style="font-size: 16px; opacity: 0.9; margin-bottom: 10px;">Avg per User</div>
              <div style="font-size: 48px; font-weight: 700;">${analytics.avgGenerationsPerUser?.toFixed(1) || '0'}</div>
            </div>
            
            <div style="
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              padding: 30px;
              border-radius: 15px;
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <div style="font-size: 16px; opacity: 0.9; margin-bottom: 10px;">Max Streak</div>
              <div style="font-size: 48px; font-weight: 700;">🔥 ${analytics.maxStreak || '0'}</div>
            </div>
            
            <div style="
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              padding: 30px;
              border-radius: 15px;
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <div style="font-size: 16px; opacity: 0.9; margin-bottom: 10px;">Quran Progress</div>
              <div style="font-size: 48px; font-weight: 700;">${analytics.quranActiveUsers || '0'}</div>
            </div>
          </div>
          
          <div style="
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 30px;
            opacity: 0.8;
            font-size: 14px;
          ">
            Generated on ${formattedTime}
          </div>
        </div>
      `;

      container.innerHTML = content;
      document.body.appendChild(container);

      // Convert to PNG
      const canvas = await html2canvas(container, {
        backgroundColor: null,
        scale: 2,
      });

      // Download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `ramadanbot-analytics-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      document.body.removeChild(container);
    } catch (error) {
      console.error('Failed to download analytics PNG:', error);
      alert('Failed to download analytics');
    } finally {
      setDownloadingAnalytics(false);
    }
  };

  // Login Screen - Apple Style
  if (!isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-950 dark:to-black p-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-8 text-center">
                    <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Lock size={40} className="text-gray-900 dark:text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                    <p className="text-gray-300 text-sm">Enter credentials to continue</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 px-1">
                                Password
                            </label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-900 dark:text-white font-medium"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <LoadingSpinner size="sm" color="text-current" /> : "Unlock Dashboard"}
                        </button>
                    </form>
                    
                    <button 
                        onClick={onBack} 
                        className="w-full mt-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                    >
                        ← Return to App
                    </button>
                </div>
            </div>
        </div>
    );
  }

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  
  // Calculate derived metrics from users list if not available in analytics object
  // This prevents crashes if the AnalyticsData type doesn't have these specific fields
  const activeStreaksCount = users.filter(u => u.streak > 0).length;
  const avgGens = analytics && analytics.totalUsers > 0 
      ? (analytics.totalGenerations / analytics.totalUsers).toFixed(1) 
      : "0.0";
  const highestStreak = users.length > 0 ? Math.max(...users.map(u => u.streak || 0)) : 0;
  const bannedCount = users.filter(u => u.is_banned).length;
  const activeUsersCount = analytics ? analytics.totalUsers - bannedCount : 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-950 dark:to-black animate-fade-in">
      {/* Navbar - Apple Style */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all active:scale-95"
                >
                    <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Console</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">System Management</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === 'overview' 
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === 'users' 
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    Users
                </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
        
        {activeTab === 'overview' && analytics && (
            <div className="space-y-6">
              {/* Header with Download Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center">
                      <BarChart3 size={24} className="text-white" strokeWidth={2} />
                    </div>
                    Analytics Overview
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Real-time system metrics and performance data</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={downloadAnalyticsPNG}
                    disabled={downloadingAnalytics}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-full font-semibold transition-all active:scale-95"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">{downloadingAnalytics ? 'Downloading...' : 'Download PNG'}</span>
                  </button>
                  <button 
                    onClick={() => loadData()} 
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all active:scale-95"
                  >
                    <RefreshCcw size={18} className="text-gray-700 dark:text-gray-200" />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card: Total Users */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Total Users</p>
                      <p className="text-4xl font-bold mt-2">{analytics.totalUsers}</p>
                    </div>
                    <Users size={24} strokeWidth={2} className="opacity-50" />
                  </div>
                </div>

                {/* Card: Total Generations */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Generations</p>
                      <p className="text-4xl font-bold mt-2">{analytics.totalGenerations}</p>
                    </div>
                    <Zap size={24} strokeWidth={2} className="opacity-50" />
                  </div>
                </div>

                {/* Card: Active Today */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Active Today</p>
                      <p className="text-4xl font-bold mt-2">{analytics.activeToday}</p>
                    </div>
                    <Activity size={24} strokeWidth={2} className="opacity-50" />
                  </div>
                </div>

                {/* Card: Max Streak */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Max Streak</p>
                      <p className="text-4xl font-bold mt-2">🔥 {analytics.maxStreak || 0}</p>
                    </div>
                    <TrendingUp size={24} strokeWidth={2} className="opacity-50" />
                  </div>
                </div>

                {/* Card: Avg Generations */}
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Avg per User</p>
                      <p className="text-4xl font-bold mt-2">{analytics.avgGenerationsPerUser?.toFixed(1) || '0'}</p>
                    </div>
                    <Target size={24} strokeWidth={2} className="opacity-50" />
                  </div>
                </div>

                {/* Card: Quran Progress */}
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Quran Active</p>
                      <p className="text-4xl font-bold mt-2">{analytics.quranActiveUsers || 0}</p>
                    </div>
                    <ShieldCheck size={24} strokeWidth={2} className="opacity-50" />
                  </div>
                </div>
              </div>

              {/* Reset Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleResetAllStreaks}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl font-semibold transition-all active:scale-95"
                >
                  <AlertCircle size={20} />
                  Reset All Streaks
                </button>
                <button
                  onClick={handleResetQuranProgress}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-100 dark:bg-yellow-900/20 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 border-2 border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 rounded-2xl font-semibold transition-all active:scale-95"
                >
                  <AlertCircle size={20} />
                  Reset Quran Progress
                </button>
              </div>
            </div>
          )}

        {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500 flex items-center justify-center">
                    <Users size={24} className="text-white" strokeWidth={2} />
                  </div>
                  User Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Full CRUD control over users and their settings</p>
              </div>

              {/* Search */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search size={18} className="text-gray-400" strokeWidth={2} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search users by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 dark:text-white transition-all"
                />
              </div>

              {/* Users Table */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Last Activity</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Stats</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Limit</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-base font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                {editNameId === user.id ? (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={tempName}
                                      onChange={(e) => setTempName(e.target.value)}
                                      className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => saveName(user.id)}
                                      className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                                    >
                                      <Check size={14} className="text-green-600 dark:text-green-400" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                                      {user.name}
                                      <button
                                        onClick={() => { setEditNameId(user.id); setTempName(user.name); }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Edit3 size={12} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                      </button>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: ...{user.id.slice(-6)}</div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                Topic: {user.last_topic || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Never
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">🔥 {user.streak}</span>
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Total: {user.generation_count}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {editLimitId === user.id ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  type="number" 
                                  value={tempLimit}
                                  onChange={(e) => setTempLimit(parseInt(e.target.value))}
                                  className="w-20 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white font-semibold outline-none focus:border-blue-500"
                                  min="1"
                                  max="50"
                                />
                                <button 
                                  onClick={() => saveLimit(user.id)} 
                                  className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 flex items-center justify-center transition-all"
                                >
                                  <Check size={14} className="text-green-600 dark:text-green-400" />
                                </button>
                              </div>
                            ) : (
                              <span 
                                onClick={() => { setEditLimitId(user.id); setTempLimit(user.rate_limit_override); }}
                                className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all inline-block"
                              >
                                {user.rate_limit_override}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleBan(user.id, user.is_banned)}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                                  user.is_banned 
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                                }`}
                              >
                                {user.is_banned ? "Unban" : "Ban"}
                              </button>
                              <button 
                                onClick={() => handleDelete(user.id, user.name)}
                                className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center transition-all"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{filteredUsers.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Active</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{filteredUsers.filter(u => !u.is_banned).length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Banned</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{filteredUsers.filter(u => u.is_banned).length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
                                                  
