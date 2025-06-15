
import React from 'react';
import { Phone, Users, Settings } from 'lucide-react';
import { useAppStore, Screen } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface NavItemProps {
  screen: Screen;
  label: string;
  Icon: React.ElementType;
}

const NavItem: React.FC<NavItemProps> = ({ screen, label, Icon }) => {
  const { activeScreen, setActiveScreen } = useAppStore();
  const isActive = activeScreen === screen;

  return (
    <button
      onClick={() => setActiveScreen(screen)}
      className={cn(
        'relative flex flex-col items-center justify-center space-y-1 w-full h-full tap-target transition-smooth group',
        'text-muted-foreground hover:text-primary',
        isActive && 'text-primary'
      )}
    >
      <Icon className={cn('w-6 h-6 transition-transform', isActive ? 'scale-110' : 'group-hover:scale-110')} />
      <span className={cn('text-xs', isActive ? 'font-semibold' : 'font-medium')}>
        {label}
      </span>
    </button>
  );
};

const BottomNavbar: React.FC = () => {
  const navItems: NavItemProps[] = [
    { screen: 'home', label: 'Home', Icon: Phone },
    { screen: 'contacts', label: 'Contacts', Icon: Users },
    { screen: 'settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <div className="safe-area-bottom fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md">
      <div className="flex items-center justify-around h-16 px-2 bg-background/80 backdrop-blur-xl border border-border/60 rounded-full shadow-lg">
        {navItems.map((item, index) => (
          <div key={`${item.screen}-${index}`} className="flex-1 flex items-center justify-center h-full">
            <NavItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
