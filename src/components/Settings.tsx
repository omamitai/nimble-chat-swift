
import React from 'react';
import {
  ArrowLeft, Camera, Bell, Shield, Palette, Type, AreaChart,
  Database, LifeBuoy, Info, ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const {
    currentUser,
    theme,
    fontSize,
    notifications,
    setActiveScreen,
    setTheme,
  } = useAppStore();

  const handleProfileEdit = () => {
    setActiveScreen('profile');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: Camera,
          label: 'Profile',
          value: currentUser.name,
          onClick: handleProfileEdit,
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          value: 'Manage your privacy settings',
          onClick: () => toast.info('Coming Soon!', { description: 'This feature is under development.' }),
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
          onClick: () => toast.info('Coming Soon!', { description: 'This feature is under development.' }),
        },
        {
          icon: Database,
          label: 'Storage',
          value: 'Manage storage',
          onClick: () => toast.info('Coming Soon!', { description: 'This feature is under development.' }),
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
          onClick: () => toast.info('Coming Soon!', { description: 'This feature is under development.' }),
        },
        {
          icon: Info,
          label: 'About',
          value: 'App information',
          onClick: () => toast.info('Coming Soon!', { description: 'This feature is under development.' }),
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
        {/* Profile Section */}
        <div className="p-4 border-b border-border/50">
          <div 
            className="flex items-center space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-smooth cursor-pointer"
            onClick={handleProfileEdit}
          >
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              size="xl"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">
                {currentUser.name}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {currentUser.about}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentUser.username}
              </p>
            </div>
            <div className="text-muted-foreground">
              <span className="text-sm">Edit</span>
            </div>
          </div>
        </div>

        {/* Theme Quick Toggle */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <span className="font-medium">Theme</span>
            <div className="flex items-center space-x-2">
              {(['light', 'dark', 'auto'] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-smooth',
                    theme === themeOption
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title} className="py-4">
            <h3 className="text-sm font-medium text-muted-foreground px-4 mb-2">
              {section.title}
            </h3>
            <div className="divide-y divide-border/50">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center space-x-3 p-4 hover:bg-muted/50 active:bg-muted transition-smooth cursor-pointer"
                  onClick={item.onClick}
                >
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{item.label}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.value}
                    </p>
                  </div>
                  <div className="text-muted-foreground">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Security Notice */}
        <div className="p-4 m-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <SettingsIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">End-to-End Encryption</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your messages are secured with end-to-end encryption. Only you and the recipient can read them.
              </p>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            SecureChat v1.0.0
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for privacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
