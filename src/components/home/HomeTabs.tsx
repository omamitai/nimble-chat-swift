
import React from 'react';
import { PhoneCall, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeTabsProps {
    activeTab: 'favorites' | 'recents';
    setActiveTab: (tab: 'favorites' | 'recents') => void;
}

const HomeTabs: React.FC<HomeTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="px-6 pb-4">
            <div className="flex bg-muted/30 rounded-2xl p-1">
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={cn(
                        'flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all',
                        activeTab === 'favorites'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Quick Call
                </button>
                <button
                    onClick={() => setActiveTab('recents')}
                    className={cn(
                        'flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all',
                        activeTab === 'recents'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <Clock className="w-4 h-4 mr-2" />
                    Recents
                </button>
            </div>
        </div>
    );
};

export default HomeTabs;
