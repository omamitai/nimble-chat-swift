
import React from 'react';
import { Bell, Volume2, Vibrate } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import SettingsPage from './SettingsPage';

const NotificationSettings: React.FC = () => {
    const { notifications, updateNotificationSettings } = useAppStore();

    const handleToggle = (key: keyof typeof notifications, value: boolean) => {
        updateNotificationSettings({ [key]: value });
        toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} ${value ? 'enabled' : 'disabled'}`);
    }

    return (
        <SettingsPage title="Notifications">
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
        </SettingsPage>
    );
}

export default NotificationSettings;
