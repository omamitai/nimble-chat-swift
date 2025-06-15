
import React, { useState } from 'react';
import { ArrowLeft, Camera, Share2, Download, Edit3 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile: React.FC = () => {
  const { user, updateUser, setActiveScreen, clearAuth } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    about: user?.about || '',
  });

  const handleSave = () => {
    if (user) {
      updateUser(editData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    }
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${user?.username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name}'s SecureCall Profile`,
          text: `Connect with me on SecureCall`,
          url: profileUrl,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        toast.success('Profile link copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy profile link');
      }
    }
  };

  const handleBackupProfile = () => {
    const profileData = {
      user,
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
    };
    
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `securecall-profile-${user?.username}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Profile backed up successfully');
  };

  const handleLogout = () => {
    clearAuth();
    toast.info('Logged out successfully');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="safe-area-top">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveScreen('settings')}
              className="tap-target p-2 -ml-2 hover:bg-muted rounded-full transition-smooth"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {/* Profile Picture and Basic Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-smooth">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              {isEditing ? (
                <div className="w-full space-y-3">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="about">About</Label>
                    <Input
                      id="about"
                      value={editData.about}
                      onChange={(e) => setEditData(prev => ({ ...prev, about: e.target.value }))}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.username}</p>
                    <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  </div>
                  
                  {user.about && (
                    <p className="text-sm text-center px-4">{user.about}</p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleShareProfile}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleBackupProfile}
            >
              <Download className="w-4 h-4 mr-2" />
              Backup Profile
            </Button>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
