import React, { useEffect, useState } from 'react';
import { User, AnalyticsData } from '../types';
import { fetchAllUsers, updateUserLimit, toggleUserBan, getAnalytics, adminLogin } from '../app/actions';
import { ArrowLeft, Ban, RefreshCcw, Search, ShieldCheck, TrendingUp, Users, Activity, Lock, Edit3, Save, BarChart3, Zap, Target } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

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
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [search, setSearch] = useState('');
  const [editLimitId, setEditLimitId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<number>(1);

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
    const [usersData, analyticsData] = await Promise.all([
        fetchAllUsers(),
        getAnalytics()
    ]);
    setUsers(usersData);
    setAnalytics(analyticsData);
    setLoading(false);
  };

  // --- MUTATIONS ---
  const handleBan = async (id: string, currentStatus: boolean) => {
    await toggleUserBan(id, !currentStatus);
    loadData(); // Refresh
  };

  const saveLimit = async (id: string) => {
    await updateUserLimit(id, tempLimit);
    setEditLimitId(null);
    loadData();
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-950 dark:to-black animate-fade-in">
      {/* Navbar - Apple Style */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
            {/* Left: Back Button & Title */}
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

            {/* Right: Tab Switcher */}
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
                {/* Header */}
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
                    <button 
                        onClick={() => loadData()} 
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all active:scale-95"
                    >
                        <RefreshCcw size={18} className="text-gray-700 dark:text-gray-200" />
                    </button>
                </div>

                {/* Stats Grid - Apple Card Style */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Total Users */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Users size={24} strokeWidth={2} />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium opacity-90">Total Users</p>
                                <p className="text-4xl font-bold mt-1">{analytics.total_users}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <span className="opacity-90">Registered accounts</span>
                        </div>
                    </div>

                    {/* Total Generations */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Zap size={24} strokeWidth={2} />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium opacity-90">Generations</p>
                                <p className="text-4xl font-bold mt-1">{analytics.total_generations}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <span className="opacity-90">Flyers created</span>
                        </div>
                    </div>

                    {/* Active Streaks */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <TrendingUp size={24} strokeWidth={2} />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium opacity-90">Active Streaks</p>
                                <p className="text-4xl font-bold mt-1">{analytics.active_streaks}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <span className="opacity-90">Users with 1+ day</span>
                        </div>
                    </div>

                    {/* Avg Generations */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Activity size={24} strokeWidth={2} />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium opacity-90">Avg per User</p>
                                <p className="text-4xl font-bold mt-1">{analytics.avg_generations_per_user.toFixed(1)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <span className="opacity-90">Generation rate</span>
                        </div>
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Target size={20} className="text-blue-600 dark:text-blue-400" strokeWidth={2} />
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Peak Streak</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.highest_streak}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">days consecutive</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <ShieldCheck size={20} className="text-green-600 dark:text-green-400" strokeWidth={2} />
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Active Users</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.total_users - (users.filter(u => u.is_banned).length || 0)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">not banned</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Ban size={20} className="text-red-600 dark:text-red-400" strokeWidth={2} />
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Banned</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.filter(u => u.is_banned).length || 0}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">restricted access</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500 flex items-center justify-center">
                            <Users size={24} className="text-white" strokeWidth={2} />
                        </div>
                        User Management
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage user accounts, limits, and permissions</p>
                </div>

                {/* Search Bar - Apple Style */}
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

                {/* Users Table - Apple Style */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Daily Limit</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-base font-bold shadow-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{user.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: ...{user.id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">🔥 {user.streak}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">day streak</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total: {user.generation_count}</span>
                                                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500" 
                                                            style={{ width: `${Math.min((user.generation_count / 50) * 100, 100)}%` }}
                                                        />
                                                    </div>
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
                                                        className="w-20 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                    <button 
                                                        onClick={() => saveLimit(user.id)} 
                                                        className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 flex items-center justify-center transition-all active:scale-95"
                                                    >
                                                        <Save size={16} className="text-green-600 dark:text-green-400" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-semibold">
                                                        {user.rate_limit_override || 3} gen/day
                                                    </span>
                                                    <button 
                                                        onClick={() => { setEditLimitId(user.id); setTempLimit(user.rate_limit_override || 3); }}
                                                        className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Edit3 size={14} className="text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleBan(user.id, user.is_banned)}
                                                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                                                    user.is_banned 
                                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50' 
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400'
                                                }`}
                                            >
                                                {user.is_banned ? "Unban" : "Ban"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 text-center">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{filteredUsers.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 text-center">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Active</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{filteredUsers.filter(u => !u.is_banned).length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 text-center">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Banned</p>
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
