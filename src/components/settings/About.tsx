
import React from 'react';
import SettingsPage from './SettingsPage';
import VersionInfo from './VersionInfo';
import SettingsItem from './SettingsItem';
import { FileText, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const About: React.FC = () => {
    const aboutItems = [
        {
          icon: ShieldCheck,
          label: 'Privacy Policy',
          value: 'How we handle your data',
          onClick: () => toast.info('Privacy Policy page coming soon!'),
        },
        {
          icon: FileText,
          label: 'Licenses',
          value: 'Open source licenses',
          onClick: () => toast.info('Licenses page coming soon!'),
        },
    ];
    return (
        <SettingsPage title="About">
            <VersionInfo />
            <div className="divide-y divide-border/50">
                {aboutItems.map((item) => (
                    <SettingsItem key={item.label} {...item} />
                ))}
            </div>
        </SettingsPage>
    );
};

export default About;
