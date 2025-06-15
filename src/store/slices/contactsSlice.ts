
import { StateCreator } from 'zustand';

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  isBlocked?: boolean;
  isFavorite?: boolean;
}

export interface ContactsSlice {
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  toggleContactBlock: (contactId: string) => void;
  toggleFavorite: (contactId: string) => void;
}

export const createContactsSlice: StateCreator<ContactsSlice> = (set, get) => ({
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
  addContact: (contact) => {
    const { contacts } = get();
    set({ contacts: [...contacts, contact] });
  },
  updateContact: (id, updates) => {
    const { contacts } = get();
    set({
      contacts: contacts.map(contact =>
        contact.id === id ? { ...contact, ...updates } : contact
      ),
    });
  },
  removeContact: (id) => {
    const { contacts } = get();
    set({ contacts: contacts.filter(contact => contact.id !== id) });
  },
  toggleContactBlock: (contactId) => {
    const { contacts } = get();
    set({
      contacts: contacts.map(contact =>
        contact.id === contactId 
          ? { ...contact, isBlocked: !contact.isBlocked }
          : contact
      ),
    });
  },
  toggleFavorite: (contactId) => {
    const { contacts } = get();
    set({
      contacts: contacts.map(contact =>
        contact.id === contactId
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      ),
    });
  },
});
