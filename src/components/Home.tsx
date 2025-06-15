
import React, { useState, useMemo } from 'react';
import { Search, Phone, Video, Settings, Users, PhoneCall, UserPlus, Clock, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const {
    contacts,
    callHistory,
    searchQuery,
    showSearchBar,
    setActiveScreen,
    setSearchQuery,
    setShowSearchBar,
    startCall,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'favorites' | 'recents'>('favorites');

  // Favorite contacts for Quick Call - limited to 8
  const favoriteContacts = useMemo(() => {
    return contacts.filter(c => c.isFavorite).slice(0, 8);
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return favoriteContacts;
    
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery, favoriteContacts]);

  const recentCallsWithContacts = useMemo(() => {
    return callHistory.map(call => {
      const contact = contacts.find(c => c.id === call.contactId);
      return { ...call, contact };
    }).filter(call => call.contact);
  }, [callHistory, contacts]);

  const handleVoiceCall = (contactId: string) => {
    startCall(contactId, 'voice');
    setActiveScreen('call');
  };

  const handleVideoCall = (contactId: string) => {
    startCall(contactId, 'video');
    setActiveScreen('call');
  };

  const formatCallDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCallTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return date.toLocaleDateString('en', { weekday: 'short' });
    
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  const getCallIcon = (direction: string, type: string) => {
    if (direction === 'missed') return PhoneMissed;
    if (direction === 'incoming') return PhoneIncoming;
    return PhoneOutgoing;
  };

  const getCallIconColor = (direction: string) => {
    if (direction === 'missed') return 'text-red-500';
    if (direction === 'incoming') return 'text-nordic-aurora';
    return 'text-muted-foreground';
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-nordic-ice/5 to-background">
      {/* Header */}
      <div className="safe-area-top bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold gradient-text">SecureCall</h1>
            <p className="text-sm text-muted-foreground/80 mt-1">
              Encrypted voice & video calls
            </p>
          </div>
          <div className="absolute right-6 flex items-center space-x-1">
            <button 
              className="tap-target p-3 hover:bg-primary/10 rounded-full transition-smooth group"
              onClick={() => setShowSearchBar(!showSearchBar)}
            >
              <Search className="w-5 h-5 text-muted-foreground/80 group-hover:text-primary transition-colors" />
            </button>
            <button 
              className="tap-target p-3 hover:bg-primary/10 rounded-full transition-smooth group"
              onClick={() => setActiveScreen('settings')}
            >
              <Settings className="w-5 h-5 text-muted-foreground/80 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="px-6 pb-5 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-muted/30 backdrop-blur-sm rounded-2xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/30 transition-all"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pb-4">
          <div className="flex bg-muted/30 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('favorites')}
              className={cn(
                'flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all',
                activeTab === 'favorites'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('recents')}
              className={cn(
                'flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all',
                activeTab === 'recents'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Clock className="w-4 h-4 mr-2" />
              Recents
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'favorites' ? (
          <div className="px-6 py-4">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">No favorite contacts</h3>
                <p className="text-muted-foreground/80 text-sm mb-6 max-w-xs leading-relaxed">
                  {searchQuery ? 'Try a different search term' : 'Add contacts to favorites for quick calling'}
                </p>
                <Button 
                  onClick={() => setActiveScreen('contacts')} 
                  className="bg-gradient-to-r from-primary to-nordic-ocean hover:from-primary/90 hover:to-nordic-ocean/90 text-primary-foreground shadow-lg border-0 rounded-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Browse Contacts
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="nordic-card p-6 text-center group hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Avatar
                      src={contact.avatar}
                      name={contact.name}
                      size="xl"
                      isOnline={contact.isOnline}
                      className="mx-auto mb-4 shadow-lg"
                    />
                    <h3 className="font-bold text-foreground mb-1 truncate">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 mb-4 truncate">
                      {contact.phone}
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleVoiceCall(contact.id)}
                        className="call-button-voice"
                        title="Voice call"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleVideoCall(contact.id)}
                        className="call-button-video"
                        title="Video call"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/15">
            {recentCallsWithContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">No recent calls</h3>
                <p className="text-muted-foreground/80 text-sm max-w-xs leading-relaxed">
                  Your recent calls will appear here
                </p>
              </div>
            ) : (
              recentCallsWithContacts.map((call) => {
                const CallIcon = getCallIcon(call.direction, call.type);
                return (
                  <div
                    key={call.id}
                    className="flex items-center space-x-4 px-6 py-5 hover:bg-gradient-to-r hover:from-muted/20 hover:to-transparent transition-all group"
                  >
                    <Avatar
                      src={call.contact?.avatar}
                      name={call.contact?.name || 'Unknown'}
                      size="lg"
                      isOnline={call.contact?.isOnline}
                      className="shadow-sm"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold truncate text-foreground">
                          {call.contact?.name || 'Unknown'}
                        </h3>
                        <CallIcon className={cn('w-4 h-4', getCallIconColor(call.direction))} />
                        {call.type === 'video' && (
                          <Video className="w-4 h-4 text-muted-foreground/60" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground/80">
                          {formatCallTime(call.timestamp)}
                          {call.duration && (
                            <span className="ml-2">• {formatCallDuration(call.duration)}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVoiceCall(call.contactId)}
                        className="call-button-voice"
                        title="Voice call"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleVideoCall(call.contactId)}
                        className="call-button-video"
                        title="Video call"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
