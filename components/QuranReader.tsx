'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Zap,
  Lock,
  CheckCircle2,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  Menu,
  Grid,
  BarChart2,
} from 'lucide-react';
import { User } from '../types';
import { completeQuranPhaseEnhanced, getCompletedQuranPhases } from '../app/actions';
import { QURAN_CONFIG, getPhasePageRange, calculateOverallProgress } from '../lib/quranPages';

interface QuranReaderProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onProgressUpdate?: () => void;
}

interface CompletedPhase {
  day: number;
  phase: number;
}

const QuranReader: React.FC<QuranReaderProps> = ({ isOpen, onClose, user, onProgressUpdate }) => {
  // State Management
  const [currentDay, setCurrentDay] = useState(user.quran_current_day || 1);
  const [currentPhase, setCurrentPhase] = useState(user.quran_current_phase || 1);
  const [currentPageOffset, setCurrentPageOffset] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<CompletedPhase[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [preloadedCache, setPreloadedCache] = useState<Set<number>>(new Set());
  
  const daySelectRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Phase calculations
  const pageRange = useMemo(
    () => getPhasePageRange(currentDay, currentPhase),
    [currentDay, currentPhase]
  );
  const currentPageNumber = pageRange.start + currentPageOffset;
  const totalPages = 604;
  const isPhaseLocked =
    currentDay === 1 && currentPhase === 1
      ? false
      : currentPhase > 1
      ? completedPhases.some((p) => p.day === currentDay && p.phase === currentPhase - 1) === false
      : completedPhases.filter((p) => p.day === currentDay - 1).length !== QURAN_CONFIG.PHASES_PER_DAY;
  const isPhaseCompleted = completedPhases.some((p) => p.day === currentDay && p.phase === currentPhase);

  // Load completed phases on mount
  useEffect(() => {
    if (!user?.id || !isOpen) return;

    const loadPhases = async () => {
      try {
        const result = await getCompletedQuranPhases(user.id);
        setCompletedPhases(result.completedPhases || []);
      } catch (error) {
        console.error('Failed to load completed phases:', error);
      }
    };

    loadPhases();
  }, [user?.id, isOpen]);

  // Optimize image loading with preloading strategy for local files
  const getPagePath = useCallback((pageNum: number): string => {
    const paddedNum = String(pageNum).padStart(3, '0');
    return `/page${paddedNum}.png`;
  }, []);

  // Preload adjacent pages for smooth navigation
  const preloadPages = useCallback(() => {
    const pagesToPreload = [
      currentPageNumber - 1,
      currentPageNumber,
      currentPageNumber + 1,
      currentPageNumber + 2,
    ].filter((p) => p >= 1 && p <= totalPages);

    pagesToPreload.forEach((pageNum) => {
      if (!preloadedCache.has(pageNum)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = getPagePath(pageNum);
        link.as = 'image';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);

        setPreloadedCache((prev) => new Set(prev).add(pageNum));
      }
    });
  }, [currentPageNumber, preloadedCache, totalPages, getPagePath]);

  useEffect(() => {
    preloadPages();
  }, [currentPageNumber, preloadPages]);

  // Navigation handlers
  const handleNextPage = useCallback(() => {
    if (currentPageOffset < pageRange.count - 1) {
      setCurrentPageOffset(currentPageOffset + 1);
    } else if (currentPhase < QURAN_CONFIG.PHASES_PER_DAY) {
      setCurrentPhase(currentPhase + 1);
      setCurrentPageOffset(0);
    } else if (currentDay < QURAN_CONFIG.RAMADAN_DAYS) {
      setCurrentDay(currentDay + 1);
      setCurrentPhase(1);
      setCurrentPageOffset(0);
    }
    setImageError(false);
  }, [currentPageOffset, pageRange.count, currentPhase, currentDay]);

  const handlePrevPage = useCallback(() => {
    if (currentPageOffset > 0) {
      setCurrentPageOffset(currentPageOffset - 1);
    } else if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
      const prevRange = getPhasePageRange(currentDay, currentPhase - 1);
      setCurrentPageOffset(prevRange.count - 1);
    } else if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setCurrentPhase(QURAN_CONFIG.PHASES_PER_DAY);
      const prevRange = getPhasePageRange(
        currentDay - 1,
        QURAN_CONFIG.PHASES_PER_DAY
      );
      setCurrentPageOffset(prevRange.count - 1);
    }
    setImageError(false);
  }, [currentPageOffset, currentPhase, currentDay]);

  const handleCompletePhase = async () => {
    if (isPhaseLocked) {
      alert('Complete the previous section to unlock this one');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await completeQuranPhaseEnhanced(user.id, currentDay, currentPhase);

      if (result.success) {
        setCompletedPhases((prev) => {
          const isDuplicate = prev.some((p) => p.day === currentDay && p.phase === currentPhase);
          return isDuplicate ? prev : [...prev, { day: currentDay, phase: currentPhase }];
        });

        const newCount = completedPhases.length + 1;
        if (newCount === 150) {
          setCongratsMessage('🎉 Alhamdulillah! You have completed the entire Quran in 30 days! 📖✨');
        } else if (currentPhase === QURAN_CONFIG.PHASES_PER_DAY) {
          setCongratsMessage(`🌙 Day ${currentDay} Complete! Moving to Day ${currentDay + 1}...`);
        } else {
          setCongratsMessage(`✨ Phase ${currentPhase} Complete! Phase ${currentPhase + 1} unlocked!`);
        }

        setShowCongrats(true);
        setTimeout(() => {
          setShowCongrats(false);
          if (currentPhase < QURAN_CONFIG.PHASES_PER_DAY) {
            setCurrentPhase(currentPhase + 1);
          } else if (currentDay < QURAN_CONFIG.RAMADAN_DAYS) {
            setCurrentDay(currentDay + 1);
            setCurrentPhase(1);
          }
          onProgressUpdate?.();
        }, 2500);
      } else {
        alert(result.error || 'Failed to complete phase');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDaySelect = (day: number) => {
    setCurrentDay(day);
    setCurrentPhase(1);
    setCurrentPageOffset(0);
    setShowDaySelector(false);
  };

  const overallProgress = calculateOverallProgress(user.quran_total_pages_read || currentPageNumber);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextPage, handlePrevPage, onClose]);

  // Close day selector on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (daySelectRef.current && !daySelectRef.current.contains(e.target as Node)) {
        setShowDaySelector(false);
      }
    };

    if (showDaySelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDaySelector]);

  if (!isOpen) return null;

  const currentImagePath = getPagePath(currentPageNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm md:p-4">
      {/* Main Reader Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-full md:max-w-4xl md:h-auto md:rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
          isDarkMode ? 'bg-gray-950' : 'bg-white'
        } transition-colors`}
      >
        {/* Header with Controls */}
        <div
          className={`flex items-center justify-between px-4 md:px-6 py-4 border-b ${
            isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'
          } backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3">
            <BookOpen size={24} className={isDarkMode ? 'text-green-500' : 'text-green-600'} />
            <div className="flex flex-col gap-1">
              <div className="font-bold text-sm">
                Day {currentDay} • Phase {currentPhase}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Page {currentPageNumber} / {totalPages}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Day Selector */}
            <div className="relative" ref={daySelectRef}>
              <button
                onClick={() => setShowDaySelector(!showDaySelector)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Grid size={20} />
              </button>

              {showDaySelector && (
                <div
                  className={`absolute right-0 top-12 w-64 rounded-xl shadow-2xl border ${
                    isDarkMode
                      ? 'bg-gray-900 border-gray-700'
                      : 'bg-white border-gray-200'
                  } z-50 p-3`}
                >
                  <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                      const dayCompleted = completedPhases.filter((p) => p.day === day).length ===
                        QURAN_CONFIG.PHASES_PER_DAY;
                      const dayPartial = completedPhases.some((p) => p.day === day);

                      return (
                        <button
                          key={day}
                          onClick={() => handleDaySelect(day)}
                          className={`p-2 rounded text-xs font-semibold transition-all ${
                            currentDay === day
                              ? 'ring-2 ring-green-500 bg-green-500/20'
                              : dayCompleted
                              ? isDarkMode
                                ? 'bg-green-900/40 text-green-300'
                                : 'bg-green-100 text-green-700'
                              : dayPartial
                              ? isDarkMode
                                ? 'bg-amber-900/40 text-amber-300'
                                : 'bg-amber-100 text-amber-700'
                              : isDarkMode
                              ? 'bg-gray-800 text-gray-400'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Main Image Display Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-3 md:p-6 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950">
          {isPhaseLocked ? (
            <div className="text-center space-y-4">
              <Lock size={64} className={isDarkMode ? 'text-gray-600 mx-auto' : 'text-gray-300 mx-auto'} />
              <div>
                <h3 className={`font-bold text-2xl mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  Phase Locked
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Complete the previous section to unlock
                </p>
              </div>
            </div>
          ) : imageError ? (
            <div className="text-center space-y-3">
              <div className={`text-5xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>❌</div>
              <p className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                Failed to Load Page
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Page {currentPageNumber} could not be loaded
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              {isImageLoading && (
                <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Loading page...
                    </p>
                  </div>
                </div>
              )}
              <img
                ref={imageRef}
                key={currentImagePath}
                src={currentImagePath}
                alt={`Quran Page ${currentPageNumber}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-300"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center',
                }}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setIsImageLoading(false);
                }}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </div>

        {/* Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-3xl p-8 text-center max-w-xs shadow-2xl animate-in zoom-in duration-300">
              <CheckCircle2 size={80} className="mx-auto text-white mb-6 drop-shadow" />
              <h3 className="text-3xl font-black text-white mb-3">Excellent!</h3>
              <p className="text-white/90 text-base leading-relaxed">{congratsMessage}</p>
            </div>
          </div>
        )}

        {/* Controls Footer */}
        <div
          className={`px-4 md:px-6 py-4 border-t flex items-center justify-between gap-3 ${
            isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'
          } backdrop-blur-sm flex-wrap`}
        >
          {/* Left Navigation */}
          <button
            onClick={handlePrevPage}
            disabled={currentPageNumber === 1}
            className={`p-2.5 rounded-lg transition-all ${
              currentPageNumber === 1
                ? 'opacity-30 cursor-not-allowed'
                : isDarkMode
                ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Center: Zoom Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              disabled={zoom === 50}
              className={`p-1.5 rounded transition-colors ${
                zoom === 50 ? 'opacity-30' : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>

            <span className={`text-xs font-semibold min-w-[40px] text-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {zoom}%
            </span>

            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              disabled={zoom === 150}
              className={`p-1.5 rounded transition-colors ${
                zoom === 150 ? 'opacity-30' : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
          </div>

          {/* Right Navigation */}
          <button
            onClick={handleNextPage}
            disabled={currentPageNumber === totalPages}
            className={`p-2.5 rounded-lg transition-all ${
              currentPageNumber === totalPages
                ? 'opacity-30 cursor-not-allowed'
                : isDarkMode
                ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Phase Completion Button */}
        {!isPhaseLocked && !imageError && (
          <div className="px-4 md:px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <button
              onClick={handleCompletePhase}
              disabled={isSubmitting || isPhaseCompleted}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isPhaseCompleted
                  ? isDarkMode
                    ? 'bg-green-900/40 text-green-300 cursor-default'
                    : 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
              }`}
            >
              {isPhaseCompleted ? (
                <>
                  <CheckCircle2 size={18} />
                  Phase Completed
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Complete This Phase
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranReader;
