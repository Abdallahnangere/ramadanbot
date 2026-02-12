'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  CheckCircle2,
  Zap,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { User } from '../types';
import {
  getPhasePageRange,
  getPhasePageImages,
  isPhaseLockedStatus,
  calculatePhaseProgress,
  calculateOverallProgress,
  QURAN_CONFIG,
} from '../lib/quranPages';

interface AppleQuranReaderProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  completedPhases: Array<{ day: number; phase: number }>;
  onCompletePhase: (day: number, phase: number) => Promise<boolean>;
  onProgressUpdate?: () => void;
}

const AppleQuranReader: React.FC<AppleQuranReaderProps> = ({
  isOpen,
  onClose,
  user,
  completedPhases,
  onCompletePhase,
  onProgressUpdate,
}) => {
  const [currentDay, setCurrentDay] = useState(user.quran_current_day || 1);
  const [currentPhase, setCurrentPhase] = useState(user.quran_current_phase || 1);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load page images for current phase
  useEffect(() => {
    const images = getPhasePageImages(currentDay, currentPhase);
    setPageImages(images);
    setCurrentPageIndex(0);
    setImageLoading(true);
  }, [currentDay, currentPhase]);

  useEffect(() => {
    setLoading(false);
  }, [isOpen]);

  const phaseRange = getPhasePageRange(currentDay, currentPhase);
  const currentAbsolutePage = phaseRange.start + currentPageIndex;
  const isPhaseCompleted = completedPhases.some(
    (p) => p.day === currentDay && p.phase === currentPhase
  );
  const isPhaseLocked = isPhaseLockedStatus(
    currentDay,
    currentPhase,
    completedPhases
  );
  const phaseProgress = calculatePhaseProgress(
    currentDay,
    currentPhase,
    user.quran_total_pages_read || 0
  );
  const overallProgress = calculateOverallProgress(user.quran_total_pages_read || 0);

  const handleNextPage = () => {
    if (currentPageIndex < pageImages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setImageLoading(true);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setImageLoading(true);
    }
  };

  const handleNextPhase = () => {
    if (currentPhase < QURAN_CONFIG.PHASES_PER_DAY) {
      setCurrentPhase(currentPhase + 1);
    } else if (currentDay < QURAN_CONFIG.RAMADAN_DAYS) {
      setCurrentDay(currentDay + 1);
      setCurrentPhase(1);
    }
  };

  const handlePrevPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    } else if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setCurrentPhase(QURAN_CONFIG.PHASES_PER_DAY);
    }
  };

  const handleCompletePhase = async () => {
    setIsSubmitting(true);
    try {
      const success = await onCompletePhase(currentDay, currentPhase);
      if (success) {
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
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to complete phase:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full h-full md:w-[95vw] md:h-[95vh] md:rounded-3xl bg-white dark:bg-slate-950 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Ramadan Quran Journey
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Day {currentDay} • Phase {currentPhase} of {QURAN_CONFIG.PHASES_PER_DAY}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ramadan Progress
            </span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Navigation */}
          <div className="hidden md:flex md:w-64 flex-col border-r border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                Ramadan Days
              </h3>
              <div className="space-y-2">
                {Array.from({ length: QURAN_CONFIG.RAMADAN_DAYS }, (_, i) => i + 1).map(
                  (day) => {
                    const dayCompleted = completedPhases.some(
                      (p) =>
                        p.day === day &&
                        p.phase === QURAN_CONFIG.PHASES_PER_DAY
                    );
                    const isCurrentDay = day === currentDay;

                    return (
                      <button
                        key={day}
                        onClick={() => setCurrentDay(day)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isCurrentDay
                            ? 'bg-blue-500 text-white shadow-lg'
                            : dayCompleted
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Day {day}</span>
                          {dayCompleted && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

            {/*  Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 p-4 md:p-8 relative">
            {isPhaseLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center">
                  <Lock className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Phase Locked
                  </h3>
                  <p className="text-gray-300">
                    Complete the previous phase to unlock this one
                  </p>
                </div>
              </div>
            )}

            {loading || imageLoading ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading page {currentAbsolutePage}...
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                {pageImages[currentPageIndex] && (
                  <div className="relative w-full h-full max-w-2xl">
                    <img
                      src={pageImages[currentPageIndex]}
                      alt={`Quran Page ${currentAbsolutePage}`}
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                      className="w-full h-full object-contain rounded-xl shadow-2xl"
                    />
                    {/* Page Number Indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Page {currentAbsolutePage} / {QURAN_CONFIG.TOTAL_PAGES}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 md:p-6">
          {/* Congrats Message */}
          {showCongrats && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700 rounded-xl">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span>Great! Phase {currentPhase} completed! 🎉</span>
              </div>
            </div>
          )}

          {/* Phase Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phase Progress
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {phaseProgress}% ({currentPageIndex + 1}/{pageImages.length})
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentPageIndex + 1) / pageImages.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Page Navigation */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <div className="flex-1 grid grid-cols-5 gap-1">
                {pageImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`h-8 rounded-lg text-xs font-medium transition-all ${
                      idx === currentPageIndex
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPageIndex === pageImages.length - 1}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Phase Navigation and Action */}
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={handlePrevPhase}
                disabled={currentDay === 1 && currentPhase === 1}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous Phase</span>
              </button>

              <button
                onClick={handleCompletePhase}
                disabled={isPhaseCompleted || isPhaseLocked || isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {isSubmitting
                  ? 'Completing...'
                  : isPhaseCompleted
                  ? 'Phase Complete'
                  : `Complete Phase ${currentPhase}`}
              </button>

              <button
                onClick={handleNextPhase}
                disabled={
                  currentDay === QURAN_CONFIG.RAMADAN_DAYS &&
                  currentPhase === QURAN_CONFIG.PHASES_PER_DAY
                }
                className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span className="hidden sm:inline">Next Phase</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleQuranReader;
