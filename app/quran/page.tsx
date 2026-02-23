'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DayCard from '@/components/quran/DayCard';
import { BookOpen, Flame, ArrowLeft } from 'lucide-react';

interface UserProgress {
  currentDay: number;
  currentPhase: number;
  completedPhases: Array<{ day: number; phase: number }>;
  totalCompletedPhases: number;
  totalPhases: number;
  completionPercentage: number;
}

function getQuranCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    
    [data-quran-theme="light"], :root {
      --qr-bg: #FAFAF7;
      --qr-bg-alt: #F3F2EE;
      --qr-sf: #FFFFFF;
      --qr-bd: rgba(0,0,0,0.08);
      --qr-t1: #0F0E0C;
      --qr-t2: #5B5955;
      --qr-t3: #9C9990;
      --qr-gold: #B8900A;
      --qr-gold-b: #D4A830;
      --qr-emerald: #047857;
      --qr-em-dim: rgba(4,120,87,0.08);
      --qr-em-brd: rgba(4,120,87,0.18);
    }
    
    [data-quran-theme="dark"] {
      --qr-bg: #07080F;
      --qr-bg-alt: #0C0D1A;
      --qr-sf: #111320;
      --qr-bd: rgba(255,255,255,0.07);
      --qr-t1: #EDE8DC;
      --qr-t2: #8A93AE;
      --qr-t3: #424B64;
      --qr-gold: #D4A853;
      --qr-gold-b: #F0C060;
      --qr-emerald: #34D399;
      --qr-em-dim: rgba(52,211,153,0.12);
      --qr-em-brd: rgba(52,211,153,0.22);
    }

    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    .qr-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 700; color: var(--qr-t1); line-height: 1.1; }
    .qr-subtitle { font-size: 15px; font-weight: 400; color: var(--qr-t2); }
    .qr-back-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 9px; background: var(--qr-sf); border: 1px solid var(--qr-bd); color: var(--qr-t2); text-decoration: none; transition: all 0.2s; }
    .qr-back-btn:hover { color: var(--qr-t1); border-color: var(--qr-gold); background: var(--qr-bg-alt); }
    .qr-stat { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--qr-em-dim); border: 1px solid var(--qr-em-brd); border-radius: 10px; }
    .qr-stat-label { font-size: 12px; font-weight: 500; color: var(--qr-t2); }
    .qr-stat-value { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 700; color: var(--qr-t1); }
    .qr-progress-label { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--qr-t3); }
    .qr-progress-value { font-size: 24px; font-weight: 700; color: var(--qr-t1); }
  `;
}

export default function QuranJourneyPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
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

    // Check theme preference
    const isDarkTheme = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkTheme);
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: `var(--qr-bg)` }} data-quran-theme={isDark ? 'dark' : 'light'}>
        <style dangerouslySetInnerHTML={{ __html: getQuranCSS() }} />
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `var(--qr-emerald)`, borderTopColor: 'transparent' }} />
          <p style={{ color: `var(--qr-t2)` }}>Loading your Qur'ān journey...</p>
        </div>
      </div>
    );
  }

  const getDayStatus = (day: number) => {
    if (day === 1) {
      return { isUnlocked: true, isCompleted: false };
    }
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

  const currentDayStatus = getDayStatus(progress.currentDay);
  const currentDayCompleted = getDayCompletedPhases(progress.currentDay);

  return (
    <div className="min-h-screen" style={{ backgroundColor: `var(--qr-bg)`, color: `var(--qr-t1)` }} data-quran-theme={isDark ? 'dark' : 'light'}>
      <style dangerouslySetInnerHTML={{ __html: getQuranCSS() }} />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: `var(--qr-sf)`, borderColor: `var(--qr-bd)` }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/app" className="qr-back-btn">
            <ArrowLeft size={18} />
            <span>Back to App</span>
          </Link>
          <h2 style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.05em' }}>QUR'ĀN JOURNEY</h2>
          <div style={{ width: '140px' }} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h1 className="qr-title mb-2">Your Qur'ān Journey</h1>
            <p className="qr-subtitle">Complete 145 phases across 29 days of Ramadan</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className="qr-stat">
              <span className="qr-stat-label">Completed</span>
              <span className="qr-stat-value">{progress.totalCompletedPhases}</span>
            </div>
            <div className="qr-stat">
              <span className="qr-stat-label">Total</span>
              <span className="qr-stat-value">{progress.totalPhases}</span>
            </div>
            <div className="qr-stat">
              <span className="qr-stat-label">Current Day</span>
              <span className="qr-stat-value">{progress.currentDay}</span>
            </div>
            <div className="qr-stat">
              <span className="qr-stat-label">Progress</span>
              <span className="qr-stat-value">{progress.completionPercentage}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '12px' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="qr-progress-label">Overall Progress</span>
              <span className="qr-progress-value">{progress.completionPercentage}%</span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', backgroundColor: `var(--qr-bd)` }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress.completionPercentage}%`,
                  background: `linear-gradient(90deg, var(--qr-emerald), var(--qr-gold))`,
                  transition: 'width 0.6s ease-out',
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Jump Section */}
        {currentDayStatus.isUnlocked && (
          <div className="mb-12 p-6 rounded-xl border-2" style={{ backgroundColor: `var(--qr-em-dim)`, borderColor: `var(--qr-em-brd)` }}>
            <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: `var(--qr-t3)`, marginBottom: '8px' }}>Continue Journey</p>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: `var(--qr-t1)` }}>Day {progress.currentDay}</h3>
                <p style={{ fontSize: '13px', color: `var(--qr-t2)`, marginTop: '4px' }}>{currentDayCompleted}/5 phases completed</p>
              </div>
              <Link
                href={currentDayCompleted < 5 ? `/quran/${progress.currentDay}` : progress.currentDay < 29 ? `/quran/${progress.currentDay + 1}` : '/app'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: `linear-gradient(135deg, var(--qr-emerald), var(--qr-gold))`,
                  color: '#fff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                {currentDayCompleted < 5 ? 'Continue' : 'Next Day'} →
              </Link>
            </div>
          </div>
        )}

        {/* Days Grid */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: `var(--qr-t3)`, marginBottom: '16px' }}>All Days</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 29 }, (_, i) => i + 1).map(day => {
              const { isUnlocked } = getDayStatus(day);
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
    </div>
  );
}
