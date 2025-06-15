
import React, { useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

import ContactsHeader from './contacts/ContactsHeader';
import ContactSearchBar from './contacts/ContactSearchBar';
import ContactGroup from './contacts/ContactGroup';
import NoContacts from './contacts/NoContacts';

const Contacts: React.FC = () => {
  const {
    contacts,
    setActiveScreen,
    startCall,
    toggleFavorite,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const groupedContacts = useMemo(() => {
    const groups: Record<string, typeof contacts> = {};
    
    filteredContacts.forEach(contact => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    return Object.keys(groups)
      .sort()
      .map(letter => ({
        letter,
        contacts: groups[letter],
      }));
  }, [filteredContacts]);

  const handleCall = (contactId: string, type: 'voice' | 'video') => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      startCall(contactId, type);
      setActiveScreen('call');
    }
  };

  const handleToggleFavorite = (contactId: string, isFavorite: boolean | undefined, contactName: string) => {
    toggleFavorite(contactId);
    if (!isFavorite) {
      toast.success(`${contactName} added to Quick Call`);
    } else {
      toast.info(`${contactName} removed from Quick Call`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      <ContactsHeader contactsCount={filteredContacts.length} />
      <ContactSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredContacts.length === 0 ? (
          <NoContacts isSearching={!!searchQuery} />
        ) : (
          <div className="pb-6">
            {groupedContacts.map(group => (
              <ContactGroup
                key={group.letter}
                letter={group.letter}
                contacts={group.contacts}
                onVoiceCall={(id) => handleCall(id, 'voice')}
                onVideoCall={(id) => handleCall(id, 'video')}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
