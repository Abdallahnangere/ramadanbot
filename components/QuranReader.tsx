'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, X, BookOpen, Zap, CheckCircle2, ZoomIn, ZoomOut, HelpCircle, ChevronDown, Search,
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
  const [currentDay, setCurrentDay] = useState(user.quran_current_day || 1);
  const [currentPhase, setCurrentPhase] = useState(user.quran_current_phase || 1);
  const [currentPageOffset, setCurrentPageOffset] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<CompletedPhase[]>([]);
  const isDarkMode = true; // Always dark mode
  const [zoom, setZoom] = useState(100);
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showPhaseDropdown, setShowPhaseDropdown] = useState(false);
  const [showHelpToast, setShowHelpToast] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [pageSearch, setPageSearch] = useState('');
  const [touchStartX, setTouchStartX] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const daySelectRef = useRef<HTMLDivElement>(null);
  const phaseSelectRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  // Immediate reader state persistence - save to database on every page change
  const saveReaderState = useCallback(async (day: number, phase: number, pageNum: number) => {
    try {
      await fetch('/api/reader/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPage: pageNum,
          currentDay: day,
          currentPhase: phase,
        }),
      });
    } catch (error) {
      console.error('Failed to save reader state:', error);
    }
  }, [user.id]);

  // Load saved reader state on first open
  useEffect(() => {
    if (!isOpen || isInitialized) return;

    const loadSavedState = async () => {
      try {
        const response = await fetch(`/api/reader/state?userId=${user.id}`);
        const data = await response.json();
        
        if (data.currentDay && data.currentPhase) {
          setCurrentDay(data.currentDay);
          setCurrentPhase(data.currentPhase);
          
          // Calculate offset from page number
          const range = getPhasePageRange(data.currentDay, data.currentPhase);
          const offset = Math.max(0, data.currentPage - range.start);
          setCurrentPageOffset(offset);
        }
      } catch (error) {
        console.error('Failed to load reader state:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSavedState();
  }, [isOpen, isInitialized, user.id]);

  // Calculate current page range and number
  const pageRange = useMemo(() => getPhasePageRange(currentDay, currentPhase), [currentDay, currentPhase]);
  const currentPageNumber = pageRange.start + currentPageOffset;
  const totalPages = 604;
  const isPhaseCompleted = completedPhases.some((p) => p.day === currentDay && p.phase === currentPhase);
  const isLastPageOfPhase = currentPageOffset === pageRange.count - 1;

  // Save reader state immediately on page change
  useEffect(() => {
    if (!isOpen || !isInitialized) return;
    saveReaderState(currentDay, currentPhase, currentPageNumber);
  }, [currentPageNumber, isOpen, isInitialized, saveReaderState]);

  // Load completed phases on open
  useEffect(() => {
    if (!user?.id || !isOpen) return;
    getCompletedQuranPhases(user.id).then((result) => {
      setCompletedPhases(result.completedPhases || []);
    });
  }, [user?.id, isOpen]);

  const getPagePath = useCallback((pageNum: number): string => {
    const paddedNum = String(pageNum).padStart(3, '0');
    return `/page${paddedNum}.png`;
  }, []);

  // Auto-complete phase when LEAVING the final page to transition to next phase
  const handleAutoCompletePhase = async () => {
    if (isSubmitting || isPhaseCompleted) return;
    setIsSubmitting(true);
    
    try {
      const result = await completeQuranPhaseEnhanced(user.id, currentDay, currentPhase);
      if (result.success) {
        setCompletedPhases([...completedPhases, { day: currentDay, phase: currentPhase }]);
        setCongratsMessage(`🎉 Phase ${currentPhase} of Day ${currentDay} Completed! 🎉`);
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 4000);
        onProgressUpdate?.();
      }
    } catch (error) {
      console.error('Failed to complete phase:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Smart phase transition: checks if leaving last page, triggers completion, then transitions
  const handlePhaseTransition = async () => {
    if (!isPhaseCompleted && isLastPageOfPhase) {
      await handleAutoCompletePhase();
    }
  };

  const handleNextPage = useCallback(async () => {
    // If at last page of current phase, trigger completion before advancing
    if (isLastPageOfPhase && !isPhaseCompleted) {
      await handleAutoCompletePhase();
    }

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
  }, [currentPageOffset, pageRange.count, currentPhase, currentDay, isLastPageOfPhase, isPhaseCompleted, handleAutoCompletePhase]);

  const handlePrevPage = useCallback(() => {
    if (currentPageOffset > 0) {
      setCurrentPageOffset(currentPageOffset - 1);
    } else if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
      const prevRange = getPhasePageRange(currentDay, currentPhase - 1);
      setCurrentPageOffset(prevRange.count - 1);
    } else if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setCurrentPhase(5);
      const prevDayRange = getPhasePageRange(currentDay - 1, 5);
      setCurrentPageOffset(prevDayRange.count - 1);
    }
    setImageError(false);
  }, [currentPageOffset, currentPhase, currentDay]);

  const handleGoToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    
    let targetPage = pageNum;
    for (let d = 1; d <= 29; d++) {
      for (let p = 1; p <= 5; p++) {
        const range = getPhasePageRange(d, p);
        if (targetPage >= range.start && targetPage <= range.end) {
          setCurrentDay(d);
          setCurrentPhase(p);
          setCurrentPageOffset(targetPage - range.start);
          setPageSearch('');
          return;
        }
      }
    }
  };

  // Touch/Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance (50px)
      if (diff > 0) handleNextPage(); // Swipe left → next page
      else handlePrevPage(); // Swipe right → previous page
     }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (daySelectRef.current && !daySelectRef.current.contains(e.target as Node)) {
        setShowDayDropdown(false);
      }
      if (phaseSelectRef.current && !phaseSelectRef.current.contains(e.target as Node)) {
        setShowPhaseDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'Escape') {
        if (showHelpToast) setShowHelpToast(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextPage, handlePrevPage, onClose, showHelpToast]);

  if (!isOpen) return null;

  const currentImagePath = getPagePath(currentPageNumber);
  const overallProgress = calculateOverallProgress(currentPageNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm md:p-4">
      <div ref={readerRef} className={`relative w-full h-full md:max-w-5xl md:h-auto md:rounded-3xl overflow-hidden shadow-2xl flex flex-col ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} transition-colors`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        
        {/* Help Toast */}
        {showHelpToast && (
          <div className={`relative z-10 mx-4 mt-4 p-4 rounded-lg border flex items-start gap-3 ${isDarkMode ? 'bg-emerald-900/30 border-emerald-700 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
            <HelpCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Qur'ān Reader Guide</p>
              <p className="text-xs opacity-90 mt-1">The Qur'ān is divided into 29 days and 5 phases daily. Read at your own pace – navigate freely to any day/phase. Progress saves automatically.</p>
            </div>
            <button onClick={() => setShowHelpToast(false)} className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded ${isDarkMode ? 'bg-emerald-900 hover:bg-emerald-800 text-emerald-100' : 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900'}`}>
              Understood
            </button>
          </div>
        )}

        {/* Header */}
        <div className={`flex items-center justify-between px-4 md:px-6 py-4 border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white'} backdrop-blur-sm`}>
          <div className="flex items-center gap-3">
            <BookOpen size={24} className={isDarkMode ? 'text-emerald-500' : 'text-emerald-600'} />
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Qur'ān Reader</h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Day {currentDay} • Phase {currentPhase} • Page {currentPageNumber}/604</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'} font-semibold`}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-600 transition-all" style={{ width: `${overallProgress}%` }} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-6 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950">
          {imageError ? (
            <div className="text-center space-y-3">
              <div className="text-5xl">❌</div>
              <p className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Failed to Load Page</p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {isImageLoading && (
                <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
                  </div>
                </div>
              )}
              <img
                ref={imageRef}
                key={currentImagePath}
                src={currentImagePath}
                alt={`Qur'ān Page ${currentPageNumber}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                onLoad={() => setIsImageLoading(false)}
                onError={() => { setImageError(true); setIsImageLoading(false); }}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </div>

        {/* Congratulations */}
        {showCongrats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-3xl p-8 text-center max-w-xs shadow-2xl">
              <CheckCircle2 size={80} className="mx-auto text-white mb-6" />
              <h3 className="text-3xl font-black text-white mb-3">Excellent!</h3>
              <p className="text-white/90 text-base">{congratsMessage}</p>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className={`px-4 md:px-6 py-4 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'} backdrop-blur-sm`}>
          <div className="space-y-3">
            {/* Search & Navigation */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Page Search */}
              <div className="relative min-w-fit">
                <input
                  type="number"
                  min="1"
                  max="604"
                  placeholder="Go to page..."
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleGoToPage(parseInt(pageSearch) || 0);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} w-32 outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>

              {/* Day Dropdown (List) */}
              <div className="relative" ref={daySelectRef}>
                <button
                  onClick={() => setShowDayDropdown(!showDayDropdown)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 whitespace-nowrap ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-900'}`}
                >
                  Day {currentDay}
                  <ChevronDown size={16} />
                </button>
                {showDayDropdown && (
                  <div className={`absolute bottom-full mb-2 left-0 rounded-lg shadow-xl p-2 max-h-48 overflow-y-auto ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    {Array.from({ length: 29 }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        onClick={() => {
                          setCurrentDay(day);
                          setCurrentPhase(1);
                          setCurrentPageOffset(0);
                          setShowDayDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 rounded text-sm font-semibold transition-all ${
                          currentDay === day
                            ? 'ring-2 ring-emerald-500 bg-emerald-500/20'
                            : completedPhases.filter((p) => p.day === day).length === 5
                            ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                            : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                        }`}
                      >
                        Day {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phase Dropdown */}
              <div className="relative" ref={phaseSelectRef}>
                <button
                  onClick={() => setShowPhaseDropdown(!showPhaseDropdown)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 whitespace-nowrap ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-900'}`}
                >
                  Phase {currentPhase}
                  <ChevronDown size={16} />
                </button>
                {showPhaseDropdown && (
                  <div className={`absolute bottom-full mb-2 left-8 rounded-lg shadow-xl p-2 flex flex-col gap-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((phase) => (
                      <button
                        key={phase}
                        onClick={() => {
                          setCurrentPhase(phase);
                          setCurrentPageOffset(0);
                          setShowPhaseDropdown(false);
                        }}
                        className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                          currentPhase === phase
                            ? 'ring-2 ring-blue-500 bg-blue-500/20'
                            : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                        }`}
                      >
                        Phase {phase}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation & Zoom */}
              <button onClick={handlePrevPage} disabled={currentPageNumber === 1} className={`p-2 rounded-lg transition-all ${currentPageNumber === 1 ? 'opacity-30 cursor-not-allowed' : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-200')} font-semibold`}>
                <ChevronLeft size={24} />
              </button>

              <div className="flex items-center gap-2 px-3 py-1 rounded-lg" >
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} disabled={zoom === 50} className={`p-1 rounded font-semibold ${zoom === 50 ? 'opacity-30' : ''}`}>
                  <ZoomOut size={18} />
                </button>
                <span className={`text-xs font-bold min-w-[35px] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{zoom}%</span>
                <button onClick={() => setZoom(Math.min(150, zoom + 10))} disabled={zoom === 150} className={`p-1 rounded font-semibold ${zoom === 150 ? 'opacity-30' : ''}`}>
                  <ZoomIn size={18} />
                </button>
              </div>

              <button onClick={handleNextPage} disabled={currentPageNumber === totalPages} className={`p-2 rounded-lg transition-all ${currentPageNumber === totalPages ? 'opacity-30 cursor-not-allowed' : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-200')} font-semibold`}>
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Info message */}
            <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isLastPageOfPhase && !isPhaseCompleted ? '✅ Reach the end to auto-complete phase' : 'Swipe or use arrows to navigate'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranReader;
