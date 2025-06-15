
import React from 'react';
import { Contact } from '@/store/useAppStore';
import ContactItem from './ContactItem';

interface ContactGroupProps {
    letter: string;
    contacts: Contact[];
    onVoiceCall: (id: string) => void;
    onVideoCall: (id: string) => void;
    onToggleFavorite: (id: string, isFavorite: boolean | undefined, name: string) => void;
}

const ContactGroup: React.FC<ContactGroupProps> = ({ letter, contacts, ...rest }) => (
    <div>
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/20 px-6 py-3 z-10">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                {letter}
            </h3>
        </div>
        <div className="divide-y divide-border/20">
            {contacts.map(contact => (
                <ContactItem key={contact.id} contact={contact} {...rest} />
            ))}
        </div>
    </div>
);

export default ContactGroup;
