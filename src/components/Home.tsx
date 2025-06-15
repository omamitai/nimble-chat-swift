
import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import HomeHeader from './home/HomeHeader';
import HomeTabs from './home/HomeTabs';
import QuickCallTab from './home/QuickCallTab';
import RecentsTab from './home/RecentsTab';

const Home: React.FC = () => {
  const {
    contacts,
    searchQuery,
    setActiveScreen,
    startCall,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'favorites' | 'recents'>('favorites');

  const favoriteContacts = useMemo(() => {
    return contacts.filter(c => c.isFavorite).slice(0, 8); // Show more favorites
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return favoriteContacts;
    
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery, favoriteContacts]);

  const handleCall = (contactId: string, type: 'voice' | 'video') => {
    startCall(contactId, type);
    setActiveScreen('call');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-nordic-ice/5 to-background">
      <HomeHeader />
      <HomeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'favorites' ? (
          <QuickCallTab 
            filteredContacts={filteredContacts}
            onVoiceCall={(id) => handleCall(id, 'voice')}
            onVideoCall={(id) => handleCall(id, 'video')}
          />
        ) : (
          <RecentsTab 
            onVoiceCall={(id) => handleCall(id, 'voice')}
            onVideoCall={(id) => handleCall(id, 'video')}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
