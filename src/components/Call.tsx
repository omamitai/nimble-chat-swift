
import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';

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

  const getConnectionQuality = () => {
    if (activeCall?.status !== 'connected') return 'connecting';
    // Simulate connection quality
    return Math.random() > 0.3 ? 'excellent' : 'good';
  };

  if (!activeCall || !contact) {
    return null;
  }

  return (
    <div 
      className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-black flex flex-col text-white relative overflow-hidden"
      onClick={() => setShowControls(true)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-8 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className={cn(
        'safe-area-top px-6 py-4 transition-all duration-300',
        showControls ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'w-3 h-3 rounded-full',
              getConnectionQuality() === 'excellent' ? 'bg-green-400' : 
              getConnectionQuality() === 'good' ? 'bg-yellow-400' : 'bg-red-400'
            )} />
            <span className="text-sm text-white/80 capitalize">
              {getConnectionQuality()} connection
            </span>
          </div>
          
          {activeCall.type === 'video' && (
            <div className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full">
              Video call
            </div>
          )}
        </div>
      </div>

      {/* Contact Info - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Avatar with enhanced styling */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-blue-400/30 rounded-full blur-2xl animate-pulse-slow" />
            <Avatar
              src={contact.avatar}
              name={contact.name}
              size="xl"
              className="w-48 h-48 ring-8 ring-white/20 shadow-2xl relative z-10"
            />
            
            {/* Pulse animation for connecting/ringing */}
            {(activeCall.status === 'connecting' || activeCall.status === 'ringing') && (
              <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping" />
            )}
          </div>
          
          {/* Contact Details */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">{contact.name}</h1>
            <div className="space-y-1">
              <p className="text-2xl text-white/90 font-medium">{getCallStatusText()}</p>
              <p className="text-base text-white/60">{contact.phone}</p>
            </div>
          </div>

          {/* Call Quality Indicator */}
          {activeCall.status === 'connected' && (
            <div className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-full">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={cn(
                      'w-1 rounded-full transition-all',
                      bar <= (getConnectionQuality() === 'excellent' ? 4 : 3)
                        ? 'bg-green-400 h-3'
                        : 'bg-white/30 h-2'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-white/80">
                {getConnectionQuality() === 'excellent' ? 'HD' : 'Good'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className={cn(
        'safe-area-bottom pb-8 px-8 transition-all duration-300 ease-out',
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}>
        <div className="flex justify-center items-center space-x-6">
          {/* Secondary Actions */}
          <button
            onClick={() => {
              // Navigate to messages with this contact
              setActiveScreen('chatList');
            }}
            className="tap-target w-14 h-14 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 border border-white/10"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={cn(
              'tap-target w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2',
              activeCall.isMuted 
                ? 'bg-red-500 hover:bg-red-600 border-red-400' 
                : 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border-white/20'
            )}
          >
            {activeCall.isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {/* End Call Button - Prominent */}
          <button
            onClick={handleEndCall}
            className="tap-target w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl ring-4 ring-red-500/30"
          >
            <PhoneOff className="w-8 h-8" />
          </button>

          {/* Speaker/Video Button */}
          {activeCall.type === 'video' ? (
            <button
              onClick={toggleVideo}
              className={cn(
                'tap-target w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2',
                activeCall.isVideoOff 
                  ? 'bg-red-500 hover:bg-red-600 border-red-400' 
                  : 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border-white/20'
              )}
            >
              {activeCall.isVideoOff ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </button>
          ) : (
            <button
              onClick={toggleSpeaker}
              className={cn(
                'tap-target w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2',
                activeCall.isSpeakerOn 
                  ? 'bg-primary hover:bg-primary/80 border-primary/60' 
                  : 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border-white/20'
              )}
            >
              {activeCall.isSpeakerOn ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>
          )}

          {/* Additional Action */}
          <button
            onClick={() => {
              // Add more options or switch camera
            }}
            className="tap-target w-14 h-14 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 border border-white/10"
          >
            <div className="w-1 h-1 bg-white rounded-full mx-0.5" />
            <div className="w-1 h-1 bg-white rounded-full mx-0.5" />
            <div className="w-1 h-1 bg-white rounded-full mx-0.5" />
          </button>
        </div>
        
        {/* Gesture Hint */}
        {showControls && activeCall.status === 'connected' && (
          <p className="text-center text-white/50 text-xs mt-4">
            Tap screen to show/hide controls
          </p>
        )}
      </div>
    </div>
  );
};

export default Call;
