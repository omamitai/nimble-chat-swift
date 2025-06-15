
import React from 'react';
import SettingsPage from './SettingsPage';
import SettingsItem from './SettingsItem';
import { Lock, EyeOff, UserX } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

const PrivacySecurity: React.FC = () => {
    const { setActiveScreen } = useAppStore();

    const items = [
        {
          icon: EyeOff,
          label: 'Read Receipts',
          value: 'Enabled',
          onClick: () => toast.info('Toggle Read Receipts - Coming Soon!'),
        },
        {
          icon: UserX,
          label: 'Blocked Contacts',
          value: 'Manage blocked contacts',
          onClick: () => toast.info('Blocked Contacts - Coming Soon!'),
        },
    ];

    return (
        <SettingsPage title="Privacy & Security">
            <div className="py-4">
                <h3 className="text-sm font-medium text-muted-foreground px-4 mb-2">
                    Who can see my personal info
                </h3>
                <div className="divide-y divide-border/50">
                    <SettingsItem
                        icon={Lock}
                        label="Profile Photo"
                        value="Everyone"
                        onClick={() => toast.info('Coming Soon!')}
                    />
                </div>
            </div>
            <div className="py-4">
                <h3 className="text-sm font-medium text-muted-foreground px-4 mb-2">
                    Messaging
                </h3>
                <div className="divide-y divide-border/50">
                    {items.map((item) => (
                        <SettingsItem key={item.label} {...item} />
                    ))}
                </div>
            </div>
        </SettingsPage>
    );
};

export default PrivacySecurity;
