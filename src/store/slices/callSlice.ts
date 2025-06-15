
import { StateCreator } from 'zustand';

export interface CallRecord {
  id: string;
  contactId: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: Date;
  duration?: number;
}

export interface ActiveCall {
  id: string;
  contactId: string;
  type: 'voice' | 'video';
  status: 'connecting' | 'ringing' | 'connected' | 'ended';
  startTime: Date;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoOff: boolean;
}

export interface CallSlice {
  callHistory: CallRecord[];
  activeCall: ActiveCall | null;
  setCallHistory: (history: CallRecord[]) => void;
  addCallRecord: (record: CallRecord) => void;
  startCall: (contactId: string, type: 'voice' | 'video') => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleVideo: () => void;
}

export const createCallSlice: StateCreator<CallSlice> = (set, get) => ({
  callHistory: [],
  activeCall: null,
  setCallHistory: (history) => set({ callHistory: history }),
  addCallRecord: (record) => {
    const { callHistory } = get();
    set({ callHistory: [record, ...callHistory] });
  },
  startCall: (contactId, type) => {
    const newCall: ActiveCall = {
      id: `call-${Date.now()}`,
      contactId,
      type,
      status: 'connecting',
      startTime: new Date(),
      isMuted: false,
      isSpeakerOn: false,
      isVideoOff: false,
    };
    
    set({ activeCall: newCall });
    
    // Simulate call progression
    setTimeout(() => {
      const { activeCall } = get();
      if (activeCall?.id === newCall.id) {
        set({ activeCall: { ...activeCall, status: 'ringing' } });
      }
    }, 1000);
    
    setTimeout(() => {
      const { activeCall } = get();
      if (activeCall?.id === newCall.id) {
        set({ activeCall: { ...activeCall, status: 'connected' } });
      }
    }, 3000);
  },
  endCall: () => {
    const { activeCall, addCallRecord } = get();
    if (activeCall) {
      const duration = Math.floor((Date.now() - activeCall.startTime.getTime()) / 1000);
      addCallRecord({
        id: `record-${Date.now()}`,
        contactId: activeCall.contactId,
        type: activeCall.type,
        direction: 'outgoing',
        timestamp: activeCall.startTime,
        duration: activeCall.status === 'connected' ? duration : undefined,
      });
    }
    set({ activeCall: null });
  },
  toggleMute: () => {
    const { activeCall } = get();
    if (activeCall) {
      set({ activeCall: { ...activeCall, isMuted: !activeCall.isMuted } });
    }
  },
  toggleSpeaker: () => {
    const { activeCall } = get();
    if (activeCall) {
      set({ activeCall: { ...activeCall, isSpeakerOn: !activeCall.isSpeakerOn } });
    }
  },
  toggleVideo: () => {
    const { activeCall } = get();
    if (activeCall) {
      set({ activeCall: { ...activeCall, isVideoOff: !activeCall.isVideoOff } });
    }
  },
});
