import React, { useState } from 'react';
import { loginUser } from '../app/actions'; // Use Server Action
import { User } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ChevronRight, ShieldCheck, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const result = await loginUser(name, pin);
        
        if (result.success && result.user) {
            onLogin(result.user);
        } else {
            setError(result.error || "Authentication failed");
        }
    } catch (e) {
        setError("Network error. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handlePrivacyClick = () => {
    window.open('https://ramadanbot.vercel.app/privacy', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Navigation Bar - Apple style */}
      <div className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span 
              className="text-xs font-medium text-gray-600"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Secure Login
            </span>
          </div>
          
          <button
            onClick={handlePrivacyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
          >
            <Lock size={14} className="text-gray-600" />
            <span 
              className="text-xs font-medium text-gray-700"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Privacy Policy
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-10">
          
          {/* Hero Section */}
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl blur-2xl opacity-30" />
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-3xl shadow-xl border border-gray-200">
                  <img 
                    src="/logo.png" 
                    alt="RamadanBot" 
                    className="w-20 h-20 object-contain" 
                  />
                </div>
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <h1 
                className="text-5xl font-semibold text-gray-900 tracking-tight"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                RamadanBot
              </h1>
              <p 
                className="text-xl text-gray-500"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                Your spiritual companion
              </p>
            </div>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 block"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  Name
                </label>
                <input 
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3.5 rounded-xl text-base outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Enter your name"
                  required
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}
                />
              </div>
              
              {/* PIN Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="pin"
                  className="text-sm font-medium text-gray-700 block"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  4-Digit PIN
                </label>
                <div className="relative">
                  <input 
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    pattern="\d*"
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setPin(value);
                    }}
                    className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3.5 rounded-xl text-base outline-none transition-all tracking-[0.5em] placeholder:tracking-normal placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-mono pr-12"
                    placeholder="••••"
                    maxLength={4}
                    required
                    style={{ 
                      fontFamily: 'monospace'
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <ShieldCheck size={20} strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading || name.length < 2 || pin.length < 4}
                className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-[17px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="text-white" />
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            {/* Helper Text */}
            <div className="mt-6 text-center space-y-3">
              <p 
                className="text-sm text-gray-600"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                Enter your name and PIN to continue
              </p>
              <p 
                className="text-xs text-gray-500"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                New users will automatically create an account
              </p>
            </div>
          </div>

          {/* Privacy Agreement */}
          <div className="text-center">
            <p 
              className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              By continuing, you agree to our{' '}
              <button
                onClick={handlePrivacyClick}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Privacy Policy
              </button>
              {' '}and data practices
            </p>
          </div>
        </div>
      </div>

      {/* Footer - Professional Branding */}
      <div className="w-full border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span 
                className="font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                Made with love for the Ummah
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">Nigeria 🇳🇬</span>
            </div>
            
            <p 
              className="text-xs text-gray-500 font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              © {new Date().getFullYear()} RamadanBot. All rights reserved.
            </p>
            
            <p 
              className="text-[11px] text-gray-400"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Developed by Abdallah Nangere
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
