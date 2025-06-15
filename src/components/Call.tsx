
import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
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
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [activeCall?.status, showControls]);

  const handleEndCall = () => {
    endCall();
    setActiveScreen('chatList');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
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
      className="h-full bg-gradient-to-b from-slate-900 to-black flex flex-col text-white relative"
      onClick={() => setShowControls(true)}
    >
      {/* Contact Info */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar
            src={contact.avatar}
            name={contact.name}
            size="xl"
            className="w-32 h-32 ring-4 ring-white/20"
          />
          
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-1">{contact.name}</h1>
            <p className="text-lg text-white/70">{getCallStatusText()}</p>
            
            {activeCall.type === 'video' && (
              <p className="text-sm text-white/50 mt-2">Video call</p>
            )}
          </div>
        </div>

        {/* Connection Quality Indicator */}
        <div className="flex items-center space-x-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            activeCall.status === 'connected' ? 'bg-green-400' : 'bg-yellow-400'
          )} />
          <span className="text-xs text-white/60">
            {activeCall.status === 'connected' ? 'Connected' : 'Connecting'}
          </span>
        </div>
      </div>

      {/* Call Controls */}
      <div className={cn(
        'transition-all duration-300 ease-in-out',
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}>
        <div className="safe-area-bottom p-6">
          <div className="flex justify-center items-center space-x-6">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={cn(
                'tap-target w-14 h-14 rounded-full flex items-center justify-center transition-all',
                activeCall.isMuted 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white/20 hover:bg-white/30'
              )}
            >
              {activeCall.isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="tap-target w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            {/* Speaker/Video Button */}
            {activeCall.type === 'video' ? (
              <button
                onClick={toggleVideo}
                className={cn(
                  'tap-target w-14 h-14 rounded-full flex items-center justify-center transition-all',
                  activeCall.isVideoOff 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
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
                  'tap-target w-14 h-14 rounded-full flex items-center justify-center transition-all',
                  activeCall.isSpeakerOn 
                    ? 'bg-primary hover:bg-primary/80' 
                    : 'bg-white/20 hover:bg-white/30'
                )}
              >
                {activeCall.isSpeakerOn ? (
                  <Volume2 className="w-6 h-6" />
                ) : (
                  <VolumeX className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Call;
