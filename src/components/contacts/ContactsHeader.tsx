
import React from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ContactsHeaderProps {
    contactsCount: number;
}

const ContactsHeader: React.FC<ContactsHeaderProps> = ({ contactsCount }) => {
    const [copied, setCopied] = React.useState(false);

    const handleInviteFriends = async () => {
        const inviteText = 'Join me on SecureCall for free encrypted voice and video calls!';
        const inviteUrl = window.location.origin;

        try {
            if (navigator.share) {
                await navigator.share({ title: 'Join SecureCall', text: inviteText, url: inviteUrl });
                toast.success('Invite shared successfully!');
            } else {
                await navigator.clipboard.writeText(`${inviteText} ${inviteUrl}`);
                setCopied(true);
                toast.success('Invite link copied to clipboard!');
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (error) {
            console.error('Failed to share/copy invite:', error);
            toast.error('Could not share or copy invite link.');
        }
    };

    return (
        <div className="safe-area-top bg-background/90 backdrop-blur-xl border-b border-border/30">
            <div className="flex items-center justify-between px-6 py-5">
                <div className="text-center flex-1">
                    <h1 className="text-2xl font-bold gradient-text">Contacts</h1>
                    <p className="text-sm text-muted-foreground/80 mt-1">
                        {contactsCount} contact{contactsCount !== 1 ? 's' : ''}
                    </p>
                </div>
                <Button
                    onClick={handleInviteFriends}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg border-0 rounded-full px-4"
                >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Invite'}
                </Button>
            </div>
        </div>
    );
};

export default ContactsHeader;
