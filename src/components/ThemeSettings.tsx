
import React from 'react';
import { ArrowLeft, Palette } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const ThemeSettings: React.FC = () => {
    const { theme, setTheme, setActiveScreen } = useAppStore();

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
        setTheme(newTheme);
    };

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
                    <h1 className="text-xl font-semibold">Theme</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Palette className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">App Theme</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {(['light', 'dark', 'auto'] as const).map((themeOption) => (
                                <button
                                    key={themeOption}
                                    onClick={() => handleThemeChange(themeOption)}
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
                <div className="p-4 text-sm text-muted-foreground text-center">
                    <p>'Auto' will sync with your system's theme preference.</p>
                </div>
            </div>
        </div>
    );
};

export default ThemeSettings;
