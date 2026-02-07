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
    <div 
      className="h-full flex flex-col items-center justify-between relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #000000 100%)',
        color: '#ffffff' 
      }}
    >
      
      {/* Enhanced Background Ambience - Apple-style mesh gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orb */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 122, 255, 0.4) 0%, rgba(88, 86, 214, 0.3) 50%, transparent 70%)',
            animation: 'pulse 8s ease-in-out infinite'
          }}
        />
        {/* Secondary accent */}
        <div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(175, 82, 222, 0.3) 0%, rgba(0, 122, 255, 0.2) 50%, transparent 70%)',
            animation: 'pulse 10s ease-in-out infinite reverse'
          }}
        />
        {/* Tertiary highlight */}
        <div 
          className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(94, 92, 230, 0.35) 0%, transparent 70%)',
            animation: 'float 12s ease-in-out infinite'
          }}
        />
      </div>

      {/* Glass morphism top bar */}
      <div className="w-full backdrop-blur-xl bg-white/[0.02] border-b border-white/[0.05] z-20">
        <div className="max-w-sm mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Secure Login</span>
          </div>
          <button
            onClick={handlePrivacyClick}
            className="text-[10px] font-medium text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors flex items-center gap-1 group"
          >
            <Lock size={10} className="group-hover:scale-110 transition-transform" />
            Privacy
          </button>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center items-center px-6 py-8 z-10">
        
        {/* Hero Section - Apple style */}
        <div className="text-center mb-12 space-y-6 max-w-sm">
          {/* Logo with elegant shadow */}
          <div className="relative inline-block group">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ transform: 'scale(1.2)' }}
            />
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 rounded-3xl backdrop-blur-sm border border-white/[0.08] shadow-2xl">
              <img 
                src="/logo.png" 
                alt="Ramadan Bot Logo" 
                className="w-24 h-24 object-contain drop-shadow-2xl" 
              />
            </div>
          </div>
          
          {/* Typography - Apple style hierarchy */}
          <div className="space-y-3">
            <h1 
              className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-300"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                letterSpacing: '-0.03em',
                lineHeight: '1.1'
              }}
            >
              RamadanBot
            </h1>
            <p 
              className="text-base text-gray-400 font-medium tracking-tight"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif'
              }}
            >
              Your spiritual companion
            </p>
          </div>
        </div>

        {/* Form Container - Glass morphism card */}
        <div className="w-full max-w-sm">
          <div 
            className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.09] to-white/[0.04] rounded-3xl border border-white/[0.1] shadow-2xl p-8"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <label 
                  className="text-xs font-semibold text-gray-400 ml-1 block uppercase tracking-wide"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  Name
                </label>
                <div className="relative group">
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.12] text-white px-5 py-4 rounded-2xl text-base outline-none transition-all placeholder:text-gray-600 font-medium"
                    placeholder="e.g. Abdallah"
                    required
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      color: 'white',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 122, 255, 0.5)';
                      e.target.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.1), inset 0 2px 8px rgba(0, 0, 0, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.target.style.boxShadow = 'inset 0 2px 8px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                </div>
              </div>
              
              {/* PIN Input */}
              <div className="space-y-2">
                <label 
                  className="text-xs font-semibold text-gray-400 ml-1 block uppercase tracking-wide"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  4-Digit PIN
                </label>
                <div className="relative group">
                  <input 
                    type="password"
                    inputMode="numeric"
                    pattern="\d*"
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setPin(value);
                    }}
                    className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.12] text-white px-5 py-4 rounded-2xl text-base outline-none transition-all tracking-[0.8em] placeholder:tracking-normal placeholder:text-gray-600 font-mono"
                    placeholder="••••"
                    maxLength={4}
                    required
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      color: 'white',
                      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 122, 255, 0.5)';
                      e.target.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.1), inset 0 2px 8px rgba(0, 0, 0, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.target.style.boxShadow = 'inset 0 2px 8px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
                    <ShieldCheck size={18} strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  className="text-center text-red-300 text-sm font-semibold backdrop-blur-xl bg-red-500/10 py-3.5 rounded-2xl border border-red-500/30"
                  style={{
                    animation: 'slideIn 0.3s ease-out',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit Button - Apple style */}
              <button 
                type="submit"
                disabled={isLoading || name.length < 2 || pin.length < 4}
                className="w-full font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed group relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(180deg, #007AFF 0%, #0051D5 100%)',
                  color: 'white',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  boxShadow: '0 8px 24px rgba(0, 122, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && name.length >= 2 && pin.length >= 4) {
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 122, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 122, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Shimmer effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    animation: 'shimmer 2s infinite'
                  }}
                />
                
                {isLoading ? (
                  <LoadingSpinner size="sm" color="text-white" />
                ) : (
                  <>
                    <span className="relative z-10">Continue</span>
                    <ChevronRight size={20} strokeWidth={2.5} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Helper Text */}
            <p 
              className="mt-6 text-center text-sm text-gray-400 leading-relaxed"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Enter your name and PIN to continue.
              <br />
              <span className="text-gray-500 text-xs">New users will create an account automatically.</span>
            </p>
          </div>
        </div>

        {/* Privacy Notice - Subtle but accessible */}
        <div className="mt-8 max-w-sm">
          <p 
            className="text-center text-xs text-gray-500 leading-relaxed"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            By continuing, you agree to our{' '}
            <button
              onClick={handlePrivacyClick}
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors font-medium"
            >
              Privacy Policy
            </button>
            {' '}and data practices.
          </p>
        </div>
      </div>
      
      {/* Footer - Refined */}
      <div className="w-full backdrop-blur-xl bg-white/[0.02] border-t border-white/[0.05] z-20">
        <div className="max-w-sm mx-auto px-6 py-6">
          <p 
            className="text-center text-xs text-gray-500 font-medium tracking-wide"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            Made with ❤️ for the Ummah
            <br />
            <span className="text-gray-600 text-[10px]">Abdallah Nangere · Nigeria 🇳🇬</span>
          </p>
        </div>
      </div>

      {/* Inline Keyframe Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -20px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
