import * as React from 'react';
import { Header } from './components/Header';
import { BottomNav, Screen } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { WorkoutScreen } from './screens/WorkoutScreen';
import { CoachScreen } from './screens/CoachScreen';
import { ProgressionScreen } from './screens/ProgressionScreen';
import { BadgesScreen } from './screens/BadgesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { VideoScreen } from './screens/VideoScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { FloatingActionMenu } from './components/FloatingActionMenu';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';
import { UserProfile, Language } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { useI18n } from './i18n';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { X, Sparkles, Zap, ShieldCheck, Crown } from 'lucide-react';

export default function App() {
  const [session, setSession] = React.useState<any>(null);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [activeScreen, setActiveScreen] = React.useState<Screen>('home');
  const [showPaywall, setShowPaywall] = React.useState(false);
  const [colorIndex, setColorIndex] = React.useState(0);

  // Supabase Session Listener
  React.useEffect(() => {
    // Check for demo mode first
    if (localStorage.getItem('forgex_demo_mode') === 'true') {
      setSession({
        user: { id: 'demo-user', email: 'demo@example.com' },
        access_token: 'demo-token'
      });
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Neon border color cycling
  React.useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % 280);
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  const neonColor = `hsl(${(colorIndex * 360) / 280}, 100%, 50%)`;

  // Sync user profile from Supabase or localStorage
  React.useEffect(() => {
    if (!session) {
      setUser(null);
      return;
    }

    const fetchProfile = async () => {
      // First try localStorage for quick load
      const savedUser = localStorage.getItem('forgex_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.id === session.user.id) {
          setUser(parsedUser);
          applyColors(parsedUser.primaryColor, parsedUser.secondaryColor);
          return;
        }
      }

      // If not in localStorage or ID mismatch, we'd fetch from Supabase 'profiles' table here
      // For now, we'll rely on onboarding to set it up
      // setUser(null) will trigger onboarding if no profile exists
    };

    fetchProfile();
  }, [session]);

  const applyColors = (primary?: string, secondary?: string) => {
    const root = document.documentElement;
    if (primary) {
      root.style.setProperty('--color-accent', primary);
    }
    if (secondary) {
      root.style.setProperty('--color-accent-secondary', secondary);
    }
  };

  const handleOnboardingComplete = (newUser: UserProfile) => {
    const profileWithId = { ...newUser, id: session?.user?.id, email: session?.user?.email };
    setUser(profileWithId);
    localStorage.setItem('forgex_user', JSON.stringify(profileWithId));
    applyColors(newUser.primaryColor, newUser.secondaryColor);
    
    // In a real app, you'd upsert to Supabase here:
    // supabase.from('profiles').upsert(profileWithId)
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('forgex_user', JSON.stringify(updatedUser));
    applyColors(updatedUser.primaryColor, updatedUser.secondaryColor);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'workout':
        setActiveScreen('workout');
        break;
      case 'coach':
        setActiveScreen('coach');
        break;
      case 'settings':
        setActiveScreen('settings');
        break;
      default:
        break;
    }
  };

  if (!session) {
    return <Auth />;
  }

  if (!user) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  const t = useI18n(user.language || 'en');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen user={user} onStartWorkout={() => setActiveScreen('workout')} />;
      case 'workout':
        return <WorkoutScreen user={user} onUpdateUser={handleUpdateUser} />;
      case 'coach':
        return <CoachScreen user={user} />;
      case 'progression':
        return <ProgressionScreen user={user} />;
      case 'badges':
        return <BadgesScreen user={user} />;
      case 'video':
        return <VideoScreen user={user} />;
      case 'settings':
        return <SettingsScreen user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return <HomeScreen user={user} onStartWorkout={() => setActiveScreen('workout')} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent selection:text-bg">
      {/* Fine Neon Border */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] border-[1px] transition-colors duration-[10000ms]"
        style={{ 
          borderColor: neonColor,
          boxShadow: `inset 0 0 5px ${neonColor}, 0 0 5px ${neonColor}`
        }}
      />
      <Header user={user} onSettingsClick={() => setActiveScreen('settings')} />
      
      <main className="max-w-md mx-auto relative min-h-[calc(100vh-180px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} language={user.language} />

      <FloatingActionMenu onAction={handleQuickAction} language={user.language} />

      {/* Premium Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
              onClick={() => setShowPaywall(false)}
            />
            <Card variant="neon" className="relative z-10 w-full max-w-sm p-8 space-y-8 overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="icon" onClick={() => setShowPaywall(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <Crown className="w-10 h-10 text-accent neon-glow" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">{t.upgradeElite}</h2>
                  <p className="text-sm text-white/60">{t.upgradeDesc}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Zap, text: t.unlimitedAI },
                  { icon: ShieldCheck, text: t.advancedAnalytics },
                  { icon: Sparkles, text: t.customProtocols },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Button variant="neon" size="lg" className="w-full font-black uppercase tracking-widest">
                  {t.upgradePrice}
                </Button>
                <p className="text-[10px] text-center text-white/40 uppercase tracking-widest">
                  {t.cancelAnytime}
                </p>
              </div>
            </Card>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Premium Trigger (Demo) */}
      {activeScreen === 'home' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPaywall(true)}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-accent-secondary flex items-center justify-center shadow-2xl z-40 neon-glow-purple"
        >
          <Crown className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </div>
  );
}
