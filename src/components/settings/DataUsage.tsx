
import React from 'react';
import SettingsPage from './SettingsPage';
import { BarChart, Wifi, Film } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DataUsage: React.FC = () => {
    return (
        <SettingsPage title="Data Usage">
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <BarChart className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Network Usage</span>
                </div>
                <div className="space-y-3 text-sm">
                    <p>Total: <strong>1.2 GB</strong></p>
                    <div className="space-y-2">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Calls</span>
                                <span>800 MB</span>
                            </div>
                            <Progress value={66} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Media</span>
                                <span>400 MB</span>
                            </div>
                            <Progress value={34} className="h-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
                 <div className="flex items-center space-x-3 mb-4">
                    <Film className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Media Auto-Download</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Configure when media should be automatically downloaded to save data.</p>
                     <p className="text-xs pt-2">Full controls coming soon.</p>
                </div>
            </div>
        </SettingsPage>
    );
};

export default DataUsage;
