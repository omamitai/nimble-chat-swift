import React from 'react';
import {
  ArrowLeft, Bell, Shield, Palette, Type, AreaChart,
  Database, LifeBuoy, Info
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

import ProfileSettingItem from './settings/ProfileSettingItem';
import ThemeQuickToggle from './settings/ThemeQuickToggle';
import SettingsSection from './settings/SettingsSection';
import SecurityNotice from './settings/SecurityNotice';
import VersionInfo from './settings/VersionInfo';

const Settings: React.FC = () => {
  const {
    theme,
    fontSize,
    notifications,
    setActiveScreen,
  } = useAppStore();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: Shield,
          label: 'Privacy & Security',
          value: 'Manage your privacy settings',
          onClick: () => setActiveScreen('privacy_security'),
        },
        {
          icon: Bell,
          label: 'Notifications',
          value: notifications.enabled ? 'Enabled' : 'Disabled',
          onClick: () => setActiveScreen('notification_settings'),
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: Palette,
          label: 'Theme',
          value: theme.charAt(0).toUpperCase() + theme.slice(1),
          onClick: () => setActiveScreen('theme_settings'),
        },
        {
          icon: Type,
          label: 'Font Size',
          value: fontSize.charAt(0).toUpperCase() + fontSize.slice(1),
          onClick: () => setActiveScreen('font_size_settings'),
        },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        {
          icon: AreaChart,
          label: 'Data Usage',
          value: 'Manage data usage',
          onClick: () => setActiveScreen('data_usage'),
        },
        {
          icon: Database,
          label: 'Storage',
          value: 'Manage storage',
          onClick: () => setActiveScreen('storage'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: LifeBuoy,
          label: 'Help & Support',
          value: 'Get help',
          onClick: () => setActiveScreen('help'),
        },
        {
          icon: Info,
          label: 'About',
          value: 'App information',
          onClick: () => setActiveScreen('about'),
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="safe-area-top">
        <div className="flex items-center space-x-3 p-4 border-b border-border/50">
          <button
            onClick={() => setActiveScreen('home')}
            className="tap-target p-2 -ml-2 hover:bg-muted rounded-full transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ProfileSettingItem />
        <ThemeQuickToggle />

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <SettingsSection key={section.title} title={section.title} items={section.items} />
        ))}
        
        <SecurityNotice />
        <VersionInfo />
      </div>
    </div>
  );
};

export default Settings;
