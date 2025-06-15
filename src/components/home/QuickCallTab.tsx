
import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { useAppStore, Contact } from '@/store/useAppStore';
import ContactCard from './ContactCard';
import { Button } from '@/components/ui/button';

interface QuickCallTabProps {
    filteredContacts: Contact[];
    onVoiceCall: (contactId: string) => void;
    onVideoCall: (contactId: string) => void;
}

const QuickCallTab: React.FC<QuickCallTabProps> = ({ filteredContacts, onVoiceCall, onVideoCall }) => {
    const { searchQuery, setActiveScreen } = useAppStore();

    if (filteredContacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">No favorite contacts</h3>
                <p className="text-muted-foreground/80 text-sm mb-6 max-w-xs leading-relaxed">
                    {searchQuery ? 'Try a different search term' : 'Star contacts to add them to favorites for quick calling'}
                </p>
                <Button
                    onClick={() => setActiveScreen('contacts')}
                    className="bg-gradient-to-r from-primary to-nordic-ocean hover:from-primary/90 hover:to-nordic-ocean/90 text-primary-foreground shadow-lg border-0 rounded-full"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Browse Contacts
                </Button>
            </div>
        );
    }

    return (
        <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-3">
                {filteredContacts.map(contact => (
                    <ContactCard
                        key={contact.id}
                        contact={contact}
                        onVoiceCall={onVoiceCall}
                        onVideoCall={onVideoCall}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuickCallTab;
