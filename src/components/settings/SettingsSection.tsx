
import React from 'react';
import SettingsItem from './SettingsItem';
import { LucideProps } from 'lucide-react';

interface ItemProps {
  icon: React.ElementType<LucideProps>;
  label: string;
  value: string;
  onClick: () => void;
}

interface SettingsSectionProps {
  title: string;
  items: ItemProps[];
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, items }) => (
  <div className="py-4">
    <h3 className="text-sm font-medium text-muted-foreground px-4 mb-2">
      {title}
    </h3>
    <div className="divide-y divide-border/50">
      {items.map((item) => (
        <SettingsItem key={item.label} {...item} />
      ))}
    </div>
  </div>
);

export default SettingsSection;
