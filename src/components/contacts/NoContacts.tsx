
import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NoContactsProps {
    isSearching: boolean;
}

const NoContacts: React.FC<NoContactsProps> = ({ isSearching }) => {
    const handleInviteFriends = () => toast.info("Invite functionality is not connected.");

    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No contacts found</h3>
            <p className="text-muted-foreground/80 text-sm mb-6 max-w-xs leading-relaxed">
                {isSearching ? 'Try a different search term' : 'Invite friends to start calling'}
            </p>
            <Button onClick={handleInviteFriends} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg border-0 rounded-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Friends
            </Button>
        </div>
    );
};

export default NoContacts;
