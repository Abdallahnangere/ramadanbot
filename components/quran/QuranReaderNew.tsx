'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, CheckCircle2, ZoomIn, ZoomOut } from 'lucide-react';
import { getPhasePageRange } from '@/lib/quranPages';

interface QuranReaderNewProps {
  day: number;
  phase: number;
  userId: string;
  onComplete?: () => void;
}

export default function QuranReaderNew({ day, phase, userId, onComplete }: QuranReaderNewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState('');

  const pageRange = getPhasePageRange(day, phase);
  const totalPages = pageRange.count;
  const currentPageNumber = pageRange.start + currentPageIndex;
  const isLastPage = currentPageIndex === totalPages - 1;

  const imageRef = useRef<HTMLImageElement>(null);

  const getPageImagePath = useCallback((pageNum: number): string => {
    const paddedNum = String(pageNum).padStart(3, '0');
    return `/page${paddedNum}.png`;
  }, []);

  const handleNextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setImageError(false);
    }
  }, [currentPageIndex, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setImageError(false);
    }
  }, [currentPageIndex]);

  const handleCompletePhase = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quran/complete-phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, day, phase }),
      });

      if (!response.ok) throw new Error('Failed to complete phase');

      const data = await response.json();
      setCongratsMessage(`🎉 Phase ${phase} Completed!\n${data.totalCompletedPhases}/${data.totalPhases} Total Phases`);
      setShowCongrats(true);

      setTimeout(() => {
        setShowCongrats(false);
        onComplete?.();
      }, 3000);
    } catch (error) {
      console.error('Failed to complete phase:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage]);

  const currentImagePath = getPageImagePath(currentPageNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm md:p-4">
      <div className="relative w-full h-full md:max-w-4xl md:h-auto md:rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-gray-800/90 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-white">Qur'ān Reader</h2>
            <p className="text-xs text-gray-400">Day {day} • Phase {phase} • Page {currentPageIndex + 1}/{totalPages}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} disabled={zoom === 50} className="p-2 hover:bg-gray-700 rounded text-gray-300">
              <ZoomOut size={18} />
            </button>
            <span className="text-xs font-semibold text-gray-400 min-w-[35px] text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(150, zoom + 10))} disabled={zoom === 150} className="p2 hover:bg-gray-700 rounded text-gray-300">
              <ZoomIn size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-700">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-600" style={{ width: `${((currentPageIndex + 1) / totalPages) * 100}%` }} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-6 bg-white">
          {imageError ? (
            <div className="text-center">
              <p className="text-gray-600 text-lg">Failed to load page image</p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img
                ref={imageRef}
                key={currentImagePath}
                src={currentImagePath}
                alt={`Qur'ān Page ${currentPageNumber}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ transform: `scale(${zoom / 100})` }}
                onLoad={() => setIsImageLoading(false)}
                onError={() => { setImageError(true); setIsImageLoading(false); }}
              />
            </div>
          )}
        </div>

        {/* Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
            <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-3xl p-8 text-center max-w-xs shadow-2xl">
              <CheckCircle2 size={80} className="mx-auto text-white mb-6" />
              <h3 className="text-3xl font-black text-white mb-2">Excellent!</h3>
              <p className="text-white/90 whitespace-pre-line">{congratsMessage}</p>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className="px-4 md:px-6 py-4 bg-gray-800/90 border-t border-gray-700 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-700 disabled:opacity-30 text-gray-300 transition"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex-1 text-center text-sm text-gray-400">
            {isLastPage ? (
              <button
                onClick={handleCompletePhase}
                disabled={isSubmitting}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-lg transition"
              >
                {isSubmitting ? 'Completing...' : '✅ Complete Phase'}
              </button>
            ) : (
              <p>Page {currentPageIndex + 1} of {totalPages}</p>
            )}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className="p-2 rounded-lg hover:bg-gray-700 disabled:opacity-30 text-gray-300 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
