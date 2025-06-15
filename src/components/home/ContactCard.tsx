
import React from 'react';
import { Phone, Video } from 'lucide-react';
import { Contact } from '@/store/useAppStore';
import Avatar from '@/components/Avatar';

interface ContactCardProps {
    contact: Contact;
    onVoiceCall: (contactId: string) => void;
    onVideoCall: (contactId: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onVoiceCall, onVideoCall }) => (
    <div
        className="nordic-card p-4 text-center group hover:scale-[1.02] transition-all cursor-pointer"
    >
        <Avatar
            src={contact.avatar}
            name={contact.name}
            size="xl"
            isOnline={contact.isOnline}
            className="mx-auto mb-3"
        />
        <h3 className="font-bold text-foreground text-sm mb-1 truncate">
            {contact.name}
        </h3>
        <p className="text-xs text-muted-foreground/80 mb-3 truncate">
            {contact.username}
        </p>
        <div className="flex justify-center space-x-2">
            <button
                onClick={() => onVoiceCall(contact.id)}
                className="call-button-voice"
                title="Voice call"
            >
                <Phone className="w-5 h-5" />
            </button>
            <button
                onClick={() => onVideoCall(contact.id)}
                className="call-button-video"
                title="Video call"
            >
                <Video className="w-5 h-5" />
            </button>
        </div>
    </div>
);

export default ContactCard;
