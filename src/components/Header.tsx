import * as React from 'react';
import { User, Bell, Settings } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSettingsClick }) => {
  return (
    <header className="flex items-center justify-between p-6 sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-secondary p-0.5">
          <div className="w-full h-full rounded-full bg-bg flex items-center justify-center overflow-hidden">
            <User className="w-6 h-6 text-accent" />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-mono text-white/50 uppercase tracking-tighter">Level {user.level}</h2>
          <h1 className="text-lg font-bold leading-tight">{user.name}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full neon-glow" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onSettingsClick}>
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
