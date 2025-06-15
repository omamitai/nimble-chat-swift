
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Mic, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';

const Conversation: React.FC = () => {
  const {
    selectedChatId,
    conversations,
    messages,
    contacts,
    currentUser,
    setActiveScreen,
    setSelectedChat,
    addMessage,
    updateMessageStatus,
  } = useAppStore();

  const [messageText, setMessageText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const conversation = conversations.find(c => c.id === selectedChatId);
  const chatMessages = selectedChatId ? messages[selectedChatId] || [] : [];
  const contact = contacts.find(c => c.id === selectedChatId);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChatId) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      text: messageText.trim(),
      senderId: 'me',
      timestamp: new Date(),
      status: 'sending' as const,
      type: 'text' as const,
    };

    addMessage(selectedChatId, newMessage);
    setMessageText('');
    setIsComposing(false);

    // Simulate message delivery
    setTimeout(() => {
      updateMessageStatus(selectedChatId, newMessage.id, 'sent');
    }, 1000);

    setTimeout(() => {
      updateMessageStatus(selectedChatId, newMessage.id, 'delivered');
    }, 2000);

    setTimeout(() => {
      updateMessageStatus(selectedChatId, newMessage.id, 'read');
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    setIsComposing(e.target.value.length > 0);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  if (!conversation || !selectedChatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="safe-area-top">
        <div className="flex items-center space-x-3 p-4 border-b border-border/50 bg-background/95 backdrop-blur-sm">
          <button
            onClick={() => {
              setSelectedChat(null);
              setActiveScreen('chatList');
            }}
            className="tap-target p-2 -ml-2 hover:bg-muted rounded-full transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <Avatar
            src={conversation.avatar}
            name={conversation.name}
            size="md"
            isOnline={conversation.isOnline}
          />
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{conversation.name}</h2>
            {conversation.isTyping ? (
              <p className="text-xs text-primary">typing...</p>
            ) : conversation.isOnline ? (
              <p className="text-xs text-online">online</p>
            ) : contact?.lastSeen ? (
              <p className="text-xs text-muted-foreground">
                last seen {formatMessageTime(contact.lastSeen)}
              </p>
            ) : null}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="tap-target p-2 hover:bg-muted rounded-full transition-smooth">
              <Camera className="w-5 h-5" />
            </button>
            <button className="tap-target p-2 hover:bg-muted rounded-full transition-smooth">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Avatar
                src={conversation.avatar}
                name={conversation.name}
                size="lg"
              />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Start a conversation with {conversation.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              Messages are end-to-end encrypted
            </p>
          </div>
        ) : (
          chatMessages.map((message, index) => {
            const isMe = message.senderId === 'me';
            const showTime = index === 0 || 
              chatMessages[index - 1].timestamp.getTime() - message.timestamp.getTime() > 300000;
            
            return (
              <div key={message.id} className="space-y-2">
                {showTime && (
                  <div className="flex justify-center">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {message.timestamp.toLocaleDateString('en', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
                
                <div className={cn(
                  'flex items-end space-x-2',
                  isMe ? 'justify-end' : 'justify-start'
                )}>
                  {!isMe && (
                    <Avatar
                      src={conversation.avatar}
                      name={conversation.name}
                      size="sm"
                    />
                  )}
                  
                  <div className={cn(
                    'message-bubble',
                    isMe ? 'message-sent' : 'message-received'
                  )}>
                    <p className="leading-relaxed">{message.text}</p>
                    <div className={cn(
                      'flex items-center justify-end mt-1 space-x-1',
                      isMe ? 'text-foreground/60' : 'text-muted-foreground'
                    )}>
                      <span className="text-xs">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {isMe && (
                        <span className={cn(
                          'text-xs',
                          message.status === 'read' ? 'text-primary' : 'text-muted-foreground'
                        )}>
                          {getMessageStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="safe-area-bottom">
        <div className="p-4 border-t border-border/50 bg-background/95 backdrop-blur-sm">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={messageText}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full resize-none rounded-2xl bg-muted px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[48px] max-h-[120px]"
                rows={1}
              />
              
              {!isComposing && (
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 tap-target p-2 hover:bg-background rounded-full transition-smooth">
                  <Mic className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            {isComposing && (
              <button
                onClick={handleSendMessage}
                className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center transition-smooth tap-target"
              >
                <span className="text-lg">→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
