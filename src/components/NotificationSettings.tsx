
import React from 'react';
import { ArrowLeft, Bell, Volume2, Vibrate } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const NotificationSettings: React.FC = () => {
    const { notifications, updateNotificationSettings, setActiveScreen } = useAppStore();

    const handleToggle = (key: keyof typeof notifications, value: boolean) => {
        updateNotificationSettings({ [key]: value });
        toast.success(`Notifications ${key} ${value ? 'enabled' : 'disabled'}`);
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="safe-area-top">
                <div className="flex items-center space-x-3 p-4 border-b border-border/50">
                    <button
                        onClick={() => setActiveScreen('settings')}
                        className="tap-target p-2 -ml-2 hover:bg-muted rounded-full transition-smooth"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-semibold">Notifications</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Enable Notifications</span>
                    </div>
                    <Switch
                        checked={notifications.enabled}
                        onCheckedChange={(checked) => handleToggle('enabled', checked)}
                    />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Volume2 className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Sound</span>
                    </div>
                    <Switch
                        checked={notifications.sound}
                        onCheckedChange={(checked) => handleToggle('sound', checked)}
                        disabled={!notifications.enabled}
                    />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Vibrate className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Vibration</span>
                    </div>
                    <Switch
                        checked={notifications.vibration}
                        onCheckedChange={(checked) => handleToggle('vibration', checked)}
                        disabled={!notifications.enabled}
                    />
                </div>
            </div>
        </div>
    );
}

export default NotificationSettings;
