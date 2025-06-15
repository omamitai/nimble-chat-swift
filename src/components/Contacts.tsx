import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, UserPlus, Phone, Video, Share2, MessageCircle, Users, Star, Copy, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Contacts: React.FC = () => {
  const {
    contacts,
    conversations,
    setActiveScreen,
    setSelectedChat,
    addMessage,
    startCall,
    toggleFavorite,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

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

  const handleInviteFriends = async () => {
    const inviteText = 'Join me on SecureCall for free encrypted voice and video calls!';
    const inviteUrl = window.location.origin;
    
    try {
      // Try Web Share API first (mobile devices)
      if (navigator.share && navigator.canShare && navigator.canShare({ text: inviteText, url: inviteUrl })) {
        await navigator.share({
          title: 'Join SecureCall',
          text: inviteText,
          url: inviteUrl
        });
        toast.success('Invite shared successfully!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${inviteText} ${inviteUrl}`);
        setCopied(true);
        toast.success('Invite link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // Final fallback for older browsers
      try {
        await navigator.clipboard.writeText(`${inviteText} ${inviteUrl}`);
        setCopied(true);
        toast.success('Invite link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardError) {
        // Manual copy fallback
        const textArea = document.createElement('textarea');
        textArea.value = `${inviteText} ${inviteUrl}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success('Invite link copied!');
        setTimeout(() => setCopied(false), 2000);
      }
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

  const formatLastSeen = (lastSeen?: Date) => {
    if (!lastSeen) return '';
    
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return lastSeen.toLocaleDateString('en', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="safe-area-top bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold gradient-text">Contacts</h1>
            <p className="text-sm text-muted-foreground/80 mt-1">
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={handleInviteFriends}
            size="sm"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg border-0 rounded-full px-4"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Invite'}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-5">
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
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No contacts found</h3>
            <p className="text-muted-foreground/80 text-sm mb-6 max-w-xs leading-relaxed">
              {searchQuery ? 'Try a different search term' : 'Invite friends to start calling'}
            </p>
            <Button onClick={handleInviteFriends} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg border-0 rounded-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Friends
            </Button>
          </div>
        ) : (
          <div className="pb-6">
            {groupedContacts.map(group => (
              <div key={group.letter}>
                {/* Section Header */}
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/20 px-6 py-3 z-10">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                    {group.letter}
                  </h3>
                </div>

                {/* Contacts in this section */}
                <div className="divide-y divide-border/20">
                  {group.contacts.map(contact => (
                    <div
                      key={contact.id}
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
                        className="border-2 border-background shadow-sm"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                            {contact.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground/80">
                            {contact.phone}
                          </p>
                          
                          {!contact.isOnline && contact.lastSeen && (
                            <span className="text-xs text-muted-foreground/60">
                              {formatLastSeen(contact.lastSeen)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Call Actions */}
                      {!contact.isBlocked && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleFavorite(contact.id, contact.isFavorite, contact.name)}
                            className="tap-target w-10 h-10 hover:bg-muted/50 text-muted-foreground rounded-full transition-all flex items-center justify-center group/star"
                            title={contact.isFavorite ? "Remove from Quick Call" : "Add to Quick Call"}
                          >
                            <Star className={cn("w-5 h-5 transition-all", contact.isFavorite ? 'text-amber-400 fill-amber-400' : 'group-hover/star:text-amber-400 group-hover/star:scale-110')} />
                          </button>
                          <button
                            onClick={() => handleMessage(contact.id)}
                            className="tap-target w-10 h-10 bg-muted/30 hover:bg-muted/50 text-muted-foreground rounded-full transition-all flex items-center justify-center group/message"
                          >
                            <MessageCircle className="w-5 h-5 group-hover/message:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleVoiceCall(contact.id)}
                            className="call-button-voice"
                          >
                            <Phone className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleVideoCall(contact.id)}
                            className="call-button-video"
                          >
                            <Video className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
