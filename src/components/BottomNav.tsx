import * as React from 'react';
import { Home, Dumbbell, MessageSquare, TrendingUp, Award, Settings, Video, Music } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Language } from '../types';
import { useI18n } from '../i18n';

export type Screen = 'home' | 'workout' | 'coach' | 'progression' | 'badges' | 'settings' | 'video' | 'music';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  language?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, language = 'en' }) => {
  const t = useI18n(language);
  const navItems = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'workout', icon: Dumbbell, label: t.workout },
    { id: 'music', icon: Music, label: t.music },
    { id: 'coach', icon: MessageSquare, label: t.coach },
    { id: 'progression', icon: TrendingUp, label: 'Stats' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-4 pb-8 z-50 pointer-events-none">
      <div className="max-w-md mx-auto glass rounded-2xl p-2 flex items-center justify-between pointer-events-auto shadow-2xl">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300',
                isActive ? 'text-accent' : 'text-white/40 hover:text-white/60'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-accent/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn('w-6 h-6 z-10', isActive && 'neon-glow')} />
              <span className="text-[10px] font-mono mt-1 uppercase tracking-tighter opacity-70 z-10">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
