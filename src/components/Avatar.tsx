
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md', 
  isOnline, 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
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
    <div className={cn('relative flex-shrink-0', className)}>
      <div className={cn(
        'rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground overflow-hidden',
        sizeClasses[size]
      )}>
        {src ? (
          <img 
            src={src} 
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      
      {isOnline !== undefined && (
        <div className={cn(
          'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background',
          isOnline ? 'bg-online' : 'bg-offline'
        )} />
      )}
    </div>
  );
};

export default Avatar;
