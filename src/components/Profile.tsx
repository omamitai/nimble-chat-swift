
import React, { useState } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Avatar from './Avatar';

const Profile: React.FC = () => {
  const { currentUser, setActiveScreen, updateProfile } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [about, setAbout] = useState(currentUser.about);

  const handleSave = () => {
    updateProfile({ name, about });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(currentUser.name);
    setAbout(currentUser.about);
    setIsEditing(false);
  };

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
          
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-full hover:bg-primary/90 transition-smooth"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm text-primary hover:text-primary/80 transition-smooth"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-8 px-4">
          <div className="relative">
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              size="xl"
              className="w-24 h-24"
            />
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6 px-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your name"
              />
            ) : (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{currentUser.name}</p>
              </div>
            )}
          </div>

          {/* About */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              About
            </label>
            {isEditing ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Tell us about yourself"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{currentUser.about}</p>
              </div>
            )}
          </div>

          {/* Phone (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Phone Number
            </label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{currentUser.phone}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Phone number cannot be changed
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Privacy & Security</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your profile information is encrypted and only shared with your contacts. 
              We never store or access your personal data.
            </p>
          </div>
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="p-4 space-y-3 mt-8">
            <button className="w-full p-4 bg-muted hover:bg-muted/80 rounded-lg text-left transition-smooth">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Share Profile</h4>
                  <p className="text-xs text-muted-foreground">
                    Share your profile with QR code
                  </p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>
            </button>

            <button className="w-full p-4 bg-muted hover:bg-muted/80 rounded-lg text-left transition-smooth">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Backup Profile</h4>
                  <p className="text-xs text-muted-foreground">
                    Export your profile data
                  </p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
