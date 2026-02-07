import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'text-blue-600', 
  label 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${color}`} 
        strokeWidth={2.5}
        aria-label="Loading"
      />
      {label && (
        <span className={`${labelSizeClasses[size]} font-medium text-gray-600`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
