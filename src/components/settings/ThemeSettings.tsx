
import React from 'react';
import { Palette } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import SettingsPage from './SettingsPage';

const ThemeSettings: React.FC = () => {
    const { theme, setTheme } = useAppStore();

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
        setTheme(newTheme);
    };

    return (
        <SettingsPage title="Theme">
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
        </SettingsPage>
    );
};

export default ThemeSettings;
