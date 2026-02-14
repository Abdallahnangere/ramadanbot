'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Zap,
  Lock,
  CheckCircle2,
  Volume2,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  Menu,
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
  // Navigation & State
  const [currentDay, setCurrentDay] = useState(user.quran_current_day || 1);
  const [currentPhase, setCurrentPhase] = useState(user.quran_current_phase || 1);
  const [currentPageOffset, setCurrentPageOffset] = useState(0); // 0-3 for 4 pages per phase
  const [completedPhases, setCompletedPhases] = useState<CompletedPhase[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [pageLoadError, setPageLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState('');
  const [preloadedImages, setPreloadedImages] = useState<Map<string, string>>(new Map());
  const daySelectRef = useRef<HTMLDivElement>(null);

  // Load completed phases on mount
  useEffect(() => {
    if (user.id) {
      getCompletedQuranPhases(user.id).then((result) => {
        if (result.success && result.completedPhases) {
          setCompletedPhases(result.completedPhases);
        }
      });
    }
  }, [user.id]);

  // Close day selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (daySelectRef.current && !daySelectRef.current.contains(event.target as Node)) {
        setShowDaySelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect dark mode preference
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Get current page number based on day, phase, and offset
  const getPageNumber = (day: number, phase: number, offset: number): number => {
    const range = getPhasePageRange(day, phase);
    return range.start + offset;
  };

  const currentPageNumber = getPageNumber(currentDay, currentPhase, currentPageOffset);
  const pageRange = getPhasePageRange(currentDay, currentPhase);
  const totalPages = QURAN_CONFIG.TOTAL_PAGES;
  const isPhaseCompleted = completedPhases.some((p) => p.day === currentDay && p.phase === currentPhase);
  const isPhaseLocked =
    currentDay === 1 && currentPhase === 1
      ? false
      : currentPhase > 1
      ? !completedPhases.some((p) => p.day === currentDay && p.phase === currentPhase - 1)
      : currentDay > 1
      ? ![1, 2, 3, 4, 5].every((p) =>
          completedPhases.some((cp) => cp.day === currentDay - 1 && cp.phase === p)
        )
      : false;

  // Get page image URL
  const getPageImageUrl = (pageNum: number): string => {
    const paddedNum = String(pageNum).padStart(3, '0');
    // Attempt PNG first (converted format), will fallback if not found
    return `/${paddedNum}___Hafs39__DM.png`;
  };

  const pageImageUrl = getPageImageUrl(currentPageNumber);
  const overallProgress = calculateOverallProgress(user.quran_total_pages_read || currentPageNumber);

  // Preload adjacent pages
  useEffect(() => {
    const pagesToPreload = [
      currentPageNumber - 1,
      currentPageNumber,
      currentPageNumber + 1,
      currentPageNumber + 2,
    ]
      .filter((p) => p >= 1 && p <= totalPages)
      .map(getPageImageUrl);

    pagesToPreload.forEach((url) => {
      if (!preloadedImages.has(url)) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [currentPageNumber, totalPages, preloadedImages]);

  // Navigation handlers
  const handleNextPage = () => {
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
    setPageLoadError(null);
  };

  const handlePrevPage = () => {
    if (currentPageOffset > 0) {
      setCurrentPageOffset(currentPageOffset - 1);
    } else if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
      const prevRange = getPhasePageRange(currentDay, currentPhase - 1);
      setCurrentPageOffset(prevRange.count - 1);
    } else if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setCurrentPhase(QURAN_CONFIG.PHASES_PER_DAY);
      const prevRange = getPhasePageRange(currentDay - 1, QURAN_CONFIG.PHASES_PER_DAY);
      setCurrentPageOffset(prevRange.count - 1);
    }
    setPageLoadError(null);
  };

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

        // Check if fully completed
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
      console.error('Error completing phase:', error);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm md:p-4">
      {/* Main Reader */}
      <div
        className={`relative w-full h-full md:max-w-4xl md:h-auto md:rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
          isDarkMode ? 'bg-gray-950' : 'bg-white'
        } transition-colors`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 md:px-6 py-4 border-b ${
            isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'
          } backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3">
            <BookOpen
              className={`${isDarkMode ? 'text-amber-500' : 'text-amber-600'}`}
              size={24}
            />
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Quran Reader
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Day {currentDay} • Phase {currentPhase} • Page {currentPageNumber}/604
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className={`px-4 md:px-6 py-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Overall Progress
            </span>
            <span className={`text-sm font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              {overallProgress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-300 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Page Display Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-6 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-950 dark:to-gray-900">
          {isPhaseLocked ? (
            <div className="text-center space-y-4">
              <Lock size={48} className={isDarkMode ? 'text-gray-600 mx-auto' : 'text-gray-400 mx-auto'} />
              <div>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  Phase Locked
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Complete the previous section to unlock
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <img
                key={pageImageUrl}
                src={pageImageUrl}
                alt={`Quran Page ${currentPageNumber}`}
                className={`max-w-full max-h-full object-contain rounded-lg shadow-lg transition-opacity ${
                  pageLoadError ? 'opacity-50' : 'opacity-100'
                }`}
                onError={() => {
                  setPageLoadError(`Failed to load page ${currentPageNumber}`);
                }}
                onLoad={() => {
                  setPageLoadError(null);
                }}
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center',
                }}
              />
              {pageLoadError && (
                <div className={`text-center p-6 rounded-lg max-w-md ${isDarkMode ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'}`}>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-amber-400' : 'text-amber-900'} mb-2`}>
                    📄 Pages Not Ready Yet
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-amber-300/80' : 'text-amber-900/70'} mb-3 leading-relaxed`}>
                    Your Quran pages need to be converted from .ai format to .png format for web display. This is a one-time setup!
                  </p>
                  <a href="/QURAN_PNG_CONVERSION_GUIDE.md" target="_blank" rel="noopener noreferrer" className={`inline-block px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isDarkMode 
                      ? 'bg-amber-700 text-white hover:bg-amber-600' 
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}>
                    📖 View Setup Guide
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm md:rounded-3xl">
            <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl p-8 text-center max-w-xs shadow-2xl">
              <CheckCircle2 size={64} className="mx-auto text-white mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">Excellent!</h3>
              <p className="text-white/90 text-sm leading-relaxed">{congratsMessage}</p>
            </div>
          </div>
        )}

        {/* Controls Footer */}
        <div
          className={`px-4 md:px-6 py-4 border-t flex items-center justify-between gap-3 ${
            isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'
          } backdrop-blur-sm`}
        >
          {/* Left Navigation */}
          <button
            onClick={handlePrevPage}
            disabled={currentPageNumber === 1}
            className={`p-2.5 rounded-lg transition-all ${
              currentPageNumber === 1
                ? 'opacity-30 cursor-not-allowed'
                : isDarkMode
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Center: Phase Info & Zoom */}
          <div className="flex-1 flex items-center justify-center gap-3">
            {/* Zoom Controls */}
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              disabled={zoom === 50}
              className={`p-1.5 rounded transition-colors ${
                zoom === 50 ? 'opacity-30' : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ZoomOut size={18} />
            </button>

            <span className={`text-xs font-semibold min-w-[45px] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {zoom}%
            </span>

            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              disabled={zoom === 150}
              className={`p-1.5 rounded transition-colors ${
                zoom === 150 ? 'opacity-30' : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
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
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bottom Action Bar */}
        {!isPhaseLocked && (
          <div className={`px-4 md:px-6 py-3 flex items-center gap-3 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            {/* Day Selector */}
            <div className="relative" ref={daySelectRef}>
              <button
                onClick={() => setShowDaySelector(!showDaySelector)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Menu size={16} className="inline mr-1.5" />
                Day {currentDay}
              </button>

              {showDaySelector && (
                <div
                  className={`absolute bottom-full mb-2 left-0 max-w-48 max-h-64 overflow-y-auto rounded-lg shadow-xl p-2 grid grid-cols-3 gap-2 ${
                    isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                  }`}
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDaySelect(day)}
                      className={`py-1.5 px-2 rounded text-sm font-semibold transition-all ${
                        currentDay === day
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                          : completedPhases.some((p) => p.day === day && p.phase === 5)
                          ? isDarkMode
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-green-100 text-green-700'
                          : isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phase Display */}
            <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Array.from({ length: QURAN_CONFIG.PHASES_PER_DAY }, (_, i) => i + 1).map((phase) => (
                <div
                  key={phase}
                  className={`w-2 h-2 rounded-full transition-all ${
                    phase < currentPhase
                      ? 'bg-green-500'
                      : phase === currentPhase
                      ? 'bg-amber-500'
                      : isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Complete Phase Button */}
            <button
              onClick={handleCompletePhase}
              disabled={isPhaseCompleted || isSubmitting || isPhaseLocked}
              className={`ml-auto px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                isPhaseCompleted
                  ? isDarkMode
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-green-100 text-green-700'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg'
              }`}
            >
              {isPhaseCompleted ? (
                <>
                  <CheckCircle2 size={18} />
                  Completed
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Complete Phase
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
