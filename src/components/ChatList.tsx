
import React, { useState, useMemo } from 'react';
import { Search, Camera, Settings, Bell } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';

const ChatList: React.FC = () => {
  const {
    conversations,
    searchQuery,
    showSearchBar,
    setActiveScreen,
    setSelectedChat,
    setSearchQuery,
    setShowSearchBar,
    markMessagesAsRead,
  } = useAppStore();

  const [pullOffset, setPullOffset] = useState(0);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

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

  const handleNewChat = () => {
    setActiveScreen('contacts');
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
        // Trigger refresh
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
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h1 className="text-2xl font-semibold">Messages</h1>
          <div className="flex items-center space-x-3">
            <button 
              className="tap-target p-2 hover:bg-muted rounded-full transition-smooth"
              onClick={() => setShowSearchBar(!showSearchBar)}
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="tap-target p-2 hover:bg-muted rounded-full transition-smooth"
              onClick={() => setActiveScreen('settings')}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="p-4 border-b border-border/50 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>
          </div>
        )}
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
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No conversations</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery ? 'No matches found' : 'Start a new conversation'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center space-x-3 p-4 hover:bg-muted/50 active:bg-muted transition-smooth cursor-pointer"
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
                    <h3 className="font-medium truncate">
                      {conversation.name}
                      {conversation.isPinned && (
                        <span className="ml-2 text-xs text-primary">📌</span>
                      )}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      {conversation.isTyping ? (
                        <div className="flex items-center space-x-1 text-primary">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-primary rounded-full animate-typing" />
                            <div className="w-1 h-1 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-1 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
                          </div>
                          <span className="text-xs">typing...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage?.senderId === 'me' && (
                            <span className="text-primary">You: </span>
                          )}
                          {conversation.lastMessage?.text || 'No messages yet'}
                        </p>
                      )}
                    </div>
                    
                    {conversation.unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center">
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

      {/* Floating Action Button */}
      <div className="absolute bottom-6 right-6 safe-area-bottom">
        <button
          onClick={handleNewChat}
          className="w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg tap-target flex items-center justify-center transition-smooth"
        >
          <Camera className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatList;
