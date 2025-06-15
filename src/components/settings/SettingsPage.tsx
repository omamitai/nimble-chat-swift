
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface SettingsPageProps {
  title: string;
  children: React.ReactNode;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ title, children }) => {
    const { setActiveScreen } = useAppStore();

    return (
        <div className="flex flex-col h-full bg-background animate-fade-in">
            {/* Header */}
            <div className="safe-area-top">
                <div className="flex items-center space-x-3 p-4 border-b border-border/50">
                    <button
                        onClick={() => setActiveScreen('settings')}
                        className="tap-target p-2 -ml-2 hover:bg-muted rounded-full transition-smooth"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-semibold">{title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {children}
            </div>
        </div>
    );
}

export default SettingsPage;
