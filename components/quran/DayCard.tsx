'use client';

import Link from 'next/link';
import { Lock, CheckCircle2, Unlock } from 'lucide-react';

interface DayCardProps {
  day: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedPhasesCount: number;
}

export default function DayCard({ day, isUnlocked, isCompleted, completedPhasesCount }: DayCardProps) {
  const bgColor = isCompleted 
    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    : isUnlocked 
    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
    : 'bg-gradient-to-br from-gray-400 to-gray-500';

  const hoverClass = isUnlocked && !isCompleted ? 'hover:shadow-lg hover:scale-105' : '';
  const cursorClass = isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60';

  const content = (
    <div className={`${bgColor} ${hoverClass} ${cursorClass} transition-all rounded-2xl p-6 text-white shadow-md flex flex-col items-center justify-center min-h-[120px]`}>
      <div className="text-3xl font-bold mb-2">Day {day}</div>
      
      {isCompleted ? (
        <div className="flex items-center gap-1 text-sm font-semibold">
          <CheckCircle2 size={16} />
          5/5 Complete
        </div>
      ) : isUnlocked ? (
        <div className="text-xs font-semibold opacity-90">{completedPhasesCount}/5 Phases</div>
      ) : (
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Lock size={16} />
          Locked
        </div>
      )}
    </div>
  );

  if (!isUnlocked) {
    return <div>{content}</div>;
  }

  return (
    <Link href={`/quran/${day}`}>
      {content}
    </Link>
  );
}
