import * as React from 'react';
import { Card } from '../components/Card';
import { BADGES } from '../constants';
import { Award, Flame, Dumbbell, Trophy, Lock, CheckCircle2, Zap, Moon, Medal, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { useI18n } from '../i18n';

const iconMap: Record<string, any> = {
  Award,
  Flame,
  Dumbbell,
  Trophy,
  Zap,
  Moon,
  Medal,
  Star,
};

export const BadgesScreen: React.FC<{ user: UserProfile }> = ({ user }) => {
  const t = useI18n(user.language || 'en');
  const userBadges = user.badges || BADGES;
  const unlockedCount = userBadges.filter(b => b.unlocked).length;

  const tiers = [
    { name: 'Bronze', color: 'text-amber-700', bg: 'bg-amber-700/10', border: 'border-amber-700/20' },
    { name: 'Silver', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
    { name: 'Gold', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { name: 'Platinum', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
    { name: 'Elite', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
  ];

  const currentTier = tiers.find(t => t.name === user.tier) || tiers[0];

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tight italic">{t.hallOfForge}</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
          <Award className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">{unlockedCount}/{userBadges.length} {t.badges}</span>
        </div>
      </div>

      {/* Tier Section */}
      <Card className={`p-6 flex items-center justify-between relative overflow-hidden ${currentTier.bg} ${currentTier.border}`}>
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Trophy className={`w-24 h-24 ${currentTier.color}`} />
        </div>
        <div className="relative z-10 space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.tier} {t.status}</h3>
          <p className={`text-3xl font-black uppercase italic tracking-tighter ${currentTier.color}`}>{t[user.tier.toLowerCase() as keyof typeof t] || user.tier}</p>
          <p className="text-[10px] text-white/60 uppercase tracking-widest">{t.topAthletes}</p>
        </div>
        <div className="relative z-10">
          <Star className={`w-8 h-8 ${currentTier.color} neon-glow`} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {userBadges.map((badge, i) => {
          const Icon = iconMap[badge.icon] || Award;
          const badgeNameKey = badge.name.toLowerCase().replace(/\s+/g, '') as keyof typeof t;
          return (
            <Card 
              key={badge.id} 
              className={cn(
                'flex flex-col items-center p-6 space-y-4 text-center relative overflow-hidden',
                !badge.unlocked && 'opacity-50 grayscale'
              )}
            >
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center relative',
                badge.unlocked ? 'bg-accent/20 neon-glow' : 'bg-white/5'
              )}>
                <Icon className={cn('w-8 h-8', badge.unlocked ? 'text-accent' : 'text-white/20')} />
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white/40" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-tight">{t[badgeNameKey] || badge.name}</h3>
                <p className="text-[10px] text-white/40 leading-tight">{badge.description}</p>
              </div>
              {badge.unlocked && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </motion.div>
              )}
            </Card>
          );
        })}
        
        {/* Placeholder for locked badges */}
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex flex-col items-center p-6 space-y-4 text-center opacity-30 grayscale">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white/20" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-tight">{t.locked}</h3>
              <p className="text-[10px] text-white/40 leading-tight">{t.keepTrainingBadge}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
