
import React from 'react';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { CallRecord, Contact } from '@/store/useAppStore';
import Avatar from '@/components/Avatar';
import { cn } from '@/lib/utils';

interface RecentCallItemProps {
    call: CallRecord & { contact?: Contact };
    onVoiceCall: (contactId: string) => void;
    onVideoCall: (contactId: string) => void;
}

const formatCallDuration = (seconds?: number) => {
    if (seconds === undefined) return '';
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

const getCallIcon = (direction: string) => {
    if (direction === 'missed') return PhoneMissed;
    if (direction === 'incoming') return PhoneIncoming;
    return PhoneOutgoing;
};

const getCallIconColor = (direction: string) => {
    if (direction === 'missed') return 'text-red-500';
    if (direction === 'incoming') return 'text-green-500';
    return 'text-muted-foreground';
};

const RecentCallItem: React.FC<RecentCallItemProps> = ({ call, onVoiceCall, onVideoCall }) => {
    const CallIcon = getCallIcon(call.direction);
    return (
        <div
            className="flex items-center space-x-4 px-4 py-4 hover:bg-gradient-to-r hover:from-muted/20 hover:to-transparent transition-all group"
        >
            <Avatar
                src={call.contact?.avatar}
                name={call.contact?.name || 'Unknown'}
                size="lg"
                isOnline={call.contact?.isOnline}
                className="flex-shrink-0"
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
                        {call.duration !== undefined && (
                            <span className="ml-2">• {formatCallDuration(call.duration)}</span>
                        )}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                    onClick={() => onVoiceCall(call.contactId)}
                    className="call-button-voice"
                    title="Voice call"
                >
                    <Phone className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onVideoCall(call.contactId)}
                    className="call-button-video"
                    title="Video call"
                >
                    <Video className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default RecentCallItem;
