'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Volume2, Globe, BookOpen, Check, Trophy } from 'lucide-react';
import { User } from '../types';
import { completeQuranPhase, getQuranUserProgress } from '../app/actions';

interface QuranBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onProgressUpdate?: () => void;
}

interface QuranAyah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  ayah: number;
  translation?: string;
  audioUrl?: string;
}

const QURAN_PHASES_PER_DAY = 5;
const PAGES_PER_PHASE = 4;
const TOTAL_PAGES = 604;
const RAMADAN_DAYS = 30;

const QuranBottomSheet: React.FC<QuranBottomSheetProps> = ({ isOpen, onClose, user, onProgressUpdate }) => {
  const [currentDay, setCurrentDay] = useState(user.quran_current_day || 1);
  const [currentPhase, setCurrentPhase] = useState(user.quran_current_phase || 1);
  const [currentPage, setCurrentPage] = useState(user.quran_current_page || 1);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [quranText, setQuranText] = useState<QuranAyah[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratulateMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get phase boundaries
  const getPhasePages = (day: number, phase: number) => {
    const dayStartPage = (day - 1) * PAGES_PER_PHASE * QURAN_PHASES_PER_DAY;
    const phaseStartPage = dayStartPage + (phase - 1) * PAGES_PER_PHASE + 1;
    const phaseEndPage = phaseStartPage + PAGES_PER_PHASE - 1;
    return { start: phaseStartPage, end: phaseEndPage };
  };

  // Fetch Quran text from API with translations
  useEffect(() => {
    if (!isOpen || !currentPage) return;

    const fetchQuranPage = async () => {
      setLoading(true);
      try {
        // AlQuran Cloud API - fetch page with English Sahih translation
        const response = await fetch(
          `https://api.alquran.cloud/v1/page/${currentPage}/en.sahih`
        );
        const data = await response.json();
        if (data.data && data.data.ayahs) {
          // Transform to include translations
          const transformed = data.data.ayahs.map((ayah: any) => ({
            ...ayah,
            translation: ayah.text || '[Translation]',
            audioUrl: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${String(ayah.surah.number).padStart(3, '0')}.mp3`
          }));
          setQuranText(transformed);
        }
      } catch (error) {
        console.error('Failed to fetch Quran page:', error);
        // Fallback to basic fetch
        try {
          const fallback = await fetch(`https://api.alquran.cloud/v1/page/${currentPage}`);
          const data = await fallback.json();
          if (data.data && data.data.ayahs) {
            setQuranText(data.data.ayahs);
          }
        } catch (e) {
          console.error('Fallback failed:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuranPage();
  }, [isOpen, currentPage]);

  const handleCompletePhase = async () => {
    try {
      const { start, end } = getPhasePages(currentDay, currentPhase);
      const result = await completeQuranPhase(user.id, currentDay, currentPhase, start, end);
      
      if (result.success) {
        // Check if phase 5 completed (all phases of the day)
        if (currentPhase === QURAN_PHASES_PER_DAY) {
          if (currentDay === RAMADAN_DAYS) {
            setShowCongrats(true);
            setCongratulateMessage(`🎉 Alhamdulillah! You've completed reading the entire Quran in 30 days! 📖✨`);
          } else {
            setShowCongrats(true);
            setCongratulateMessage(`Day ${currentDay} Complete! 🌙\n\nMove to Day ${currentDay + 1} tomorrow!`);
            setCurrentDay(currentDay + 1);
            setCurrentPhase(1);
          }
        } else {
          setCongratulateMessage(`Phase ${currentPhase} Complete! ✨\n\nPhase ${currentPhase + 1} unlocked!`);
          setShowCongrats(true);
          setCurrentPhase(currentPhase + 1);
        }
        
        onProgressUpdate?.();
      }
    } catch (error) {
      console.error('Failed to complete phase:', error);
    }
  };

  const handleNextPage = () => {
    const { end } = getPhasePages(currentDay, currentPhase);
    if (currentPage < end) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    const { start } = getPhasePages(currentDay, currentPhase);
    if (currentPage > start) {
      setCurrentPage(currentPage - 1);
    }
  };

  const { start, end } = getPhasePages(currentDay, currentPhase);
  const pageProgress = ((currentPage - start) / (end - start + 1)) * 100;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col animation-slide-up">
        
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quran Reading</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Day {currentDay}/30 • Phase {currentPhase}/5</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-all">
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Day/Phase Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: RAMADAN_DAYS }).map((_, day) => (
              <button
                key={day + 1}
                onClick={() => {setCurrentDay(day + 1); setCurrentPhase(1); const { start } = getPhasePages(day + 1, 1); setCurrentPage(start);}}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentDay === day + 1
                    ? 'bg-indigo-600 text-white'
                    : day + 1 < currentDay
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                Day {day + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Page Display */}
          <div className="px-6 py-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {/* Page Number */}
                <div className="flex items-center justify-center">
                  <div className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                      Page {currentPage} • Phase {currentPhase}/5
                    </p>
                  </div>
                </div>

                {/* Quran Text Display */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-amber-200/30 dark:border-gray-700">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {quranText.length > 0 ? (
                      quranText.map((ayah, idx) => (
                        <div key={idx} className="space-y-2">
                          {/* Arabic */}
                          <div className="text-right">
                            <p className="text-xl leading-relaxed text-gray-900 dark:text-gray-100 font-arabic" dir="rtl">
                              {ayah.text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {ayah.surah.name} • Ayah {ayah.ayah}
                            </p>
                          </div>

                          {/* English Translation (optional) */}
                          {showEnglish && (
                            <div className="pl-4 border-l-2 border-indigo-400">
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {(ayah as any).translation || '[English translation]'}
                              </p>
                            </div>
                          )}

                          {idx < quranText.length - 1 && <hr className="border-amber-200/30" />}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Loading Quran text...
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Phase Progress</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.round(pageProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pageProgress}%` }}
                    />
                  </div>
                </div>

                {/* Toggle Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEnglish(!showEnglish)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      showEnglish
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Globe size={18} />
                    <span className="text-sm">English</span>
                  </button>
                  <button
                    onClick={() => setShowAudio(!showAudio)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      showAudio
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Volume2 size={18} />
                    <span className="text-sm">Recitation</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer - Navigation & Actions */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
          {/* Page Navigation */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= start}
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Page {currentPage} of {end}
              </p>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= end}
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Complete Phase Button */}
          {currentPage === end && (
            <button
              onClick={handleCompletePhase}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Check size={20} />
              Complete Phase {currentPhase}
            </button>
          )}
        </div>
      </div>

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm text-center space-y-6 animate-bounce-in">
            <div className="text-6xl animate-bounce">
              {currentPhase === QURAN_PHASES_PER_DAY && currentDay === RAMADAN_DAYS ? '🎉' : '✨'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Alhamdulillah!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm">
                {congratsMessage}
              </p>
            </div>
            <button
              onClick={() => {
                setShowCongrats(false);
                if (currentPhase === QURAN_PHASES_PER_DAY && currentDay < RAMADAN_DAYS) {
                  // Move to next day
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuranBottomSheet;
