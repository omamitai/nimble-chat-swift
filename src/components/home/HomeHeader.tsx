
import React from 'react';
import { Search, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const HomeHeader: React.FC = () => {
    const { showSearchBar, setShowSearchBar, setActiveScreen, searchQuery, setSearchQuery } = useAppStore();

    return (
        <div className="safe-area-top bg-background/90 backdrop-blur-xl border-b border-border/30">
            <div className="flex items-center justify-between px-6 py-5">
                <div className="text-center flex-1">
                    <h1 className="text-2xl font-bold gradient-text">SecureCall</h1>
                    <p className="text-sm text-muted-foreground/80 mt-1">
                        Encrypted voice & video calls
                    </p>
                </div>
                <div className="absolute right-6 flex items-center space-x-1">
                    <button
                        className="tap-target p-3 hover:bg-primary/10 rounded-full transition-smooth group"
                        onClick={() => setShowSearchBar(!showSearchBar)}
                    >
                        <Search className="w-5 h-5 text-muted-foreground/80 group-hover:text-primary transition-colors" />
                    </button>
                    <button
                        className="tap-target p-3 hover:bg-primary/10 rounded-full transition-smooth group"
                        onClick={() => setActiveScreen('settings')}
                    >
                        <Settings className="w-5 h-5 text-muted-foreground/80 group-hover:text-primary transition-colors" />
                    </button>
                </div>
            </div>

            {showSearchBar && (
                <div className="px-6 pb-5 animate-slide-up">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-muted/30 backdrop-blur-sm rounded-2xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/30 transition-all"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeHeader;
