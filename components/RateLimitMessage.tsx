import React, { useEffect, useState } from 'react';
import { getRemainingTime } from '../lib/rateLimit';
import { Clock } from 'lucide-react';

interface RateLimitMessageProps {
  resetTime?: string;
}

const RateLimitMessage: React.FC<RateLimitMessageProps> = () => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    // Immediate check
    setTimeLeft(getRemainingTime());
    
    // Update every minute
    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header - Clean Apple Style */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg mb-4">
            <Clock size={40} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Daily Limit Reached
          </h2>
        </div>
        
        {/* Content - Premium Spacing */}
        <div className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600 text-base leading-relaxed">
              You've used your daily generation limit.
            </p>
            <p className="text-gray-500 text-sm">
              Come back tomorrow to create more flyers.
            </p>
          </div>
            
          {/* Countdown Display - Apple Card */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-4 rounded-2xl border border-blue-200 shadow-sm">
            <Clock size={20} className="text-blue-600" strokeWidth={2} />
            <span className="font-mono font-bold text-xl text-blue-700">{timeLeft}</span>
          </div>

          {/* Footer Note - Subtle */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              This limit ensures quality service for all users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitMessage;
