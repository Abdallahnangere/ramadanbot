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
        // Map page number to surah for demonstration
        // Each surah gets ~4 pages (PAGES_PER_PHASE), and we have 30 days with 5 phases each = 150 pages total
        // This is 114 surahs compressed into 150 pages (some multi-page, some single)
        
        // For now, map page to surah: pages 1-4 = surah 1, 5-8 = surah 2, etc
        const pagesPerSurah = 4;
        const surahNumber = Math.floor((currentPage - 1) / pagesPerSurah) + 1;
        
        // Don't exceed 114 surahs
        const finalSurah = Math.min(surahNumber, 114);
        
        console.log(`Page ${currentPage} -> Surah ${finalSurah}`);
        
        // Fetch surah with Arabic text
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${finalSurah}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch surah ${finalSurah}: ${response.status}`);
        }
        
        const surahData = await response.json();
        const ayahs = surahData.data.ayahs || [];
        
        console.log(`Fetched surah ${finalSurah}: ${ayahs.length} ayahs`);
        
        if (ayahs.length > 0) {
          // Fetch English translations
          const enrichedAyahs = await Promise.all(
            ayahs.map(async (ayah: any) => {
              let translation = '';
              try {
                const transResponse = await fetch(
                  `https://api.alquran.cloud/v1/ayah/${ayah.number}/en.asad`
                );
                if (transResponse.ok) {
                  const transData = await transResponse.json();
                  translation = transData.data?.text || '';
                }
              } catch (e) {
                // Silently fail
              }
              
              return {
                number: ayah.number,
                text: ayah.text || '',
                surah: {
                  number: surahData.data.number,
                  name: surahData.data.name || 'Unknown',
                  englishName: surahData.data.englishName || 'Unknown'
                },
                ayah: ayah.numberInSurah || 1,
                englishTranslation: translation
              };
            })
          );
          
          console.log('Successfully loaded', enrichedAyahs.length, 'ayahs');
          setQuranText(enrichedAyahs);
        } else {
          throw new Error('No ayahs in response');
        }
      } catch (error) {
        console.error('Failed to fetch Qur\'an:', error);
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
    <div className={`fixed inset-0 bg-black z-50 flex flex-col ${isOpen ? '' : 'hidden'}`}>
      <audio ref={audioRef} />
      
      {/* TOP STATIC BAR - Progress, Controls, Close */}
      <div className="flex-shrink-0 bg-black/80 backdrop-blur-xl border-b border-white/10 px-3 md:px-6 py-3 md:py-4 space-y-2">
        {/* Row 1: Day/Phase Selectors and Close */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 flex-1">
            {/* Day Selector */}
            <div className="relative flex-1">
              <button
                onClick={() => setExpandedDay(expandedDay === currentDay ? null : currentDay)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm font-semibold transition-all"
              >
                <span>📅 Day {currentDay}</span>
                <ChevronDown size={16} className={`transform transition-transform ${expandedDay === currentDay ? 'rotate-180' : ''}`} />
              </button>
              {expandedDay === currentDay && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-white/20 rounded-lg overflow-hidden z-50 max-h-40 overflow-y-auto">
                  {Array.from({ length: RAMADAN_DAYS }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => {
                        setCurrentDay(idx + 1);
                        setCurrentPhase(1);
                        setCurrentPage(getPhasePages(idx + 1, 1).start);
                        setExpandedDay(null);
                      }}
                      className={`w-full px-3 py-1.5 text-xs font-medium text-left hover:bg-white/20 transition-all ${
                        currentDay === idx + 1 ? 'bg-amber-600 text-white' : 'text-gray-300'
                      }`}
                    >
                      Day {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phase Selector */}
            <div className="relative flex-1">
              <button
                onClick={() => setExpandedDay(expandedDay === -currentPhase ? null : -currentPhase)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm font-semibold transition-all"
              >
                <span>☪️ Phase {currentPhase}</span>
                <ChevronDown size={16} className={`transform transition-transform ${expandedDay === -currentPhase ? 'rotate-180' : ''}`} />
              </button>
              {expandedDay === -currentPhase && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-white/20 rounded-lg overflow-hidden z-50">
                  {Array.from({ length: QURAN_PHASES_PER_DAY }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => {
                        setCurrentPhase(idx + 1);
                        setCurrentPage(getPhasePages(currentDay, idx + 1).start);
                        setExpandedDay(null);
                      }}
                      className={`w-full px-3 py-1.5 text-xs font-medium text-left hover:bg-white/20 transition-all whitespace-nowrap ${
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

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Row 2: Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Page {currentPage}/{end}</span>
            <span className="text-xs font-bold text-amber-400">{Math.round(pageProgress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-2 rounded-full transition-all duration-500 shadow-lg shadow-amber-500/50" 
              style={{ width: `${pageProgress}%` }} 
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Full Page Arabic Text */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-black via-gray-950 to-black">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="space-y-4 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
              </div>
              <p className="text-white/60 font-medium">Loading Qur'an (Page {currentPage}/{end})...</p>
              <p className="text-xs text-white/40 mt-2">Check browser console for details</p>
            </div>
          </div>
        ) : quranText.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <p className="text-gray-400 text-lg">No Quranic text available</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-full flex flex-col items-center justify-center px-4 md:px-8 py-8 md:py-12">
            <div className="w-full max-w-4xl space-y-8">
              {quranText.map((ayah, idx) => (
                <div key={idx} className="space-y-4">
                  {/* Large Arabic Text - Mushaf Style */}
                  <div className="text-center">
                    <p 
                      className="text-4xl md:text-5xl lg:text-6xl leading-relaxed md:leading-relaxed text-amber-50 font-bold hover:text-white transition-colors" 
                      style={{
                        fontFamily: "'Traditional Arabic', 'Arial Unicode MS', 'DejaVu Sans', serif",
                        fontWeight: '700',
                        lineHeight: '2.2',
                        direction: 'rtl',
                        textAlign: 'center',
                      }}
                      dir="rtl"
                    >
                      {ayah.text}
                    </p>
                    
                    {/* Surah and Ayah Info */}
                    <p className="text-xs md:text-sm text-amber-600/80 mt-4 md:mt-6 font-semibold">
                      {ayah.surah.name} • الآية {ayah.ayah}
                    </p>
                  </div>

                  {/* English Translation Below if Enabled */}
                  {showEnglish && ayah.englishTranslation && (
                    <div className="text-center border-t border-amber-600/20 pt-4">
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        {ayah.englishTranslation}
                      </p>
                    </div>
                  )}

                  {/* Divider */}
                  {idx < quranText.length - 1 && (
                    <div className="flex justify-center mt-6 md:mt-8">
                      <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROL BAR - Fixed */}
      <div className="flex-shrink-0 bg-black/80 backdrop-blur-xl border-t border-white/10 px-3 md:px-6 py-3 space-y-2">
        {/* Navigation and Control Buttons */}
        <div className="flex gap-2 items-center justify-between">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage <= start}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          
          <button
            onClick={isPlayingAudio ? handleStopAudio : handlePlayAudio}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold transition-all text-sm ${
              isPlayingAudio
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            {isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
            <span>Recitation</span>
          </button>

          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold transition-all text-sm ${
              showEnglish
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Globe size={18} />
            <span>English</span>
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= end}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        {/* Complete Phase Button */}
        {currentPage === end && (
          <button
            onClick={handleCompletePhase}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2.5 md:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base"
          >
            <Check size={18} />
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
