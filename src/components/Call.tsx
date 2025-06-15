
import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, MessageCircle, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';
import CallControlButton from './CallControlButton';

const Call: React.FC = () => {
  const {
    activeCall,
    contacts,
    endCall,
    toggleMute,
    toggleSpeaker,
    toggleVideo,
    setActiveScreen,
  } = useAppStore();

  const [callDuration, setCallDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const contact = contacts.find(c => c.id === activeCall?.contactId);

  useEffect(() => {
    if (!activeCall) {
      setActiveScreen('chatList');
      return;
    }

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall, setActiveScreen]);

  useEffect(() => {
    if (activeCall?.status === 'connected') {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [activeCall?.status, showControls]);

  const handleEndCall = () => {
    endCall();
    setActiveScreen('chatList');
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCallStatusText = () => {
    switch (activeCall?.status) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return 'Ringing...';
      case 'connected':
        return formatDuration(callDuration);
      default:
        return '';
    }
  };

  if (!activeCall || !contact) {
    return null;
  }

  return (
    <div 
      className="h-full bg-call-background text-white relative overflow-hidden flex flex-col"
      onClick={() => setShowControls(true)}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute -bottom-1/3 -left-1/2 w-full h-2/3 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -top-1/4 -right-1/2 w-full h-2/3 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header (Simplified) */}
      <div className={cn(
        'safe-area-top px-6 py-5 transition-all duration-300 z-10',
        showControls ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/90 capitalize font-medium">
              Secure Call
            </span>
          </div>
      </div>

      {/* Contact Info - Centered and Refined */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 z-10 space-y-6">
        <div className="relative">
          <Avatar
            src={contact.avatar}
            name={contact.name}
            size="call"
            className="relative z-10 ring-4 ring-primary/30 shadow-2xl"
          />
          
          {(activeCall.status === 'connecting' || activeCall.status === 'ringing') && (
            <div className="absolute -inset-2 rounded-full border-2 border-primary/50 animate-ping" style={{ animationDelay: '0.5s' }} />
          )}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {contact.name}
          </h1>
          <p className="text-xl text-white/80 font-medium">
            {getCallStatusText()}
          </p>
        </div>
      </div>

      {/* Redesigned Call Controls */}
      <div className={cn(
        'safe-area-bottom pb-8 px-6 transition-all duration-300 ease-out z-10',
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}>
        <div className="grid grid-cols-3 gap-5 max-w-sm mx-auto mb-8">
          <CallControlButton 
            onClick={toggleMute} 
            icon={activeCall.isMuted ? MicOff : Mic} 
            label="Mute" 
            isActive={activeCall.isMuted}
          />

          {activeCall.type === 'video' ? (
            <CallControlButton 
              onClick={toggleVideo} 
              icon={activeCall.isVideoOff ? VideoOff : Video} 
              label="Video" 
              isActive={activeCall.isVideoOff}
            />
          ) : (
            <CallControlButton 
              onClick={toggleSpeaker} 
              icon={activeCall.isSpeakerOn ? Volume2 : VolumeX} 
              label="Speaker" 
              isActive={activeCall.isSpeakerOn}
            />
          )}
          
          <CallControlButton 
            onClick={() => setActiveScreen('chatList')} 
            icon={MessageCircle} 
            label="Message" 
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleEndCall}
            className="tap-target w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>
        
        {showControls && activeCall.status === 'connected' && (
          <p className="text-center text-white/60 text-xs mt-6 font-medium">
            Tap screen to hide controls
          </p>
        )}
      </div>
    </div>
  );
};

export default Call;
