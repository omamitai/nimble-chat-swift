
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const ThemeQuickToggle: React.FC = () => {
    const { theme, setTheme } = useAppStore();

    return (
        <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
                <span className="font-medium">Theme</span>
                <div className="flex items-center space-x-2">
                    {(['light', 'dark', 'auto'] as const).map((themeOption) => (
                        <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption)}
                            className={cn(
                                'px-3 py-1 rounded-full text-sm transition-smooth',
                                theme === themeOption
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            )}
                        >
                            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ThemeQuickToggle;
