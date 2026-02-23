'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import QuranReaderNew from '@/components/quran/QuranReaderNew';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function getReaderCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    
    [data-reader-theme="light"], :root {
      --rd-bg: #FAFAF7;
      --rd-sf: #FFFFFF;
      --rd-bd: rgba(0,0,0,0.08);
      --rd-t1: #0F0E0C;
      --rd-t2: #5B5955;
      --rd-t3: #9C9990;
    }
    
    [data-reader-theme="dark"] {
      --rd-bg: #07080F;
      --rd-sf: #111320;
      --rd-bd: rgba(255,255,255,0.07);
      --rd-t1: #EDE8DC;
      --rd-t2: #8A93AE;
      --rd-t3: #424B64;
    }

    .reader-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--rd-t2); }
    .reader-breadcrumb a { color: var(--rd-t2); text-decoration: none; }
    .reader-breadcrumb a:hover { color: var(--rd-t1); }
    .reader-nav-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 8px; background: var(--rd-sf); border: 1px solid var(--rd-bd); color: var(--rd-t2); text-decoration: none; font-weight: 500; font-size: 13px; transition: all 0.2s; }
    .reader-nav-btn:hover { color: var(--rd-t1); border-color: var(--rd-t1); }
  `;
}

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const day = parseInt(params.day as string);
  const phase = parseInt(params.phase as string);

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('ramadanbot_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserId(userData.id);
        setIsLoading(false);
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

  if (isLoading || !userId || !day || !phase) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: `var(--rd-bg)` }} data-reader-theme={isDark ? 'dark' : 'light'}>
        <style dangerouslySetInnerHTML={{ __html: getReaderCSS() }} />
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#047857', borderTopColor: 'transparent' }} />
          <p style={{ color: `var(--rd-t2)` }}>Loading reader...</p>
        </div>
      </div>
    );
  }

  const handlePhaseComplete = () => {
    setTimeout(() => {
      router.push(`/quran/${day}`);
    }, 1000);
  };

  const canGoPrevious = phase > 1;
  const canGoNext = phase < 5;

  return (
    <div data-reader-theme={isDark ? 'dark' : 'light'}>
      <style dangerouslySetInnerHTML={{ __html: getReaderCSS() }} />
      <QuranReaderNew
        day={day}
        phase={phase}
        userId={userId}
        onComplete={handlePhaseComplete}
      />
      
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t" style={{ backgroundColor: `var(--rd-sf)`, borderColor: `var(--rd-bd)`, zIndex: 30 }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={canGoPrevious ? `/quran/${day}/${phase - 1}` : `/quran/${day}`}
            className="reader-nav-btn"
          >
            <ChevronLeft size={16} />
            Previous
          </Link>

          <nav className="reader-breadcrumb">
            <Link href="/quran" style={{ textDecoration: 'none', color: 'var(--rd-t2)' }}>Qur'ān</Link>
            <span>/</span>
            <Link href={`/quran/${day}`} style={{ textDecoration: 'none', color: 'var(--rd-t2)' }}>Day {day}</Link>
            <span>/</span>
            <span style={{ color: 'var(--rd-t1)', fontWeight: '600' }}>Phase {phase}</span>
          </nav>

          <Link
            href={canGoNext ? `/quran/${day}/${phase + 1}` : `/quran/${day + 1}` ? (day < 29 ? `/quran/${day + 1}` : '/app') : `/quran/${day}`}
            className="reader-nav-btn"
          >
            Next
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
