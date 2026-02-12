'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Volume2, Globe, BookOpen, Check, Play, Pause, ChevronDown } from 'lucide-react';
import { User } from '../types';
import { completeQuranPhase } from '../app/actions';

interface QuranFullScreenModalProps {
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
  englishTranslation?: string;
}

const QURAN_PHASES_PER_DAY = 5;
const PAGES_PER_PHASE = 4;
const TOTAL_PAGES = 604;
const RAMADAN_DAYS = 30;
const ALAFASY_BASE = 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy';

const QuranFullScreenModal: React.FC<QuranFullScreenModalProps> = ({ isOpen, onClose, user, onProgressUpdate }) => {
  const [currentDay, setCurrentDay] = useState(user.quran_current_day || 1);
  const [currentPhase, setCurrentPhase] = useState(user.quran_current_phase || 1);
  const [currentPage, setCurrentPage] = useState(user.quran_current_page || 1);
  const [showEnglish, setShowEnglish] = useState(false);
  const [quranText, setQuranText] = useState<QuranAyah[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratulateMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSurahPlaying, setCurrentSurahPlaying] = useState<number | null>(null);

  // Get phase boundaries
  const getPhasePages = (day: number, phase: number) => {
    const dayStartPage = (day - 1) * PAGES_PER_PHASE * QURAN_PHASES_PER_DAY;
    const phaseStartPage = dayStartPage + (phase - 1) * PAGES_PER_PHASE + 1;
    const phaseEndPage = phaseStartPage + PAGES_PER_PHASE - 1;
    return { start: phaseStartPage, end: phaseEndPage };
  };

  // Fetch Qur'an text with proper error handling and translations
  useEffect(() => {
    if (!isOpen || !currentPage) return;

    const fetchQuranPage = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.quran.com/api/v4/quran/pages/${currentPage}?fields=text_madina`
        );
        const data = await response.json();
        
        if (data.ayahs && Array.isArray(data.ayahs)) {
          // Fetch translations
          const enrichedAyahs = await Promise.all(
            data.ayahs.map(async (ayah: any) => {
              let translation = '';
              try {
                const transRes = await fetch(
                  `https://api.quran.com/api/v4/ayahs/${ayah.number}/en/sahih`
                );
                const transData = await transRes.json();
                translation = transData.text || '';
              } catch (e) {
                // Silent fail, no translation available
              }
              
              return {
                number: ayah.number,
                text: ayah.text_madina || '',
                surah: ayah.surah || { number: 1, name: 'Al-Fatiha', englishName: 'The Opening' },
                ayah: ayah.verse_number || 1,
                englishTranslation: translation
              };
            })
          );
          
          setQuranText(enrichedAyahs);
        }
      } catch (error) {
        console.error('Failed to fetch Quran:', error);
        setQuranText([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuranPage();
  }, [isOpen, currentPage]);

  // Handle audio cleanup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handlePlayAudio = () => {
    if (!audioRef.current) return;
    
    const firstSurah = quranText[0]?.surah.number;
    if (!firstSurah) return;
    
    const audioUrl = `${ALAFASY_BASE}/${String(firstSurah).padStart(3, '0')}.mp3`;
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(e => console.error('Audio play error:', e));
    setIsPlayingAudio(true);
    setCurrentSurahPlaying(firstSurah);
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setCurrentSurahPlaying(null);
  };

  const handleNextPage = () => {
    const { end } = getPhasePages(currentDay, currentPhase);
    if (currentPage < end) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    const { start } = getPhasePages(currentDay, currentPhase);
    if (currentPage > start) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompletePhase = async () => {
    try {
      let nextDay = currentDay;
      let nextPhase = currentPhase + 1;

      if (nextPhase > QURAN_PHASES_PER_DAY) {
        nextDay += 1;
        nextPhase = 1;
      }

      if (nextDay > RAMADAN_DAYS && nextPhase > QURAN_PHASES_PER_DAY) {
        setCongratulateMessage('You have completed the entire Qur\'an! Alhamdulillah! 🎉');
      } else {
        setCongratulateMessage(
          `Great! You've completed Phase ${currentPhase} of Day ${currentDay}.\n\nContinue to Day ${nextDay}, Phase ${nextPhase}.`
        );
      }

      setShowCongrats(true);

      // Update user progress
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quran_current_day: nextDay > RAMADAN_DAYS ? RAMADAN_DAYS : nextDay,
          quran_current_phase: nextDay > RAMADAN_DAYS ? QURAN_PHASES_PER_DAY : nextPhase,
          quran_current_page: nextDay > RAMADAN_DAYS ? 604 : getPhasePages(nextDay, nextPhase).start,
        }),
      });

      if (res.ok) {
        setCurrentDay(nextDay > RAMADAN_DAYS ? RAMADAN_DAYS : nextDay);
        setCurrentPhase(nextDay > RAMADAN_DAYS ? QURAN_PHASES_PER_DAY : nextPhase);
      }
    } catch (error) {
      console.error('Failed to complete phase:', error);
    }
  };

  const { start, end } = getPhasePages(currentDay, currentPhase);
  const pageProgress = ((currentPage - start) / (end - start + 1)) * 100;

  if (!isOpen) return null;

  // Intro Screen
  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-50 flex items-center justify-center p-4">
        <audio ref={audioRef} />
        <div className="max-w-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-2 border-amber-600/30 rounded-3xl p-8 md:p-12 backdrop-blur-xl text-center space-y-6 animate-fade-in">
          <div className="text-6xl md:text-7xl mb-4">📖</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Qur'an Journey</h2>
          <div className="space-y-4 text-amber-50/90 leading-relaxed">
            <p className="text-lg md:text-xl font-semibold">Complete the entire Qur'an in 30 days</p>
            <div className="bg-black/30 rounded-xl p-6 space-y-3 text-left">
              <p className="text-sm md:text-base">
                🌙 <span className="font-semibold">The 30-Day Path</span> is designed to help you recite the full Qur'an throughout Ramadan in an engaging, sustainable manner.
              </p>
              <p className="text-sm md:text-base">
                📚 The Qur'an is divided into <span className="font-semibold">30 days</span> and <span className="font-semibold">5 phases per day</span> (corresponding with the five daily prayers), making it perfectly aligned with Islamic practice.
              </p>
              <p className="text-sm md:text-base">
                ⏱️ Each phase typically takes only <span className="font-semibold">10-15 minutes</span> to complete, allowing you to revise during or after prayer times.
              </p>
              <p className="text-sm md:text-base">
                ✨ By dedicating just a brief period after each prayer to complete that day's phase, you'll have <span className="font-semibold">revised the entire Holy Qur'an</span> by the end of Ramadan, إن شاء الله.
              </p>
              <p className="text-sm md:text-base mt-4 text-amber-300 font-semibold">
                May this journey bring you closer to Allah's Words. 🤲
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowIntro(false)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
          >
            Begin Reading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex flex-col ${isOpen ? '' : 'hidden'}`}>
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 md:py-5 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-white">Qur'an Reading</h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Day {currentDay}/30 • Phase {currentPhase}/5 • Page {currentPage}/{end}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Main Content - Responsive */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-6 py-6 md:py-8 space-y-6 max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="space-y-4 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
                </div>
                <p className="text-white/60 font-medium">Loading Qur'an...</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Qur'an Text Display */}
              <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-3xl p-6 md:p-8 border-2 border-amber-600/30 backdrop-blur-sm">
                <div className="space-y-6">
                  {quranText.length > 0 ? (
                    quranText.map((ayah, idx) => (
                      <div key={idx} className="space-y-3">
                        {/* Arabic */}
                        <div className="text-right">
                          <p 
                            className="text-3xl md:text-4xl leading-relaxed text-amber-50 font-bold hover:text-white transition-colors font-arabic" 
                            dir="rtl"
                          >
                            {ayah.text}
                          </p>
                          <p className="text-xs md:text-sm text-amber-600/80 mt-2 md:mt-3 font-semibold">
                            {ayah.surah.name} • الآية {ayah.ayah}
                          </p>
                        </div>

                        {/* English Translation */}
                        {showEnglish && ayah.englishTranslation && (
                          <div className="pl-4 md:pl-6 border-l-4 border-amber-500/50">
                            <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                              {ayah.englishTranslation}
                            </p>
                          </div>
                        )}

                        {idx < quranText.length - 1 && <hr className="border-amber-600/20" />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8 md:py-12">
                      <p className="text-base md:text-lg">Loading Qur'anic text...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 md:mt-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium text-gray-300">Phase Progress</span>
                  <span className="text-xs md:text-sm font-bold text-amber-400">{Math.round(pageProgress)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-amber-500/50" 
                    style={{ width: `${pageProgress}%` }} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls - Fixed */}
      <div className="flex-shrink-0 bg-black/50 backdrop-blur-xl border-t border-white/10 px-4 md:px-6 py-4 space-y-3">
        {/* Control Buttons */}
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${
              showEnglish
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Globe size={18} />
            <span className="hidden md:inline">English</span>
          </button>
          <button
            onClick={isPlayingAudio ? handleStopAudio : handlePlayAudio}
            className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${
              isPlayingAudio
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            {isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
            <span className="hidden md:inline">Recitation</span>
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-2 md:gap-3">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage <= start}
            className="flex-shrink-0 w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          
          <div className="flex-1 text-center">
            <p className="text-xs md:text-sm text-gray-300 font-medium">
              Page {currentPage} of {end}
            </p>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= end}
            className="flex-shrink-0 w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        {/* Day/Phase Selector Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <div className="relative">
            <button
              onClick={() => setExpandedDay(expandedDay === currentDay ? null : currentDay)}
              className="w-full flex items-center justify-between px-3 md:px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm font-semibold transition-all"
            >
              <span>Day {currentDay}</span>
              <ChevronDown size={16} className={`transform transition-transform ${expandedDay === currentDay ? 'rotate-180' : ''}`} />
            </button>
            {expandedDay === currentDay && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-white/20 rounded-lg overflow-hidden z-50 max-h-48 overflow-y-auto">
                {Array.from({ length: RAMADAN_DAYS }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => {
                      setCurrentDay(idx + 1);
                      setCurrentPhase(1);
                      setCurrentPage(getPhasePages(idx + 1, 1).start);
                      setExpandedDay(null);
                    }}
                    className={`w-full px-4 py-2 text-xs md:text-sm font-medium text-left hover:bg-white/20 transition-all ${
                      currentDay === idx + 1 ? 'bg-amber-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    Day {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setExpandedDay(expandedDay === -currentPhase ? null : -currentPhase)}
              className="w-full flex items-center justify-between px-3 md:px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm font-semibold transition-all"
            >
              <span>Phase {currentPhase}</span>
              <ChevronDown size={16} className={`transform transition-transform ${expandedDay === -currentPhase ? 'rotate-180' : ''}`} />
            </button>
            {expandedDay === -currentPhase && (
              <div className="absolute top-full right-0 bg-gray-900 border border-white/20 rounded-lg overflow-hidden z-50">
                {Array.from({ length: QURAN_PHASES_PER_DAY }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => {
                      setCurrentPhase(idx + 1);
                      setCurrentPage(getPhasePages(currentDay, idx + 1).start);
                      setExpandedDay(null);
                    }}
                    className={`w-full px-4 py-2 text-xs md:text-sm font-medium text-left hover:bg-white/20 transition-all whitespace-nowrap ${
                      currentPhase === idx + 1 ? 'bg-purple-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    Phase {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Complete Phase Button */}
        {currentPage === end && (
          <button
            onClick={handleCompletePhase}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Check size={20} />
            Complete Phase {currentPhase}
          </button>
        )}
      </div>

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm text-center space-y-6 border border-white/10 animate-bounce-in backdrop-blur-xl">
            <div className="text-5xl md:text-6xl animate-bounce">
              {currentPhase === QURAN_PHASES_PER_DAY && currentDay === RAMADAN_DAYS ? '🎉' : '✨'}
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Alhamdulillah!
              </h3>
              <p className="text-gray-300 whitespace-pre-line text-xs md:text-sm leading-relaxed">
                {congratsMessage}
              </p>
            </div>
            <button
              onClick={() => {
                setShowCongrats(false);
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranFullScreenModal;
