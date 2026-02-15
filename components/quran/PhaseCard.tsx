'use client';

import Link from 'next/link';
import { Lock, CheckCircle2 } from 'lucide-react';

interface PhaseCardProps {
  day: number;
  phase: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  pagesCount: number;
}

const PHASE_DETAILS = [
  { name: 'Fajr', emoji: '🌅', description: 'Dawn' },
  { name: 'Dhuhr', emoji: '☀️', description: 'Noon' },
  { name: 'Asr', emoji: '🌤️', description: 'Afternoon' },
  { name: 'Maghrib', emoji: '🌅', description: 'Sunset' },
  { name: 'Isha', emoji: '🌙', description: 'Night' },
];

export default function PhaseCard({ day, phase, isUnlocked, isCompleted, pagesCount }: PhaseCardProps) {
  const phaseDetail = PHASE_DETAILS[phase - 1];
  
  const bgColor = isCompleted 
    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    : isUnlocked 
    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
    : 'bg-gradient-to-br from-gray-400 to-gray-500';

  const hoverClass = isUnlocked && !isCompleted ? 'hover:shadow-lg hover:scale-105' : '';
  const cursorClass = isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60';

  const content = (
    <div className={`${bgColor} ${hoverClass} ${cursorClass} transition-all rounded-2xl p-6 text-white shadow-md flex flex-col items-center justify-center min-h-[140px]`}>
      <div className="text-4xl mb-2">{phaseDetail.emoji}</div>
      <div className="text-lg font-bold">{phaseDetail.name}</div>
      
      {isCompleted ? (
        <div className="flex items-center gap-1 text-xs font-semibold mt-2 opacity-90">
          <CheckCircle2 size={14} />
          Completed
        </div>
      ) : isUnlocked ? (
        <div className="text-xs font-semibold opacity-90 mt-2">{pagesCount} pages</div>
      ) : (
        <div className="flex items-center gap-1 text-xs font-semibold mt-2">
          <Lock size={14} />
          Locked
        </div>
      )}
    </div>
  );

  if (!isUnlocked) {
    return <div>{content}</div>;
  }

  return (
    <Link href={`/quran/${day}/${phase}`}>
      {content}
    </Link>
  );
}
