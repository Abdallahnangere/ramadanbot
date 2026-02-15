'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import QuranReaderNew from '@/components/quran/QuranReaderNew';

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const day = parseInt(params.day as string);
  const phase = parseInt(params.phase as string);

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
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
  }, [router]);

  if (isLoading || !userId || !day || !phase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading reader...</p>
        </div>
      </div>
    );
  }

  const handlePhaseComplete = () => {
    // Redirect back to day page or move to next phase/day
    setTimeout(() => {
      router.push(`/quran/${day}`);
    }, 1000);
  };

  return (
    <QuranReaderNew
      day={day}
      phase={phase}
      userId={userId}
      onComplete={handlePhaseComplete}
    />
  );
}
