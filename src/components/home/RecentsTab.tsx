
import React from 'react';
import { Clock } from 'lucide-react';
import { useAppStore, CallRecord, Contact } from '@/store/useAppStore';
import RecentCallItem from './RecentCallItem';

interface RecentsTabProps {
    onVoiceCall: (contactId: string) => void;
    onVideoCall: (contactId: string) => void;
}

const RecentsTab: React.FC<RecentsTabProps> = ({ onVoiceCall, onVideoCall }) => {
    const { callHistory, contacts } = useAppStore();

    const recentCallsWithContacts = React.useMemo(() => {
        return callHistory.map(call => {
            const contact = contacts.find(c => c.id === call.contactId);
            return { ...call, contact };
        }).filter(call => call.contact);
    }, [callHistory, contacts]);

    if (recentCallsWithContacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">No recent calls</h3>
                <p className="text-muted-foreground/80 text-sm max-w-xs leading-relaxed">
                    Your recent calls will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-border/15">
            {recentCallsWithContacts.map((call) => (
                <RecentCallItem
                    key={call.id}
                    call={call}
                    onVoiceCall={onVoiceCall}
                    onVideoCall={onVideoCall}
                />
            ))}
        </div>
    );
};

export default RecentsTab;
