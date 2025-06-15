
import React from 'react';
import { MessageSquare, Users, Settings } from 'lucide-react';
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
      {isActive && (
        <div className="w-1.5 h-1.5 bg-primary rounded-full absolute bottom-1.5 animate-fade-in"></div>
      )}
    </button>
  );
};

const BottomNavbar: React.FC = () => {
  const navItems: NavItemProps[] = [
    { screen: 'chatList', label: 'Chats', Icon: MessageSquare },
    { screen: 'contacts', label: 'Contacts', Icon: Users },
    { screen: 'settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <div className="safe-area-bottom fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/90 backdrop-blur-lg border-t border-border/50">
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => (
          <div key={item.screen} className="flex-1 flex items-center justify-center h-full">
            <NavItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
