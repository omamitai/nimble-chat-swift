
import React from 'react';
import SettingsPage from './SettingsPage';
import VersionInfo from './VersionInfo';
import SettingsItem from './SettingsItem';
import { FileText, ShieldCheck, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '@/constants/app';

const About: React.FC = () => {
    const aboutItems = [
        {
          icon: ShieldCheck,
          label: 'Privacy Policy',
          value: 'How we handle your data',
          onClick: () => window.open(APP_CONFIG.PRIVACY_URL, '_blank'),
        },
        {
          icon: FileText,
          label: 'Terms of Service',
          value: 'Read our terms and conditions',
          onClick: () => window.open(APP_CONFIG.TERMS_URL, '_blank'),
        },
        {
          icon: ExternalLink,
          label: 'GitHub Repository',
          value: 'View source code',
          onClick: () => window.open('https://github.com/your-repo/securecall', '_blank'),
        },
    ];

    return (
        <SettingsPage title="About">
            <div className="space-y-6">
                {/* App Info */}
                <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{APP_CONFIG.NAME}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {APP_CONFIG.DESCRIPTION}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Version:</span>
                            <p className="text-muted-foreground">{APP_CONFIG.VERSION}</p>
                        </div>
                        <div>
                            <span className="font-medium">Support:</span>
                            <p className="text-muted-foreground">{APP_CONFIG.SUPPORT_EMAIL}</p>
                        </div>
                    </div>
                </div>

                <VersionInfo />

                {/* Legal & Info Links */}
                <div className="divide-y divide-border/50">
                    {aboutItems.map((item) => (
                        <SettingsItem key={item.label} {...item} />
                    ))}
                </div>

                {/* Security Notice */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <h4 className="font-medium text-sm mb-2">End-to-End Encryption</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                All calls are protected with industry-standard end-to-end encryption. 
                                Your conversations remain private and secure.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsPage>
    );
};

export default About;
