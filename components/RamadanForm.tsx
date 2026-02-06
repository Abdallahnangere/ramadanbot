import React, { useState, useRef, useEffect } from 'react';
import { FormData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { checkLimitAndGenerate } from '../app/actions'; // Use Server Action
import { Send, Target, ChevronDown, Check, Info, Lightbulb, AlertCircle } from 'lucide-react';

interface RamadanFormProps {
  onSuccess: (data: { text: string; formData: FormData }) => void;
  disabled?: boolean;
  initialName: string;
  userId: string; // Needed for tracking
}

const RamadanForm: React.FC<RamadanFormProps> = ({ onSuccess, disabled, initialName, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    day: 1,
    hint: '',
  });

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
    <div className="w-full space-y-5">
      
      {/* How It Works - Apple Style Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl border border-blue-200/50 dark:border-blue-900/30 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1.5">
                How It Works
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                Share a spiritual theme like "Patience" or "Gratitude" and we'll craft a personalized Ramadan reflection flyer for you to share with your community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Card - Apple Style */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Topic and Day Row */}
            <div className="flex gap-3 relative z-20">
              {/* Topic Input */}
              <div className="flex-1 space-y-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 px-1">
                  Topic
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Target size={18} className="text-gray-400 dark:text-gray-500" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    maxLength={50}
                    value={formData.topic}
                    onChange={(e) => handleChange('topic', e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 placeholder:dark:text-gray-500"
                    placeholder="e.g., Ihsan"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Day Dropdown */}
              <div className="w-32 flex-shrink-0 space-y-2" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 px-1">
                  Day
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => !isLoading && setIsDayOpen(!isDayOpen)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-semibold flex items-center justify-between outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-98"
                    disabled={isLoading}
                  >
                    <span>Day {formData.day}</span>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDayOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDayOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-50 py-2">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => { handleChange('day', day); setIsDayOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                            formData.day === day 
                              ? 'bg-blue-500 text-white font-semibold' 
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
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

            {/* Hint Textarea */}
            <div className="space-y-2">
              <label className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Hint <span className="text-xs font-normal text-gray-400 dark:text-gray-500">(optional)</span>
                </span>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  {formData.hint?.length || 0}/300
                </span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 pointer-events-none">
                  <Lightbulb size={18} className="text-gray-400 dark:text-gray-500" strokeWidth={2} />
                </div>
                <textarea
                  maxLength={300}
                  rows={3}
                  value={formData.hint}
                  onChange={(e) => handleChange('hint', e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none placeholder:text-gray-400 placeholder:dark:text-gray-500"
                  placeholder="Specific Ayah, Hadith, or theme..."
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Generate Button - Apple Style */}
            <button
              type="submit"
              disabled={isLoading || disabled}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-none transform active:scale-98 transition-all flex items-center justify-center gap-2.5 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="text-white" />
              ) : (
                <>
                  <span className="text-base">Generate Flyer Image</span>
                  <Send size={18} fill="currentColor" strokeWidth={0} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* AI Disclaimer - Apple Style */}
      <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                <span className="font-semibold">Note:</span> AI may occasionally make errors in name placement while creating the flyer image. If you encounter this, simply generate another flyer to get the correct result.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamadanForm;
