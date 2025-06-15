
import React from 'react';
import { ChevronRight, LucideProps } from 'lucide-react';

export interface SettingsItemProps {
  icon: React.ElementType<LucideProps>;
  label: string;
  value: string;
  onClick: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, label, value, onClick }) => (
  <div
    className="flex items-center space-x-3 p-4 hover:bg-muted/50 active:bg-muted transition-smooth cursor-pointer"
    onClick={onClick}
  >
    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium">{label}</h4>
      <p className="text-sm text-muted-foreground truncate">
        {value}
      </p>
    </div>
    <div className="text-muted-foreground">
      <ChevronRight className="w-4 h-4" />
    </div>
  </div>
);

export default SettingsItem;
