
import React from 'react';
import SettingsPage from './SettingsPage';
import SettingsItem from './SettingsItem';
import { HelpCircle, FileText, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Help: React.FC = () => {
    const helpItems = [
        {
          icon: HelpCircle,
          label: 'FAQ',
          value: 'Find answers to common questions',
          onClick: () => toast.info('FAQ page coming soon!'),
        },
        {
          icon: Mail,
          label: 'Contact Us',
          value: 'Get in touch with support',
          onClick: () => toast.info('Contact Us form coming soon!'),
        },
        {
          icon: FileText,
          label: 'Terms of Service',
          value: 'Read our terms and conditions',
          onClick: () => toast.info('Terms of Service page coming soon!'),
        },
    ];
    return (
        <SettingsPage title="Help & Support">
            <div className="divide-y divide-border/50">
                {helpItems.map((item) => (
                    <SettingsItem key={item.label} {...item} />
                ))}
            </div>
        </SettingsPage>
    );
};

export default Help;
