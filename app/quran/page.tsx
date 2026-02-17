'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DayCard from '@/components/quran/DayCard';
import { BookOpen, Flame } from 'lucide-react';

interface UserProgress {
  currentDay: number;
  currentPhase: number;
  completedPhases: Array<{ day: number; phase: number }>;
  totalCompletedPhases: number;
  totalPhases: number;
  completionPercentage: number;
}

export default function QuranJourneyPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from session/auth - check ramadanbot_user key used in /app
    const user = localStorage.getItem('ramadanbot_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserId(userData.id);
      } catch {
        router.push('/app');
        return;
      }
    } else {
      router.push('/app');
      return;
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

  if (isLoading || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your Qur'ān journey...</p>
        </div>
      </div>
    );
  }

  // Determine which days are unlocked
  const getDayStatus = (day: number) => {
    if (day === 1) {
      // Day 1 is always unlocked
      return { isUnlocked: true, isCompleted: false };
    }

    // A day is unlocked if the previous day's last phase is completed
    const previousDayLastPhaseCompleted = progress.completedPhases.some(
      p => p.day === day - 1 && p.phase === 5
    );

    return {
      isUnlocked: previousDayLastPhaseCompleted,
      isCompleted: false,
    };
  };

  const getDayCompletedPhases = (day: number) => {
    return progress.completedPhases.filter(p => p.day === day).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center gap-3">
              <BookOpen size={40} className="text-emerald-500" />
              Your Qur'ān Journey
            </h1>
            <p className="text-gray-400 text-lg">Complete 145 phases across 29 days of Ramadan</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold">
              <Flame size={20} className="text-orange-500" />
              {progress.totalCompletedPhases} / {progress.totalPhases}
            </div>
            <p className="text-2xl font-bold text-white">{progress.completionPercentage}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Days Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 29 }, (_, i) => i + 1).map(day => {
            const { isUnlocked, isCompleted } = getDayStatus(day);
            const completedPhasesCount = getDayCompletedPhases(day);

            return (
              <DayCard
                key={day}
                day={day}
                isUnlocked={isUnlocked}
                isCompleted={completedPhasesCount === 5}
                completedPhasesCount={completedPhasesCount}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
