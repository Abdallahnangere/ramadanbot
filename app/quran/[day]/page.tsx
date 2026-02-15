'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PhaseCard from '@/components/quran/PhaseCard';
import { getPhasePageRange } from '@/lib/quranPages';
import { BookOpen, ChevronLeft } from 'lucide-react';

interface Progress {
  completedPhases: Array<{ day: number; phase: number }>;
}

export default function DayPhasesPage() {
  const router = useRouter();
  const params = useParams();
  const day = parseInt(params.day as string);

  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserId(userData.id);
      } catch {
        router.push('/app');
      }
    } else {
      router.push('/app');
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/quran/progress?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch progress');
        const data = await response.json();
        setProgress(data);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  if (isLoading || !progress || !day) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading phases...</p>
        </div>
      </div>
    );
  }

  // Check if this day is unlocked
  const isDayUnlocked = day === 1 || progress.completedPhases.some(p => p.day === day - 1 && p.phase === 5);

  if (!isDayUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Day {day} is Locked</h1>
          <p className="text-gray-400 mb-6">Complete Day {day - 1} to unlock this day.</p>
          <Link href="/quran" className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition">
            Back to Days
          </Link>
        </div>
      </div>
    );
  }

  const getPhaseUnlockStatus = (phase: number) => {
    if (phase === 1) {
      // Phase 1 of any unlocked day is always available
      return true;
    }

    // Phase is unlocked if previous phase is completed
    return progress.completedPhases.some(p => p.day === day && p.phase === phase - 1);
  };

  const isPhaseCompleted = (phase: number) => {
    return progress.completedPhases.some(p => p.day === day && p.phase === phase);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/quran" className="p-2 hover:bg-gray-800 rounded-lg transition">
            <ChevronLeft size={24} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-2">
              <BookOpen size={36} className="text-emerald-500" />
              Day {day} - Five Daily Phases
            </h1>
            <p className="text-gray-400">Complete all 5 prayer phases to progress</p>
          </div>
        </div>

        {/* Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 5 }, (_, i) => i + 1).map(phase => {
            const isUnlocked = getPhaseUnlockStatus(phase);
            const isCompleted = isPhaseCompleted(phase);
            const pageRange = getPhasePageRange(day, phase);

            return (
              <PhaseCard
                key={phase}
                day={day}
                phase={phase}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
                pagesCount={pageRange.count}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
