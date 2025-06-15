import React, { useState, useMemo } from 'react';
import { Search, Phone, Video, Settings, Users, MessageCircle, PhoneCall } from 'lucide-react';
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

  const handleListVoiceCall = (e: React.MouseEvent, contactId: string) => {
    e.stopPropagation();
    startCall(contactId, 'voice');
    setActiveScreen('call');
  };

  const handleListVideoCall = (e: React.MouseEvent, contactId: string) => {
    e.stopPropagation();
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
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-background to-background/95 backdrop-blur-sm border-b border-border/50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">SecureCall</h1>
          <div className="flex items-center space-x-2">
            <button 
              className="tap-target p-3 hover:bg-primary/10 rounded-2xl transition-smooth group"
              onClick={() => setShowSearchBar(!showSearchBar)}
            >
              <Search className="w-5 h-5 group-hover:text-primary transition-colors" />
            </button>
            <button 
              className="tap-target p-3 hover:bg-primary/10 rounded-2xl transition-smooth group"
              onClick={() => setActiveScreen('settings')}
            >
              <Settings className="w-5 h-5 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="px-6 py-4 border-b border-border/50 animate-slide-up bg-gradient-to-r from-background to-muted/20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background/80 backdrop-blur-sm rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/50 shadow-sm"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Quick Call Section */}
        <div className="px-6 py-5 bg-gradient-to-br from-primary/5 via-primary/8 to-blue-500/5 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center">
                <PhoneCall className="w-4 h-4 mr-2 text-primary" />
                Quick Call
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tap to call instantly</p>
            </div>
            <button
              onClick={() => setActiveScreen('contacts')}
              className="text-xs text-primary hover:text-primary/80 font-semibold px-3 py-1.5 rounded-full hover:bg-primary/10 transition-smooth"
            >
              View all
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {recentContacts.map(contact => (
              <div key={contact.id} className="flex-shrink-0">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <Avatar
                      src={contact.avatar}
                      name={contact.name}
                      size="lg"
                      isOnline={contact.isOnline}
                      className="transition-transform group-hover:scale-105"
                    />
                    <div className="absolute -bottom-1 -right-1 flex space-x-1">
                      <button
                        onClick={() => handleVoiceCall(contact.id)}
                        className="w-7 h-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-110"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleVideoCall(contact.id)}
                        className="w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-110"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-foreground font-medium truncate w-16 text-center">
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
          <div className="divide-y divide-border/20">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center space-x-4 px-6 py-5 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 active:bg-muted/50 transition-all cursor-pointer group"
                onClick={() => handleChatSelect(conversation.id)}
              >
                <Avatar
                  src={conversation.avatar}
                  name={conversation.name}
                  size="lg"
                  isOnline={conversation.isOnline}
                  className="transition-transform group-hover:scale-105"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                      {conversation.name}
                      {conversation.isPinned && (
                        <span className="ml-2 text-xs">📌</span>
                      )}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
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
                      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full min-w-[24px] flex items-center justify-center shadow-sm">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>

                {/* Always visible call buttons with improved design */}
                <div className="flex items-center space-x-1.5 ml-3">
                  <button
                    onClick={(e) => handleListVoiceCall(e, conversation.id)}
                    className="tap-target w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary rounded-xl flex items-center justify-center transition-all hover:scale-110 border border-primary/20 hover:border-primary/40 shadow-sm hover:shadow-md"
                    title="Voice call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleListVideoCall(e, conversation.id)}
                    className="tap-target w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center transition-all hover:scale-110 border border-blue-500/20 hover:border-blue-500/40 shadow-sm hover:shadow-md"
                    title="Video call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-8 right-6 safe-area-bottom">
        <button
          onClick={() => setActiveScreen('contacts')}
          className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-2xl shadow-2xl tap-target flex items-center justify-center transition-all hover:scale-110 hover:rotate-3"
        >
          <Users className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatList;
