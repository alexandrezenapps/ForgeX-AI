import React from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../i18n';
import { MuscleGroup, UserProfile } from '../types';
import { calculateCurrentFatigue } from '../lib/fatigue';
import { cn } from '../lib/utils';

interface RecoveryMapProps {
  user: UserProfile;
  className?: string;
}

export const RecoveryMap: React.FC<RecoveryMapProps> = ({ user, className }) => {
  const t = useI18n(user.language || 'en');
  const fatigue = calculateCurrentFatigue(user);

  const getFatigueColor = (value: number) => {
    if (value < 20) return 'fill-emerald-500/40 stroke-emerald-500';
    if (value < 50) return 'fill-yellow-500/40 stroke-yellow-500';
    if (value < 80) return 'fill-orange-500/40 stroke-orange-500';
    return 'fill-rose-500/40 stroke-rose-500';
  };

  const getFatigueGlow = (value: number) => {
    if (value < 20) return 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    if (value < 50) return 'drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]';
    if (value < 80) return 'drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]';
    return 'drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]';
  };

  const muscleGroups: { id: MuscleGroup, label: string, path: string }[] = [
    { id: 'Chest', label: t.chest, path: 'M 42,36 Q 50,34 58,36 L 58,46 Q 50,48 42,46 Z' },
    { id: 'Back', label: t.back, path: 'M 42,36 Q 50,34 58,36 L 58,56 Q 50,58 42,56 Z' },
    { id: 'Legs', label: t.legs, path: 'M 41,62 Q 44,62 47,62 L 47,94 Q 44,96 41,94 Z M 53,62 Q 56,62 59,62 L 59,94 Q 56,96 53,94 Z' },
    { id: 'Shoulders', label: t.shoulders, path: 'M 36,36 Q 38,34 41,36 L 41,46 Q 38,48 36,46 Z M 59,36 Q 62,34 64,36 L 64,46 Q 62,48 59,46 Z' },
    { id: 'Arms', label: t.arms, path: 'M 31,36 Q 33,36 35,36 L 35,58 Q 33,60 31,58 Z M 65,36 Q 67,36 69,36 L 69,58 Q 67,60 65,58 Z' },
    { id: 'Core', label: t.core, path: 'M 43,48 Q 50,47 57,48 L 57,59 Q 50,60 43,59 Z' },
  ];

  return (
    <div className={cn("bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black font-mono tracking-tighter uppercase italic">{t.recoveryMap}</h3>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{t.muscleFatigue}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-mono uppercase text-white/40">0-20%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[8px] font-mono uppercase text-white/40">80%+</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[3/4] max-w-[200px] mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Head */}
            <circle cx="50" cy="25" r="5" className="fill-white/5 stroke-white/20 stroke-[0.5]" />
            
            {/* Body Outline */}
            <path 
              d="M 40,30 L 60,30 L 65,35 L 65,60 L 60,60 L 60,95 L 52,95 L 52,60 L 48,60 L 48,95 L 40,95 L 40,60 L 35,60 L 35,35 Z" 
              className="fill-white/5 stroke-white/20 stroke-[0.5]"
            />

            {/* Muscle Groups */}
            {muscleGroups.map((muscle) => (
              <motion.path
                key={muscle.id}
                d={muscle.path}
                className={cn(
                  "transition-all duration-500 stroke-[0.5]",
                  getFatigueColor(fatigue[muscle.id] || 0),
                  getFatigueGlow(fatigue[muscle.id] || 0)
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05, strokeWidth: 1 }}
              />
            ))}
          </svg>
        </div>

        <div className="space-y-4">
          {(Object.entries(fatigue) as [MuscleGroup, number][]).map(([muscle, value]) => (
            <div key={muscle} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">{t[muscle.toLowerCase() as keyof typeof t] || muscle}</span>
                <span className={cn(
                  "text-[10px] font-mono font-bold",
                  value > 80 ? "text-rose-500" : value > 50 ? "text-orange-500" : "text-emerald-500"
                )}>
                  {Math.round(value)}%
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className={cn(
                    "h-full rounded-full",
                    value > 80 ? "bg-rose-500" : value > 50 ? "bg-orange-500" : "bg-emerald-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Status</p>
            <p className="text-sm font-bold text-white">
              {Object.values(fatigue).some(v => v > 80) 
                ? t.overtrained 
                : Object.values(fatigue).some(v => v > 50)
                  ? t.needsRest
                  : t.fullyRecovered}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
