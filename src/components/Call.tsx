
import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, User, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!activeCall || !contact) {
    return null;
  }

  const isVideoCall = activeCall.type === 'video';

  return (
    <div 
      className="fixed inset-0 bg-call-background text-white overflow-hidden flex flex-col z-50"
      onClick={() => setShowControls(true)}
    >
      {/* Video Call Layout */}
      {isVideoCall ? (
        <div className="flex-1 relative">
          {/* Remote Video (Main) */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            {activeCall.isVideoOff ? (
              <div className="flex flex-col items-center space-y-4">
                <Avatar
                  src={contact.avatar}
                  name={contact.name}
                  size="call"
                  className="ring-4 ring-white/20 shadow-2xl"
                />
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
                  <p className="text-white/80">Video is off</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-nordic-ocean/20 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-white/60 mb-4 mx-auto" />
                  <p className="text-white/80">Video stream would appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <div className={cn(
            "absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg border-2 border-white/20 overflow-hidden transition-all duration-300",
            isFullscreen ? "w-32 h-40" : ""
          )}>
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              {activeCall.isVideoOff ? (
                <VideoOff className="w-6 h-6 text-white/60" />
              ) : (
                <div className="text-xs text-white/60 text-center">You</div>
              )}
            </div>
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-1 right-1 w-6 h-6 bg-black/50 rounded flex items-center justify-center"
            >
              {isFullscreen ? 
                <Minimize2 className="w-3 h-3 text-white" /> : 
                <Maximize2 className="w-3 h-3 text-white" />
              }
            </button>
          </div>

          {/* Status Overlay */}
          <div className={cn(
            'absolute top-0 left-0 right-0 safe-area-top px-6 py-4 bg-gradient-to-b from-black/50 to-transparent transition-all duration-500',
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          )}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                <p className="text-sm text-white/80">{getCallStatusText()}</p>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/90">HD</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Voice Call Layout */
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-nordic-aurora/20 animate-aurora" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-nordic-ocean/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative z-10 text-center space-y-8">
            <div className="relative">
              <Avatar
                src={contact.avatar}
                name={contact.name}
                size="call"
                className="ring-4 ring-white/20 shadow-2xl"
              />
              
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
              <p className="text-xl text-white/80 font-medium">
                {getCallStatusText()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className={cn(
        'safe-area-bottom pb-8 px-6 bg-gradient-to-t from-black/50 to-transparent transition-all duration-500 ease-out',
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}>
        <div className="flex items-center justify-center space-x-8 mb-8">
          <CallControlButton 
            onClick={toggleMute} 
            icon={activeCall.isMuted ? MicOff : Mic} 
            label="Mute" 
            isActive={activeCall.isMuted}
          />

          {isVideoCall ? (
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
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </div>
        
        {showControls && activeCall.status === 'connected' && (
          <p className="text-center text-white/50 text-xs mt-6 font-medium">
            Tap to {isVideoCall ? 'show/hide' : 'hide'} controls
          </p>
        )}
      </div>
    </div>
  );
};

export default Call;
