
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'call';
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md', 
  isOnline, 
  className,
  onClick
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    call: 'w-32 h-32 text-3xl',
  };

  const onlineIndicatorSizes = {
    xs: 'w-2 h-2 -bottom-0 -right-0',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    md: 'w-3 h-3 -bottom-0.5 -right-0.5',
    lg: 'w-3.5 h-3.5 -bottom-1 -right-1',
    xl: 'w-4 h-4 -bottom-1 -right-1',
    call: 'w-6 h-6 -bottom-2 -right-2',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative flex-shrink-0', className)} onClick={onClick}>
      <div className={cn(
        'rounded-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center font-semibold text-muted-foreground overflow-hidden shadow-sm',
        sizeClasses[size]
      )}>
        {src ? (
          <img 
            src={src} 
            alt={name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="select-none">${getInitials(name)}</span>`;
              }
            }}
          />
        ) : (
          <span className="select-none">{getInitials(name)}</span>
        )}
      </div>
      
      {isOnline !== undefined && (
        <div className={cn(
          'absolute rounded-full border-2 border-background shadow-sm',
          onlineIndicatorSizes[size],
          isOnline ? 'bg-online' : 'bg-muted-foreground/60'
        )} />
      )}
    </div>
  );
};

export default Avatar;
