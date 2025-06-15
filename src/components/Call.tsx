
import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, User, ShieldCheck } from 'lucide-react';
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
      setActiveScreen('contacts');
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
    setActiveScreen('contacts');
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
      className="h-full bg-gradient-to-b from-call-background via-call-background/95 to-call-background text-white relative overflow-hidden flex flex-col"
      onClick={() => setShowControls(true)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-nordic-aurora/20 animate-aurora" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-nordic-ocean/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className={cn(
        'safe-area-top px-6 py-6 transition-all duration-500 z-10',
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      )}>
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/90 font-medium">
              End-to-End Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 z-10 space-y-8">
        <div className="relative">
          {activeCall.type === 'video' && !activeCall.isVideoOff ? (
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 border-4 border-white/20 flex items-center justify-center backdrop-blur-sm">
              <Video className="w-16 h-16 text-white/60" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-nordic-ocean/20" />
            </div>
          ) : (
            <Avatar
              src={contact.avatar}
              name={contact.name}
              size="call"
              className="relative z-10 ring-4 ring-white/20 shadow-2xl border-4 border-white/10"
            />
          )}
          
          {(activeCall.status === 'connecting' || activeCall.status === 'ringing') && (
            <>
              <div className="absolute -inset-4 rounded-full border-2 border-white/30 animate-ping" />
              <div className="absolute -inset-8 rounded-full border border-white/20 animate-ping" style={{ animationDelay: '0.5s' }} />
            </>
          )}
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm">
            {contact.name}
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <p className="text-xl text-white/80 font-medium">
              {getCallStatusText()}
            </p>
            {activeCall.type === 'video' && (
              <Video className="w-5 h-5 text-white/60" />
            )}
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className={cn(
        'safe-area-bottom pb-10 px-6 transition-all duration-500 ease-out z-10',
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}>
        <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto mb-10">
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
            onClick={() => setActiveScreen('contacts')} 
            icon={User} 
            label="Contact" 
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleEndCall}
            className="tap-target w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 border-4 border-white/20"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>
        
        {showControls && activeCall.status === 'connected' && (
          <p className="text-center text-white/50 text-xs mt-8 font-medium">
            Tap screen to hide controls
          </p>
        )}
      </div>
    </div>
  );
};

export default Call;
