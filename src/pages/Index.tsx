import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Home from '@/components/Home';
import Contacts from '@/components/Contacts';
import Settings from '@/components/Settings';
import Profile from '@/components/Profile';
import Call from '@/components/Call';
import BottomNavbar from '@/components/BottomNavbar';
import NotificationSettings from '@/components/NotificationSettings';
import FontSizeSettings from '@/components/FontSizeSettings';
import ThemeSettings from '@/components/ThemeSettings';
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
      default:
        return <Home />;
    }
  };

  const showNavbar = !['call', 'profile', 'notification_settings', 'font_size_settings', 'theme_settings'].includes(activeScreen);

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
