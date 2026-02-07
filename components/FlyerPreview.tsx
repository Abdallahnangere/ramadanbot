import React, { useEffect, useState, useRef } from 'react';
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
  const hasGeneratedRef = useRef(false); // Prevent double generation

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    // Prevent double generation
    if (hasGeneratedRef.current) return;
    
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
          hasGeneratedRef.current = true; // Mark as generated
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
  }, [message, formData.day, formData.topic, user.name]); // Only regenerate if actual data changes

  const handleDownload = () => {
    if (flyerUrl) {
      const fileName = `Ramadan_Day_${formData.day}_${slugify(formData.topic)}.png`;
      downloadFlyer(flyerUrl, fileName);
      setHasDownloaded(true);
      if (onDownloaded) {
        onDownloaded(flyerUrl);
      }
      showNotification('success', 'Flyer downloaded successfully');
    }
  };

  const handleRedownload = () => {
    if (flyerUrl) {
      const fileName = `Ramadan_Day_${formData.day}_${slugify(formData.topic)}.png`;
      downloadFlyer(flyerUrl, fileName);
      showNotification('success', 'Downloaded again');
    }
  };

  // Share to WhatsApp with image
  const shareToWhatsApp = async () => {
    if (!flyerUrl) return;
    
    try {
      const caption = `🌙 Ramadan Day ${formData.day}: ${formData.topic}\n\n"${message.substring(0, 100)}..."\n\n✨ Created with RamadanBot by ${user.name}\n🔥 My Streak: ${user.streak} days`;
      
      // Try native share first (mobile)
      if (navigator.share) {
        const response = await fetch(flyerUrl);
        const blob = await response.blob();
        const file = new File([blob], `Ramadan_Day_${formData.day}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'My Ramadan Reflection',
          text: caption,
          files: [file]
        });
        showNotification('success', 'Shared to WhatsApp');
      } else {
        // Fallback: Download first then open WhatsApp
        handleDownload();
        setTimeout(() => {
          window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, '_blank');
          showNotification('info', 'Attach the downloaded image to WhatsApp');
        }, 500);
      }
    } catch (e) {
      console.log('WhatsApp share error:', e);
      showNotification('error', 'Share cancelled');
    }
  };

  // Share to X (Twitter) with image
  const shareToTwitter = async () => {
    if (!flyerUrl) return;
    
    try {
      const caption = `Day ${formData.day} of #Ramadan 🌙\n\n"${message.substring(0, 120)}..."\n\nMy Streak: ${user.streak} days 🔥\n\n#RamadanBot #IslamicReflection #SpiritualJourney`;
      
      // Try native share first
      if (navigator.share) {
        const response = await fetch(flyerUrl);
        const blob = await response.blob();
        const file = new File([blob], `Ramadan_Day_${formData.day}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'My Ramadan Reflection',
          text: caption,
          files: [file]
        });
        showNotification('success', 'Shared to X');
      } else {
        // Fallback: Download and open Twitter
        handleDownload();
        setTimeout(() => {
          const text = encodeURIComponent(caption);
          window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
          showNotification('info', 'Attach the downloaded image on X/Twitter');
        }, 500);
      }
    } catch (e) {
      console.log('Twitter share error:', e);
    }
  };

  // Share to Facebook with image
  const shareToFacebook = async () => {
    if (!flyerUrl) return;
    
    try {
      const caption = `Check out my Day ${formData.day} Ramadan reflection! 🌙\n\nMy streak: ${user.streak} days 🔥\n\nCreate your own spiritual journey at RamadanBot`;
      
      // Try native share first
      if (navigator.share) {
        const response = await fetch(flyerUrl);
        const blob = await response.blob();
        const file = new File([blob], `Ramadan_Day_${formData.day}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'My Ramadan Reflection',
          text: caption,
          files: [file]
        });
        showNotification('success', 'Shared to Facebook');
      } else {
        // Fallback: Download and open Facebook
        handleDownload();
        setTimeout(() => {
          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(caption)}`;
          window.open(url, '_blank');
          showNotification('info', 'Attach the downloaded image on Facebook');
        }, 500);
      }
    } catch (e) {
      console.log('Facebook share error:', e);
    }
  };

  // Share to Snapchat with image
  const shareToSnapchat = async () => {
    if (!flyerUrl) return;
    
    try {
      const caption = `Day ${formData.day} 🌙\n\nRamadan Reflection\n\nStreak: ${user.streak} days 🔥\n\nRamadanBot`;
      
      // Try native share
      if (navigator.share) {
        const response = await fetch(flyerUrl);
        const blob = await response.blob();
        const file = new File([blob], `Ramadan_Day_${formData.day}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'My Ramadan Flyer',
          text: caption,
          files: [file]
        });
        showNotification('success', 'Shared to Snapchat');
      } else {
        handleDownload();
        showNotification('info', 'Share from gallery to Snapchat');
      }
    } catch (e) {
      console.log('Snapchat share error:', e);
    }
  };

  const handleShare = async () => {
    if (navigator.share && flyerUrl) {
        try {
            const response = await fetch(flyerUrl);
            const blob = await response.blob();
            const file = new File([blob], `Ramadan_Day_${formData.day}.png`, { type: 'image/png' });
            const caption = `Ramadan Day ${formData.day}: ${formData.topic}\n\nCreated with RamadanBot`;
            
            await navigator.share({
                title: 'My Ramadan Reflection',
                text: caption,
                files: [file]
            });
        } catch (e) {
            console.log("Error sharing", e);
        }
    } else {
        handleDownload();
    }
  };

  // Loading State - Apple.com minimal style
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-block">
            <LoadingSpinner size="lg" color="text-gray-900" />
          </div>
          
          <div className="space-y-2">
            <h3 
              className="text-2xl font-semibold text-gray-900 tracking-tight"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}
            >
              Creating your reflection
            </h3>
            <p 
              className="text-[17px] text-gray-500 leading-relaxed"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Just a moment while we design something beautiful
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen - Apple.com clean style
  if (hasDownloaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
        <div className="text-center space-y-8 max-w-sm w-full">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500">
            <CheckCircle2 size={32} className="text-white" strokeWidth={2.5} />
          </div>

          <div className="space-y-3">
            <h2 
              className="text-3xl font-semibold text-gray-900 tracking-tight"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}
            >
              Flyer saved
            </h2>
            <p 
              className="text-[17px] text-gray-500"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Share your reflection with the world
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleRedownload}
              className="w-full bg-white border border-gray-300 text-gray-900 font-medium py-3.5 px-6 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              <Download size={18} />
              <span>Download again</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full bg-blue-500 text-white font-medium py-3.5 px-6 rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>

            <button
              onClick={onReset}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3.5 px-6 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error State - Apple.com style
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <XCircle size={32} className="text-red-500" strokeWidth={2} />
          </div>

          <div className="space-y-2">
            <h3 
              className="text-2xl font-semibold text-gray-900"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}
            >
              Something went wrong
            </h3>
            <p 
              className="text-[15px] text-gray-500 leading-relaxed"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              {error}
            </p>
          </div>

          <button 
            onClick={onReset}
            className="w-full max-w-xs bg-blue-500 text-white font-medium py-3.5 px-6 rounded-xl hover:bg-blue-600 transition-colors"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Main Preview - Apple.com clean, light design
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Notification Toast - Apple style */}
      {notification && (
        <div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-xl bg-gray-900 text-white shadow-2xl flex items-center gap-3 max-w-sm animate-slide-down"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
        >
          {notification.type === 'success' && <CheckCircle2 size={18} className="text-green-400" />}
          {notification.type === 'error' && <XCircle size={18} className="text-red-400" />}
          {notification.type === 'info' && <Info size={18} className="text-blue-400" />}
          <span className="text-[15px] font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center pt-8 pb-6 px-6 border-b border-gray-200">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium mb-3">
          <Sparkles size={14} />
          <span>Ready to share</span>
        </div>
        <h2 
          className="text-2xl font-semibold text-gray-900 tracking-tight"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}
        >
          Your reflection
        </h2>
      </div>

      {/* Flyer Preview */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-sm">
          {flyerUrl ? (
            <img 
              src={flyerUrl} 
              alt="Ramadan Flyer" 
              className="w-full rounded-2xl shadow-xl"
              style={{ aspectRatio: '1/1' }}
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
              <span className="text-gray-400">No preview</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-8 space-y-4 border-t border-gray-200 pt-6">
        {/* Primary Download */}
        <button
          onClick={handleDownload}
          className="w-full bg-blue-500 text-white font-medium text-[17px] py-4 rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center justify-center gap-2.5"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
        >
          <Download size={20} strokeWidth={2.5} />
          <span>Download</span>
        </button>

        {/* Social Share */}
        <div className="space-y-3">
          <p 
            className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            Share
          </p>
          
          <div className="grid grid-cols-4 gap-3">
            {/* WhatsApp */}
            <button
              onClick={shareToWhatsApp}
              className="aspect-square bg-[#25D366] hover:bg-[#20BA5A] rounded-xl flex items-center justify-center transition-colors active:scale-95"
              title="Share to WhatsApp with image"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-7 h-7" />
            </button>

            {/* X (Twitter) */}
            <button
              onClick={shareToTwitter}
              className="aspect-square bg-black hover:bg-gray-800 rounded-xl flex items-center justify-center transition-colors active:scale-95"
              title="Share to X with image"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.669-5.829 6.669h-3.328l7.731-8.835L.424 2.25h6.679l4.882 6.479 5.288-6.479zM17.002 20.331h1.834L6.822 4.169H4.881z"/>
              </svg>
            </button>

            {/* Facebook */}
            <button
              onClick={shareToFacebook}
              className="aspect-square bg-[#1877F2] hover:bg-[#166FE5] rounded-xl flex items-center justify-center transition-colors active:scale-95"
              title="Share to Facebook with image"
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Snapchat */}
            <button
              onClick={shareToSnapchat}
              className="aspect-square bg-[#FFFC00] hover:bg-[#F0ED00] rounded-xl flex items-center justify-center transition-colors active:scale-95"
              title="Share to Snapchat with image"
            >
              <img src="/snap.png" alt="Snapchat" className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={handleShare} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:bg-gray-300"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            <Share2 size={18} />
            <span>More</span>
          </button>
          
          <button 
            onClick={onReset} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:bg-gray-300"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            <RefreshCcw size={18} />
            <span>New</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FlyerPreview;
