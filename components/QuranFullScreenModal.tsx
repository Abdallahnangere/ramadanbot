'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Volume2, Globe, BookOpen, Check, Trophy, Play, Pause } from 'lucide-react';
import { User } from '../types';
import { completeQuranPhase, getQuranUserProgress } from '../app/actions';

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
  audioUrl?: string;
}

const QURAN_PHASES_PER_DAY = 5;
const PAGES_PER_PHASE = 4;
const TOTAL_PAGES = 604;
const RAMADAN_DAYS = 30;

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
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  // Get phase boundaries
  const getPhasePages = (day: number, phase: number) => {
    const dayStartPage = (day - 1) * PAGES_PER_PHASE * QURAN_PHASES_PER_DAY;
    const phaseStartPage = dayStartPage + (phase - 1) * PAGES_PER_PHASE + 1;
    const phaseEndPage = phaseStartPage + PAGES_PER_PHASE - 1;
    return { start: phaseStartPage, end: phaseEndPage };
  };

  // Fetch Qur'an text from quran.com API - Arabic only (Mushaf Al-Madinah)
  useEffect(() => {
    if (!isOpen || !currentPage) return;

    const fetchQuranPage = async () => {
      setLoading(true);
      try {
        // Fetch from quran.com API - uses Mushaf Al-Madinah Arabic by default
        const response = await fetch(
          `https://api.quran.com/api/v4/quran/pages/${currentPage}`
        );
        const data = await response.json();
        
        if (data.ayahs && Array.isArray(data.ayahs)) {
          // Fetch English translations for each ayah
          const enrichedAyahs = await Promise.all(
            data.ayahs.map(async (ayah: any) => {
              try {
                // Get Sahih International English translation
                const translationRes = await fetch(
                  `https://api.quran.com/api/v4/ayahs/${ayah.number}?fields=text_madina,translations&language=en`
                );
                const translationData = await translationRes.json();
                
                return {
                  number: ayah.number,
                  text: ayah.text_madina, // Arabic text from Mushaf Madinah
                  surah: ayah.surah,
                  ayah: ayah.verse_number,
                  englishTranslation: translationData.translation?.text || '',
                  audioUrl: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${String(ayah.surah.number).padStart(3, '0')}.mp3`
                };
              } catch (e) {
                return {
                  ...ayah,
                  englishTranslation: '',
                  audioUrl: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${String(ayah.surah.number).padStart(3, '0')}.mp3`
                };
              }
            })
          );
          
          setQuranText(enrichedAyahs);
          
          // Prepare audio URLs for background recitation
          const uniqueSurahs = Array.from(new Set(enrichedAyahs.map((a: any) => a.surah.number)));
          const audioUrls = uniqueSurahs.map((surahNum: number) => 
            `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${String(surahNum).padStart(3, '0')}.mp3`
          );
          setAudioQueue(audioUrls);
        }
      } catch (error) {
        console.error('Failed to fetch Quran page from quran.com:', error);
        
        // Fallback to alquran.cloud
        try {
          const fallbackRes = await fetch(`https://api.alquran.cloud/v1/page/${currentPage}/ar.madina`);
          const fallbackData = await fallbackRes.json();
          
          if (fallbackData.data?.ayahs) {
            setQuranText(fallbackData.data.ayahs.map((ayah: any) => ({
              ...ayah,
              englishTranslation: '',
              audioUrl: ''
            })));
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

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current || !isPlayingAudio || audioQueue.length === 0) return;

    const playNextAudio = () => {
      if (currentAudioIndex < audioQueue.length) {
        audioRef.current!.src = audioQueue[currentAudioIndex];
        audioRef.current!.play().catch(e => console.error('Audio play failed:', e));
      } else {
        setIsPlayingAudio(false);
      }
    };

    playNextAudio();

    const handleAudioEnd = () => {
      setCurrentAudioIndex(prev => prev + 1);
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleAudioEnd);
      return () => audio.removeEventListener('ended', handleAudioEnd);
    }
  }, [isPlayingAudio, currentAudioIndex, audioQueue]);

  const handlePlayAudio = () => {
    if (audioQueue.length > 0) {
      setIsPlayingAudio(true);
      setCurrentAudioIndex(0);
    }
  };

  const handleStopAudio = () => {
    setIsPlayingAudio(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentAudioIndex(0);
  };

  const handleCompletePhase = async () => {
    try {
      const { start, end } = getPhasePages(currentDay, currentPhase);
      const result = await completeQuranPhase(user.id, currentDay, currentPhase, start, end);
      
      if (result.success) {
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

  const { start, end } = getPhasePages(currentDay, currentPhase);
  const pageProgress = ((currentPage - start) / (end - start + 1)) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex flex-col">
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Qur'an Reading</h1>
            <p className="text-sm text-gray-400 mt-1">Day {currentDay}/30 • Phase {currentPhase}/5 • Page {currentPage}/{end}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Main Content - Full Screen with Arabic Text */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 space-y-8">
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
            <div className="max-w-4xl mx-auto">
              {/* Mushaf Al-Madinah Text Display - Arabic */}
              <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-3xl p-8 border-2 border-amber-600/30 backdrop-blur-sm">
                <div className="space-y-6">
                  {quranText.length > 0 ? (
                    quranText.map((ayah, idx) => (
                      <div key={idx} className="space-y-3">
                        {/* Arabic - Mushaf Madinah Style */}
                        <div className="text-right">
                          <p 
                            className="text-4xl leading-relaxed text-amber-50 font-arabic font-bold hover:text-white transition-colors" 
                            dir="rtl"
                            style={{ fontFamily: "'Traditional Arabic', serif" }}
                          >
                            {ayah.text}
                          </p>
                          <p className="text-xs text-amber-600/80 mt-3 font-semibold">
                            {ayah.surah.name} • الآية {ayah.ayah}
                          </p>
                        </div>

                        {/* English Translation - Always shown but can toggle detail */}
                        {showEnglish && ayah.englishTranslation && (
                          <div className="pl-6 border-l-4 border-amber-500/50">
                            <p className="text-sm text-gray-200 leading-relaxed">
                              {ayah.englishTranslation}
                            </p>
                          </div>
                        )}

                        {idx < quranText.length - 1 && <hr className="border-amber-600/20" />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-12">
                      <p className="text-lg">Loading Qur'anic text...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Phase Progress</span>
                  <span className="text-sm font-bold text-amber-400">{Math.round(pageProgress)}%</span>
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

      {/* Bottom Controls - Fixed and Always Visible */}
      <div className="flex-shrink-0 bg-black/50 backdrop-blur-xl border-t border-white/10 px-6 py-4 space-y-4">
        {/* Control Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
              showEnglish
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Globe size={18} />
            <span className="text-sm">English</span>
          </button>
          <button
            onClick={isPlayingAudio ? handleStopAudio : handlePlayAudio}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
              isPlayingAudio
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            {isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
            <span className="text-sm">{isPlayingAudio ? 'Stop' : 'Recitation'}</span>
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage <= start}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          
          <div className="flex-1 text-center">
            <p className="text-sm text-gray-300 font-medium">
              Page {currentPage} of {end}
            </p>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= end}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>

        {/* Complete Phase Button */}
        {currentPage === end && (
          <button
            onClick={handleCompletePhase}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Check size={20} />
            Complete Phase {currentPhase}
          </button>
        )}
      </div>

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 max-w-sm text-center space-y-6 border border-white/10 animate-bounce-in backdrop-blur-xl">
            <div className="text-6xl animate-bounce">
              {currentPhase === QURAN_PHASES_PER_DAY && currentDay === RAMADAN_DAYS ? '🎉' : '✨'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Alhamdulillah!
              </h3>
              <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
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
