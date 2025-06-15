
import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Home from '@/components/Home';
import Contacts from '@/components/Contacts';
import Settings from '@/components/Settings';
import Profile from '@/components/Profile';
import Call from '@/components/Call';
import BottomNavbar from '@/components/BottomNavbar';
import NotificationSettings from '@/components/settings/NotificationSettings';
import FontSizeSettings from '@/components/settings/FontSizeSettings';
import ThemeSettings from '@/components/settings/ThemeSettings';
import PrivacySecurity from '@/components/settings/PrivacySecurity';
import DataUsage from '@/components/settings/DataUsage';
import Storage from '@/components/settings/Storage';
import Help from '@/components/settings/Help';
import About from '@/components/settings/About';
import { cn } from '@/lib/utils';

const Index: React.FC = () => {
  const { activeScreen, theme } = useAppStore();

  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applyTheme = () => {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      };
      applyTheme();
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'contacts':
        return <Contacts />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'call':
        return <Call />;
      case 'notification_settings':
        return <NotificationSettings />;
      case 'font_size_settings':
        return <FontSizeSettings />;
      case 'theme_settings':
        return <ThemeSettings />;
      case 'privacy_security':
        return <PrivacySecurity />;
      case 'data_usage':
        return <DataUsage />;
      case 'storage':
        return <Storage />;
      case 'help':
        return <Help />;
      case 'about':
        return <About />;
      default:
        return <Home />;
    }
  };

  const subScreens = [
    'call', 'profile', 'notification_settings', 'font_size_settings', 
    'theme_settings', 'privacy_security', 'data_usage', 'storage', 'help', 'about'
  ];
  const showNavbar = !subScreens.includes(activeScreen);

  return (
    <div className="h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="h-full max-w-md mx-auto relative">
        <div className={cn("absolute inset-0", showNavbar && "pb-20")}>
           {renderScreen()}
        </div>
        {showNavbar && <BottomNavbar />}
      </div>
    </div>
  );
};

export default Index;
