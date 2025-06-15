
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';

interface CallControlButtonProps {
  icon: React.ElementType<LucideProps>;
  label: string;
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
  isActive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CallControlButton: React.FC<CallControlButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-18 h-18'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm'
  };

  return (
    <div className={cn("flex flex-col items-center gap-3 select-none", className)}>
      <button
        onClick={onClick}
        className={cn(
          'tap-target rounded-full flex items-center justify-center transition-all duration-300 ease-out touch-manipulation relative overflow-hidden',
          sizeClasses[size],
          isActive
            ? 'bg-white text-call-background shadow-xl scale-105 ring-2 ring-white/30'
            : 'bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-sm text-white/90 border border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl hover:scale-110'
        )}
      >
        {/* Active state indicator */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
        )}
        
        <Icon className={cn(iconSizes[size], 'relative z-10')} />
        
        {/* Ripple effect on tap */}
        <div className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/5 active:bg-white/10 transition-all duration-200" />
      </button>
      
      <span className={cn(
        "font-medium text-white/90 text-center leading-tight max-w-20 truncate",
        textSizes[size]
      )}>
        {label}
      </span>
    </div>
  );
};

export default CallControlButton;
