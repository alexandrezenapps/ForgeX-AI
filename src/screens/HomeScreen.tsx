import * as React from 'react';
import { Card } from '../components/Card';
import { Gauge } from '../components/Gauge';
import { Button } from '../components/Button';
import { UserProfile } from '../types';
import { Flame, Zap, Trophy, Clock, Activity, Moon, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../i18n';

interface HomeScreenProps {
  user: UserProfile;
  onStartWorkout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user, onStartWorkout }) => {
  const t = useI18n(user.language || 'en');
  return (
    <div className="p-6 space-y-6 pb-32">
      {/* XP & Level Section */}
      <Card className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="text-sm font-bold uppercase tracking-widest">{user.tier} {t.tier}</span>
          </div>
          <span className="text-xs font-mono text-white/50">{t.level} {user.level}</span>
        </div>
        <Gauge value={user.xp} max={1000} label={t.xp} color="var(--color-accent)" />
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <span className="text-[10px] uppercase tracking-widest text-white/40">{t.points}</span>
          <span className="text-sm font-black text-accent">{(user.points || 0).toLocaleString()}</span>
        </div>
        <Gauge value={user.energy} max={100} label={t.energy} color="var(--color-accent-secondary)" />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-accent neon-glow" />
          </div>
          <span className="text-2xl font-bold">{user.streak}</span>
          <span className="text-[10px] uppercase tracking-widest text-white/50">{t.streak}</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-accent-secondary/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-accent-secondary neon-glow-purple" />
          </div>
          <span className="text-2xl font-bold">45m</span>
          <span className="text-[10px] uppercase tracking-widest text-white/50">{t.avgSession}</span>
        </Card>
      </div>

      {/* Start Session CTA */}
      <Card variant="neon" className="p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">{t.readyToForge}</h2>
          <p className="text-sm text-white/60">{t.nextSession} {user.goal}.</p>
        </div>
        <Button 
          size="lg" 
          className="w-full relative z-10 font-black uppercase tracking-widest"
          onClick={onStartWorkout}
        >
          <Zap className="w-5 h-5 mr-2 fill-current" />
          {t.startWorkout}
        </Button>
      </Card>

      {/* Recovery & Sleep Section */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.recoveryHud}</h4>
              <p className="text-sm font-bold">{t.cnsReadiness}: 92%</p>
              <p className="text-[10px] text-accent uppercase tracking-tighter">{t.optimalHeavy}</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-bg bg-accent/20" />
            ))}
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
              <Moon className="w-6 h-6 text-accent-secondary" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.sleepLab}</h4>
              <p className="text-sm font-bold">{t.score}: 84/100</p>
              <p className="text-[10px] text-accent-secondary uppercase tracking-tighter">7h 24m • 2h {t.deepSleep}</p>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-accent-secondary" />
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 px-2">{t.recentActivity}</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{t.pushSession} A</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-tighter">March {28 - i}, 2026 • 52m</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-accent">+120 XP</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dumbbell = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6.5 6.5 11 11"/><path d="m10 10 5.5 5.5"/><path d="m3 7 4 4"/><path d="m11 3 4 4"/><path d="m15 13 4 4"/><path d="m7 15 4 4"/><path d="M18 3 3 18"/><path d="m2 2 2 2"/><path d="m20 20 2 2"/>
  </svg>
);
