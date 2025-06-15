
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from '@/components/Avatar';

const ProfileSettingItem: React.FC = () => {
    const { user, setActiveScreen } = useAppStore();

    if (!user) {
        return null;
    }

    return (
        <div className="p-4 border-b border-border/50">
            <div 
                className="flex items-center space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-smooth cursor-pointer"
                onClick={() => setActiveScreen('profile')}
            >
                <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="xl"
                />
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold truncate">
                        {user.name}
                    </h2>
                    <p className="text-sm text-muted-foreground truncate">
                        {user.about || 'Hey there! I am using SecureCall.'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {user.username}
                    </p>
                </div>
                <div className="text-muted-foreground">
                    <span className="text-sm">Edit</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileSettingItem;
