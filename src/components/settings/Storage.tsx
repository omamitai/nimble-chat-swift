
import React from 'react';
import SettingsPage from './SettingsPage';
import { HardDrive, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Storage: React.FC = () => {
    return (
        <SettingsPage title="Storage">
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <HardDrive className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Storage Usage</span>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span>Used: <strong>250 MB</strong></span>
                        <span>Free: <strong>750 MB</strong></span>
                    </div>
                    <Progress value={25} className="h-2" />
                </div>
            </div>
             <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Clear Cache</span>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => toast.success("Cache Cleared!")}>
                        Clear
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    This will clear temporary files and free up space. Your chats and media will not be deleted.
                </p>
            </div>
        </SettingsPage>
    );
};

export default Storage;
