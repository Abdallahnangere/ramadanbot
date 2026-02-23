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

const AdminDashboardEnhanced: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  
  // Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'broadcast'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [editLimitId, setEditLimitId] = useState<string | null>(null);
  const [editNameId, setEditNameId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<number>(1);
  const [tempName, setTempName] = useState<string>('');
  const [downloadingAnalytics, setDownloadingAnalytics] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 50;

  // Broadcast State
  const [broadcastMessages, setBroadcastMessages] = useState<any[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastDetails, setBroadcastDetails] = useState('');
  const [broadcastActionText, setBroadcastActionText] = useState('');
  const [broadcastActionUrl, setBroadcastActionUrl] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminLogin(password);
    if (res.success) {
      setIsAuthenticated(true);
      // Load data first, then extract admin ID from loaded users
      await loadDataAndSetAdminId();
    } else {
      alert("Invalid Admin Password");
    }
    setLoading(false);
  };

  // Load data and extract admin ID from users
  const loadDataAndSetAdminId = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const [usersData, analyticsData] = await Promise.all([
        fetchAllUsers(),
        getEnhancedAnalytics()
      ]);
      setUsers(usersData);
      setAnalytics(analyticsData);
      
      // Find and set the first admin user
      const adminUser = usersData.find(u => u.role === 'admin');
      if (adminUser) {
        setAdminId(adminUser.id);
      } else {
        console.warn('No admin user found in database');
      }
    } catch (error) {
      console.error("Failed to load admin data", error);
    }
    setLoading(false);
  };

  // --- DATA LOADING ---
  const loadData = async () => {
    setLoading(true);
    setCurrentPage(1); // Reset to first page when loading new data
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

  // --- BROADCAST MESSAGE HANDLERS ---
  const loadBroadcastMessages = async () => {
    try {
      const res = await fetch('/api/broadcast/active');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBroadcastMessages(data.messages || []);
        }
      }
    } catch (error) {
      console.error('Failed to load broadcast messages:', error);
    }
  };

  const handleCreateBroadcast = async () => {
    const finalMessage = broadcastDetails.trim() || broadcastMessage.trim();
    if (!broadcastMessage.trim() || !finalMessage) {
      alert('Message cannot be empty');
      return;
    }
    
    setBroadcastLoading(true);
    try {
      const res = await fetch('/api/broadcast/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(adminId && { adminId }),
          message: finalMessage,
          actionText: broadcastActionText.trim() || null,
          actionUrl: broadcastActionUrl.trim() || null
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBroadcastMessage('');
          setBroadcastDetails('');
          setBroadcastActionText('');
          setBroadcastActionUrl('');
          alert('Broadcast message created successfully');
          loadBroadcastMessages();
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Failed to create broadcast (${res.status}): ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create broadcast:', error);
      alert('Error creating broadcast message');
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    if (confirm('Delete this message?')) {
      try {
        if (!adminId) {
          alert('Admin ID not found');
          return;
        }
        const res = await fetch(`/api/broadcast/${id}?adminId=${adminId}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          loadBroadcastMessages();
        } else {
          alert('Failed to delete message');
        }
      } catch (error) {
        console.error('Failed to delete broadcast:', error);
      }
    }
  };

  const handlePauseBroadcast = async (id: string) => {
    try {
      if (!adminId) {
        alert('Admin ID not found');
        return;
      }
      const res = await fetch(`/api/broadcast/${id}/pause?adminId=${adminId}`, {
        method: 'POST'
      });

      if (res.ok) {
        loadBroadcastMessages();
      } else {
        alert('Failed to pause message');
      }
    } catch (error) {
      console.error('Failed to pause broadcast:', error);
    }
  };

  const handleResumeBroadcast = async (id: string) => {
    try {
      if (!adminId) {
        alert('Admin ID not found');
        return;
      }
      const res = await fetch(`/api/broadcast/${id}/resume?adminId=${adminId}`, {
        method: 'POST'
      });

      if (res.ok) {
        loadBroadcastMessages();
      } else {
        alert('Failed to resume message');
      }
    } catch (error) {
      console.error('Failed to resume broadcast:', error);
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
        width: '1600px',
        backgroundColor: '#ffffff',
        padding: '0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        color: '#000'
      });

      const formattedDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const formattedTime = new Date().toLocaleTimeString('en-US');

      const content = `
        <div style="
          width: 100%;
          background: linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%);
          color: #1f2937;
          padding: 60px;
          font-family: 'SF Pro Display', -apple-system, sans-serif;
        ">
          <!-- Header Section -->
          <div style="
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            color: white;
            border-radius: 24px;
            padding: 50px 60px;
            margin-bottom: 40px;
            box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            <div>
              <div style="
                font-size: 52px;
                font-weight: 800;
                margin-bottom: 12px;
                letter-spacing: -1px;
              ">
                RamadanBot
              </div>
              <div style="
                font-size: 20px;
                opacity: 0.95;
                font-weight: 500;
                letter-spacing: 0.5px;
              ">
                Analytics Dashboard Report
              </div>
            </div>
            <div style="
              font-size: 72px;
              opacity: 0.9;
              text-shadow: 0 4px 8px rgba(0,0,0,0.1);
            ">
              🌙
            </div>
          </div>

          <!-- Main Stats Grid (3x2) -->
          <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 40px;
          ">
            <!-- Total Users -->
            <div style="
              background: white;
              border-radius: 20px;
              padding: 36px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 4px 16px rgba(0,0,0,0.06);
              text-align: center;
            ">
              <div style="
                font-size: 48px;
                margin-bottom: 12px;
              ">👥</div>
              <div style="
                font-size: 14px;
                color: #6b7280;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Total Users</div>
              <div style="
                font-size: 52px;
                font-weight: 800;
                background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${analytics.totalUsers}</div>
            </div>

            <!-- Total Generations -->
            <div style="
              background: white;
              border-radius: 20px;
              padding: 36px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 4px 16px rgba(0,0,0,0.06);
              text-align: center;
            ">
              <div style="
                font-size: 48px;
                margin-bottom: 12px;
              ">✨</div>
              <div style="
                font-size: 14px;
                color: #6b7280;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Reflections Generated</div>
              <div style="
                font-size: 52px;
                font-weight: 800;
                background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${analytics.totalGenerations}</div>
            </div>

            <!-- Active Users -->
            <div style="
              background: white;
              border-radius: 20px;
              padding: 36px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 4px 16px rgba(0,0,0,0.06);
              text-align: center;
            ">
              <div style="
                font-size: 48px;
                margin-bottom: 12px;
              ">🔥</div>
              <div style="
                font-size: 14px;
                color: #6b7280;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Active Users</div>
              <div style="
                font-size: 52px;
                font-weight: 800;
                background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${analytics.activeToday || 0}</div>
            </div>

            <!-- Avg Generations -->
            <div style="
              background: white;
              border-radius: 20px;
              padding: 36px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 4px 16px rgba(0,0,0,0.06);
              text-align: center;
            ">
              <div style="
                font-size: 48px;
                margin-bottom: 12px;
              ">📊</div>
              <div style="
                font-size: 14px;
                color: #6b7280;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Avg per User</div>
              <div style="
                font-size: 52px;
                font-weight: 800;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${analytics.avgGenerationsPerUser?.toFixed(1) || '0'}</div>
            </div>

            <!-- Max Streak -->
            <div style="
              background: white;
              border-radius: 20px;
              padding: 36px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 4px 16px rgba(0,0,0,0.06);
              text-align: center;
            ">
              <div style="
                font-size: 48px;
                margin-bottom: 12px;
              ">🏆</div>
              <div style="
                font-size: 14px;
                color: #6b7280;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Max Streak</div>
              <div style="
                font-size: 52px;
                font-weight: 800;
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${analytics.maxStreak || 0}</div>
            </div>

            <!-- Qur'ān Reading -->
            <div style="
              background: white;
              border-radius: 20px;
              padding: 36px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 4px 16px rgba(0,0,0,0.06);
              text-align: center;
            ">
              <div style="
                font-size: 48px;
                margin-bottom: 12px;
              ">📖</div>
              <div style="
                font-size: 14px;
                color: #6b7280;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Qur'ān Active</div>
              <div style="
                font-size: 52px;
                font-weight: 800;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${analytics.quranActiveUsers || 0}</div>
            </div>
          </div>

          <!-- Footer -->
          <div style="
            background: white;
            border-radius: 20px;
            padding: 30px 40px;
            border: 2px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          ">
            <div style="
              text-align: left;
            ">
              <div style="
                font-size: 24px;
                font-weight: 800;
                background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">RamadanBot</div>
              <div style="
                font-size: 13px;
                color: #9ca3af;
                margin-top: 2px;
              ">www.ramadanbot.app</div>
            </div>
            <div style="
              text-align: right;
              color: #6b7280;
              font-size: 13px;
              line-height: 1.6;
            ">
              <div style="font-weight: 600;">${formattedDate}</div>
              <div style="opacity: 0.7;">${formattedTime}</div>
              <div style="opacity: 0.5; margin-top: 4px;">Generated Report</div>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = content;
      document.body.appendChild(container);

      // Convert to PNG with higher quality
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      // Download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `ramadanbot-analytics-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      document.body.removeChild(container);
      
      alert('✅ Analytics report downloaded successfully!');
    } catch (error) {
      console.error('Failed to download analytics PNG:', error);
      alert('Failed to download analytics. Please try again.');
    } finally {
      setDownloadingAnalytics(false);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-950 dark:to-black p-6 animate-fade-in">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md overflow-hidden">
          {/* Header Section - With Branding */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-7000 to-purple-700 dark:from-indigo-900 dark:via-purple-900 dark:to-purple-950 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl border border-white/30">
                🌙
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">RamadanBot</h3>
                <p className="text-xs text-white/70">Admin Console</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Secure Access</h2>
            <p className="text-indigo-100 text-sm">Enter credentials to continue</p>
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

  const filteredUsers = users
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); // Sort by newest first
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);
  
  const activeStreaksCount = users.filter(u => u.streak > 0).length;
  const bannedCount = users.filter(u => u.is_banned).length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-950 dark:to-black animate-fade-in">
      {/* Navbar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all active:scale-95"
            >
              <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-lg font-bold">
                🌙
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">RamadanBot Admin</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard & Management</p>
              </div>
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
            <button 
              onClick={() => setActiveTab('broadcast')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'broadcast' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Broadcast
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
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 dark:text-white transition-all"
                />
              </div>

              {/* Users Grid - Card Based Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedUsers.map(user => {
                  const joinDate = new Date(user.created_at);
                  const daysAgo = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
                  const quranProgress = user.quran_current_day ? Math.round((user.quran_current_day / 29) * 100) : 0;
                  
                  return (
                    <div 
                      key={user.id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-none transition-shadow duration-200 hover:border-emerald-300 dark:hover:border-emerald-800"
                    >
                      {/* Header: Name and Status Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            {editNameId === user.id ? (
                              <div className="flex gap-2 mb-1">
                                <input
                                  type="text"
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                                  className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveName(user.id)}
                                  className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                                >
                                  <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2 group">
                                  {user.name}
                                  <button
                                    onClick={() => { setEditNameId(user.id); setTempName(user.name); }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Edit3 size={12} className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400" />
                                  </button>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {user.id.slice(-6)}</div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {user.is_banned && (
                            <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center gap-1">
                              <Ban size={12} className="text-red-600 dark:text-red-400" />
                              <span className="text-xs font-semibold text-red-700 dark:text-red-400">Banned</span>
                            </div>
                          )}
                          {user.role === 'admin' && (
                            <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center gap-1">
                              <ShieldCheck size={12} className="text-purple-600 dark:text-purple-400" />
                              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">Admin</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Join Date */}
                      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">Joined</p>
                        <p className="text-sm text-gray-900 dark:text-white font-semibold">
                          {joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{daysAgo} days ago</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Streak */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-3 border border-orange-200/50 dark:border-orange-800/30">
                          <p className="text-xs text-orange-700 dark:text-orange-400 font-medium uppercase tracking-wide">Streak</p>
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-300 flex items-center gap-1">
                            {user.streak} 🔥
                          </p>
                        </div>

                        {/* Generations */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-200/50 dark:border-blue-800/30">
                          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium uppercase tracking-wide">Reflections</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                            {user.generation_count}
                          </p>
                        </div>
                      </div>

                      {/* Qur'ān Progress (Gamified Journey) */}
                      {user.quran_current_day && (
                        <div className="mb-4 p-3 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl border border-teal-200/50 dark:border-teal-800/30">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-teal-700 dark:text-teal-400 font-medium uppercase tracking-wide">📖 Qur'ān Journey</p>
                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{quranProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                            <div 
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-300"
                              style={{ width: `${quranProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                            Day {user.quran_current_day}/29 • Phase {user.quran_current_phase || 1}/5
                          </p>
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1">
                            Phases: ? / 145 Completed
                          </p>
                        </div>
                      )}

                      {/* Daily Limit */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide mb-2">Daily Limit</p>
                        {editLimitId === user.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              value={tempLimit}
                              onChange={(e) => setTempLimit(parseInt(e.target.value))}
                              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white font-semibold outline-none focus:border-emerald-500"
                              min="1"
                              max="50"
                              autoFocus
                            />
                            <button 
                              onClick={() => saveLimit(user.id)} 
                              className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 flex items-center justify-center transition-all"
                            >
                              <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => { setEditLimitId(user.id); setTempLimit(user.rate_limit_override); }}
                            className="w-full px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-bold cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all border border-emerald-300 dark:border-emerald-700"
                          >
                            {user.rate_limit_override} generations/day
                          </button>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleBan(user.id, user.is_banned)}
                          className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                            user.is_banned 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-green-100 dark:hover:bg-green-900/30' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                          }`}
                        >
                          {user.is_banned ? "Unban" : "Ban"}
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id, user.name)}
                          className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center transition-all"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Showing {(currentPage - 1) * USERS_PER_PAGE + 1} to {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                    >
                      ← Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isActive = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg font-semibold transition-all text-sm ${
                              isActive
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && <span className="text-gray-600 dark:text-gray-400 px-2">...</span>}
                    </div>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* Summary Cards - Updated positioning */}
              <div className="grid grid-cols-3 gap-4 mt-4">
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
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{bannedCount}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center">
                    <Zap size={24} className="text-white" strokeWidth={2} />
                  </div>
                  Broadcast Messages
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Send messages to all app users</p>
              </div>

              {/* Create Message Form */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Message</h3>
                
                <input
                  type="text"
                  placeholder="Enter message text"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  placeholder="Optional: Message details or full text"
                  value={broadcastDetails}
                  onChange={(e) => setBroadcastDetails(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Action button text (optional)"
                    value={broadcastActionText}
                    onChange={(e) => setBroadcastActionText(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="Action button URL (optional)"
                    value={broadcastActionUrl}
                    onChange={(e) => setBroadcastActionUrl(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleCreateBroadcast}
                  disabled={broadcastLoading || !broadcastMessage.trim()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  {broadcastLoading ? 'Creating...' : 'Send Message to All Users'}
                </button>
              </div>

              {/* Active Messages List */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Messages ({broadcastMessages.length})</h3>
                
                {broadcastMessages.length === 0 ? (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No active messages</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {broadcastMessages.map((msg) => (
                      <div key={msg.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-white break-words">{msg.message}</p>
                            {msg.action_text && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Button: <span className="font-semibold">{msg.action_text}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handlePauseBroadcast(msg.id)}
                            className="text-sm px-3 py-1 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all"
                          >
                            Pause
                          </button>
                          <button
                            onClick={() => handleDeleteBroadcast(msg.id)}
                            className="text-sm px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                          >
                            Delete
                          </button>
                        </div>
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
  );
};

export default AdminDashboardEnhanced;
