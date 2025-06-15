
import React from 'react';
import { Phone, Video, Star } from 'lucide-react';
import { Contact } from '@/store/useAppStore';
import Avatar from '@/components/Avatar';
import { cn } from '@/lib/utils';

interface ContactItemProps {
    contact: Contact;
    onVoiceCall: (id: string) => void;
    onVideoCall: (id: string) => void;
    onToggleFavorite: (id: string, isFavorite: boolean | undefined, name: string) => void;
}

const formatLastSeen = (lastSeen?: Date) => {
    if (!lastSeen) return '';
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    return lastSeen.toLocaleDateString('en', { month: 'short', day: 'numeric' });
};

const ContactItem: React.FC<ContactItemProps> = ({ contact, onVoiceCall, onVideoCall, onToggleFavorite }) => (
    <div
        className={cn(
            'flex items-center space-x-4 px-6 py-5 hover:bg-muted/30 transition-all group',
            contact.isBlocked && 'opacity-50'
        )}
    >
        <Avatar
            src={contact.avatar}
            name={contact.name}
            size="lg"
            isOnline={contact.isOnline}
            className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                {contact.name}
            </h3>
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground/80">
                    {contact.username}
                </p>
                {!contact.isOnline && contact.lastSeen && (
                    <span className="text-xs text-muted-foreground/60">
                        {formatLastSeen(contact.lastSeen)}
                    </span>
                )}
            </div>
        </div>
        {!contact.isBlocked && (
            <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                    onClick={() => onToggleFavorite(contact.id, contact.isFavorite, contact.name)}
                    className="tap-target w-10 h-10 hover:bg-muted/50 text-muted-foreground rounded-full transition-all flex items-center justify-center group/star"
                    title={contact.isFavorite ? "Remove from Quick Call" : "Add to Quick Call"}
                >
                    <Star className={cn("w-5 h-5 transition-all", contact.isFavorite ? 'text-amber-400 fill-amber-400' : 'group-hover/star:text-amber-400 group-hover/star:scale-110')} />
                </button>
                <button
                    onClick={() => onVoiceCall(contact.id)}
                    className="call-button-voice"
                >
                    <Phone className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onVideoCall(contact.id)}
                    className="call-button-video"
                >
                    <Video className="w-5 h-5" />
                </button>
            </div>
        )}
    </div>
);

export default ContactItem;
