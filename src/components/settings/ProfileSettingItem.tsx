
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from '@/components/Avatar';

const ProfileSettingItem: React.FC = () => {
    const { currentUser, setActiveScreen } = useAppStore();

    return (
        <div className="p-4 border-b border-border/50">
            <div 
                className="flex items-center space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-smooth cursor-pointer"
                onClick={() => setActiveScreen('profile')}
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
    );
}

export default ProfileSettingItem;
