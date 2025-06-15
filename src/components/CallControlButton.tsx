
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';

interface CallControlButtonProps {
  icon: React.ElementType<LucideProps>;
  label: string;
  onClick?: () => void;
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
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        onClick={onClick}
        className={cn(
          'tap-target rounded-full flex items-center justify-center transition-all duration-200 ease-out touch-manipulation',
          sizeClasses[size],
          isActive
            ? 'bg-white text-call-background shadow-lg'
            : 'bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white/90 border border-white/20'
        )}
      >
        <Icon className={iconSizes[size]} />
      </button>
      <span className="text-xs font-medium text-white/90 text-center leading-tight">
        {label}
      </span>
    </div>
  );
};

export default CallControlButton;
