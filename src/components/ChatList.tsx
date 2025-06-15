
import React, { useState, useMemo } from 'react';
import { Search, Phone, Video, Settings, Users } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';

const ChatList: React.FC = () => {
  const {
    conversations,
    contacts,
    searchQuery,
    showSearchBar,
    setActiveScreen,
    setSelectedChat,
    setSearchQuery,
    setShowSearchBar,
    markMessagesAsRead,
    startCall,
  } = useAppStore();

  const [pullOffset, setPullOffset] = useState(0);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const recentContacts = useMemo(() => {
    return contacts.filter(contact => contact.isOnline).slice(0, 6);
  }, [contacts]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return date.toLocaleDateString('en', { weekday: 'short' });
    
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setActiveScreen('conversation');
    markMessagesAsRead(chatId);
  };

  const handleVoiceCall = (contactId: string) => {
    startCall(contactId, 'voice');
    setActiveScreen('call');
  };

  const handleVideoCall = (contactId: string) => {
    startCall(contactId, 'video');
    setActiveScreen('call');
  };

  const handlePullStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleMove = (moveEvent: TouchEvent) => {
      const currentY = moveEvent.touches[0].clientY;
      const offset = Math.max(0, Math.min(currentY - startY, 100));
      setPullOffset(offset);
    };

    const handleEnd = () => {
      if (pullOffset > 60) {
        setTimeout(() => {
          console.log('Refreshing chats...');
        }, 300);
      }
      setPullOffset(0);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="safe-area-top">
        <div className="flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <h1 className="text-2xl font-semibold text-foreground">SecureCall</h1>
          <div className="flex items-center space-x-2">
            <button 
              className="tap-target p-2.5 hover:bg-muted rounded-full transition-smooth"
              onClick={() => setShowSearchBar(!showSearchBar)}
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="tap-target p-2.5 hover:bg-muted rounded-full transition-smooth"
              onClick={() => setActiveScreen('settings')}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="px-6 py-3 border-b border-border/50 animate-slide-up bg-background">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border-0"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Quick Call Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Quick Call</h3>
            <button
              onClick={() => setActiveScreen('contacts')}
              className="text-xs text-primary hover:text-primary/80 font-medium"
            >
              See all
            </button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-1">
            {recentContacts.map(contact => (
              <div key={contact.id} className="flex-shrink-0">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <Avatar
                      src={contact.avatar}
                      name={contact.name}
                      size="lg"
                      isOnline={contact.isOnline}
                      className="ring-2 ring-background"
                    />
                    <div className="absolute -bottom-1 -right-1 flex space-x-1">
                      <button
                        onClick={() => handleVoiceCall(contact.id)}
                        className="w-6 h-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center transition-smooth shadow-sm"
                      >
                        <Phone className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleVideoCall(contact.id)}
                        className="w-6 h-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center transition-smooth shadow-sm"
                      >
                        <Video className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium truncate w-16 text-center">
                    {contact.name.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        onTouchStart={handlePullStart}
        style={{ transform: `translateY(${pullOffset}px)` }}
      >
        {pullOffset > 0 && (
          <div className="flex items-center justify-center py-4 text-muted-foreground">
            <div className={cn(
              'w-6 h-6 border-2 border-primary rounded-full animate-spin',
              pullOffset > 60 && 'border-t-transparent'
            )} />
          </div>
        )}

        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Phone className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to connect?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              {searchQuery ? 'No matches found' : 'Start a secure call or message with your contacts'}
            </p>
            <button
              onClick={() => setActiveScreen('contacts')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium transition-smooth"
            >
              <Users className="w-4 h-4 mr-2 inline" />
              View Contacts
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center space-x-4 px-6 py-4 hover:bg-muted/30 active:bg-muted/50 transition-smooth cursor-pointer"
                onClick={() => handleChatSelect(conversation.id)}
              >
                <Avatar
                  src={conversation.avatar}
                  name={conversation.name}
                  size="lg"
                  isOnline={conversation.isOnline}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate text-foreground">
                      {conversation.name}
                      {conversation.isPinned && (
                        <span className="ml-2 text-xs text-primary">📌</span>
                      )}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      {conversation.isTyping ? (
                        <div className="flex items-center space-x-1 text-primary">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
                          </div>
                          <span className="text-xs font-medium">typing...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage?.senderId === 'me' && (
                            <span className="text-primary font-medium">You: </span>
                          )}
                          {conversation.lastMessage?.text || 'No messages yet'}
                        </p>
                      )}
                    </div>
                    
                    {conversation.unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full min-w-[24px] flex items-center justify-center ml-2">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-6 safe-area-bottom flex flex-col space-y-3">
        <button
          onClick={() => setActiveScreen('contacts')}
          className="w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg tap-target flex items-center justify-center transition-smooth"
        >
          <Users className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatList;
