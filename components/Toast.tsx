'use client';

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      container: 'bg-white border-green-200 shadow-lg',
      icon: 'text-green-600',
      text: 'text-gray-900',
      iconBg: 'bg-green-100',
    },
    error: {
      container: 'bg-white border-red-200 shadow-lg',
      icon: 'text-red-600',
      text: 'text-gray-900',
      iconBg: 'bg-red-100',
    },
    warning: {
      container: 'bg-white border-amber-200 shadow-lg',
      icon: 'text-amber-600',
      text: 'text-gray-900',
      iconBg: 'bg-amber-100',
    },
    info: {
      container: 'bg-white border-blue-200 shadow-lg',
      icon: 'text-blue-600',
      text: 'text-gray-900',
      iconBg: 'bg-blue-100',
    },
  };

  const icons = {
    success: <CheckCircle size={20} strokeWidth={2} />,
    error: <AlertCircle size={20} strokeWidth={2} />,
    warning: <AlertCircle size={20} strokeWidth={2} />,
    info: <Info size={20} strokeWidth={2} />,
  };

  const currentStyle = styles[type];

  return (
    <div
      className={`fixed top-4 left-4 right-4 max-w-sm mx-auto z-[9999] animate-fade-in-up
        ${currentStyle.container} border-2 rounded-2xl backdrop-blur-xl p-4 flex items-center gap-3`}
    >
      {/* Icon Circle */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-full ${currentStyle.iconBg} flex items-center justify-center shadow-sm`}>
        <div className={currentStyle.icon}>{icons[type]}</div>
      </div>
      
      {/* Message */}
      <p className={`${currentStyle.text} text-[15px] font-medium flex-1`}>{message}</p>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 active:scale-95"
        aria-label="Close notification"
      >
        <X size={16} className="text-gray-600" strokeWidth={2} />
      </button>
    </div>
  );
};

export default Toast;
