
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
      className="h-full bg-gradient-to-br from-slate-900 via-slate-800/95 to-black flex flex-col text-white relative overflow-hidden"
      onClick={() => setShowControls(true)}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-40 right-8 w-48 h-48 bg-blue-400/25 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <div className={cn(
        'safe-area-top px-6 py-5 transition-all duration-300 z-10',
        showControls ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'w-3 h-3 rounded-full shadow-sm',
              getConnectionQuality() === 'excellent' ? 'bg-green-400' : 
              getConnectionQuality() === 'good' ? 'bg-yellow-400' : 'bg-red-400'
            )} />
            <span className="text-sm text-white/90 capitalize font-medium">
              {getConnectionQuality()} connection
            </span>
          </div>
          
          {activeCall.type === 'video' && (
            <div className="text-xs text-white/70 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              Video call
            </div>
          )}
        </div>
      </div>

      {/* Contact Info - Centered and Enhanced */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">
        <div className="flex flex-col items-center space-y-8">
          {/* Enhanced Avatar with better styling */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/40 via-blue-400/30 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -inset-3 bg-gradient-to-br from-white/10 to-white/5 rounded-full backdrop-blur-sm" />
            <Avatar
              src={contact.avatar}
              name={contact.name}
              size="call"
              className="relative z-10 ring-4 ring-white/30 shadow-2xl"
            />
            
            {/* Enhanced pulse animation for connecting/ringing */}
            {(activeCall.status === 'connecting' || activeCall.status === 'ringing') && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
                <div className="absolute -inset-2 rounded-full border border-white/30 animate-ping" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </div>
          
          {/* Enhanced Contact Details */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
              {contact.name}
            </h1>
            <div className="space-y-2">
              <p className="text-2xl text-white/95 font-semibold">
                {getCallStatusText()}
              </p>
              <p className="text-base text-white/70 font-medium">
                {contact.phone}
              </p>
            </div>
          </div>

          {/* Enhanced Call Quality Indicator */}
          {activeCall.status === 'connected' && (
            <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={cn(
                      'w-1.5 rounded-full transition-all',
                      bar <= (getConnectionQuality() === 'excellent' ? 4 : 3)
                        ? 'bg-green-400 h-4 shadow-sm' 
                        : 'bg-white/40 h-3'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-white/90 font-medium">
                {getConnectionQuality() === 'excellent' ? 'HD Quality' : 'Good Quality'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Call Controls */}
      <div className={cn(
        'safe-area-bottom pb-10 px-8 transition-all duration-500 ease-out z-10',
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}>
        <div className="flex justify-center items-center space-x-6">
          {/* Secondary Actions */}
          <button
            onClick={() => setActiveScreen('chatList')}
            className="tap-target w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/20 hover:scale-110"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={cn(
              'tap-target w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 hover:scale-110',
              activeCall.isMuted 
                ? 'bg-red-500 hover:bg-red-600 border-red-400 shadow-red-500/30' 
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30'
            )}
          >
            {activeCall.isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {/* End Call Button - Enhanced */}
          <button
            onClick={handleEndCall}
            className="tap-target w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl ring-4 ring-red-500/40 hover:scale-110 hover:ring-red-500/60"
          >
            <PhoneOff className="w-8 h-8" />
          </button>

          {/* Speaker/Video Button */}
          {activeCall.type === 'video' ? (
            <button
              onClick={toggleVideo}
              className={cn(
                'tap-target w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 hover:scale-110',
                activeCall.isVideoOff 
                  ? 'bg-red-500 hover:bg-red-600 border-red-400 shadow-red-500/30' 
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30'
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
                'tap-target w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 hover:scale-110',
                activeCall.isSpeakerOn 
                  ? 'bg-primary hover:bg-primary/80 border-primary/60 shadow-primary/30' 
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30'
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
            className="tap-target w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/20 hover:scale-110"
          >
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </button>
        </div>
        
        {/* Enhanced Gesture Hint */}
        {showControls && activeCall.status === 'connected' && (
          <p className="text-center text-white/60 text-sm mt-6 font-medium">
            Tap screen to show/hide controls
          </p>
        )}
      </div>
    </div>
  );
};

export default Call;
