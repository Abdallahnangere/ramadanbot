import React, { useState, useRef, useEffect } from 'react';
import { FormData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { checkLimitAndGenerate } from '../app/actions'; // Use Server Action
import { Send, Target, ChevronDown, Check, Info, Lightbulb, AlertCircle, Clock, MapPin, Moon } from 'lucide-react';

interface RamadanFormProps {
  onSuccess: (data: { text: string; formData: FormData }) => void;
  disabled?: boolean;
  initialName: string;
  userId: string; // Needed for tracking
  countdownTime?: string;
  hasLimitReached?: boolean;
}

const RamadanForm: React.FC<RamadanFormProps> = ({ onSuccess, disabled, initialName, userId, countdownTime = '00:00:00', hasLimitReached = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [iftarCountdown, setIftarCountdown] = useState<{ h: string; m: string; s: string; day: number }>({ h: '00', m: '00', s: '00', day: 1 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    day: 1,
    hint: '',
  });

  // Prayer times for Damaturu, Nigeria (Ramadan 1447)
  const PRAYER_TIMES = [
    { day: 1, maghrib: "18:21" }, { day: 2, maghrib: "18:21" }, { day: 3, maghrib: "18:21" },
    { day: 4, maghrib: "18:21" }, { day: 5, maghrib: "18:22" }, { day: 6, maghrib: "18:22" },
    { day: 7, maghrib: "18:22" }, { day: 8, maghrib: "18:22" }, { day: 9, maghrib: "18:22" },
    { day: 10, maghrib: "18:22" }, { day: 11, maghrib: "18:23" }, { day: 12, maghrib: "18:23" },
    { day: 13, maghrib: "18:23" }, { day: 14, maghrib: "18:23" }, { day: 15, maghrib: "18:23" },
    { day: 16, maghrib: "18:23" }, { day: 17, maghrib: "18:23" }, { day: 18, maghrib: "18:23" },
    { day: 19, maghrib: "18:23" }, { day: 20, maghrib: "18:23" }, { day: 21, maghrib: "18:23" },
    { day: 22, maghrib: "18:24" }, { day: 23, maghrib: "18:24" }, { day: 24, maghrib: "18:24" },
    { day: 25, maghrib: "18:24" }, { day: 26, maghrib: "18:24" }, { day: 27, maghrib: "18:24" },
    { day: 28, maghrib: "18:24" }, { day: 29, maghrib: "18:24" }, { day: 30, maghrib: "18:24" },
  ];

  // Calculate current Ramadan day and time until iftar
  useEffect(() => {
    const updateCountdown = () => {
      try {
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
        const ramadanStart = new Date(2026, 1, 18); // Feb 18, 2026
        
        const diffMs = now.getTime() - ramadanStart.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        const ramadanDay = Math.max(1, Math.min(30, diffDays));
        
        const todayPrayer = PRAYER_TIMES.find(p => p.day === ramadanDay);
        const maghribTime = todayPrayer?.maghrib || PRAYER_TIMES[0].maghrib;
        const [maghribH, maghribM] = maghribTime.split(':').map(Number);
        
        const iftarDate = new Date(now);
        iftarDate.setHours(maghribH, maghribM, 0, 0);
        
        if (iftarDate < now) {
          iftarDate.setDate(iftarDate.getDate() + 1);
        }
        
        const msUntilIftar = iftarDate.getTime() - now.getTime();
        const totalSecs = Math.max(0, Math.floor(msUntilIftar / 1000));
        const hours = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSecs % 60).padStart(2, '0');
        
        setIftarCountdown({ h: hours, m: mins, s: secs, day: ramadanDay });
      } catch (e) {
        // Fallback if timezone conversion fails
        setIftarCountdown({ h: '00', m: '00', s: '00', day: 1 });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDayOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) return;
    
    setIsLoading(true);
    
    // Scroll to top when starting generation
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      const response = await checkLimitAndGenerate(
        userId,
        formData.topic,
        formData.day,
        formData.hint
      );

      if (response.success && response.text) {
        onSuccess({ text: response.text, formData });
      } else {
        alert(response.error);
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Compact Iftar Countdown - Smart Status Card */}
      <div className="bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 rounded-2xl border border-orange-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3 items-center">
            {/* Ramadan Day */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Moon size={16} className="text-orange-600" strokeWidth={2} />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Day</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{iftarCountdown.day}</p>
              <p className="text-xs text-gray-500 font-medium">Ramadan</p>
            </div>

            {/* Countdown to Iftar */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock size={16} className="text-rose-600" strokeWidth={2} />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Iftar in</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-rose-600 font-mono">{iftarCountdown.h}</span>
                <span className="text-xs text-gray-400 font-medium">:</span>
                <span className="text-xl font-bold text-rose-600 font-mono">{iftarCountdown.m}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">hours : minutes</p>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin size={16} className="text-amber-600" strokeWidth={2} />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</span>
              </div>
              <p className="text-sm font-bold text-amber-700 leading-tight">Damaturu</p>
              <p className="text-xs text-gray-500 font-medium">Nigeria</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form - Clean & Elegant */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Topic and Day Row */}
        <div className="flex gap-3 relative z-20">
          
          {/* Topic Input - Apple Polish */}
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-semibold text-gray-600 px-1 uppercase tracking-wider">
              Topic
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Target size={18} className="text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="text"
                maxLength={50}
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-[15px] font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="e.g., Ihsan"
                disabled={isLoading || disabled}
                required
              />
            </div>
          </div>

          {/* Day Dropdown - Premium Design */}
          <div className="w-32 flex-shrink-0 space-y-2" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-gray-600 px-1 uppercase tracking-wider">
              Day
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => !isLoading && !disabled && setIsDayOpen(!isDayOpen)}
                className="w-full py-3.5 px-4 rounded-xl bg-white border border-gray-300 text-gray-900 text-[15px] font-semibold flex items-center justify-between outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 hover:bg-gray-50 active:scale-98 disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading || disabled}
              >
                <span>Day {formData.day}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isDayOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu - Apple Style */}
              {isDayOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 max-h-72 overflow-y-auto z-50 py-2 animate-fade-in">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => { handleChange('day', day); setIsDayOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[15px] flex items-center justify-between transition-all duration-150 ${
                        formData.day === day 
                          ? 'bg-blue-500 text-white font-semibold' 
                          : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <span>Day {day}</span>
                      {formData.day === day && <Check size={16} strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hint Textarea - Apple Design */}
        <div className="space-y-2">
          <label className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Hint <span className="text-xs font-normal text-gray-400 normal-case tracking-normal">(optional)</span>
            </span>
            <span className="text-xs font-medium text-gray-400">
              {formData.hint?.length || 0}/300
            </span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-3.5 pointer-events-none">
              <Lightbulb size={18} className="text-gray-400" strokeWidth={2} />
            </div>
            <textarea
              maxLength={300}
              rows={3}
              value={formData.hint}
              onChange={(e) => handleChange('hint', e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-[15px] font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Specific Ayah, Hadith, or theme..."
              disabled={isLoading || disabled}
            />
          </div>
        </div>

        {/* Generate Button - Apple Premium */}
        {hasLimitReached ? (
          <button
            type="button"
            disabled={true}
            className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 font-semibold py-4 rounded-xl shadow-none cursor-not-allowed flex flex-col items-center justify-center gap-2"
          >
            <span className="text-[15px]">Daily Limit Reached</span>
            <span className="font-mono text-sm font-bold text-gray-700">{countdownTime}</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading || disabled || !formData.topic}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg disabled:shadow-none transform active:scale-98 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="text-white" />
            ) : (
              <>
                <span className="text-[15px]">Generate Flyer</span>
                <Send size={18} fill="currentColor" strokeWidth={0} />
              </>
            )}
          </button>
        )}
      </form>

      {/* AI Disclaimer - Apple Alert Style */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">Note:</span> AI may occasionally make errors in name placement. Simply generate another flyer if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamadanForm;
