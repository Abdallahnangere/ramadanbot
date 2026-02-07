import React, { useEffect, useState } from 'react';
import { FormData, User } from '../types';
import { generateFlyer, downloadFlyer, slugify } from '../lib/flyerGenerator';
import LoadingSpinner from './LoadingSpinner';
import { Download, Share2, RefreshCcw, Sparkles, XCircle, CheckCircle2, Info } from 'lucide-react';

interface FlyerPreviewProps {
  message: string;
  formData: FormData;
  onReset: () => void;
  user: User;
  onDownloaded?: (url: string) => void;
}

const FlyerPreview: React.FC<FlyerPreviewProps> = ({ message, formData, onReset, user, onDownloaded }) => {
  const [flyerUrl, setFlyerUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    let mounted = true;

    const createFlyer = async () => {
      setError(null);
      setIsGenerating(true);
      try {
        if (!message || !user.name) throw new Error("Missing data for generation");

        // 1080x1080 Square config
        const url = await generateFlyer({
          width: 1080,
          height: 1080,
          backgroundColor: '#0f766e',
          textColor: '#ffffff',
          userName: user.name,
          topic: formData.topic,
          day: formData.day,
          message: message
        });
        
        if (mounted) {
          if (!url || url.length < 100) throw new Error("Generated image is invalid");
          setFlyerUrl(url);
          setIsGenerating(false);
        }
      } catch (err: any) {
        if (mounted) {
          console.error("Preview Generation Error", err);
          console.error("Error details:", err.message || JSON.stringify(err));
          setError("Design render failed: " + (err.message || "Unknown error"));
          setIsGenerating(false);
        }
      }
    };
    
    const t = setTimeout(createFlyer, 500);
    return () => { 
        mounted = false; 
        clearTimeout(t);
    };
  }, [message, formData, user]);

  const handleDownload = () => {
    if (flyerUrl) {
      const fileName = `Ramadan_Day_${formData.day}_${slugify(formData.topic)}.png`;
      downloadFlyer(flyerUrl, fileName);
      setHasDownloaded(true);
      if (onDownloaded) {
        onDownloaded(flyerUrl);
      }
    }
  };

  const handleRedownload = () => {
    if (flyerUrl) {
      const fileName = `Ramadan_Day_${formData.day}_${slugify(formData.topic)}.png`;
      downloadFlyer(flyerUrl, fileName);
    }
  };

  const getShareCaption = () => {
    return `Ramadan Day ${formData.day}: ${formData.topic}\n\n"${message.substring(0, 50)}..."\n\nDesign by RamadanBot | ${user.name}`;
  };

  const handleShare = async () => {
    if (navigator.share && flyerUrl) {
        try {
            const response = await fetch(flyerUrl);
            const blob = await response.blob();
            const file = new File([blob], `Ramadan_Day_${formData.day}.png`, { type: 'image/png' });
            
            await navigator.share({
                title: 'My Ramadan Reflection',
                text: getShareCaption(),
                files: [file]
            });
        } catch (e) {
            console.log("Error sharing", e);
            showNotification('error', 'Share cancelled or failed.');
        }
    } else {
        handleDownload();
    }
  };

  // Loading State - Apple Style
  if (isGenerating) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-6"
        style={{
          background: 'linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #000000 100%)',
        }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(0, 122, 255, 0.4) 0%, rgba(88, 86, 214, 0.3) 50%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Animated spinner container */}
          <div className="relative">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl opacity-70"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            />
            <div className="relative">
              <LoadingSpinner size="lg" color="text-blue-400" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-300"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              Crafting Your Reflection
            </h3>
            <p 
              className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Designing your beautiful flyer with precision and care
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400"
                    style={{
                      animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  // Success Screen After Download - Apple Style
  if (hasDownloaded) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8"
        style={{
          background: 'linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #000000 100%)',
        }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, rgba(16, 185, 129, 0.3) 50%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative z-10 space-y-8 max-w-sm w-full">
          {/* Success icon with animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-2xl"
                style={{ transform: 'scale(1.5)' }}
              />
              <div 
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl"
                style={{
                  animation: 'scaleIn 0.5s ease-out',
                  boxShadow: '0 20px 60px rgba(52, 211, 153, 0.4)'
                }}
              >
                <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-300"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              Flyer Downloaded!
            </h2>
            <p 
              className="text-gray-400 text-base"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Share it with your loved ones
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleRedownload}
              className="w-full backdrop-blur-2xl bg-white/[0.08] border border-white/[0.12] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.97]"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <Download size={20} strokeWidth={2.5} />
              <span>Download Again</span>
            </button>

            <button
              onClick={() => {
                const caption = `Ramadan Day ${formData.day}: ${formData.topic}\\n\\n"${message.substring(0, 60)}..."\\n\\nCreated with RamadanBot`;
                if (navigator.share) {
                  navigator.share({
                    title: 'My Ramadan Reflection',
                    text: caption
                  }).catch(() => {});
                }
              }}
              className="w-full font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.97]"
              style={{
                background: 'linear-gradient(180deg, #007AFF 0%, #0051D5 100%)',
                color: 'white',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                boxShadow: '0 8px 24px rgba(0, 122, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <Share2 size={20} strokeWidth={2.5} />
              <span>Share Reflection</span>
            </button>

            <button
              onClick={onReset}
              className="w-full backdrop-blur-2xl bg-white/[0.05] text-gray-300 font-semibold py-4 rounded-2xl transition-all active:scale-[0.97]"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              Return to Home
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Error State - Apple Style
  if (error) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8"
        style={{
          background: 'linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #000000 100%)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 50%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative z-10 space-y-6 max-w-sm">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl flex items-center justify-center border border-red-500/30">
              <XCircle size={40} className="text-red-400" strokeWidth={2} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 
              className="text-2xl font-bold text-white"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}
            >
              Generation Failed
            </h3>
            <p 
              className="text-gray-400 text-sm leading-relaxed"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              {error}
            </p>
          </div>

          <button 
            onClick={onReset}
            className="w-full font-semibold py-4 rounded-2xl transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(180deg, #007AFF 0%, #0051D5 100%)',
              color: 'white',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              boxShadow: '0 8px 24px rgba(0, 122, 255, 0.4)'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main Preview Screen - Apple Style
  return (
    <div 
      className="flex flex-col h-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #000000 100%)',
      }}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 122, 255, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div 
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl backdrop-blur-2xl border shadow-2xl flex items-center gap-3 max-w-sm"
          style={{
            background: notification.type === 'success' 
              ? 'rgba(52, 211, 153, 0.15)' 
              : notification.type === 'error'
              ? 'rgba(239, 68, 68, 0.15)'
              : 'rgba(59, 130, 246, 0.15)',
            borderColor: notification.type === 'success'
              ? 'rgba(52, 211, 153, 0.3)'
              : notification.type === 'error'
              ? 'rgba(239, 68, 68, 0.3)'
              : 'rgba(59, 130, 246, 0.3)',
            animation: 'slideDown 0.3s ease-out',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
          }}
        >
          {notification.type === 'success' && <CheckCircle2 size={20} className="text-green-400" />}
          {notification.type === 'error' && <XCircle size={20} className="text-red-400" />}
          {notification.type === 'info' && <Info size={20} className="text-blue-400" />}
          <span className="text-white text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header Badge */}
      <div className="relative z-10 text-center pt-8 pb-4 px-6">
        <div 
          className="inline-flex items-center gap-2 backdrop-blur-xl bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 px-4 py-2 rounded-full shadow-lg"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
          }}
        >
          <Sparkles size={16} className="text-green-400" />
          <span className="text-green-300 text-sm font-semibold">Reflection Complete</span>
        </div>
        <h2 
          className="text-xl font-bold text-white mt-3"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-0.01em'
          }}
        >
          Your Daily Reflection
        </h2>
      </div>

      {/* Flyer Preview - Premium Card */}
      <div className="flex-1 flex justify-center items-center px-6 py-6 relative z-10">
        <div className="relative w-full max-w-[320px]">
          {/* Card shadow layers */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[32px] blur-2xl"
            style={{ transform: 'scale(1.05)' }}
          />
          
          <div 
            className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-[28px] border border-white/[0.12] p-4 shadow-2xl"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              aspectRatio: '1/1'
            }}
          >
            {flyerUrl ? (
              <img 
                src={flyerUrl} 
                alt="Ramadan Flyer" 
                className="w-full h-full object-cover rounded-[24px]"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  animation: 'fadeIn 0.5s ease-out'
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-[24px] flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="relative z-10 px-6 pb-8 space-y-4">
        {/* Primary Download Button */}
        <button
          onClick={handleDownload}
          className="w-full font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
            color: '#000',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            boxShadow: '0 8px 24px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              animation: 'shimmer 2s infinite'
            }}
          />
          <Download size={20} strokeWidth={2.5} className="relative z-10" />
          <span className="relative z-10">Download Flyer</span>
        </button>

        {/* Social Share Grid */}
        <div className="space-y-3">
          <p 
            className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            Share on
          </p>
          <div className="grid grid-cols-4 gap-3">
            {/* WhatsApp */}
            <button
              onClick={async () => {
                if (flyerUrl) {
                  try {
                    const response = await fetch(flyerUrl);
                    const blob = await response.blob();
                    const file = new File([blob], `Ramadan_Day_${formData.day}.png`, { type: 'image/png' });
                    const caption = `Day ${formData.day} | Streak: ${user.streak} days | RamadanBot`;
                    
                    if (navigator.share) {
                      await navigator.share({
                        title: 'My Ramadan Reflection',
                        text: caption,
                        files: [file]
                      });
                    } else {
                      await navigator.clipboard?.writeText(caption);
                      window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, '_blank');
                    }
                  } catch (e) {
                    console.log('Share error:', e);
                  }
                }
              }}
              className="aspect-square backdrop-blur-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 rounded-2xl flex items-center justify-center transition-all active:scale-[0.95]"
              style={{ boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)' }}
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-6 h-6" />
            </button>

            {/* X (Twitter) */}
            <button
              onClick={async () => {
                if (flyerUrl) {
                  const caption = `Day ${formData.day} of #Ramadan\n\n"${message.substring(0, 80)}..."\n\nMy Streak: ${user.streak} days 🔥\n\n#RamadanBot #IslamicReflection`;
                  const text = encodeURIComponent(caption);
                  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                  showNotification('info', '💡 Upload the flyer image in Twitter for max engagement!');
                }
              }}
              className="aspect-square backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-[0.95]"
              style={{ boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)' }}
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.669-5.829 6.669h-3.328l7.731-8.835L.424 2.25h6.679l4.882 6.479 5.288-6.479zM17.002 20.331h1.834L6.822 4.169H4.881z"/>
              </svg>
            </button>

            {/* Facebook */}
            <button
              onClick={() => {
                if (flyerUrl) {
                  const caption = `Check out my Day ${formData.day} Ramadan reflection!\n\nMy streak: ${user.streak} days\n\nCreate your own at RamadanBot`;
                  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(caption)}`;
                  window.open(url, '_blank');
                }
              }}
              className="aspect-square backdrop-blur-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/40 rounded-2xl flex items-center justify-center transition-all active:scale-[0.95]"
              style={{ boxShadow: '0 4px 12px rgba(24, 119, 242, 0.2)' }}
            >
              <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Snapchat */}
            <button
              onClick={async () => {
                if (flyerUrl) {
                  try {
                    const response = await fetch(flyerUrl);
                    const blob = await response.blob();
                    const file = new File([blob], `Ramadan_Day_${formData.day}.png`, { type: 'image/png' });
                    const caption = `Day ${formData.day}\n\nRamadan Reflection\n\nStreak: ${user.streak} days`;
                    
                    if (navigator.share) {
                      await navigator.share({
                        title: 'My Ramadan Flyer',
                        text: caption,
                        files: [file]
                      });
                    } else {
                      handleRedownload();
                    }
                  } catch (e) {
                    console.log('Share error:', e);
                  }
                }
              }}
              className="aspect-square backdrop-blur-xl bg-[#FFFC00]/20 hover:bg-[#FFFC00]/30 border border-[#FFFC00]/40 rounded-2xl flex items-center justify-center transition-all active:scale-[0.95]"
              style={{ boxShadow: '0 4px 12px rgba(255, 252, 0, 0.2)' }}
            >
              <img src="/snap.png" alt="Snapchat" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={handleShare} 
            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <Share2 size={18} strokeWidth={2.5} />
            <span>More</span>
          </button>
          
          <button 
            onClick={onReset} 
            className="backdrop-blur-xl bg-white/[0.05] text-gray-300 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            <RefreshCcw size={18} strokeWidth={2.5} />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Inline Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default FlyerPreview;
