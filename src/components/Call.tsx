
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, User, Maximize2, Minimize2, MoreVertical } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';
import CallControlButton from './CallControlButton';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const isMobile = useIsMobile();
  const [callDuration, setCallDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocalVideoMinimized, setIsLocalVideoMinimized] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const contact = contacts.find(c => c.id === activeCall?.contactId);

  // Smart control visibility system
  const resetControlsTimeout = useCallback(() => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    
    setShowControls(true);
    setLastInteraction(Date.now());
    
    // Only auto-hide for connected video calls
    if (activeCall?.status === 'connected' && activeCall?.type === 'video') {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
  }, [activeCall?.status, activeCall?.type]);

  // Handle user interactions
  const handleUserInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  // Smart tap detection - differentiate between tap to show controls vs UI interaction
  const handleContainerTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isControlElement = target.closest('.call-control') || target.closest('button');
    
    if (!isControlElement) {
      if (showControls && activeCall?.type === 'video' && activeCall?.status === 'connected') {
        setShowControls(false);
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current);
        }
      } else {
        resetControlsTimeout();
      }
    }
  }, [showControls, activeCall?.type, activeCall?.status, resetControlsTimeout]);

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
    resetControlsTimeout();
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!activeCall) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggleMute();
          resetControlsTimeout();
          break;
        case 'v':
          if (activeCall.type === 'video') {
            toggleVideo();
            resetControlsTimeout();
          }
          break;
        case 'Escape':
          if (showControls) {
            setShowControls(false);
          } else {
            resetControlsTimeout();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeCall, toggleMute, toggleVideo, showControls, resetControlsTimeout]);

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

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.log('Fullscreen not supported');
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.log('Exit fullscreen failed');
      }
    }
  };

  if (!activeCall || !contact) {
    return null;
  }

  const isVideoCall = activeCall.type === 'video';

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-call-background text-white overflow-hidden flex flex-col z-50 select-none"
      onClick={handleContainerTap}
      onTouchStart={handleContainerTap}
    >
      {/* Video Call Layout - Full Screen Coverage */}
      {isVideoCall ? (
        <div className="flex-1 relative w-full h-full">
          {/* Remote Video Stream - Full Coverage */}
          <div className="absolute inset-0 w-full h-full">
            {activeCall.isVideoOff ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="flex flex-col items-center space-y-6 z-10">
                  <Avatar
                    src={contact.avatar}
                    name={contact.name}
                    size="call"
                    className="ring-4 ring-white/20 shadow-2xl scale-110"
                  />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">{contact.name}</h2>
                    <p className="text-white/70 text-lg">Camera is off</p>
                  </div>
                </div>
                {/* Ambient background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-nordic-aurora/5 animate-pulse-slow" />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 via-gray-900 to-nordic-ocean/10 flex items-center justify-center relative">
                <div className="text-center z-10">
                  <Video className="w-20 h-20 text-white/40 mb-6 mx-auto" />
                  <p className="text-white/60 text-lg">Video stream</p>
                  <p className="text-white/40 text-sm mt-2">HD • {getCallStatusText()}</p>
                </div>
                {/* Dynamic video placeholder with breathing effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-nordic-ocean/5 animate-pulse" style={{ animationDuration: '3s' }} />
              </div>
            )}
          </div>

          {/* Local Video - Smart Positioning */}
          <div 
            className={cn(
              "absolute transition-all duration-300 ease-out rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-sm",
              isLocalVideoMinimized 
                ? "top-4 right-4 w-20 h-28" 
                : "top-6 right-6 w-32 h-44",
              isMobile && "top-4 right-4",
              showControls ? "opacity-100" : "opacity-70"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsLocalVideoMinimized(!isLocalVideoMinimized);
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center relative">
              {activeCall.isVideoOff ? (
                <VideoOff className={cn("text-white/60", isLocalVideoMinimized ? "w-4 h-4" : "w-8 h-8")} />
              ) : (
                <div className="text-center">
                  <div className={cn("text-white/70 font-medium", isLocalVideoMinimized ? "text-xs" : "text-sm")}>
                    You
                  </div>
                </div>
              )}
              
              {/* Minimize/Maximize indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-black/60 rounded-lg flex items-center justify-center backdrop-blur-sm">
                {isLocalVideoMinimized ? 
                  <Maximize2 className="w-3 h-3 text-white/80" /> : 
                  <Minimize2 className="w-3 h-3 text-white/80" />
                }
              </div>
            </div>
          </div>

          {/* Smart Status Overlay */}
          <div className={cn(
            'absolute top-0 left-0 right-0 safe-area-top px-6 py-4 transition-all duration-500 ease-out',
            'bg-gradient-to-b from-black/60 via-black/20 to-transparent backdrop-blur-sm',
            showControls 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-full pointer-events-none'
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                  <p className="text-sm text-white/80">{getCallStatusText()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/90 font-medium">HD</span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="call-control w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/60 transition-all"
                >
                  <MoreVertical className="w-5 h-5 text-white/80" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Enhanced Voice Call Layout */
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
          {/* Dynamic Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-nordic-aurora/20 animate-aurora" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-nordic-ocean/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
          </div>

          <div className="relative z-10 text-center space-y-8 max-w-sm">
            <div className="relative">
              <Avatar
                src={contact.avatar}
                name={contact.name}
                size="call"
                className="ring-4 ring-white/30 shadow-2xl"
              />
              
              {/* Animated Call Status Rings */}
              {(activeCall.status === 'connecting' || activeCall.status === 'ringing') && (
                <>
                  <div className="absolute -inset-6 rounded-full border-2 border-white/40 animate-ping" />
                  <div className="absolute -inset-10 rounded-full border border-white/20 animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute -inset-14 rounded-full border border-white/10 animate-ping" style={{ animationDelay: '1s' }} />
                </>
              )}
              
              {/* Connected Status Indicator */}
              {activeCall.status === 'connected' && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">
                {contact.name}
              </h1>
              <p className="text-xl text-white/80 font-medium">
                {getCallStatusText()}
              </p>
              
              {/* Call Quality Indicator */}
              {activeCall.status === 'connected' && (
                <div className="flex items-center justify-center space-x-2 text-white/60">
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" />
                    <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm font-medium">HD Audio</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Smart Control Panel */}
      <div className={cn(
        'safe-area-bottom pb-8 px-6 transition-all duration-500 ease-out',
        'bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-xl',
        showControls 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-full pointer-events-none'
      )}>
        {/* Primary Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <div className="call-control">
            <CallControlButton 
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
                resetControlsTimeout();
              }} 
              icon={activeCall.isMuted ? MicOff : Mic} 
              label={activeCall.isMuted ? "Unmute" : "Mute"} 
              isActive={activeCall.isMuted}
              size="lg"
            />
          </div>

          {isVideoCall ? (
            <div className="call-control">
              <CallControlButton 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVideo();
                  resetControlsTimeout();
                }} 
                icon={activeCall.isVideoOff ? VideoOff : Video} 
                label={activeCall.isVideoOff ? "Turn On Video" : "Turn Off Video"} 
                isActive={activeCall.isVideoOff}
                size="lg"
              />
            </div>
          ) : (
            <div className="call-control">
              <CallControlButton 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSpeaker();
                  resetControlsTimeout();
                }} 
                icon={activeCall.isSpeakerOn ? Volume2 : VolumeX} 
                label={activeCall.isSpeakerOn ? "Speaker On" : "Speaker Off"} 
                isActive={activeCall.isSpeakerOn}
                size="lg"
              />
            </div>
          )}
          
          <div className="call-control">
            <CallControlButton 
              onClick={(e) => {
                e.stopPropagation();
                setActiveScreen('contacts');
                resetControlsTimeout();
              }} 
              icon={User} 
              label="Contact" 
              size="lg"
            />
          </div>
        </div>

        {/* End Call Button - Prominent */}
        <div className="flex justify-center mb-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEndCall();
            }}
            className="call-control w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 shadow-red-500/30"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>
        
        {/* Smart Usage Hints */}
        {showControls && activeCall.status === 'connected' && (
          <div className="text-center space-y-2">
            <p className="text-white/50 text-xs font-medium">
              {isVideoCall ? 'Tap anywhere to hide controls' : 'Tap to hide controls'}
            </p>
            {!isMobile && (
              <p className="text-white/30 text-xs">
                Press Space to mute • V for video • ESC to toggle controls
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Call;
