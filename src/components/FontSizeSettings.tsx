
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const FontSizeSettings: React.FC = () => {
    const { fontSize, setFontSize, setActiveScreen } = useAppStore();

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="safe-area-top">
                <div className="flex items-center space-x-3 p-4 border-b border-border/50">
                    <button
                        onClick={() => setActiveScreen('settings')}
                        className="tap-target p-2 -ml-2 hover:bg-muted rounded-full transition-smooth"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-semibold">Font Size</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <p className="text-center text-muted-foreground text-sm">Select your preferred font size.</p>
                  <div className="flex items-center justify-around">
                      {(['small', 'medium', 'large'] as const).map((sizeOption) => (
                          <button
                              key={sizeOption}
                              onClick={() => setFontSize(sizeOption)}
                              className={cn(
                                  'px-4 py-2 rounded-full transition-smooth font-medium',
                                  fontSize === sizeOption
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground hover:bg-muted/80',
                                  sizeOption === 'small' && 'text-sm',
                                  sizeOption === 'medium' && 'text-base',
                                  sizeOption === 'large' && 'text-lg',
                              )}
                          >
                              {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
                          </button>
                      ))}
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg text-center">
                    <p className={cn(
                        'transition-all',
                        fontSize === 'small' && 'text-sm',
                        fontSize === 'medium' && 'text-base',
                        fontSize === 'large' && 'text-lg'
                    )}>
                        This is a preview of your selected font size. It will be applied across the app.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FontSizeSettings;
