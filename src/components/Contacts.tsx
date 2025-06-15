
import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, UserPlus, Phone, Video, Share2, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Contacts: React.FC = () => {
  const {
    contacts,
    conversations,
    setActiveScreen,
    setSelectedChat,
    addMessage,
    startCall,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleVoiceCall = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      startCall(contactId, 'voice');
      setActiveScreen('call');
    }
  };

  const handleVideoCall = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      startCall(contactId, 'video');
      setActiveScreen('call');
    }
  };

  const handleMessage = (contactId: string) => {
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(contactId) && !conv.isGroup
    );

    if (existingConversation) {
      setSelectedChat(existingConversation.id);
      setActiveScreen('conversation');
    } else {
      setSelectedChat(contactId);
      setActiveScreen('conversation');
    }
  };

  const handleInviteFriends = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on SecureCall',
        text: 'Download SecureCall for free encrypted voice and video calls!',
        url: window.location.origin
      });
    } else {
      // Fallback for browsers without Web Share API
      const inviteText = `Join me on SecureCall for free encrypted voice and video calls! ${window.location.origin}`;
      navigator.clipboard.writeText(inviteText);
      // In a real app, you'd show a toast notification here
      alert('Invite link copied to clipboard!');
    }
  };

  const formatLastSeen = (lastSeen?: Date) => {
    if (!lastSeen) return '';
    
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    
    if (diff < 60000) return 'last seen just now';
    if (diff < 3600000) return `last seen ${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `last seen ${Math.floor(diff / 3600000)}h ago`;
    
    return `last seen ${lastSeen.toLocaleDateString('en', { 
      month: 'short', 
      day: 'numeric' 
    })}`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="safe-area-top">
        <div className="flex items-center space-x-3 p-4 border-b border-border/50">
          <button
            onClick={() => setActiveScreen('chatList')}
            className="tap-target p-2 -ml-2 hover:bg-muted rounded-full transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Contacts</h1>
          <div className="flex-1" />
          <Button
            onClick={handleInviteFriends}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Invite Friends Banner */}
        <div className="mx-4 my-2 p-4 bg-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-primary">Invite Friends</h3>
              <p className="text-xs text-primary/80 mt-1">
                Share SecureCall with friends for free encrypted calls
              </p>
            </div>
            <Button
              onClick={handleInviteFriends}
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No contacts found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery ? 'Try a different search term' : 'Invite friends to start calling'}
            </p>
            <Button onClick={handleInviteFriends} className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Friends
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {groupedContacts.map(group => (
              <div key={group.letter}>
                {/* Section Header */}
                <div className="sticky top-0 bg-background/90 backdrop-blur-sm border-b border-border/30 px-4 py-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {group.letter}
                  </h3>
                </div>

                {/* Contacts in this section */}
                {group.contacts.map(contact => (
                  <div
                    key={contact.id}
                    className={cn(
                      'flex items-center space-x-3 p-4 hover:bg-muted/50 transition-smooth',
                      contact.isBlocked && 'opacity-50'
                    )}
                  >
                    <Avatar
                      src={contact.avatar}
                      name={contact.name}
                      size="lg"
                      isOnline={contact.isOnline}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">
                          {contact.name}
                          {contact.isBlocked && (
                            <span className="ml-2 text-xs text-destructive">Blocked</span>
                          )}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {contact.phone}
                        </p>
                        
                        {!contact.isOnline && contact.lastSeen && (
                          <span className="text-xs text-muted-foreground">
                            {formatLastSeen(contact.lastSeen)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Call Actions */}
                    {!contact.isBlocked && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleVoiceCall(contact.id)}
                          className="tap-target p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-smooth"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleVideoCall(contact.id)}
                          className="tap-target p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-smooth"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMessage(contact.id)}
                          className="tap-target p-3 bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-smooth"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
