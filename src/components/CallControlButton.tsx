
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';

interface CallControlButtonProps {
  icon: React.ElementType<LucideProps>;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

const CallControlButton: React.FC<CallControlButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-2.5", className)}>
      <button
        onClick={onClick}
        className={cn(
          'tap-target w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200 ease-out',
          isActive
            ? 'bg-white text-black'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
        )}
      >
        <Icon className="w-8 h-8" />
      </button>
      <span className="text-sm font-medium text-white/90">{label}</span>
    </div>
  );
};

export default CallControlButton;
