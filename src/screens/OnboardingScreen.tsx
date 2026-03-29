import * as React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { UserProfile, Goal, Language } from '../types';
import { ChevronRight, User, Ruler, Weight, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';

interface OnboardingScreenProps {
  onComplete: (user: UserProfile) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [formData, setFormData] = React.useState<UserProfile>({
    name: '',
    age: 25,
    weight: 75,
    height: 180,
    goal: 'Strength',
    level: 1,
    xp: 0,
    energy: 100,
    streak: 0,
    points: 0,
    tier: 'Bronze',
    language: 'en',
  });

  const t = useI18n(formData.language);

  const goals: Goal[] = ['Strength', 'Hypertrophy', 'Endurance', 'Fat Loss'];
  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'zh', label: '中文' },
  ];

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(formData);
  };

  const getGoalLabel = (goal: Goal) => {
    const key = goal.toLowerCase().replace(/\s+/g, '') as keyof typeof t;
    return t[key] || goal;
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-bg relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col h-full max-w-md mx-auto w-full">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gradient">ForgeX AI</h1>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={cn(
                  'h-1 rounded-full transition-all duration-500',
                  step >= i ? 'w-6 bg-accent' : 'w-2 bg-white/10'
                )} 
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tight leading-none">{t.onboardingLanguage}</h2>
                <p className="text-white/40 text-sm uppercase tracking-widest font-mono">{t.onboardingLanguageDesc}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setFormData({ ...formData, language: lang.id })}
                    className={cn(
                      'p-6 rounded-2xl border transition-all flex items-center justify-between group',
                      formData.language === lang.id 
                        ? 'bg-accent/10 border-accent neon-glow' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    )}
                  >
                    <span className={cn(
                      'text-lg font-bold transition-colors',
                      formData.language === lang.id ? 'text-accent' : 'text-white/60 group-hover:text-white'
                    )}>
                      {lang.label}
                    </span>
                    {formData.language === lang.id && <Sparkles className="w-5 h-5 text-accent" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tight leading-none">{t.onboardingIdentity}</h2>
                <p className="text-white/40 text-sm uppercase tracking-widest font-mono">{t.onboardingIdentityDesc}</p>
              </div>
              <Card className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.enterName}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tight leading-none">{t.onboardingBiometric}</h2>
                <p className="text-white/40 text-sm uppercase tracking-widest font-mono">{t.onboardingBiometricDesc}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.age}</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-transparent text-3xl font-bold focus:outline-none"
                  />
                </Card>
                <Card className="p-6 space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.userWeight}</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full bg-transparent text-3xl font-bold focus:outline-none"
                  />
                </Card>
                <Card className="p-6 space-y-2 col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.height}</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="w-full bg-transparent text-3xl font-bold focus:outline-none"
                  />
                </Card>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tight leading-none">{t.onboardingGoal}</h2>
                <p className="text-white/40 text-sm uppercase tracking-widest font-mono">{t.onboardingGoalDesc}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setFormData({ ...formData, goal })}
                    className={cn(
                      'p-6 rounded-2xl border transition-all flex items-center justify-between group',
                      formData.goal === goal 
                        ? 'bg-accent/10 border-accent neon-glow' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                        formData.goal === goal ? 'bg-accent text-bg' : 'bg-white/5 text-white/40 group-hover:text-white'
                      )}>
                        <Target className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        'text-lg font-bold transition-colors',
                        formData.goal === goal ? 'text-accent' : 'text-white/60 group-hover:text-white'
                      )}>
                        {getGoalLabel(goal)}
                      </span>
                    </div>
                    {formData.goal === goal && <Sparkles className="w-5 h-5 text-accent" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="w-32 h-32 rounded-full bg-accent/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-accent border-dashed animate-[spin_10s_linear_infinite]" />
                <Sparkles className="w-16 h-16 text-accent neon-glow" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tight leading-none">{t.onboardingReady}</h2>
                <p className="text-white/40 text-sm uppercase tracking-widest font-mono">{t.onboardingReadyDesc}</p>
              </div>
              <Card className="p-6 w-full text-left space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-xs uppercase tracking-widest">{t.subject}</span>
                  <span className="font-bold">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-xs uppercase tracking-widest">{t.objective}</span>
                  <span className="font-bold text-accent">{getGoalLabel(formData.goal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-xs uppercase tracking-widest">{t.status}</span>
                  <span className="font-bold text-accent-secondary">{t.optimal}</span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-8">
          <Button 
            size="lg" 
            className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest"
            onClick={nextStep}
            disabled={step === 1 && !formData.name}
          >
            {step === 4 ? t.initialize : t.continue}
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
