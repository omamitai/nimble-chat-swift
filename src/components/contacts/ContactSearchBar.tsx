
import React from 'react';
import { Search } from 'lucide-react';

interface ContactSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const ContactSearchBar: React.FC<ContactSearchBarProps> = ({ searchQuery, setSearchQuery }) => (
    <div className="px-6 pb-5 bg-background/90 backdrop-blur-xl">
        <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-muted/30 backdrop-blur-sm rounded-2xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/30 transition-all"
            />
        </div>
    </div>
);

export default ContactSearchBar;
