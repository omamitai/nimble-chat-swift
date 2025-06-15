
import React from 'react';
import { Settings } from 'lucide-react';

const SecurityNotice: React.FC = () => (
    <div className="p-4 m-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-4 h-4 text-primary" />
            </div>
            <div>
                <h4 className="font-medium text-sm mb-1">End-to-End Encryption</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Your messages are secured with end-to-end encryption. Only you and the recipient can read them.
                </p>
            </div>
        </div>
    </div>
);

export default SecurityNotice;
