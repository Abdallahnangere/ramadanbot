'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PhaseCard from '@/components/quran/PhaseCard';
import { getPhasePageRange } from '@/lib/quranPages';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface Progress {
  completedPhases: Array<{ day: number; phase: number }>;
  totalPhases: number;
  totalCompletedPhases: number;
}

function getDayCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    
    [data-day-theme="light"], :root {
      --dt-bg: #FAFAF7;
      --dt-bg-alt: #F3F2EE;
      --dt-sf: #FFFFFF;
      --dt-bd: rgba(0,0,0,0.08);
      --dt-t1: #0F0E0C;
      --dt-t2: #5B5955;
      --dt-t3: #9C9990;
      --dt-emerald: #047857;
      --dt-em-dim: rgba(4,120,87,0.08);
      --dt-em-brd: rgba(4,120,87,0.18);
    }
    
    [data-day-theme="dark"] {
      --dt-bg: #07080F;
      --dt-bg-alt: #0C0D1A;
      --dt-sf: #111320;
      --dt-bd: rgba(255,255,255,0.07);
      --dt-t1: #EDE8DC;
      --dt-t2: #8A93AE;
      --dt-t3: #424B64;
      --dt-emerald: #34D399;
      --dt-em-dim: rgba(52,211,153,0.12);
      --dt-em-brd: rgba(52,211,153,0.22);
    }

    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    .dt-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--dt-t2); }
    .dt-breadcrumb a { color: var(--dt-emerald); text-decoration: none; font-weight: 500; }
    .dt-breadcrumb a:hover { text-decoration: underline; }
    .dt-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 700; color: var(--dt-t1); line-height: 1.1; }
    .dt-subtitle { font-size: 15px; font-weight: 400; color: var(--dt-t2); }
    .dt-progress-box { padding: 12px 16px; background: var(--dt-em-dim); border: 1px solid var(--dt-em-brd); border-radius: 10px; }
    .dt-progress-label { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--dt-t3); }
    .dt-progress-value { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: var(--dt-t1); margin-top: 2px; }
    .dt-nav-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 9px; background: var(--dt-sf); border: 1px solid var(--dt-bd); color: var(--dt-t2); text-decoration: none; font-weight: 500; transition: all 0.2s; }
    .dt-nav-btn:hover { color: var(--dt-t1); border-color: var(--dt-emerald); background: var(--dt-bg-alt); }
    .dt-nav-btn.disabled { opacity: 0.4; pointer-events: none; }
  `;
}

export default function DayPhasesPage() {
  const router = useRouter();
  const params = useParams();
  const day = parseInt(params.day as string);

  const [progress, setProgress] = useState<Progress | null>(null);
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
      }
    } else {
      router.push('/app');
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

  if (isLoading || !progress || !day) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: `var(--dt-bg)` }} data-day-theme={isDark ? 'dark' : 'light'}>
        <style dangerouslySetInnerHTML={{ __html: getDayCSS() }} />
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `var(--dt-emerald)`, borderTopColor: 'transparent' }} />
          <p style={{ color: `var(--dt-t2)` }}>Loading phases...</p>
        </div>
      </div>
    );
  }

  const isDayUnlocked = day === 1 || progress.completedPhases.some(p => p.day === day - 1 && p.phase === 5);

  if (!isDayUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: `var(--dt-bg)`, color: `var(--dt-t1)` }} data-day-theme={isDark ? 'dark' : 'light'}>
        <style dangerouslySetInnerHTML={{ __html: getDayCSS() }} />
        <div className="text-center max-w-md">
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <h1 className="dt-title mb-2">Day {day} is Locked</h1>
          <p className="dt-subtitle mb-8">Complete Day {day - 1} to unlock this day.</p>
          <Link href="/quran" className="dt-nav-btn">
            <ChevronLeft size={18} />
            Back to Days
          </Link>
        </div>
      </div>
    );
  }

  const getPhaseUnlockStatus = (phase: number) => {
    if (phase === 1) return true;
    return progress.completedPhases.some(p => p.day === day && p.phase === phase - 1);
  };

  const isPhaseCompleted = (phase: number) => {
    return progress.completedPhases.some(p => p.day === day && p.phase === phase);
  };

  const completedPhaseCount = progress.completedPhases.filter(p => p.day === day).length;
  const hasPreviousDay = day > 1;
  const hasNextDay = day < 29;
  const canGoNext = completedPhaseCount === 5;

  return (
    <div className="min-h-screen" style={{ backgroundColor: `var(--dt-bg)`, color: `var(--dt-t1)` }} data-day-theme={isDark ? 'dark' : 'light'}>
      <style dangerouslySetInnerHTML={{ __html: getDayCSS() }} />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: `var(--dt-sf)`, borderColor: `var(--dt-bd)` }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/quran" className="dt-nav-btn">
            <ChevronLeft size={18} />
            All Days
          </Link>
          <nav className="dt-breadcrumb">
            <span>/</span>
            <span style={{ fontWeight: '600', color: `var(--dt-t1)` }}>Day {day}</span>
          </nav>
          <div style={{ width: '140px' }} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="dt-title mb-2">Day {day} - Five Daily Phases</h1>
          <p className="dt-subtitle">Complete all 5 prayer phases to progress • {completedPhaseCount}/5 done</p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: `var(--dt-t3)` }}>Day Progress</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: `var(--dt-t1)` }}>{completedPhaseCount}/5</span>
            </div>
            <div style={{ height: '6px', background: `var(--dt-bd)`, borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(completedPhaseCount / 5) * 100}%`,
                  background: `linear-gradient(90deg, var(--dt-emerald), var(--dt-emerald))`,
                  transition: 'width 0.6s ease-out',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Phases Grid */}
        <div className="mb-12">
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

        {/* Day Navigation */}
        <div className="flex items-center justify-between gap-4 pt-8 border-t" style={{ borderColor: `var(--dt-bd)` }}>
          <Link
            href={hasPreviousDay ? `/quran/${day - 1}` : '#'}
            className={`dt-nav-btn flex items-center gap-2 ${!hasPreviousDay ? 'disabled' : ''}`}
            style={{ flex: '1', justifyContent: 'center' }}
          >
            <ChevronLeft size={18} />
            Previous Day
          </Link>

          <div className="text-center">
            <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: `var(--dt-t3)` }}>Progress</span>
            <p style={{ fontSize: '20px', fontWeight: '700', color: `var(--dt-t1)` }}>{day} of 29</p>
          </div>

          <Link
            href={canGoNext && hasNextDay ? `/quran/${day + 1}` : canGoNext && !hasNextDay ? '/app' : '#'}
            className={`dt-nav-btn flex items-center gap-2 ${(!canGoNext || !hasNextDay) && !canGoNext ? 'disabled' : ''}`}
            style={{ flex: '1', justifyContent: 'center' }}
          >
            {canGoNext && !hasNextDay ? 'Back to App' : canGoNext ? 'Next Day' : 'Complete Day'} 
            {canGoNext ? <ChevronRight size={18} /> : ''}
          </Link>
        </div>
      </div>
    </div>
  );
}
