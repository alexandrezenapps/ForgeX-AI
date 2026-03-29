import * as React from 'react';
import { Card } from '../components/Card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { TrendingUp, Activity, Target, Zap, Clock, Flame, ChevronRight, Calendar, Trophy, Medal, Users } from 'lucide-react';
import { UserProfile, WorkoutSession, LeaderboardEntry } from '../types';
import { useI18n } from '../i18n';
import { WORKOUT_HISTORY, EXERCISES, LEADERBOARD_DATA } from '../constants';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'motion/react';

const data = [
  { name: 'Mon', weight: 185, volume: 4500 },
  { name: 'Tue', weight: 190, volume: 4800 },
  { name: 'Wed', weight: 188, volume: 4600 },
  { name: 'Thu', weight: 195, volume: 5200 },
  { name: 'Fri', weight: 200, volume: 5500 },
  { name: 'Sat', weight: 205, volume: 5800 },
  { name: 'Sun', weight: 202, volume: 5600 },
];

export const ProgressionScreen: React.FC<{ user: UserProfile }> = ({ user }) => {
  const t = useI18n(user.language || 'en');
  const [selectedSession, setSelectedSession] = React.useState<WorkoutSession | null>(null);
  const [activeTab, setActiveTab] = React.useState<'analytics' | 'leaderboard'>('analytics');

  const radarData = [
    { subject: t.strength, A: 120, fullMark: 150 },
    { subject: t.endurance, A: 98, fullMark: 150 },
    { subject: t.mobility, A: 86, fullMark: 150 },
    { subject: t.power, A: 99, fullMark: 150 },
    { subject: t.technique, A: 85, fullMark: 150 },
    { subject: t.recovery, A: 65, fullMark: 150 },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(user.language === 'zh' ? 'zh-CN' : user.language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tight italic">{t.progression} HUD</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">Live Sync</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'analytics' ? 'bg-accent text-bg shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          {t.analytics}
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'leaderboard' ? 'bg-accent text-bg shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          {t.leaderboard}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'analytics' ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Main Chart */}
            <Card className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">{t.volumeProgression}</h3>
                  <p className="text-2xl font-black font-mono tracking-tighter text-accent">+12.5% <span className="text-xs font-normal text-white/40 ml-1">{t.vsLastWeek}</span></p>
                </div>
                <TrendingUp className="w-6 h-6 text-accent neon-glow" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(5,5,5,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="var(--color-accent)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorVolume)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Radar Chart & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4 flex flex-col items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 w-full">{t.performanceRadar}</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }} 
                      />
                      <Radar
                        name={t.forgeXScore}
                        dataKey="A"
                        stroke="var(--color-accent)"
                        fill="var(--color-accent)"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.currentGoal}</h4>
                    <p className="text-lg font-bold">{t.strengthMastery}</p>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full w-3/4 bg-accent rounded-full" />
                    </div>
                  </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent-secondary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.cnsReadiness}</h4>
                    <p className="text-lg font-bold">{t.optimal} (92%)</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">{t.readyForHighIntensity}</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Workout History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/50">{t.workoutHistory}</h3>
              </div>
              <div className="space-y-3">
                {WORKOUT_HISTORY.map((session) => (
                  <Card 
                    key={session.id} 
                    className="p-4 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-colors"
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center text-accent">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{session.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-tighter">
                            <Clock className="w-3 h-3" />
                            {session.duration}{t.min}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-tighter">
                            <Flame className="w-3 h-3" />
                            {session.calories}{t.kcal}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-white/30">{formatDate(session.date)}</span>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-accent transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* User Rank Summary */}
            <Card variant="neon" className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-bg/50 flex items-center justify-center border-2 border-accent neon-glow">
                  <span className="text-2xl font-black italic">#42</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">{t.globalRank}</h3>
                  <p className="text-xl font-black uppercase italic tracking-tighter">{t[user.tier.toLowerCase() as keyof typeof t] || user.tier} {t.tier}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-accent">{(user.points || 0).toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">{t.points}</p>
              </div>
            </Card>

            {/* Next Tier Progress */}
            <Card className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t.pointsToNextTier}</span>
                <span className="text-[10px] font-mono text-accent">1,250 {t.left}</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-accent rounded-full neon-glow" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-white/20">
                <span>{t[user.tier.toLowerCase() as keyof typeof t] || user.tier}</span>
                <span>{t.platinum}</span>
              </div>
            </Card>

            {/* Leaderboard List */}
            <div className="space-y-3">
              {LEADERBOARD_DATA.map((entry, index) => (
                <Card 
                  key={entry.id} 
                  className={`p-4 flex items-center justify-between ${
                    index < 3 ? 'border-accent/20 bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic ${
                      index === 0 ? 'bg-yellow-500 text-bg' :
                      index === 1 ? 'bg-slate-300 text-bg' :
                      index === 2 ? 'bg-amber-600 text-bg' :
                      'bg-white/5 text-white/40'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        {entry.name}
                        {index < 3 && <Medal className={`w-3 h-3 ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-slate-300' :
                          'text-amber-600'
                        }`} />}
                      </h4>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">{t[entry.tier.toLowerCase() as keyof typeof t] || entry.tier}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{(entry.points || 0).toLocaleString()}</p>
                    <p className="text-[8px] uppercase tracking-widest text-white/20">{t.points}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Details Modal */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">{selectedSession.name}</h2>
                  <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{formatDate(selectedSession.date)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedSession(null)}>
                  <Zap className="w-5 h-5 rotate-45" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">{t.duration}</p>
                  <p className="text-xl font-bold">{selectedSession.duration} {t.min}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">{t.calories}</p>
                  <p className="text-xl font-bold">{selectedSession.calories} {t.kcal}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/50">{t.workout}</h3>
                <div className="space-y-3">
                  {selectedSession.exercises.map((ex, i) => {
                    const exerciseInfo = EXERCISES.find(e => e.id === ex.exerciseId);
                    return (
                      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm">{exerciseInfo?.name || 'Unknown Exercise'}</h4>
                          <span className="text-[10px] font-mono text-accent uppercase tracking-widest">{exerciseInfo?.category}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ex.sets.map((set, si) => (
                            <div key={si} className="px-3 py-1 bg-accent/10 rounded-lg border border-accent/20 text-[10px] font-mono">
                              {set.weight}kg x {set.reps}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setSelectedSession(null)}>
                {t.cancel}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
