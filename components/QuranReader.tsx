'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, X, BookOpen, Zap, CheckCircle2, Moon, Sun, ZoomIn, ZoomOut, Menu, HelpCircle, ChevronDown,
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showPhaseDropdown, setShowPhaseDropdown] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [preloadedCache, setPreloadedCache] = useState<Set<number>>(new Set());
  const [lastSaveTime, setLastSaveTime] = useState(0);

  const daySelectRef = useRef<HTMLDivElement>(null);
  const phaseSelectRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Auto-save page position every 3 seconds
  const savePagePosition = useCallback(async () => {
    if (Date.now() - lastSaveTime < 3000) return;
    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          quran_current_day: currentDay,
          quran_current_phase: currentPhase,
          quran_current_page: getPhasePageRange(currentDay, currentPhase).start + currentPageOffset,
        }),
      });
      setLastSaveTime(Date.now());
    } catch (error) {
      console.error('Failed to save page position:', error);
    }
  }, [user.id, currentDay, currentPhase, currentPageOffset, lastSaveTime]);

  useEffect(() => {
    if (isOpen) savePagePosition();
  }, [currentDay, currentPhase, currentPageOffset, isOpen, savePagePosition]);

  const pageRange = useMemo(() => getPhasePageRange(currentDay, currentPhase), [currentDay, currentPhase]);
  const currentPageNumber = pageRange.start + currentPageOffset;
  const totalPages = 604;
  const isPhaseCompleted = completedPhases.some((p) => p.day === currentDay && p.phase === currentPhase);

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
      const prevRange = getPhasePageRange(currentDay - 1, QURAN_CONFIG.PHASES_PER_DAY);
      setCurrentPageOffset(prevRange.count - 1);
    }
    setImageError(false);
  }, [currentPageOffset, currentPhase, currentDay]);

  const handleCompletePhase = async () => {
    setIsSubmitting(true);
    try {
      const result = await completeQuranPhaseEnhanced(user.id, currentDay, currentPhase);
      if (result.success) {
        const isDuplicate = completedPhases.some((p) => p.day === currentDay && p.phase === currentPhase);
        if (!isDuplicate) {
          setCompletedPhases([...completedPhases, { day: currentDay, phase: currentPhase }]);
        }

        const newCount = isDuplicate ? completedPhases.length : completedPhases.length + 1;
        if (newCount === 145) {
          setCongratsMessage('🎉 Alhamdulillah! You have completed the entire Qur\'an in 29 days! 📖✨');
        } else if (currentPhase === QURAN_CONFIG.PHASES_PER_DAY) {
          setCongratsMessage(`🌙 Day ${currentDay} Complete! Moving to Day ${currentDay + 1}...`);
        } else {
          setCongratsMessage(`✨ Phase ${currentPhase} Complete! Well done, keep going!`);
        }

        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 2500);
        onProgressUpdate?.();
      }
    } catch (error) {
      console.error('Error completing phase:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const overallProgress = calculateOverallProgress(user.quran_total_pages_read || currentPageNumber);

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

  if (!isOpen) return null;

  const currentImagePath = getPagePath(currentPageNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm md:p-4">
      <div className={`relative w-full h-full md:max-w-5xl md:h-auto md:rounded-3xl overflow-hidden shadow-2xl flex flex-col ${isDarkMode ? 'bg-gray-950' : 'bg-white'} transition-colors`}>
        
        {/* Premium Header */}
        <div className={`flex items-center justify-between px-4 md:px-6 py-4 border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-gradient-to-r from-emerald-50 to-white'} backdrop-blur-sm`}>
          <div className="flex items-center gap-3">
            <BookOpen size={24} className={isDarkMode ? 'text-emerald-500' : 'text-emerald-600'} />
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Qur'ān Reader
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Day {currentDay} • Phase {currentPhase} • Page {currentPageNumber}/604
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowHelp(true)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`} title="Help">
              <HelpCircle size={20} />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-1.5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
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
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading page...</p>
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

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 max-w-md max-h-96 overflow-y-auto shadow-2xl`}>
              <h3 className={`text-2xl font-black mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Qur'ān Reader Guide</h3>
              <div className={`space-y-3 text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p><strong>Purpose:</strong> The Qur'ān reader is designed to facilitate a structured, spiritual Qur'anic recitation experience during Ramadan and beyond.</p>
                <p><strong>Distribution:</strong> The complete 604-page Qur'ān is strategically divided across 29 days with 5 phases daily, aligning with the five daily prayers for spiritual rhyth</p>
                <p><strong>Days 1-20:</strong> 4 pages per phase (20 pages daily)</p>
                <p><strong>Days 21-29:</strong> 5 pages per phase (25 pages daily)</p>
                <p><strong>Navigation:</strong> Use arrow keys, dropdowns, or buttons to navigate freely. All progress is saved automatically.</p>
                <p><strong>Track Progress:</strong> Mark phases complete to build your reading streak and earn congratulations upon each milestone.</p>
              </div>
              <button onClick={() => setShowHelp(false)} className={`mt-6 w-full py-2 rounded-lg font-semibold ${isDarkMode ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-3xl p-8 text-center max-w-xs shadow-2xl">
              <CheckCircle2 size={80} className="mx-auto text-white mb-6" />
              <h3 className="text-3xl font-black text-white mb-3">Excellent!</h3>
              <p className="text-white/90 text-base leading-relaxed">{congratsMessage}</p>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className={`px-4 md:px-6 py-4 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'} backdrop-blur-sm`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Day Dropdown */}
            <div className="relative" ref={daySelectRef}>
              <button
                onClick={() => setShowDayDropdown(!showDayDropdown)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'}`}
              >
                Day {currentDay}
                <ChevronDown size={18} />
              </button>
              {showDayDropdown && (
                <div className={`absolute bottom-full mb-2 left-0 rounded-lg shadow-xl p-3 grid grid-cols-5 gap-2 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  {Array.from({ length: 29 }, (_, i) => i + 1).map((day) => (
                    <button key={day} onClick={() => { setCurrentDay(day); setCurrentPhase(1); setCurrentPageOffset(0); setShowDayDropdown(false); }} className={`py-2 px-3 rounded text-xs font-bold transition-all ${currentDay === day ? 'ring-2 ring-emerald-500 bg-emerald-500/20' : completedPhases.filter((p) => p.day === day).length === 5 ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700') : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}>
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phase Dropdown */}
            <div className="relative" ref={phaseSelectRef}>
              <button
                onClick={() => setShowPhaseDropdown(!showPhaseDropdown)}
                className={`px=4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-900'}`}
              >
                Phase {currentPhase}
                <ChevronDown size={18} />
              </button>
              {showPhaseDropdown && (
                <div className={`absolute bottom-full mb-2 left-8 rounded-lg shadow-xl p-3 flex flex-col gap-2 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((phase) => (
                    <button key={phase} onClick={() => { setCurrentPhase(phase); setCurrentPageOffset(0); setShowPhaseDropdown(false); }} className={`py-2 px-4 rounded text-sm font-bold transition-all ${currentPhase === phase ? 'ring-2 ring-blue-500 bg-blue-500/20' : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}>
                      Phase {phase}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <button onClick={handlePrevPage} disabled={currentPageNumber === 1} className={`p-2.5 rounded-lg transition-all ${currentPageNumber === 1 ? 'opacity-30' : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200')}`}>
              <ChevronLeft size={24} />
            </button>

            {/* Zoom */}
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))} disabled={zoom === 50} className={`p-1 rounded ${zoom === 50 ? 'opacity-30' : ''}`}>
                <ZoomOut size={18} />
              </button>
              <span className={`text-xs font-bold min-w-[35px] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{zoom}%</span>
              <button onClick={() => setZoom(Math.min(150, zoom + 10))} disabled={zoom === 150} className={`p-1 rounded ${zoom === 150 ? 'opacity-30' : ''}`}>
                <ZoomIn size={18} />
              </button>
            </div>

            <button onClick={handleNextPage} disabled={currentPageNumber === totalPages} className={`p-2.5 rounded-lg transition-all ${currentPageNumber === totalPages ? 'opacity-30' : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200')}`}>
              <ChevronRight size={24} />
            </button>

            {/* Complete Phase */}
            <button
              onClick={handleCompletePhase}
              disabled={isSubmitting || isPhaseCompleted}
              className={`ml-auto px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${isPhaseCompleted ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700') : 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white hover:from-emerald-600 hover:to-cyan-700 shadow-lg'}`}
            >
              {isPhaseCompleted ? (<> <CheckCircle2 size={18} /> Completed</>) : isSubmitting ? (<> <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>) : (<> <Zap size={18} /> Complete Phase</>) }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranReader;
